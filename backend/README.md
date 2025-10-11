# Almahra E-commerce Backend# Almahra Ecommerce Backend

A comprehensive Flask-based REST API backend for the Almahra e-commerce platform with features including user authentication, product management, shopping cart, payment processing, order management, and AR try-on integration.A production-ready Node.js/Express backend for an optical ecommerce platform with comprehensive features including authentication, payment processing, inventory management, and admin dashboard.

## 🚀 Features## 🚀 Features

### Core Functionality- **Secure Authentication**: JWT-based authentication with role-based access control

- **User Authentication & Authorization**: JWT-based authentication with role-based access control (Customer, Admin, Super Admin)- **User Management**: Customer registration, profile management, prescription storage

- **Product Catalog**: Complete product management with categories, brands, variants, and inventory tracking- **Product Management**: Complex product catalog with variants, categories, and inventory tracking

- **Shopping Cart**: Persistent cart functionality with session management- **Order Management**: Complete order lifecycle with status tracking and history

- **Order Management**: Complete order lifecycle from cart to delivery with status tracking- **Payment Processing**: Stripe integration with webhooks and payment confirmations

- **Payment Processing**: Stripe integration for secure payments, refunds, and webhooks- **Admin Dashboard**: Comprehensive admin controls for products, orders, and users

- **User Profiles**: Customer profiles with addresses, prescriptions, and order history- **Email Notifications**: Automated order confirmations and status updates

- **Admin Dashboard**: Comprehensive admin interface with analytics and management tools- **Prescription Management**: Secure storage and management of customer prescriptions

- **Address Management**: Multiple shipping and billing addresses per user

### Advanced Features - **Review System**: Product reviews and ratings

- **AR Try-On Integration**: Computer vision-powered virtual try-on functionality using OpenCV- **Cart Management**: Persistent shopping cart functionality

- **Email Notifications**: Automated email system with HTML templates for order confirmations, shipping updates- **Stock Management**: Real-time inventory tracking with out-of-stock prevention

- **File Upload Management**: Secure image upload for products and user avatars

- **Search & Filtering**: Advanced product search with filters and sorting## 🛠 Tech Stack

- **Reviews & Ratings**: Product review system with rating aggregation

- **Inventory Management**: Stock tracking with low-stock alerts- **Runtime**: Node.js 18+

- **Analytics**: Sales analytics, revenue tracking, and reporting- **Framework**: Express.js with TypeScript

- **Database**: PostgreSQL with Prisma ORM

## 🏗️ Architecture- **Authentication**: JWT with bcrypt password hashing

- **Payment**: Stripe payment processing

### Technology Stack- **Email**: Nodemailer with HTML templates

- **Framework**: Flask 3.0.0 with Application Factory pattern- **Containerization**: Docker with multi-stage builds

- **Database**: PostgreSQL with SQLAlchemy ORM- **Proxy**: Nginx for production deployment

- **Authentication**: Flask-JWT-Extended for token management- **Security**: Rate limiting, CORS, helmet, input validation

- **Payment**: Stripe API integration

- **Email**: Flask-Mail with HTML template support## 📁 Project Structure

- **Image Processing**: OpenCV and Pillow for AR features

- **Caching**: Redis for session management```

- **API Documentation**: Swagger/OpenAPI integrationbackend/

- **Containerization**: Docker with multi-stage builds├── src/

│ ├── middleware/ # Authentication and security middleware

### Project Structure│ ├── routes/ # API route handlers

````│ ├── services/            # Business logic and external services

backend/│   ├── utils/               # Utility functions and helpers

├── app/│   ├── types/               # TypeScript type definitions

│   ├── __init__.py              # Application factory│   ├── database/            # Database seeds and utilities

│   ├── config.py                # Configuration management│   └── server.ts            # Main application entry point

│   ├── models/                  # Database models├── prisma/

│   │   ├── __init__.py│   ├── schema.prisma        # Database schema definition

│   │   ├── user.py             # User, Address, Prescription models│   └── migrations/          # Database migration files

│   │   ├── product.py          # Product, Category, Brand models├── docker/

│   │   └── order.py            # Order, Cart, Review models│   ├── Dockerfile           # Production Docker image

│   ├── routes/                  # API blueprints│   ├── Dockerfile.dev       # Development Docker image

│   │   ├── __init__.py│   └── nginx.conf           # Nginx configuration

│   │   ├── auth.py             # Authentication endpoints├── email-templates/         # HTML email templates

│   │   ├── products.py         # Product catalog API└── docker-compose.yml       # Multi-container orchestration

│   │   ├── cart.py             # Shopping cart API```

│   │   ├── orders.py           # Order management API

│   │   ├── payments.py         # Stripe payment processing## 🔧 Installation & Setup

│   │   ├── users.py            # User profile management

│   │   ├── admin.py            # Admin dashboard API### Prerequisites

│   │   └── ar_integration.py   # AR try-on endpoints

│   ├── services/                # Business logic services- Node.js 18 or higher

│   │   ├── __init__.py- PostgreSQL 15 or higher

│   │   └── email_service.py    # Email notification service- Docker (optional, for containerized deployment)

│   ├── utils/                   # Utility functions

│   │   ├── __init__.py### Environment Configuration

│   │   ├── auth.py             # Authentication helpers

│   │   └── validators.py       # Input validation1. Copy the environment template:

│   └── templates/               # Email templates

│       ├── base.html```bash

│       ├── email_verification.htmlcp .env.example .env

│       ├── order_confirmation.html```

│       └── shipping_notification.html

├── uploads/                     # File upload directory2. Configure your environment variables:

├── requirements.txt             # Python dependencies

├── run.py                      # Application entry point```env

├── Dockerfile                  # Docker configuration# Database Configuration

├── docker-compose.yml         # Multi-container setupDATABASE_URL="postgresql://username:password@localhost:5432/almahra_ecommerce"

├── .dockerignore              # Docker ignore rules

├── .env.development           # Development environment variables# JWT Configuration

├── .env.production           # Production environment variablesJWT_SECRET="your-super-secret-jwt-key-here"

└── README.md                 # This fileJWT_EXPIRES_IN="7d"

````

# Stripe Configuration

## 🛠️ Installation & SetupSTRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"

STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

### Prerequisites

- Python 3.11+# Email Configuration

- PostgreSQL 15+SMTP_HOST="smtp.gmail.com"

- Redis 7+SMTP_PORT=587

- Docker & Docker Compose (for containerized deployment)SMTP_USER="your-email@gmail.com"

SMTP_PASS="your-app-password"

### Local Development SetupFROM_EMAIL="noreply@almahra-opticals.com"

1. **Clone the repository**# Application Configuration

```bashNODE_ENV="development"

git clone https://github.com/yourusername/almahra-ecommerce-backend.gitPORT=3000

cd almahra-ecommerce-backendFRONTEND_URL="http://localhost:5173"

```

# Admin User (for seeding)

2. **Create virtual environment**ADMIN_EMAIL="admin@almahra-opticals.com"

````bashADMIN_PASSWORD="secure-admin-password"

python -m venv venv```

source venv/bin/activate  # On Windows: venv\Scripts\activate

```### Local Development Setup



3. **Install dependencies**1. **Install dependencies:**

```bash

pip install -r requirements.txt```bash

```npm install

````

4. **Set up environment variables**

````bash2. **Setup the database:**

cp .env.development .env

# Edit .env with your configuration```bash

```# Generate Prisma client

npx prisma generate

5. **Set up database**

```bash# Run database migrations

# Create PostgreSQL databasenpx prisma migrate dev

createdb almahra_ecommerce

# Seed the database with sample data

# Initialize database tablesnpm run seed

python run.py```

````

3. **Start the development server:**

4. **Start Redis server**

`bash`bash

redis-servernpm run dev

```````



7. **Run the application**The API will be available at `http://localhost:3000`

```bash

python run.py### Docker Development Setup

```

1. **Start all services:**

The API will be available at `http://localhost:5000`

```bash

### Docker Development Setupdocker-compose up -d

```

1. **Build and run with Docker Compose**

```bash2. **Run database migrations:**

docker-compose up --build

``````bash

docker-compose exec backend npx prisma migrate dev

This will start:```

- PostgreSQL database on port 5432

- Redis server on port 6379  3. **Seed the database:**

- Flask backend on port 5000

```bash

## 🔧 Configurationdocker-compose exec backend npm run seed

```

### Environment Variables

## 🔐 API Authentication

| Variable | Description | Default |

|----------|-------------|---------|Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:

| `FLASK_ENV` | Flask environment (development/production) | development |

| `SECRET_KEY` | Flask secret key | Required |```

| `JWT_SECRET_KEY` | JWT token secret | Required |Authorization: Bearer <your-jwt-token>

| `DATABASE_URL` | PostgreSQL connection string | Required |```

| `REDIS_URL` | Redis connection string | Required |

| `STRIPE_SECRET_KEY` | Stripe API secret key | Required |### Authentication Endpoints

| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Required |

| `MAIL_SERVER` | SMTP server hostname | smtp.gmail.com |- `POST /api/auth/register` - User registration

| `MAIL_USERNAME` | SMTP username | Required |- `POST /api/auth/login` - User login

| `MAIL_PASSWORD` | SMTP password/app password | Required |- `POST /api/auth/logout` - User logout

| `FRONTEND_URL` | Frontend application URL | http://localhost:3000 |- `GET /api/auth/me` - Get current user profile



### Stripe Configuration## 📚 API Documentation



1. **Create Stripe Account**: Sign up at [stripe.com](https://stripe.com)### Products API

2. **Get API Keys**: Navigate to Developers > API Keys

3. **Set up Webhooks**: Configure webhook endpoint at `/api/payments/webhook`- `GET /api/products` - List products with filtering and pagination

4. **Configure Environment**: Add keys to your `.env` file- `GET /api/products/:id` - Get product details

- `POST /api/products` - Create product (Admin only)

### Email Configuration- `PUT /api/products/:id` - Update product (Admin only)

- `DELETE /api/products/:id` - Delete product (Admin only)

For Gmail SMTP:

1. **Enable 2FA**: Enable two-factor authentication on your Gmail account### Cart API

2. **Generate App Password**: Create an app-specific password

3. **Configure Environment**: Use your email and app password in `.env`- `GET /api/cart` - Get user's cart

- `POST /api/cart/add` - Add item to cart

## 📚 API Documentation- `PUT /api/cart/item/:id` - Update cart item

- `DELETE /api/cart/item/:id` - Remove cart item

### Authentication Endpoints- `DELETE /api/cart/clear` - Clear cart

- `POST /api/auth/register` - User registration

- `POST /api/auth/login` - User login### Orders API

- `POST /api/auth/logout` - User logout

- `POST /api/auth/refresh` - Refresh JWT token- `GET /api/orders` - Get user's orders

- `POST /api/auth/verify-email` - Email verification- `GET /api/orders/:id` - Get order details

- `POST /api/auth/reset-password` - Password reset- `POST /api/orders` - Create new order

- `PUT /api/orders/:id/status` - Update order status (Admin only)

### Product Endpoints

- `GET /api/products` - Get products with filtering/pagination### Payment API

- `GET /api/products/{id}` - Get single product

- `POST /api/products` - Create product (Admin)- `POST /api/payment/create-intent` - Create payment intent

- `PUT /api/products/{id}` - Update product (Admin)- `POST /api/payment/webhook` - Stripe webhook handler

- `DELETE /api/products/{id}` - Delete product (Admin)

- `GET /api/products/categories` - Get categories### Admin API

- `GET /api/products/brands` - Get brands

- `GET /api/admin/dashboard` - Dashboard statistics

### Cart Endpoints- `GET /api/admin/orders` - Manage all orders

- `GET /api/cart` - Get user cart- `GET /api/admin/products` - Manage all products

- `POST /api/cart/add` - Add item to cart- `GET /api/admin/users` - Manage users

- `PUT /api/cart/update/{item_id}` - Update cart item

- `DELETE /api/cart/remove/{item_id}` - Remove cart item### User Management API

- `DELETE /api/cart/clear` - Clear cart

- `GET /api/user/profile` - Get user profile

### Order Endpoints- `PUT /api/user/profile` - Update user profile

- `GET /api/orders` - Get user orders- `GET /api/user/addresses` - Get user addresses

- `POST /api/orders` - Create order from cart- `POST /api/user/addresses` - Add new address

- `GET /api/orders/{id}` - Get order details- `GET /api/user/prescriptions` - Get user prescriptions

- `PUT /api/orders/{id}/cancel` - Cancel order- `POST /api/user/prescriptions` - Add prescription

- `GET /api/orders/{id}/track` - Track order

## 🗄 Database Schema

### Payment Endpoints

- `POST /api/payments/create-intent` - Create payment intentThe database includes the following main entities:

- `POST /api/payments/confirm` - Confirm payment

- `POST /api/payments/webhook` - Stripe webhook handler- **Users**: Customer and admin accounts with role-based access

- `POST /api/payments/refund` - Process refund (Admin)- **Products**: Product catalog with variants, categories, and brands

- **Orders**: Order management with items and status tracking

### User Management- **Addresses**: Multiple shipping/billing addresses per user

- `GET /api/users/profile` - Get user profile- **Prescriptions**: Secure prescription data storage

- `PUT /api/users/profile` - Update profile- **Reviews**: Product reviews and ratings

- `POST /api/users/addresses` - Add address- **Cart**: Persistent shopping cart items

- `GET /api/users/orders` - Get order history- **Categories**: Product categorization

- `POST /api/users/prescriptions` - Upload prescription- **Brands**: Brand management

- **Product Variants**: Color, size, and stock variants

### Admin Endpoints

- `GET /api/admin/dashboard` - Dashboard analytics## 📧 Email System

- `GET /api/admin/orders` - Manage all orders

- `GET /api/admin/users` - User managementThe system includes automated email notifications for:

- `POST /api/admin/products` - Product management

- `GET /api/admin/analytics` - Sales analytics- Welcome emails for new registrations

- Order confirmations with details

### AR Integration- Order status updates

- `POST /api/ar/upload-photo` - Upload user photo- Password reset emails

- `POST /api/ar/try-on/{product_id}` - Virtual try-on- Prescription upload confirmations

- `GET /api/ar/results/{session_id}` - Get AR results

Email templates are customizable HTML files located in the `email-templates/` directory.

## 🧪 Testing

## 💳 Payment Processing

### Running Tests

```bashStripe integration includes:

# Install test dependencies

pip install pytest pytest-cov- Secure payment intent creation

- Webhook handling for payment confirmations

# Run all tests- Automatic order status updates

pytest- Payment failure handling

- Refund processing (admin)

# Run with coverage

pytest --cov=app## 🔒 Security Features



# Run specific test file- Password hashing with bcrypt

pytest tests/test_auth.py- JWT token authentication

```- Rate limiting on API endpoints

- CORS configuration

### Test Structure- Input validation and sanitization

```- SQL injection prevention via Prisma

tests/- XSS protection headers

├── conftest.py              # Test configuration- Secure HTTP headers via Helmet

├── test_auth.py            # Authentication tests

├── test_products.py        # Product API tests## 📊 Admin Dashboard Features

├── test_cart.py           # Cart functionality tests

├── test_orders.py         # Order management tests- Real-time dashboard with key metrics

├── test_payments.py       # Payment processing tests- Order management and status updates

└── test_admin.py          # Admin functionality tests- Product and inventory management

```- User account management

- Sales analytics and reporting

## 🚀 Deployment- Stock level monitoring

- Review moderation

### Production Deployment with Docker

## 🚀 Production Deployment

1. **Prepare production environment**

```bash### Docker Production Deployment

cp .env.production .env

# Update with production values1. **Build the production image:**

```

```bash

2. **Build production image**docker build -f docker/Dockerfile -t almahra-backend:latest .

```bash```

docker build -t almahra-backend:production .

```2. **Deploy with docker-compose:**



3. **Deploy with Docker Compose**```bash

```bashdocker-compose -f docker-compose.prod.yml up -d

docker-compose -f docker-compose.prod.yml up -d```

```

### AWS Deployment

### AWS Deployment

The application is containerized and ready for AWS deployment using:

1. **Create RDS PostgreSQL instance**

2. **Create ElastiCache Redis cluster**  - **ECS/Fargate**: Container orchestration

3. **Deploy to ECS/EKS or EC2**- **RDS PostgreSQL**: Managed database service

4. **Configure ALB for load balancing**- **ALB**: Application Load Balancer

5. **Set up CloudWatch for monitoring**- **Route 53**: DNS management

- **CloudWatch**: Logging and monitoring

### Environment-Specific Configurations

### Environment Variables for Production

#### Development

- Debug mode enabledEnsure all environment variables are properly configured in your production environment, especially:

- Detailed error messages

- Local database and Redis- `NODE_ENV=production`

- Strong `JWT_SECRET`

#### Production- Production Stripe keys

- Debug mode disabled- Production SMTP configuration

- Error logging to files- Secure database credentials

- Managed database services

- SSL/HTTPS enforcement## 🧪 Testing

- Rate limiting enabled

Run the test suite:

## 📊 Monitoring & Logging

```bash

### Health Checks# Run all tests

- **Endpoint**: `GET /health`npm test

- **Database**: Connection validation

- **Redis**: Cache connectivity# Run tests in watch mode

- **External Services**: Stripe, Email service statusnpm run test:watch



### Logging# Run tests with coverage

```pythonnpm run test:coverage

# Configure logging in config.py```

import logging

## 📝 Development Scripts

logging.basicConfig(

    level=logging.INFO,- `npm run dev` - Start development server with hot reload

    format='%(asctime)s %(levelname)s %(name)s %(message)s',- `npm run build` - Build for production

    handlers=[- `npm run start` - Start production server

        logging.FileHandler('app.log'),- `npm run lint` - Run ESLint

        logging.StreamHandler()- `npm run seed` - Seed database with sample data

    ]- `npm run db:reset` - Reset database and reseed

)

```## 🤝 Contributing



### Metrics1. Fork the repository

- API response times2. Create a feature branch

- Database query performance  3. Make your changes

- Payment success rates4. Add tests for new features

- Error rates by endpoint5. Ensure all tests pass

- User activity analytics6. Submit a pull request



## 🔒 Security## 📄 License



### Security FeaturesThis project is licensed under the MIT License - see the LICENSE file for details.

- **Password hashing**: bcrypt with configurable rounds

- **JWT tokens**: Secure token-based authentication## 🆘 Support

- **Input validation**: Comprehensive request validation

- **SQL injection protection**: SQLAlchemy ORMFor support and questions:

- **CORS configuration**: Restricted origins

- **File upload security**: Type and size validation- Create an issue in the repository

- **Rate limiting**: API rate limiting (implement with Flask-Limiter)- Contact the development team

- Check the documentation for common solutions

### Security Best Practices

- Regular dependency updates## 🔄 Changelog

- Environment variable security

- Database connection encryption### Version 1.0.0

- API endpoint authentication

- Input sanitization- Initial release with complete ecommerce backend

- Error message sanitization- User authentication and management

- Product catalog and inventory

## 🤝 Contributing- Order processing and payment integration

- Admin dashboard functionality

1. **Fork the repository**- Email notification system

2. **Create feature branch**: `git checkout -b feature/amazing-feature`- Docker containerization

3. **Commit changes**: `git commit -m 'Add amazing feature'`- Production-ready security features

4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines
- Follow PEP 8 style guide
- Write comprehensive tests
- Update documentation
- Use meaningful commit messages
- Keep functions small and focused

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@almahra.com
- **Documentation**: [docs.almahra.com](https://docs.almahra.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/almahra-ecommerce-backend/issues)

## 🔄 Changelog

### Version 1.0.0 (Latest)
- ✅ Complete Flask backend implementation
- ✅ User authentication and authorization
- ✅ Product catalog management
- ✅ Shopping cart functionality
- ✅ Order management system
- ✅ Stripe payment integration
- ✅ Email notification system
- ✅ AR try-on integration
- ✅ Admin dashboard
- ✅ Docker containerization
- ✅ Comprehensive API documentation

---

**Built with ❤️ by the Almahra Team**
```````
