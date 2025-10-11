#!/bin/bash

# Almahra E-commerce Backend Deployment Script
# This script helps set up the backend environment quickly

echo "🚀 Almahra E-commerce Backend Setup"
echo "===================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📋 Creating environment configuration..."
    cp .env.development .env
    echo "⚠️  Please edit .env file with your configuration before running the application"
    echo "   Required: DATABASE_URL, STRIPE keys, MAIL configuration"
fi

# Create uploads directory
mkdir -p uploads
echo "📁 Created uploads directory"

# Build and start services
echo "🔨 Building and starting Docker containers..."
docker-compose down --remove-orphans
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check PostgreSQL
if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not responding"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not responding"
fi

# Check Backend
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Backend is ready"
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📡 Services are running:"
    echo "   Backend API: http://localhost:5000"
    echo "   PostgreSQL: localhost:5432"
    echo "   Redis: localhost:6379"
    echo ""
    echo "📖 Next steps:"
    echo "   1. Edit .env file with your configuration"
    echo "   2. Test the API: curl http://localhost:5000/health"
    echo "   3. View logs: docker-compose logs -f backend"
    echo "   4. Stop services: docker-compose down"
    echo ""
else
    echo "❌ Backend is not responding"
    echo "🔧 Troubleshooting:"
    echo "   - Check logs: docker-compose logs backend"
    echo "   - Check configuration in .env file"
    echo "   - Ensure all required environment variables are set"
fi

echo "🏁 Deployment script completed"