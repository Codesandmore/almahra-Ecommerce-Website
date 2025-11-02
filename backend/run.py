from app import create_app
from flask import jsonify

app = create_app()

# Remove this duplicate health endpoint - it's already defined in your app routes
# @app.route('/health')
# def health_check():
#     return jsonify({
#         "status": "healthy",
#         "service": "Almahra Ecommerce API"
#     })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)