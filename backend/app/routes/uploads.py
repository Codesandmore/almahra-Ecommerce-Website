from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from app.utils.auth import admin_required
import os
import uuid
from datetime import datetime

uploads_bp = Blueprint('uploads', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@uploads_bp.route('/image', methods=['POST'])
@admin_required
def upload_image():
    """Upload product image"""
    try:
        # Check if file is in request
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        # Check if filename is empty
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif, webp'}), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': 'File size exceeds 5MB limit'}), 400
        
        # Generate unique filename
        ext = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d%H%M%S')}.{ext}"
        
        # Create upload directory if it doesn't exist
        upload_folder = os.path.join(current_app.root_path, '..', 'uploads', 'products')
        os.makedirs(upload_folder, exist_ok=True)
        
        # Save file
        filepath = os.path.join(upload_folder, unique_filename)
        file.save(filepath)
        
        # Generate URL
        image_url = f"/uploads/products/{unique_filename}"
        
        return jsonify({
            'message': 'Image uploaded successfully',
            'image_url': image_url,
            'filename': unique_filename
        }), 201
    
    except Exception as e:
        current_app.logger.error(f"Error uploading image: {str(e)}")
        return jsonify({'error': 'Failed to upload image'}), 500

@uploads_bp.route('/products/<filename>', methods=['GET'])
def serve_product_image(filename):
    """Serve uploaded product images"""
    try:
        upload_folder = os.path.join(current_app.root_path, '..', 'uploads', 'products')
        return send_from_directory(upload_folder, filename)
    except Exception as e:
        current_app.logger.error(f"Error serving image: {str(e)}")
        return jsonify({'error': 'Image not found'}), 404

@uploads_bp.route('/image/<filename>', methods=['DELETE'])
@admin_required
def delete_image(filename):
    """Delete uploaded image"""
    try:
        upload_folder = os.path.join(current_app.root_path, '..', 'uploads', 'products')
        filepath = os.path.join(upload_folder, filename)
        
        if os.path.exists(filepath):
            os.remove(filepath)
            return jsonify({'message': 'Image deleted successfully'}), 200
        else:
            return jsonify({'error': 'Image not found'}), 404
    
    except Exception as e:
        current_app.logger.error(f"Error deleting image: {str(e)}")
        return jsonify({'error': 'Failed to delete image'}), 500
