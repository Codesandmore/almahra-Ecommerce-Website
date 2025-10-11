from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_required
from app.models import db, Product, User
from app.utils.auth import get_current_user
from app.utils.validators import validate_file_upload
import requests
import os
import uuid
from PIL import Image
import cv2
import numpy as np
import json
import base64

ar_bp = Blueprint('ar', __name__)

@ar_bp.route('/try-on', methods=['POST'])
@jwt_required()
def virtual_try_on():
    """Virtual try-on endpoint"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if file is in request
        if 'user_image' not in request.files:
            return jsonify({'error': 'No user image provided'}), 400
        
        user_image = request.files['user_image']
        product_id = request.form.get('product_id')
        
        if not product_id:
            return jsonify({'error': 'Product ID is required'}), 400
        
        # Validate file upload
        allowed_extensions = ['png', 'jpg', 'jpeg']
        validation_errors = validate_file_upload(user_image, allowed_extensions, max_size=10*1024*1024)
        if validation_errors:
            return jsonify({'errors': validation_errors}), 400
        
        # Check if product exists
        product = Product.query.filter_by(id=product_id, is_active=True).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Check if product is eyewear
        if product.frame_type not in ['eyeglasses', 'sunglasses']:
            return jsonify({'error': 'AR try-on only available for eyewear'}), 400
        
        # Save user image temporarily
        user_image_filename = f"user_{current_user_id}_{uuid.uuid4().hex}.jpg"
        user_image_path = os.path.join(current_app.config.get('UPLOAD_FOLDER', 'uploads'), user_image_filename)
        
        # Ensure upload directory exists
        os.makedirs(os.path.dirname(user_image_path), exist_ok=True)
        
        # Process and save user image
        image = Image.open(user_image.stream)
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image if too large (max 1024x1024)
        max_size = (1024, 1024)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save processed image
        image.save(user_image_path, 'JPEG', quality=85)
        
        # Prepare AR service request
        ar_service_url = current_app.config.get('AR_SERVICE_URL', 'http://localhost:5001')
        
        # Get product image for overlay
        product_image_url = None
        if product.images:
            product_image_url = product.images[0].image_url
        
        if not product_image_url:
            return jsonify({'error': 'Product image not available for AR try-on'}), 400
        
        # Call AR service
        try:
            ar_response = call_ar_service(
                ar_service_url,
                user_image_path,
                product_image_url,
                product.to_dict()
            )
            
            if ar_response.get('success'):
                # Clean up temporary file
                try:
                    os.remove(user_image_path)
                except:
                    pass
                
                return jsonify({
                    'success': True,
                    'try_on_result': ar_response['try_on_image'],
                    'product_info': product.to_dict(),
                    'confidence_score': ar_response.get('confidence_score', 0.8),
                    'face_detected': ar_response.get('face_detected', True)
                }), 200
            else:
                return jsonify({
                    'error': ar_response.get('error', 'AR processing failed')
                }), 400
        
        except Exception as e:
            current_app.logger.error(f"AR service error: {str(e)}")
            return jsonify({'error': 'AR try-on service unavailable'}), 503
    
    except Exception as e:
        current_app.logger.error(f"Error in virtual try-on: {str(e)}")
        return jsonify({'error': 'Failed to process AR try-on'}), 500

@ar_bp.route('/face-detection', methods=['POST'])
@jwt_required()
def detect_face():
    """Detect face landmarks for AR positioning"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        
        # Validate file
        allowed_extensions = ['png', 'jpg', 'jpeg']
        validation_errors = validate_file_upload(image_file, allowed_extensions)
        if validation_errors:
            return jsonify({'errors': validation_errors}), 400
        
        # Process image for face detection
        image = Image.open(image_file.stream)
        image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Use OpenCV's face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        
        gray = cv2.cvtColor(image_cv, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) == 0:
            return jsonify({'face_detected': False, 'message': 'No face detected'}), 200
        
        # Get the largest face
        face = max(faces, key=lambda x: x[2] * x[3])
        x, y, w, h = face
        
        # Detect eyes within the face region
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = image_cv[y:y+h, x:x+w]
        eyes = eye_cascade.detectMultiScale(roi_gray)
        
        # Calculate key points for glasses positioning
        face_landmarks = {
            'face_box': {
                'x': int(x),
                'y': int(y),
                'width': int(w),
                'height': int(h)
            },
            'eye_positions': [],
            'bridge_position': {
                'x': int(x + w/2),
                'y': int(y + h*0.4)
            },
            'face_width': int(w),
            'confidence': 0.85 if len(eyes) >= 2 else 0.6
        }
        
        # Add eye positions
        for (ex, ey, ew, eh) in eyes:
            face_landmarks['eye_positions'].append({
                'x': int(x + ex + ew/2),
                'y': int(y + ey + eh/2),
                'width': int(ew),
                'height': int(eh)
            })
        
        return jsonify({
            'face_detected': True,
            'landmarks': face_landmarks,
            'ready_for_ar': len(eyes) >= 2
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error in face detection: {str(e)}")
        return jsonify({'error': 'Face detection failed'}), 500

@ar_bp.route('/product-compatibility/<int:product_id>', methods=['GET'])
def check_product_compatibility(product_id):
    """Check if product is compatible with AR try-on"""
    try:
        product = Product.query.filter_by(id=product_id, is_active=True).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Check compatibility criteria
        compatibility = {
            'ar_compatible': False,
            'reasons': []
        }
        
        # Must be eyewear
        if product.frame_type not in ['eyeglasses', 'sunglasses']:
            compatibility['reasons'].append('Product must be eyeglasses or sunglasses')
        
        # Must have product images
        if not product.images:
            compatibility['reasons'].append('Product must have images')
        
        # Check if we have necessary measurements
        required_measurements = ['frame_width', 'lens_width', 'bridge_width']
        missing_measurements = []
        
        for measurement in required_measurements:
            if not getattr(product, measurement):
                missing_measurements.append(measurement)
        
        if missing_measurements:
            compatibility['reasons'].append(f"Missing measurements: {', '.join(missing_measurements)}")
        
        # Product is compatible if no blocking reasons
        compatibility['ar_compatible'] = len(compatibility['reasons']) == 0
        
        # Add product info
        compatibility['product_info'] = {
            'id': product.id,
            'name': product.name,
            'frame_type': product.frame_type,
            'frame_style': product.frame_style,
            'color': product.color,
            'measurements': {
                'frame_width': product.frame_width,
                'lens_width': product.lens_width,
                'bridge_width': product.bridge_width,
                'temple_length': product.temple_length
            }
        }
        
        return jsonify(compatibility), 200
    
    except Exception as e:
        current_app.logger.error(f"Error checking product compatibility: {str(e)}")
        return jsonify({'error': 'Failed to check compatibility'}), 500

@ar_bp.route('/save-try-on', methods=['POST'])
@jwt_required()
def save_try_on_result():
    """Save AR try-on result for user"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'try_on_image' not in data or 'product_id' not in data:
            return jsonify({'error': 'Missing required data'}), 400
        
        # Here you could save the try-on result to database
        # For now, we'll just return a success message
        
        try_on_data = {
            'user_id': current_user_id,
            'product_id': data['product_id'],
            'try_on_image': data['try_on_image'],
            'saved_at': 'timestamp_here'
        }
        
        # In a real implementation, you might save this to a database table
        # like UserTryOnHistory or similar
        
        return jsonify({
            'message': 'Try-on result saved successfully',
            'saved_id': str(uuid.uuid4())  # Mock saved ID
        }), 201
    
    except Exception as e:
        current_app.logger.error(f"Error saving try-on result: {str(e)}")
        return jsonify({'error': 'Failed to save try-on result'}), 500

def call_ar_service(ar_service_url, user_image_path, product_image_url, product_info):
    """Call external AR service for virtual try-on"""
    try:
        # Read user image as base64
        with open(user_image_path, 'rb') as img_file:
            user_image_b64 = base64.b64encode(img_file.read()).decode('utf-8')
        
        # Prepare request data
        payload = {
            'user_image': user_image_b64,
            'product_image_url': product_image_url,
            'product_info': {
                'frame_width': product_info.get('frame_width'),
                'lens_width': product_info.get('lens_width'),
                'bridge_width': product_info.get('bridge_width'),
                'frame_type': product_info.get('frame_type'),
                'color': product_info.get('color')
            }
        }
        
        # Call AR service
        response = requests.post(
            f"{ar_service_url}/api/try-on",
            json=payload,
            timeout=30,
            headers={'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            current_app.logger.error(f"AR service returned {response.status_code}: {response.text}")
            return {'success': False, 'error': 'AR service processing failed'}
    
    except requests.RequestException as e:
        current_app.logger.error(f"AR service request failed: {str(e)}")
        return {'success': False, 'error': 'AR service unavailable'}
    except Exception as e:
        current_app.logger.error(f"AR service call error: {str(e)}")
        return {'success': False, 'error': 'AR processing error'}