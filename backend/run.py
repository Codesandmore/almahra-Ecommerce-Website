from dotenv import load_dotenv
import os

# Load environment variables from .env.development
load_dotenv('.env.development')

from app import create_app
from flask import jsonify

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)