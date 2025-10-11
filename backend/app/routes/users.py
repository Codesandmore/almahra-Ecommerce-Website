from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, User, Address, Prescription
from app.utils.auth import get_current_user
from app.utils.validators import (
    validate_json, validate_required_fields, 
    validate_address_data, validate_prescription_data,
    validate_email, validate_phone
)

users_bp = Blueprint('users', __name__)

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching profile: {str(e)}")
        return jsonify({'error': 'Failed to fetch profile'}), 500

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
@validate_json
def update_profile():
    """Update user profile"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate email if provided
        if 'email' in data:
            if not validate_email(data['email']):
                return jsonify({'error': 'Invalid email format'}), 400
            
            # Check if email is already taken by another user
            existing_user = User.query.filter_by(email=data['email'].lower().strip()).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({'error': 'Email already in use'}), 409
        
        # Validate phone if provided
        if 'phone' in data and data['phone']:
            if not validate_phone(data['phone']):
                return jsonify({'error': 'Invalid phone number format'}), 400
        
        # Update allowed fields
        allowed_fields = ['first_name', 'last_name', 'phone', 'email', 'date_of_birth']
        for field in allowed_fields:
            if field in data:
                if field == 'email':
                    setattr(user, field, data[field].lower().strip())
                else:
                    setattr(user, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating profile: {str(e)}")
        return jsonify({'error': 'Failed to update profile'}), 500

@users_bp.route('/addresses', methods=['GET'])
@jwt_required()
def get_addresses():
    """Get user addresses"""
    try:
        current_user_id = get_jwt_identity()
        
        addresses = Address.query.filter_by(user_id=current_user_id).all()
        
        return jsonify({
            'addresses': [address.to_dict() for address in addresses]
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching addresses: {str(e)}")
        return jsonify({'error': 'Failed to fetch addresses'}), 500

@users_bp.route('/addresses', methods=['POST'])
@jwt_required()
@validate_json
def add_address():
    """Add new address"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate address data
        validation_errors = validate_address_data(data)
        if validation_errors:
            return jsonify({'errors': validation_errors}), 400
        
        # If this is set as default, remove default from other addresses
        if data.get('is_default', False):
            Address.query.filter_by(
                user_id=current_user_id,
                type=data.get('type', 'shipping')
            ).update({'is_default': False})
        
        # Create new address
        address = Address(
            user_id=current_user_id,
            type=data.get('type', 'shipping'),
            first_name=data['first_name'],
            last_name=data['last_name'],
            company=data.get('company'),
            address_line_1=data['address_line_1'],
            address_line_2=data.get('address_line_2'),
            city=data['city'],
            state=data['state'],
            postal_code=data['postal_code'],
            country=data['country'],
            phone=data.get('phone'),
            is_default=data.get('is_default', False)
        )
        
        db.session.add(address)
        db.session.commit()
        
        return jsonify({
            'message': 'Address added successfully',
            'address': address.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding address: {str(e)}")
        return jsonify({'error': 'Failed to add address'}), 500

@users_bp.route('/addresses/<int:address_id>', methods=['PUT'])
@jwt_required()
@validate_json
def update_address(address_id):
    """Update address"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        address = Address.query.filter_by(id=address_id, user_id=current_user_id).first()
        if not address:
            return jsonify({'error': 'Address not found'}), 404
        
        # Validate address data
        validation_errors = validate_address_data(data)
        if validation_errors:
            return jsonify({'errors': validation_errors}), 400
        
        # If this is set as default, remove default from other addresses
        if data.get('is_default', False) and not address.is_default:
            Address.query.filter_by(
                user_id=current_user_id,
                type=address.type
            ).update({'is_default': False})
        
        # Update address fields
        allowed_fields = [
            'first_name', 'last_name', 'company', 'address_line_1', 'address_line_2',
            'city', 'state', 'postal_code', 'country', 'phone', 'is_default'
        ]
        
        for field in allowed_fields:
            if field in data:
                setattr(address, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Address updated successfully',
            'address': address.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating address: {str(e)}")
        return jsonify({'error': 'Failed to update address'}), 500

@users_bp.route('/addresses/<int:address_id>', methods=['DELETE'])
@jwt_required()
def delete_address(address_id):
    """Delete address"""
    try:
        current_user_id = get_jwt_identity()
        
        address = Address.query.filter_by(id=address_id, user_id=current_user_id).first()
        if not address:
            return jsonify({'error': 'Address not found'}), 404
        
        db.session.delete(address)
        db.session.commit()
        
        return jsonify({'message': 'Address deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting address: {str(e)}")
        return jsonify({'error': 'Failed to delete address'}), 500

@users_bp.route('/prescriptions', methods=['GET'])
@jwt_required()
def get_prescriptions():
    """Get user prescriptions"""
    try:
        current_user_id = get_jwt_identity()
        
        prescriptions = Prescription.query.filter_by(user_id=current_user_id).all()
        
        return jsonify({
            'prescriptions': [prescription.to_dict() for prescription in prescriptions]
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching prescriptions: {str(e)}")
        return jsonify({'error': 'Failed to fetch prescriptions'}), 500

@users_bp.route('/prescriptions', methods=['POST'])
@jwt_required()
@validate_json
def add_prescription():
    """Add new prescription"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate prescription data
        validation_errors = validate_prescription_data(data)
        if validation_errors:
            return jsonify({'errors': validation_errors}), 400
        
        # If this is set as default, remove default from other prescriptions
        if data.get('is_default', False):
            Prescription.query.filter_by(user_id=current_user_id).update({'is_default': False})
        
        # Create new prescription
        prescription = Prescription(
            user_id=current_user_id,
            prescription_name=data['prescription_name'],
            od_sphere=data.get('od_sphere'),
            od_cylinder=data.get('od_cylinder'),
            od_axis=data.get('od_axis'),
            od_add=data.get('od_add'),
            os_sphere=data.get('os_sphere'),
            os_cylinder=data.get('os_cylinder'),
            os_axis=data.get('os_axis'),
            os_add=data.get('os_add'),
            pd=data.get('pd'),
            notes=data.get('notes'),
            doctor_name=data.get('doctor_name'),
            prescription_date=data.get('prescription_date'),
            expiry_date=data.get('expiry_date'),
            is_default=data.get('is_default', False)
        )
        
        db.session.add(prescription)
        db.session.commit()
        
        return jsonify({
            'message': 'Prescription added successfully',
            'prescription': prescription.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding prescription: {str(e)}")
        return jsonify({'error': 'Failed to add prescription'}), 500

@users_bp.route('/prescriptions/<int:prescription_id>', methods=['PUT'])
@jwt_required()
@validate_json
def update_prescription(prescription_id):
    """Update prescription"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        prescription = Prescription.query.filter_by(
            id=prescription_id, 
            user_id=current_user_id
        ).first()
        
        if not prescription:
            return jsonify({'error': 'Prescription not found'}), 404
        
        # Validate prescription data
        validation_errors = validate_prescription_data(data)
        if validation_errors:
            return jsonify({'errors': validation_errors}), 400
        
        # If this is set as default, remove default from other prescriptions
        if data.get('is_default', False) and not prescription.is_default:
            Prescription.query.filter_by(user_id=current_user_id).update({'is_default': False})
        
        # Update prescription fields
        allowed_fields = [
            'prescription_name', 'od_sphere', 'od_cylinder', 'od_axis', 'od_add',
            'os_sphere', 'os_cylinder', 'os_axis', 'os_add', 'pd', 'notes',
            'doctor_name', 'prescription_date', 'expiry_date', 'is_default'
        ]
        
        for field in allowed_fields:
            if field in data:
                setattr(prescription, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Prescription updated successfully',
            'prescription': prescription.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating prescription: {str(e)}")
        return jsonify({'error': 'Failed to update prescription'}), 500

@users_bp.route('/prescriptions/<int:prescription_id>', methods=['DELETE'])
@jwt_required()
def delete_prescription(prescription_id):
    """Delete prescription"""
    try:
        current_user_id = get_jwt_identity()
        
        prescription = Prescription.query.filter_by(
            id=prescription_id, 
            user_id=current_user_id
        ).first()
        
        if not prescription:
            return jsonify({'error': 'Prescription not found'}), 404
        
        db.session.delete(prescription)
        db.session.commit()
        
        return jsonify({'message': 'Prescription deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting prescription: {str(e)}")
        return jsonify({'error': 'Failed to delete prescription'}), 500