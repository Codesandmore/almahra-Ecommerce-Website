# Almahra E-commerce Backend - Setup Guide

Flask-based REST API backend for the Almahra eyewear e-commerce platform.

## 🚀 Tech Stack

- **Framework**: Flask 3.0.0
- **Database**: PostgreSQL 16.x
- **Authentication**: Flask-JWT-Extended
- **ORM**: SQLAlchemy with Flask-Migrate
- **Payment**: Stripe API
- **Email**: Flask-Mail (SMTP)
- **Caching**: Redis (optional)

## 📋 Prerequisites

- Python 3.8 or higher
- PostgreSQL 16.x installed and running
- pip (Python package manager)
- Redis (optional, for caching)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd almahra-Ecommerce-Website/backend
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Copy the example environment file and configure it:

```bash
# Windows PowerShell
Copy-Item .env.example .env.development

# Linux/Mac
cp .env.example .env.development
```

Edit `.env.development` with your credentials:

```env
# Database Configuration
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/almahra_ecommerce

# Email Configuration (Gmail example)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Stripe Keys (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 5. Database Setup

Create the PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE almahra_ecommerce;

# Exit psql
\q
```

Run migrations:

```bash
flask db upgrade
```

### 6. Seed Initial Data (Optional)

Create an admin user:

```python
# Run Python shell
python

# Execute seeding script
from app import create_app, db
from app.models.user import User
from app.models.user_role import UserRole

app = create_app()
with app.app_context():
    admin = User(
        email='admin@almahra.com',
        first_name='Admin',
        last_name='User',
        role=UserRole.ADMIN.value
    )
    admin.set_password('Admin@123')
    db.session.add(admin)
    db.session.commit()
    print('Admin user created successfully!')
```

### 7. Run the Development Server

```bash
python run.py
```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py           # Flask app factory
│   ├── models/               # Database models
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   └── ...
│   ├── routes/               # API endpoints
│   │   ├── auth.py           # Authentication routes
│   │   ├── products.py       # Product CRUD
│   │   ├── orders.py         # Order management
│   │   ├── admin.py          # Admin endpoints
│   │   └── ...
│   ├── services/             # Business logic
│   │   ├── email_service.py
│   │   ├── payment_service.py
│   │   └── ...
│   └── utils/                # Utility functions
│       ├── auth.py           # Auth decorators
│       ├── validators.py     # Input validation
│       └── ...
├── config/
│   └── config.py             # Configuration classes
├── migrations/               # Database migrations
├── uploads/                  # File uploads (gitignored)
├── .env.development          # Development environment variables (gitignored)
├── .env.example              # Environment template
├── requirements.txt          # Python dependencies
└── run.py                    # Application entry point
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### User Roles
- `CUSTOMER` - Regular users
- `ADMIN` - Admin users with access to admin panel
- `SUPER_ADMIN` - Full system access

### Protected Endpoints

Endpoints requiring authentication need the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get user's orders (auth required)
- `POST /api/orders` - Create new order (auth required)
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/dashboard` - Get dashboard metrics (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)

### Uploads
- `POST /api/uploads/image` - Upload image (auth required)

## 🗄️ Database Schema

### Key Tables
- `users` - User accounts and authentication
- `products` - Product catalog
- `product_variants` - Product variations (colors, sizes)
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `categories` - Product categories
- `brands` - Product brands
- `cart` - Shopping cart items

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `FLASK_ENV` | Application environment | `development` |
| `SECRET_KEY` | Flask secret key | Random string |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost/db` |
| `JWT_SECRET_KEY` | JWT signing key | Random string |
| `STRIPE_SECRET_KEY` | Stripe API secret | `sk_test_...` |
| `MAIL_USERNAME` | SMTP email address | `your-email@gmail.com` |
| `MAIL_PASSWORD` | SMTP password/app password | `your-app-password` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |

### Ports
- Backend API: `5000`
- PostgreSQL: `5432`
- Redis: `6379` (optional)
- Frontend: `5173` (Vite dev server)

## 📧 Email Configuration

For Gmail:
1. Enable 2-Factor Authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `MAIL_PASSWORD` environment variable

## 💳 Stripe Configuration

1. Create a Stripe account: https://dashboard.stripe.com/register
2. Get your test API keys: https://dashboard.stripe.com/test/apikeys
3. Add keys to `.env.development`
4. For webhooks, install Stripe CLI: https://stripe.com/docs/stripe-cli

## 🧪 Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app
```

## 📝 Database Migrations

```bash
# Create a new migration
flask db migrate -m "Description of changes"

# Apply migrations
flask db upgrade

# Rollback migration
flask db downgrade
```

## 🚨 Common Issues

### Database Connection Error
- Ensure PostgreSQL is running: `sudo systemctl status postgresql` (Linux) or check Services (Windows)
- Check DATABASE_URL in `.env.development`
- Verify database exists: `psql -l`

### Import Errors
- Activate virtual environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)
- Reinstall dependencies: `pip install -r requirements.txt`

### JWT Token Issues
- Check JWT_SECRET_KEY is set
- Verify token expiration settings
- Clear old tokens from localStorage

### CORS Errors
- Ensure CORS_ORIGINS includes frontend URL
- Check Flask-CORS is installed

## 🔒 Security Considerations

- Never commit `.env.development` or `.env.production` files
- Use strong SECRET_KEY and JWT_SECRET_KEY (generate with `os.urandom(24).hex()`)
- Enable HTTPS in production
- Use environment variables for all sensitive data
- Implement rate limiting for production
- Validate and sanitize all user inputs

## 📦 Deployment

### Production Checklist
- [ ] Set `FLASK_ENV=production`
- [ ] Use strong secret keys
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure proper CORS origins
- [ ] Set up email service (SendGrid, AWS SES)
- [ ] Configure Stripe production keys
- [ ] Set up proper logging
- [ ] Configure error monitoring (Sentry)
- [ ] Set up database backups
- [ ] Implement rate limiting
- [ ] Set up CDN for static files

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit pull request

## 📞 Contact

For questions or issues, contact the development team.

---

**Note**: This is a development setup guide. For production deployment, additional security and configuration steps are required.
