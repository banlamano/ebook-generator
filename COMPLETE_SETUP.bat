@echo off
echo.
echo ========================================
echo   COMPLETE SETUP - ONE-CLICK FIX
echo ========================================
echo.
echo This script will set up everything you need.
echo.
pause

echo.
echo Step 1: Checking environment file...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo [OK] .env file created
    echo.
    echo IMPORTANT: You need to edit .env and add:
    echo   - ANTHROPIC_API_KEY (for AI generation)
    echo   - STRIPE_SECRET_KEY (for payments - optional)
    echo   - Email settings (optional)
    echo.
    pause
) else (
    echo [OK] .env file already exists
)

echo.
echo Step 2: Checking if Docker is available...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker is installed
    goto docker_setup
) else (
    echo [X] Docker is not installed
    goto manual_setup
)

:docker_setup
echo.
echo ========================================
echo   DOCKER SETUP (Automatic)
echo ========================================
echo.
echo Starting all services with Docker...
echo This includes:
echo   - MySQL database
echo   - Backend server
echo   - Frontend server
echo.
docker-compose down
docker-compose up -d
echo.
echo Waiting 30 seconds for services to start...
timeout /t 30
echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Your application is now running at:
echo   http://localhost:3000
echo.
echo Wait another 30 seconds, then open your browser.
echo.
timeout /t 30
start http://localhost:3000
goto end

:manual_setup
echo.
echo ========================================
echo   MANUAL SETUP
echo ========================================
echo.
echo Docker is not installed. Manual setup required.
echo.
echo You need to:
echo 1. Install XAMPP from https://www.apachefriends.org/
echo 2. Start MySQL from XAMPP Control Panel
echo 3. Create database 'ebook_generator'
echo 4. Run migrations
echo.
echo Do you want to continue? (Y/N)
set /p continue="Enter choice: "

if /i "%continue%" neq "Y" goto end

echo.
echo Checking if MySQL is running...
netstat -ano | findstr :3306 >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] MySQL is not running!
    echo Please start MySQL from XAMPP and run this script again.
    pause
    goto end
)

echo [OK] MySQL is running
echo.
echo Running database migrations...
node server/migrations/migrate.js
echo.
echo Seeding initial data...
node server/migrations/seed.js
echo.
echo [OK] Database setup complete
echo.
echo Starting backend server...
start cmd /k "cd /d %~dp0 && echo Backend Server && npm run server"
timeout /t 5

echo.
echo Starting frontend...
start cmd /k "cd /d %~dp0client && echo Frontend Server && npm start"

echo.
echo ========================================
echo   Services Starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Wait 30 seconds for everything to start...
timeout /t 30
start http://localhost:3000

:end
echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
pause
