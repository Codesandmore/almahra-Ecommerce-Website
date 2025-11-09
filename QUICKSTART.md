# Quick Start Guide

Get the Almahra E-commerce platform running in 5 minutes!

## 🚀 Prerequisites

- Python 3.8+
- PostgreSQL 16.x
- Node.js 18+
- Git

## ⚡ Quick Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd almahra-Ecommerce-Website
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# GOOD NEWS: .env.development is already included!
# It has working database credentials: postgres:2934
# Just make sure your PostgreSQL is running with these credentials
# OR update DATABASE_URL in .env.development if you have different credentials
```

### 3. Database Setup

```bash
# Create database (run in PostgreSQL)
psql -U postgres
CREATE DATABASE almahra_ecommerce;
\q

# Run migrations
flask db upgrade
```

### 4. Create Admin User

```bash
# Run Python shell
python

# Execute:
from app import create_app, db
from app.models.user import User
from app.models.user_role import UserRole

app = create_app()
with app.app_context():
    admin = User(email='admin@almahra.com', first_name='Admin', last_name='User', role=UserRole.ADMIN.value)
    admin.set_password('Admin@123')
    db.session.add(admin)
    db.session.commit()
    print('Admin user created!')
# Press Ctrl+D or type exit() to exit Python shell
```

### 5. Start Backend

```bash
python run.py
```

Backend will run on http://localhost:5000

### 6. Frontend Setup (New Terminal)

```bash
# Navigate to frontend (from project root)
cd "Almahra Ecommerce"

# Install dependencies
npm install

# GOOD NEWS: .env.development is already included!
# It points to http://localhost:5000 backend

# Start dev server
npm run dev
```

Frontend will run on http://localhost:5173

## ✅ Test It Out!

1. Open browser: http://localhost:5173
2. Click "Admin Portal" in header
3. Login with:
   - Email: `admin@almahra.com`
   - Password: `Admin@123`

## 📝 Environment Files You Need

### Backend: `backend/.env.development` ✅ INCLUDED

**Already configured with working values!**

```env
DATABASE_URL=postgresql://postgres:2934@localhost:5432/almahra_ecommerce
SECRET_KEY=dev-secret-key-here
JWT_SECRET_KEY=dev-jwt-secret-here
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Important**: 
- These credentials work out of the box
- Make sure your PostgreSQL username is `postgres` with password `2934`
- OR update the DATABASE_URL if you have different credentials

### Frontend: `Almahra Ecommerce/.env.development` ✅ INCLUDED

**Already configured!**

```env
VITE_API_URL=http://localhost:5000
VITE_APP_ENV=development
```

No changes needed - it points to the backend automatically!

## 🚨 Common Issues

### Database Connection Failed
```bash
# Check if PostgreSQL is running (Windows Services or Task Manager)
# Verify username/password in .env.development
# Verify database exists: psql -l
```

### Backend Import Errors
```bash
# Make sure virtual environment is activated
venv\Scripts\activate
# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
# Backend (port 5000):
# Windows: netstat -ano | findstr :5000
# Then: taskkill /PID <pid> /F

# Frontend (port 5173):
# It will automatically use next available port
```

## 📚 Next Steps

- Read `HANDOVER.md` for complete project details
- Read `backend/SETUP_GUIDE.md` for detailed backend setup
- Configure Stripe for payments (optional for testing)
- Configure email settings (optional for testing)

## 🆘 Need Help?

Check the detailed documentation:
- `HANDOVER.md` - Complete project overview
- `backend/SETUP_GUIDE.md` - Detailed backend setup
- `backend/README.md` - Backend API documentation

---

**You're ready to start developing! 🎉**
