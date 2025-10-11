from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import stripe
from app.models import db, Order, OrderItem, CartItem, OrderStatus, PaymentStatus
from app.utils.auth import token_required, get_current_user
from app.utils.validators import validate_json, validate_required_fields, validate_order_data
from app.services.email_service import send_order_confirmation_email
import json

payments_bp = Blueprint('payments', __name__)

# Initialize Stripe
stripe.api_key = None  # Will be set from config

@payments_bp.before_app_request
def setup_stripe():
    """Initialize Stripe with API key"""
    stripe.api_key = current_app.config.get('STRIPE_SECRET_KEY')

@payments_bp.route('/create-payment-intent', methods=['POST'])
@jwt_required()
@validate_json
def create_payment_intent():
    """Create Stripe payment intent"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['amount']
        validation_errors = validate_required_fields(data, required_fields)
        if validation_errors:
            return jsonify({'errors': validation_errors}), 400
        
        amount = data['amount']  # Amount in cents
        currency = data.get('currency', 'usd')
        
        # Validate amount
        if not isinstance(amount, (int, float)) or amount <= 0:
            return jsonify({'error': 'Amount must be a positive number'}), 400
        
        # Convert to cents if needed
        amount_cents = int(amount * 100) if amount < 1000 else int(amount)
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=currency,
            metadata={
                'user_id': current_user_id,
                'integration_check': 'accept_a_payment'
            }
        )
        
        return jsonify({
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        }), 200
    
    except stripe.error.StripeError as e:
        current_app.logger.error(f"Stripe error: {str(e)}")
        return jsonify({'error': 'Payment processing error'}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating payment intent: {str(e)}")
        return jsonify({'error': 'Failed to create payment intent'}), 500

@payments_bp.route('/confirm-payment', methods=['POST'])
@jwt_required()
@validate_json
def confirm_payment():
    """Confirm payment and create order"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['payment_intent_id', 'billing_address', 'shipping_address']
        validation_errors = validate_required_fields(data, required_fields)
        if validation_errors:
            return jsonify({'errors': validation_errors}), 400
        
        payment_intent_id = data['payment_intent_id']
        
        # Verify payment intent with Stripe
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        except stripe.error.StripeError as e:
            return jsonify({'error': 'Invalid payment intent'}), 400
        
        if intent.status != 'succeeded':
            return jsonify({'error': 'Payment not completed'}), 400
        
        # Get user's cart items
        cart_items = CartItem.query.filter_by(user_id=current_user_id).all()
        
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Create order
        user = get_current_user()
        
        order = Order(
            user_id=current_user_id,
            customer_email=user.email,
            customer_phone=user.phone,
            payment_intent_id=payment_intent_id,
            payment_method='stripe',
            payment_status=PaymentStatus.COMPLETED,
            status=OrderStatus.CONFIRMED
        )
        
        # Set addresses
        order.set_billing_address(data['billing_address'])
        order.set_shipping_address(data['shipping_address'])
        
        # Add order items from cart
        for cart_item in cart_items:
            order_item = OrderItem(
                product_id=cart_item.product_id,
                product_variant_id=cart_item.product_variant_id,
                prescription_id=cart_item.prescription_id,
                product_name=cart_item.product.name,
                product_sku=cart_item.product.sku,
                product_image_url=cart_item.product.images[0].image_url if cart_item.product.images else None,
                quantity=cart_item.quantity,
                unit_price=cart_item.product.price,
                total_price=cart_item.get_total_price(),
                lens_options=cart_item.lens_options,
                frame_adjustments=cart_item.frame_adjustments,
                special_instructions=cart_item.special_instructions
            )
            order.items.append(order_item)
        
        # Calculate totals
        order.calculate_totals()
        
        # Save order
        db.session.add(order)
        
        # Update product stock
        for cart_item in cart_items:
            if cart_item.product.track_inventory:
                cart_item.product.stock_quantity -= cart_item.quantity
                
                # Update variant stock if applicable
                if cart_item.product_variant_id:
                    cart_item.product_variant.stock_quantity -= cart_item.quantity
        
        # Clear cart
        for cart_item in cart_items:
            db.session.delete(cart_item)
        
        db.session.commit()
        
        # Send order confirmation email
        try:
            send_order_confirmation_email(user.email, order)
        except Exception as e:
            current_app.logger.error(f"Failed to send order confirmation email: {str(e)}")
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict(include_items=True)
        }), 201
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error confirming payment: {str(e)}")
        return jsonify({'error': 'Failed to process order'}), 500

@payments_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks"""
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = current_app.config.get('STRIPE_WEBHOOK_SECRET')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        current_app.logger.error(f"Invalid payload: {str(e)}")
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError as e:
        current_app.logger.error(f"Invalid signature: {str(e)}")
        return jsonify({'error': 'Invalid signature'}), 400
    
    try:
        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            current_app.logger.info(f"Payment succeeded: {payment_intent['id']}")
            
            # Update order payment status if needed
            order = Order.query.filter_by(payment_intent_id=payment_intent['id']).first()
            if order and order.payment_status != PaymentStatus.COMPLETED:
                order.payment_status = PaymentStatus.COMPLETED
                order.status = OrderStatus.CONFIRMED
                db.session.commit()
        
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            current_app.logger.info(f"Payment failed: {payment_intent['id']}")
            
            # Update order payment status
            order = Order.query.filter_by(payment_intent_id=payment_intent['id']).first()
            if order:
                order.payment_status = PaymentStatus.FAILED
                order.status = OrderStatus.CANCELLED
                db.session.commit()
        
        elif event['type'] == 'charge.dispute.created':
            dispute = event['data']['object']
            current_app.logger.warning(f"Dispute created: {dispute['id']}")
            # Handle dispute logic here
        
        else:
            current_app.logger.info(f"Unhandled event type: {event['type']}")
        
        return jsonify({'status': 'success'}), 200
    
    except Exception as e:
        current_app.logger.error(f"Error handling webhook: {str(e)}")
        return jsonify({'error': 'Webhook handler failed'}), 500

@payments_bp.route('/refund', methods=['POST'])
@jwt_required()
@validate_json
def create_refund():
    """Create a refund for an order"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['order_id']
        validation_errors = validate_required_fields(data, required_fields)
        if validation_errors:
            return jsonify({'errors': validation_errors}), 400
        
        order_id = data['order_id']
        amount = data.get('amount')  # Optional: partial refund amount
        reason = data.get('reason', 'requested_by_customer')
        
        # Get order
        order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        if order.payment_status != PaymentStatus.COMPLETED:
            return jsonify({'error': 'Cannot refund unpaid order'}), 400
        
        if not order.payment_intent_id:
            return jsonify({'error': 'No payment intent found for this order'}), 400
        
        # Create refund with Stripe
        refund_data = {
            'payment_intent': order.payment_intent_id,
            'reason': reason
        }
        
        if amount:
            # Partial refund
            amount_cents = int(amount * 100) if amount < 1000 else int(amount)
            refund_data['amount'] = amount_cents
        
        refund = stripe.Refund.create(**refund_data)
        
        # Update order status
        if amount and amount < order.total_amount:
            # Partial refund - keep order as completed but note the refund
            order.admin_notes = f"Partial refund of ${amount} processed. Refund ID: {refund.id}"
        else:
            # Full refund
            order.payment_status = PaymentStatus.REFUNDED
            order.status = OrderStatus.RETURNED
        
        db.session.commit()
        
        return jsonify({
            'message': 'Refund processed successfully',
            'refund_id': refund.id,
            'amount_refunded': refund.amount / 100  # Convert back to dollars
        }), 200
    
    except stripe.error.StripeError as e:
        current_app.logger.error(f"Stripe refund error: {str(e)}")
        return jsonify({'error': 'Refund processing failed'}), 400
    except Exception as e:
        current_app.logger.error(f"Error creating refund: {str(e)}")
        return jsonify({'error': 'Failed to process refund'}), 500

@payments_bp.route('/payment-methods', methods=['GET'])
@jwt_required()
def get_payment_methods():
    """Get available payment methods"""
    try:
        # This would typically come from your configuration
        # For now, we'll return basic Stripe payment methods
        
        payment_methods = [
            {
                'id': 'card',
                'name': 'Credit/Debit Card',
                'description': 'Pay securely with your credit or debit card',
                'supported_cards': ['visa', 'mastercard', 'amex', 'discover'],
                'enabled': True
            }
            # Add other payment methods as needed
        ]
        
        return jsonify({
            'payment_methods': payment_methods
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching payment methods: {str(e)}")
        return jsonify({'error': 'Failed to fetch payment methods'}), 500