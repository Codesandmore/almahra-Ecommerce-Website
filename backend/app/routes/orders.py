from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Order, User, OrderStatus
from app.utils.auth import get_current_user
from app.utils.validators import validate_pagination_params
from app.services.email_service import send_order_shipped_email

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('', methods=['GET'])
@jwt_required()
def get_user_orders():
    """Get user's orders"""
    try:
        current_user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', '').strip()
        
        # Validate pagination
        page, per_page, pagination_errors = validate_pagination_params(page, per_page, 50)
        if pagination_errors:
            return jsonify({'errors': pagination_errors}), 400
        
        # Build query
        query = Order.query.filter_by(user_id=current_user_id)
        
        # Apply status filter if provided
        if status:
            try:
                status_enum = OrderStatus(status)
                query = query.filter_by(status=status_enum)
            except ValueError:
                return jsonify({'error': 'Invalid order status'}), 400
        
        # Execute query with pagination
        orders_pagination = query.order_by(Order.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        orders = orders_pagination.items
        
        return jsonify({
            'orders': [order.to_dict() for order in orders],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': orders_pagination.total,
                'pages': orders_pagination.pages,
                'has_next': orders_pagination.has_next,
                'has_prev': orders_pagination.has_prev
            }
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching user orders: {str(e)}")
        return jsonify({'error': 'Failed to fetch orders'}), 500

@orders_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get specific order details"""
    try:
        current_user_id = get_jwt_identity()
        
        order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({
            'order': order.to_dict(include_items=True)
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching order {order_id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch order'}), 500

@orders_bp.route('/by-number/<order_number>', methods=['GET'])
@jwt_required()
def get_order_by_number(order_number):
    """Get order by order number"""
    try:
        current_user_id = get_jwt_identity()
        
        order = Order.query.filter_by(
            order_number=order_number,
            user_id=current_user_id
        ).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify({
            'order': order.to_dict(include_items=True)
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching order {order_number}: {str(e)}")
        return jsonify({'error': 'Failed to fetch order'}), 500

@orders_bp.route('/<int:order_id>/cancel', methods=['POST'])
@jwt_required()
def cancel_order(order_id):
    """Cancel an order"""
    try:
        current_user_id = get_jwt_identity()
        
        order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Check if order can be cancelled
        if order.status not in [OrderStatus.PENDING, OrderStatus.CONFIRMED]:
            return jsonify({
                'error': 'Order cannot be cancelled at this stage',
                'current_status': order.status.value
            }), 400
        
        # Update order status
        order.status = OrderStatus.CANCELLED
        order.admin_notes = f"Cancelled by customer on {datetime.utcnow().isoformat()}"
        
        # Restore product stock
        for item in order.items:
            product = item.product
            if product and product.track_inventory:
                product.stock_quantity += item.quantity
                
                # Restore variant stock if applicable
                if item.product_variant_id:
                    variant = item.product_variant
                    if variant:
                        variant.stock_quantity += item.quantity
        
        db.session.commit()
        
        return jsonify({
            'message': 'Order cancelled successfully',
            'order': order.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error cancelling order {order_id}: {str(e)}")
        return jsonify({'error': 'Failed to cancel order'}), 500

@orders_bp.route('/<int:order_id>/track', methods=['GET'])
@jwt_required()
def track_order(order_id):
    """Get order tracking information"""
    try:
        current_user_id = get_jwt_identity()
        
        order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Prepare tracking information
        tracking_info = {
            'order_number': order.order_number,
            'status': order.status.value,
            'tracking_number': order.tracking_number,
            'shipped_at': order.shipped_at.isoformat() if order.shipped_at else None,
            'delivered_at': order.delivered_at.isoformat() if order.delivered_at else None,
            'shipping_method': order.shipping_method,
            'estimated_delivery': None  # Would be calculated based on shipping method
        }
        
        # Add status timeline
        status_timeline = []
        
        # Order placed
        status_timeline.append({
            'status': 'placed',
            'date': order.created_at.isoformat(),
            'description': 'Order placed successfully'
        })
        
        # Order confirmed (if payment completed)
        if order.status != OrderStatus.PENDING:
            status_timeline.append({
                'status': 'confirmed',
                'date': order.created_at.isoformat(),  # Could be different if payment delayed
                'description': 'Payment confirmed and order processing started'
            })
        
        # Order shipped
        if order.shipped_at:
            status_timeline.append({
                'status': 'shipped',
                'date': order.shipped_at.isoformat(),
                'description': f'Order shipped via {order.shipping_method or "standard shipping"}'
            })
        
        # Order delivered
        if order.delivered_at:
            status_timeline.append({
                'status': 'delivered',
                'date': order.delivered_at.isoformat(),
                'description': 'Order delivered successfully'
            })
        
        tracking_info['timeline'] = status_timeline
        
        return jsonify({
            'tracking': tracking_info
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error tracking order {order_id}: {str(e)}")
        return jsonify({'error': 'Failed to get tracking information'}), 500