@echo off
title Almahra E-commerce Backend Setup

echo 🚀 Almahra E-commerce Backend Setup
echo ====================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/desktop/windows/
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available. Please ensure Docker Desktop is running.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are available

REM Create environment file if it doesn't exist
if not exist .env (
    echo 📋 Creating environment configuration...
    copy .env.development .env
    echo ⚠️  Please edit .env file with your configuration before running the application
    echo    Required: DATABASE_URL, STRIPE keys, MAIL configuration
)

REM Create uploads directory
if not exist uploads mkdir uploads
echo 📁 Created uploads directory

REM Build and start services
echo 🔨 Building and starting Docker containers...
docker-compose down --remove-orphans
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak > nul

REM Check service health
echo 🔍 Checking service health...

REM Check Backend
curl -f http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is ready
    echo.
    echo 🎉 Setup completed successfully!
    echo.
    echo 📡 Services are running:
    echo    Backend API: http://localhost:5000
    echo    PostgreSQL: localhost:5432
    echo    Redis: localhost:6379
    echo.
    echo 📖 Next steps:
    echo    1. Edit .env file with your configuration
    echo    2. Test the API: curl http://localhost:5000/health
    echo    3. View logs: docker-compose logs -f backend
    echo    4. Stop services: docker-compose down
    echo.
) else (
    echo ❌ Backend is not responding
    echo 🔧 Troubleshooting:
    echo    - Check logs: docker-compose logs backend
    echo    - Check configuration in .env file
    echo    - Ensure all required environment variables are set
)

echo 🏁 Deployment script completed
pause