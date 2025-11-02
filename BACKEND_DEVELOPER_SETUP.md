# Backend Developer Setup Guide - Al Mahra Opticals

## For the Backend Developer

Hi! This project uses a **Python Flask backend** deployed on **AWS Elastic Beanstalk**. Follow these steps to set up your development environment and deploy to AWS.

---

## Prerequisites

1. **Python 3.8+** (Python 3.11 recommended)
2. **pip** (Python package manager)
3. **AWS Account**
4. **Git** installed
5. **PostgreSQL** (for local development) - Optional, can use SQLite locally

---

## Initial Setup (One-time)

### Step 1: Clone the Repository

```powershell
git clone https://github.com/Codesandmore/almahra-Ecommerce-Website.git
cd almahra-Ecommerce-Website
cd backend
```

### Step 2: Create Python Virtual Environment

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Verify activation (you should see (venv) in your prompt)
```

### Step 3: Install Python Dependencies

```powershell
pip install -r requirements.txt
```

### Step 4: Install AWS CLI and EB CLI

```powershell
# Install AWS CLI
pip install awscli

# Install Elastic Beanstalk CLI
pip install awsebcli
```

### Step 5: Configure AWS Credentials

```powershell
aws configure
```

Enter your:

- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-east-1` (or your preferred region)
- Output format: `json`

---

## Local Development Setup

### 1. Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# .env file
FLASK_ENV=development
SECRET_KEY=your-secret-key-for-development
JWT_SECRET_KEY=your-jwt-secret-key

# Database (Local PostgreSQL or use RDS endpoint later)
DATABASE_URL=postgresql://postgres:password@localhost/almahra_ecommerce

# Email Configuration
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=noreply@almahra.com

# Stripe (Test Keys)
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# File Uploads
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216

# AR Service (if needed)
AR_SERVICE_URL=http://localhost:5001
```

### 2. Set Up Local Database (Optional)

**Option A: Use PostgreSQL locally**

```powershell
# Install PostgreSQL and create database
createdb almahra_ecommerce
```

**Option B: Use SQLite for development**

```bash
# In .env file, change DATABASE_URL to:
DATABASE_URL=sqlite:///almahra_ecommerce.db
```

### 3. Initialize Database

```powershell
# Make sure you're in the backend directory and venv is activated
cd backend
venv\Scripts\activate

# Initialize migrations
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 4. Run the Development Server

```powershell
# Start the Flask development server
python run.py

# Or use Flask command
flask run --host=0.0.0.0 --port=5000
```

Your backend API will be available at: `http://localhost:5000`

### 5. Test the API

Test the health endpoint:

```powershell
curl http://localhost:5000/health
```

Expected response:

```json
{
  "status": "healthy",
  "service": "Almahra Ecommerce API"
}
```

---

## AWS Elastic Beanstalk Deployment

### 1. Initialize Elastic Beanstalk Application

```powershell
# Make sure you're in the backend directory
cd backend

# Initialize EB application
eb init
```

Choose:

- **Region**: `us-east-1` (or your preferred region)
- **Application Name**: `almahra-ecommerce-backend`
- **Platform**: `Python 3.11`
- **Platform Branch**: `Python 3.11 running on 64bit Amazon Linux 2023`
- **CodeCommit**: No (we're using GitHub)
- **SSH**: Yes (for debugging if needed)

### 2. Create EB Environment

```powershell
# Create production environment
eb create almahra-prod

# Or create development environment first
eb create almahra-dev
```

This will:

- Create an EC2 instance
- Set up a load balancer
- Create security groups
- Deploy your application

### 3. Configure Environment Variables

Set up environment variables for your EB environment:

```powershell
# Set environment variables
eb setenv FLASK_ENV=production
eb setenv SECRET_KEY=your-production-secret-key
eb setenv JWT_SECRET_KEY=your-production-jwt-secret

# Database (RDS)
eb setenv DATABASE_URL=postgresql://username:password@your-rds-endpoint/almahra_ecommerce

# Email
eb setenv MAIL_USERNAME=your-production-email@gmail.com
eb setenv MAIL_PASSWORD=your-production-app-password
eb setenv MAIL_DEFAULT_SENDER=noreply@almahra.com

# Stripe (Production Keys)
eb setenv STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
eb setenv STRIPE_SECRET_KEY=sk_live_your_live_key
eb setenv STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

### 4. Set Up RDS Database (Recommended for Production)

**Option A: Create RDS through EB Console**

1. Go to AWS Console → Elastic Beanstalk
2. Select your environment
3. Configuration → Database
4. Add database (PostgreSQL)

**Option B: Create RDS separately (Recommended)**

```powershell
# Create RDS instance using AWS CLI
aws rds create-db-instance \
    --db-instance-identifier almahra-ecommerce-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username almahraadmin \
    --master-user-password YourStrongPassword123 \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxxxxxx
```

### 5. Deploy Your Application

```powershell
# Deploy current code
eb deploy

# Check deployment status
eb status

# View logs
eb logs

# Open application in browser
eb open
```

---

## Important Files for Elastic Beanstalk

### 1. Create `application.py` for EB (Required)

Create a file named `application.py` in your backend directory:

```python
# application.py (EB entry point)
from run import app as application

if __name__ == "__main__":
    application.run()
```

### 2. Update `requirements.txt` (Already exists)

Your `requirements.txt` already contains the necessary packages. Ensure these are included:

```txt
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-Migrate==4.0.5
Flask-CORS==4.0.0
Flask-Mail==0.9.1
Flask-JWT-Extended==4.6.0
psycopg2-binary==2.9.9
gunicorn==21.2.0
# ... other dependencies
```

### 3. Create `.ebextensions` Configuration (Optional)

Create `.ebextensions/python.config` for additional configuration:

```yaml
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: application.py
  aws:elasticbeanstalk:application:environment:
    PYTHONPATH: "/var/app/current:$PYTHONPATH"
  aws:elasticbeanstalk:container:python:staticfiles:
    "/static/": "static/"

commands:
  01_migrate:
    command: "source /var/app/venv/*/bin/activate && python application.py db upgrade"
    leader_only: true
```

---

## Testing Your Backend

### 1. Test API Endpoints Locally

```powershell
# Test authentication endpoints
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'

# Test products endpoint
curl http://localhost:5000/api/products

# Test health endpoint
curl http://localhost:5000/health
```

### 2. Test Database Migrations

```powershell
# Create a new migration
flask db migrate -m "Add new table"

# Apply migrations
flask db upgrade

# Check migration status
flask db current
```

### 3. View Backend Resources

- **AWS Console**: https://console.aws.amazon.com/
- **Elastic Beanstalk**: https://console.aws.amazon.com/elasticbeanstalk/
- **RDS Database**: https://console.aws.amazon.com/rds/
- **CloudWatch Logs**: https://console.aws.amazon.com/cloudwatch/

### 4. Monitor Logs

```powershell
# View EB logs
eb logs

# Stream logs in real-time
eb logs --all
```

---

## Deploying Changes

### Development Workflow

```powershell
# 1. Make changes to your Python code
# 2. Test locally
python run.py

# 3. Deploy to Elastic Beanstalk
eb deploy

# 4. Monitor logs
eb logs
```

### Production Deployment

```powershell
# Create production environment
eb create almahra-prod

# Deploy to production
eb deploy almahra-prod

# Switch to production environment
eb use almahra-prod
```

---

## Communication with Frontend Developer

### What Frontend Needs from You:

1. **API Documentation**

   - Document all endpoints and request/response formats
   - Provide Postman collection or OpenAPI/Swagger docs
   - Share API base URL after deployment

2. **CORS Configuration**

   - Ensure CORS is properly configured for frontend domains
   - Add production frontend URL to CORS origins

3. **Authentication Flow**
   - Explain JWT token structure
   - Document login/register endpoints
   - Share token expiration settings

### What You Need from Frontend:

1. **Frontend Domain**

   - Production frontend URL for CORS configuration
   - Development server URL (usually http://localhost:3000 or http://localhost:5173)

2. **Data Requirements**

   - What data structures do they need for each page?
   - Required fields for forms (registration, checkout, etc.)
   - Image upload requirements and formats

3. **API Integration Needs**
   - Which endpoints they'll use most frequently
   - Error handling preferences
   - Loading state requirements

---

## Backend API Structure

Your Flask backend provides these main endpoints:

```
/api/auth/          # User authentication (login, register, logout)
├── /register       # POST - User registration
├── /login          # POST - User login
├── /logout         # POST - User logout
├── /refresh        # POST - Refresh JWT token
└── /me             # GET - Get current user info

/api/products/      # Product management
├── /               # GET - List all products
├── /{id}          # GET - Get single product
├── /search        # GET - Search products
├── /categories    # GET - Get product categories
└── /brands        # GET - Get product brands

/api/cart/          # Shopping cart
├── /               # GET - Get user cart
├── /add           # POST - Add item to cart
├── /update        # PUT - Update cart item
└── /remove        # DELETE - Remove cart item

/api/orders/        # Order management
├── /               # GET - Get user orders
├── /               # POST - Create new order
├── /{id}          # GET - Get order details
└── /{id}/status   # PUT - Update order status

/api/admin/         # Admin functions
├── /products      # CRUD operations for products
├── /orders        # Order management
├── /users         # User management
└── /analytics     # Dashboard analytics

/api/users/         # User profile management
├── /profile       # GET/PUT - User profile
├── /addresses     # GET/POST - User addresses
└── /appointments  # GET/POST - User appointments

/api/payments/      # Payment processing
├── /create-intent # POST - Create Stripe payment intent
├── /confirm       # POST - Confirm payment
└── /webhooks      # POST - Stripe webhooks

/api/ar/           # AR integration
├── /try-on        # POST - Virtual try-on
└── /save-fit      # POST - Save fitting data

/health            # Health check endpoint
```

---

## Getting Help

1. **AWS Elastic Beanstalk Docs**: https://docs.aws.amazon.com/elasticbeanstalk/
2. **Flask Documentation**: https://flask.palletsprojects.com/
3. **Flask-SQLAlchemy**: https://flask-sqlalchemy.palletsprojects.com/
4. **Flask-Migrate**: https://flask-migrate.readthedocs.io/
5. **AWS CLI Reference**: https://docs.aws.amazon.com/cli/
6. **EB CLI Reference**: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html

---

## Quick Start Checklist

- [ ] Clone repository
- [ ] Create Python virtual environment (`python -m venv venv`)
- [ ] Activate virtual environment (`venv\Scripts\activate`)
- [ ] Install dependencies (`pip install -r requirements.txt`)
- [ ] Install AWS CLI and EB CLI
- [ ] Configure AWS credentials (`aws configure`)
- [ ] Create `.env` file with local configuration
- [ ] Set up local database (PostgreSQL or SQLite)
- [ ] Initialize Flask migrations (`flask db init`)
- [ ] Run migrations (`flask db upgrade`)
- [ ] Test locally (`python run.py`)
- [ ] Initialize EB application (`eb init`)
- [ ] Create EB environment (`eb create`)
- [ ] Set environment variables (`eb setenv`)
- [ ] Deploy application (`eb deploy`)
- [ ] Test production endpoints
- [ ] Set up RDS database for production
- [ ] Document your API endpoints

---

## Questions?

Contact the frontend developer or check the Flask/AWS documentation.

Happy coding! 🚀
