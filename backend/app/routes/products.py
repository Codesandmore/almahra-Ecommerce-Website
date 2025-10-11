from flask import Blueprint, request, jsonify, current_app
from sqlalchemy import or_, and_, func
from app.models import db, Product, Category, Brand, ProductImage, Review
from app.utils.validators import validate_pagination_params, sanitize_search_query
from app.utils.auth import admin_required, get_current_user
import json

products_bp = Blueprint('products', __name__)

@products_bp.route('', methods=['GET'])
def get_products():
    """Get products with filtering, searching, and pagination"""
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '').strip()
        category_id = request.args.get('category_id', type=int)
        brand_id = request.args.get('brand_id', type=int)
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        frame_type = request.args.get('frame_type', '').strip()
        frame_style = request.args.get('frame_style', '').strip()
        color = request.args.get('color', '').strip()
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        is_featured = request.args.get('featured', type=bool)
        in_stock = request.args.get('in_stock', type=bool)
        
        # Validate pagination
        page, per_page, pagination_errors = validate_pagination_params(page, per_page)
        if pagination_errors:
            return jsonify({'errors': pagination_errors}), 400
        
        # Base query - only active products
        query = Product.query.filter(Product.is_active == True)
        
        # Apply search filter
        if search:
            search = sanitize_search_query(search)
            search_filter = or_(
                Product.name.ilike(f'%{search}%'),
                Product.description.ilike(f'%{search}%'),
                Product.short_description.ilike(f'%{search}%'),
                Product.tags.ilike(f'%{search}%')
            )
            query = query.filter(search_filter)
        
        # Apply category filter
        if category_id:
            query = query.join(Product.categories).filter(Category.id == category_id)
        
        # Apply brand filter
        if brand_id:
            query = query.filter(Product.brand_id == brand_id)
        
        # Apply price filters
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        
        # Apply product attribute filters
        if frame_type:
            query = query.filter(Product.frame_type == frame_type)
        if frame_style:
            query = query.filter(Product.frame_style == frame_style)
        if color:
            query = query.filter(Product.color.ilike(f'%{color}%'))
        
        # Apply featured filter
        if is_featured is not None:
            query = query.filter(Product.is_featured == is_featured)
        
        # Apply stock filter
        if in_stock is not None:
            if in_stock:
                query = query.filter(
                    or_(
                        Product.track_inventory == False,
                        Product.stock_quantity > 0
                    )
                )
            else:
                query = query.filter(
                    and_(
                        Product.track_inventory == True,
                        Product.stock_quantity <= 0
                    )
                )
        
        # Apply sorting
        sort_options = {
            'name': Product.name,
            'price': Product.price,
            'created_at': Product.created_at,
            'updated_at': Product.updated_at,
            'popularity': Product.id  # Placeholder for popularity sorting
        }
        
        if sort_by in sort_options:
            sort_column = sort_options[sort_by]
            if sort_order.lower() == 'desc':
                query = query.order_by(sort_column.desc())
            else:
                query = query.order_by(sort_column.asc())
        else:
            # Default sorting
            query = query.order_by(Product.created_at.desc())
        
        # Execute pagination
        products_pagination = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        products = products_pagination.items
        
        return jsonify({
            'products': [product.to_dict() for product in products],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': products_pagination.total,
                'pages': products_pagination.pages,
                'has_next': products_pagination.has_next,
                'has_prev': products_pagination.has_prev
            },
            'filters_applied': {
                'search': search,
                'category_id': category_id,
                'brand_id': brand_id,
                'min_price': min_price,
                'max_price': max_price,
                'frame_type': frame_type,
                'frame_style': frame_style,
                'color': color,
                'is_featured': is_featured,
                'in_stock': in_stock
            }
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching products: {str(e)}")
        return jsonify({'error': 'Failed to fetch products'}), 500

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        product = Product.query.filter_by(id=product_id, is_active=True).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({'product': product.to_dict(include_details=True)}), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching product {product_id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch product'}), 500

@products_bp.route('/slug/<slug>', methods=['GET'])
def get_product_by_slug(slug):
    """Get single product by slug"""
    try:
        product = Product.query.filter_by(slug=slug, is_active=True).first()
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify({'product': product.to_dict(include_details=True)}), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching product with slug {slug}: {str(e)}")
        return jsonify({'error': 'Failed to fetch product'}), 500

@products_bp.route('/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    """Get reviews for a specific product"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Validate pagination
        page, per_page, pagination_errors = validate_pagination_params(page, per_page, 50)
        if pagination_errors:
            return jsonify({'errors': pagination_errors}), 400
        
        # Check if product exists
        product = Product.query.filter_by(id=product_id, is_active=True).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Get approved reviews
        reviews_pagination = Review.query.filter_by(
            product_id=product_id,
            is_approved=True
        ).order_by(Review.created_at.desc()).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        reviews = reviews_pagination.items
        
        # Calculate rating statistics
        rating_stats = db.session.query(
            Review.rating,
            func.count(Review.rating).label('count')
        ).filter_by(
            product_id=product_id,
            is_approved=True
        ).group_by(Review.rating).all()
        
        rating_distribution = {str(i): 0 for i in range(1, 6)}
        for rating, count in rating_stats:
            rating_distribution[str(rating)] = count
        
        return jsonify({
            'reviews': [review.to_dict() for review in reviews],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': reviews_pagination.total,
                'pages': reviews_pagination.pages,
                'has_next': reviews_pagination.has_next,
                'has_prev': reviews_pagination.has_prev
            },
            'rating_stats': {
                'average_rating': product.get_average_rating(),
                'total_reviews': product.get_review_count(),
                'rating_distribution': rating_distribution
            }
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching reviews for product {product_id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch reviews'}), 500

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all active categories"""
    try:
        categories = Category.query.filter_by(is_active=True).order_by(Category.sort_order, Category.name).all()
        
        # Organize categories hierarchically
        category_tree = []
        category_dict = {cat.id: cat.to_dict() for cat in categories}
        
        for category in categories:
            cat_data = category_dict[category.id]
            if category.parent_id is None:
                # Root category
                cat_data['subcategories'] = []
                category_tree.append(cat_data)
            else:
                # Subcategory - add to parent
                parent = category_dict.get(category.parent_id)
                if parent and 'subcategories' not in parent:
                    parent['subcategories'] = []
                if parent:
                    parent['subcategories'].append(cat_data)
        
        return jsonify({'categories': category_tree}), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching categories: {str(e)}")
        return jsonify({'error': 'Failed to fetch categories'}), 500

@products_bp.route('/brands', methods=['GET'])
def get_brands():
    """Get all active brands"""
    try:
        brands = Brand.query.filter_by(is_active=True).order_by(Brand.name).all()
        
        return jsonify({
            'brands': [brand.to_dict() for brand in brands]
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching brands: {str(e)}")
        return jsonify({'error': 'Failed to fetch brands'}), 500

@products_bp.route('/featured', methods=['GET'])
def get_featured_products():
    """Get featured products"""
    try:
        limit = request.args.get('limit', 8, type=int)
        
        # Limit the number of featured products
        if limit > 20:
            limit = 20
        
        products = Product.query.filter_by(
            is_active=True,
            is_featured=True
        ).order_by(Product.created_at.desc()).limit(limit).all()
        
        return jsonify({
            'products': [product.to_dict() for product in products]
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching featured products: {str(e)}")
        return jsonify({'error': 'Failed to fetch featured products'}), 500

@products_bp.route('/search-suggestions', methods=['GET'])
def get_search_suggestions():
    """Get search suggestions based on query"""
    try:
        query = request.args.get('q', '').strip()
        limit = request.args.get('limit', 10, type=int)
        
        if not query or len(query) < 2:
            return jsonify({'suggestions': []}), 200
        
        # Limit suggestions
        if limit > 20:
            limit = 20
        
        query = sanitize_search_query(query)
        
        # Get product name suggestions
        product_suggestions = db.session.query(Product.name).filter(
            and_(
                Product.is_active == True,
                Product.name.ilike(f'%{query}%')
            )
        ).limit(limit).all()
        
        # Get brand name suggestions
        brand_suggestions = db.session.query(Brand.name).filter(
            and_(
                Brand.is_active == True,
                Brand.name.ilike(f'%{query}%')
            )
        ).limit(limit).all()
        
        suggestions = []
        suggestions.extend([product[0] for product in product_suggestions])
        suggestions.extend([f"{brand[0]} (Brand)" for brand in brand_suggestions])
        
        # Remove duplicates and limit
        unique_suggestions = list(set(suggestions))[:limit]
        
        return jsonify({'suggestions': unique_suggestions}), 200
    
    except Exception as e:
        current_app.logger.error(f"Error getting search suggestions: {str(e)}")
        return jsonify({'error': 'Failed to get suggestions'}), 500

@products_bp.route('/filters', methods=['GET'])
def get_product_filters():
    """Get available filter options for products"""
    try:
        # Get unique frame types
        frame_types = db.session.query(Product.frame_type).filter(
            and_(
                Product.is_active == True,
                Product.frame_type.isnot(None)
            )
        ).distinct().all()
        
        # Get unique frame styles
        frame_styles = db.session.query(Product.frame_style).filter(
            and_(
                Product.is_active == True,
                Product.frame_style.isnot(None)
            )
        ).distinct().all()
        
        # Get unique colors
        colors = db.session.query(Product.color).filter(
            and_(
                Product.is_active == True,
                Product.color.isnot(None)
            )
        ).distinct().all()
        
        # Get price range
        price_range = db.session.query(
            func.min(Product.price).label('min_price'),
            func.max(Product.price).label('max_price')
        ).filter(Product.is_active == True).first()
        
        return jsonify({
            'frame_types': [ft[0] for ft in frame_types if ft[0]],
            'frame_styles': [fs[0] for fs in frame_styles if fs[0]],
            'colors': [color[0] for color in colors if color[0]],
            'price_range': {
                'min': float(price_range.min_price) if price_range.min_price else 0,
                'max': float(price_range.max_price) if price_range.max_price else 1000
            }
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error fetching product filters: {str(e)}")
        return jsonify({'error': 'Failed to fetch filters'}), 500