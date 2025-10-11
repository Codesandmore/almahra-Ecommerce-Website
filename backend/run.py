from app import create_app, db
from flask_migrate import upgrade
import os

app = create_app()

# Health check endpoint for Docker
@app.route('/health')
def health_check():
    """Health check endpoint for load balancers and Docker"""
    return {
        'status': 'healthy',
        'message': 'Almahra E-commerce Backend is running'
    }, 200

if __name__ == '__main__':
    with app.app_context():
        # Create tables if they don't exist
        if os.environ.get('FLASK_ENV') == 'development':
            db.create_all()
    
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug, threaded=True)