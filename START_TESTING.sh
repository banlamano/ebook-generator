#!/bin/bash

# AI Ebook Generator - Easy Start Script

echo ""
echo "========================================="
echo "  AI EBOOK GENERATOR - EASY START"
echo "========================================="
echo ""
echo "This script will help you start the application."
echo ""
echo "Choose your option:"
echo ""
echo "[1] Start with Docker (Recommended - Auto-setup)"
echo "[2] Start without Docker (Manual setup needed)"
echo "[3] Check if dependencies are installed"
echo "[4] Install dependencies"
echo "[5] Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "Starting with Docker..."
        echo ""
        
        if ! command -v docker &> /dev/null; then
            echo "ERROR: Docker is not installed!"
            echo ""
            echo "Please install Docker from:"
            echo "https://www.docker.com/products/docker-desktop"
            echo ""
            exit 1
        fi

        echo "Docker detected! Starting services..."
        docker-compose up -d

        echo ""
        echo "========================================="
        echo "  SUCCESS! Application is starting..."
        echo "========================================="
        echo ""
        echo "Please wait 30 seconds for services to start, then:"
        echo ""
        echo "  Frontend: http://localhost:3000"
        echo "  Backend:  http://localhost:5000"
        echo ""
        echo "To stop: docker-compose down"
        echo ""
        ;;
        
    2)
        echo ""
        echo "Starting manually..."
        echo ""
        echo "IMPORTANT: You need MySQL running first!"
        echo ""
        read -p "Do you have MySQL installed and running? (y/n): " mysql
        
        if [ "$mysql" != "y" ]; then
            echo ""
            echo "Please install MySQL first:"
            echo "https://dev.mysql.com/downloads/"
            echo "Or use XAMPP: https://www.apachefriends.org/"
            echo ""
            exit 1
        fi

        echo ""
        echo "Starting backend and frontend..."
        echo ""
        
        # Start backend in background
        npm run server &
        
        # Wait 5 seconds
        sleep 5
        
        # Start frontend
        cd client && npm start
        ;;
        
    3)
        echo ""
        echo "Checking dependencies..."
        echo ""

        # Check Node.js
        if command -v node &> /dev/null; then
            echo "[OK] Node.js installed: $(node --version)"
        else
            echo "[X] Node.js not found"
            echo "    Download: https://nodejs.org/"
        fi

        # Check npm
        if command -v npm &> /dev/null; then
            echo "[OK] npm installed: $(npm --version)"
        else
            echo "[X] npm not found"
        fi

        # Check Docker
        if command -v docker &> /dev/null; then
            echo "[OK] Docker installed: $(docker --version)"
        else
            echo "[X] Docker not found"
            echo "    Download: https://www.docker.com/products/docker-desktop"
        fi

        # Check backend dependencies
        if [ -d "node_modules" ]; then
            echo "[OK] Backend dependencies installed"
        else
            echo "[X] Backend dependencies not installed"
            echo "    Run: npm install"
        fi

        # Check frontend dependencies
        if [ -d "client/node_modules" ]; then
            echo "[OK] Frontend dependencies installed"
        else
            echo "[X] Frontend dependencies not installed"
            echo "    Run: cd client && npm install"
        fi

        echo ""
        ;;
        
    4)
        echo ""
        echo "Installing dependencies..."
        echo ""
        echo "This may take 5-10 minutes..."
        echo ""

        echo "Installing backend dependencies..."
        npm install

        echo ""
        echo "Installing frontend dependencies..."
        cd client
        npm install
        cd ..

        echo ""
        echo "========================================="
        echo "  Installation complete!"
        echo "========================================="
        echo ""
        ;;
        
    5)
        echo ""
        echo "Goodbye!"
        echo ""
        exit 0
        ;;
        
    *)
        echo ""
        echo "Invalid choice. Please run the script again."
        echo ""
        exit 1
        ;;
esac

echo ""
echo "Thank you for using AI Ebook Generator!"
echo ""
