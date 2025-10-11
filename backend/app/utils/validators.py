from flask import request, jsonify
from functools import wraps
import re
from marshmallow import ValidationError

def validate_json(f):
    """Decorator to validate JSON request data"""
    @wraps(f)
    def decorated(*args, **kwargs):
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
        return f(*args, **kwargs)
    return decorated

def validate_email(email):
    """Validate email format"""
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_pattern, email) is not None

def validate_phone(phone):
    """Validate phone number format"""
    if not phone:
        return True  # Phone is optional
    
    # Remove all non-digit characters
    digits_only = re.sub(r'\D', '', phone)
    
    # Check if it's a valid length (10-15 digits)
    return 10 <= len(digits_only) <= 15

def validate_required_fields(data, required_fields):
    """Validate that required fields are present and not empty"""
    errors = []
    
    for field in required_fields:
        if field not in data:
            errors.append(f"{field} is required")
        elif not data[field] or (isinstance(data[field], str) and not data[field].strip()):
            errors.append(f"{field} cannot be empty")
    
    return errors

def validate_product_data(data):
    """Validate product data"""
    errors = []
    
    # Required fields for products
    required_fields = ['name', 'description', 'price', 'sku']
    errors.extend(validate_required_fields(data, required_fields))
    
    # Validate price
    if 'price' in data:
        try:
            price = float(data['price'])
            if price <= 0:
                errors.append("Price must be greater than 0")
        except (ValueError, TypeError):
            errors.append("Price must be a valid number")
    
    # Validate stock quantity
    if 'stock_quantity' in data:
        try:
            stock = int(data['stock_quantity'])
            if stock < 0:
                errors.append("Stock quantity cannot be negative")
        except (ValueError, TypeError):
            errors.append("Stock quantity must be a valid integer")
    
    # Validate SKU format
    if 'sku' in data:
        sku = data['sku'].strip()
        if not re.match(r'^[A-Za-z0-9\-_]+$', sku):
            errors.append("SKU can only contain letters, numbers, hyphens, and underscores")
    
    return errors

def validate_address_data(data):
    """Validate address data"""
    errors = []
    
    required_fields = [
        'first_name', 'last_name', 'address_line_1', 
        'city', 'state', 'postal_code', 'country'
    ]
    errors.extend(validate_required_fields(data, required_fields))
    
    # Validate postal code format (basic validation)
    if 'postal_code' in data:
        postal_code = data['postal_code'].strip()
        if not re.match(r'^[A-Za-z0-9\s\-]{3,10}$', postal_code):
            errors.append("Invalid postal code format")
    
    return errors

def validate_prescription_data(data):
    """Validate prescription data"""
    errors = []
    
    required_fields = ['prescription_name']
    errors.extend(validate_required_fields(data, required_fields))
    
    # Validate sphere values
    sphere_fields = ['od_sphere', 'os_sphere']
    for field in sphere_fields:
        if field in data and data[field] is not None:
            try:
                sphere = float(data[field])
                if not (-20.0 <= sphere <= 20.0):
                    errors.append(f"{field} must be between -20.0 and +20.0")
            except (ValueError, TypeError):
                errors.append(f"{field} must be a valid number")
    
    # Validate cylinder values
    cylinder_fields = ['od_cylinder', 'os_cylinder']
    for field in cylinder_fields:
        if field in data and data[field] is not None:
            try:
                cylinder = float(data[field])
                if not (-6.0 <= cylinder <= 0.0):
                    errors.append(f"{field} must be between -6.0 and 0.0")
            except (ValueError, TypeError):
                errors.append(f"{field} must be a valid number")
    
    # Validate axis values
    axis_fields = ['od_axis', 'os_axis']
    for field in axis_fields:
        if field in data and data[field] is not None:
            try:
                axis = int(data[field])
                if not (0 <= axis <= 180):
                    errors.append(f"{field} must be between 0 and 180")
            except (ValueError, TypeError):
                errors.append(f"{field} must be a valid integer")
    
    # Validate PD (Pupillary Distance)
    if 'pd' in data and data['pd'] is not None:
        try:
            pd = float(data['pd'])
            if not (20.0 <= pd <= 80.0):
                errors.append("PD must be between 20.0 and 80.0")
        except (ValueError, TypeError):
            errors.append("PD must be a valid number")
    
    return errors

def validate_order_data(data):
    """Validate order data"""
    errors = []
    
    # Validate addresses
    if 'billing_address' in data:
        billing_errors = validate_address_data(data['billing_address'])
        errors.extend([f"billing_address.{error}" for error in billing_errors])
    
    if 'shipping_address' in data:
        shipping_errors = validate_address_data(data['shipping_address'])
        errors.extend([f"shipping_address.{error}" for error in shipping_errors])
    
    # Validate items
    if 'items' not in data or not data['items']:
        errors.append("Order must contain at least one item")
    else:
        for i, item in enumerate(data['items']):
            if 'product_id' not in item:
                errors.append(f"Item {i+1}: product_id is required")
            if 'quantity' not in item:
                errors.append(f"Item {i+1}: quantity is required")
            elif not isinstance(item['quantity'], int) or item['quantity'] <= 0:
                errors.append(f"Item {i+1}: quantity must be a positive integer")
    
    return errors

def validate_file_upload(file, allowed_extensions, max_size=5*1024*1024):
    """Validate file upload"""
    errors = []
    
    if not file or file.filename == '':
        errors.append("No file selected")
        return errors
    
    # Check file extension
    if '.' not in file.filename:
        errors.append("File must have an extension")
    else:
        file_ext = file.filename.rsplit('.', 1)[1].lower()
        if file_ext not in allowed_extensions:
            errors.append(f"File type not allowed. Allowed types: {', '.join(allowed_extensions)}")
    
    # Check file size (if we can get it)
    try:
        file.seek(0, 2)  # Seek to end
        file_size = file.tell()
        file.seek(0)  # Reset to beginning
        
        if file_size > max_size:
            errors.append(f"File size too large. Maximum size: {max_size // (1024*1024)}MB")
    except:
        pass  # If we can't get file size, skip this validation
    
    return errors

def sanitize_search_query(query):
    """Sanitize search query to prevent injection attacks"""
    if not query:
        return ""
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\';\\]', '', query.strip())
    
    # Limit length
    if len(sanitized) > 100:
        sanitized = sanitized[:100]
    
    return sanitized

def validate_pagination_params(page=1, per_page=20, max_per_page=100):
    """Validate pagination parameters"""
    errors = []
    
    try:
        page = int(page)
        if page < 1:
            errors.append("Page must be 1 or greater")
    except (ValueError, TypeError):
        errors.append("Page must be a valid integer")
        page = 1
    
    try:
        per_page = int(per_page)
        if per_page < 1:
            errors.append("Per page must be 1 or greater")
        elif per_page > max_per_page:
            errors.append(f"Per page cannot exceed {max_per_page}")
    except (ValueError, TypeError):
        errors.append("Per page must be a valid integer")
        per_page = 20
    
    return page, per_page, errors