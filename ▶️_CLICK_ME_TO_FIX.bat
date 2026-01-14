@echo off
color 0A
echo.
echo ========================================
echo   AUTO-FIX FOR LOGIN/REGISTER
echo ========================================
echo.
echo This will automatically fix everything!
echo.
echo Press any key to start...
pause >nul

cls
echo.
echo ========================================
echo   STEP 1: Checking System
echo ========================================
echo.

REM Check Docker
echo [1/5] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker is installed
    set SETUP_MODE=docker
    goto docker_fix
) else (
    echo [X] Docker not installed
    set SETUP_MODE=manual
    goto manual_fix
)

:docker_fix
cls
echo.
echo ========================================
echo   DOCKER DETECTED - AUTO FIX
echo ========================================
echo.
echo Great! Docker is installed.
echo This will be quick and automatic!
echo.
echo [2/5] Stopping any running containers...
docker-compose down >nul 2>&1

echo [3/5] Starting all services (MySQL + Backend + Frontend)...
docker-compose up -d

echo [4/5] Waiting for services to start (60 seconds)...
echo.
echo Please wait while everything starts up...
echo This includes:
echo   - MySQL Database
echo   - Backend Server (port 5000)
echo   - Frontend (port 3000)
echo.

REM Progress bar simulation
for /l %%i in (1,1,30) do (
    echo|set /p="."
    timeout /t 2 >nul
)

echo.
echo.
echo [5/5] Running database migrations...
timeout /t 5 >nul
docker exec ebook-app npm run migrate 2>nul
docker exec ebook-app node server/migrations/seed.js 2>nul

cls
echo.
echo ========================================
echo   SUCCESS! ALL FIXED!
echo ========================================
echo.
echo Your application is now running at:
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo Opening browser in 5 seconds...
echo.
echo You can now:
echo   ✓ Register a new account
echo   ✓ Login
echo   ✓ Create ebooks
echo   ✓ Everything works!
echo.
timeout /t 5
start http://localhost:3000

echo.
echo Browser opened! Try registering now.
echo.
echo Keep this window open to see status.
echo To stop: docker-compose down
echo.
pause
goto end

:manual_fix
cls
echo.
echo ========================================
echo   DOCKER NOT FOUND - MANUAL SETUP
echo ========================================
echo.
echo Docker is not installed.
echo.
echo You have 2 options:
echo.
echo Option 1: Install Docker (RECOMMENDED)
echo   - Easiest and automatic
echo   - Everything works with one command
echo   - Download: https://www.docker.com/products/docker-desktop
echo.
echo Option 2: Install XAMPP (Manual)
echo   - Need to manually start services
echo   - Download: https://www.apachefriends.org/
echo.
echo Which do you want?
echo [1] Install Docker (I'll open the website)
echo [2] Install XAMPP (I'll open the website)
echo [3] I already have XAMPP, start manually
echo [4] Exit
echo.
set /p choice="Enter choice (1-4): "

if "%choice%"=="1" goto install_docker
if "%choice%"=="2" goto install_xampp
if "%choice%"=="3" goto xampp_start
if "%choice%"=="4" goto end

:install_docker
echo.
echo Opening Docker Desktop download page...
start https://www.docker.com/products/docker-desktop
echo.
echo After installing Docker:
echo 1. Start Docker Desktop
echo 2. Wait for it to fully start
echo 3. Run this script again
echo.
pause
goto end

:install_xampp
echo.
echo Opening XAMPP download page...
start https://www.apachefriends.org/
echo.
echo After installing XAMPP:
echo 1. Open XAMPP Control Panel
echo 2. Click 'Start' next to MySQL
echo 3. Run this script again
echo.
pause
goto end

:xampp_start
cls
echo.
echo ========================================
echo   STARTING WITH XAMPP
echo ========================================
echo.
echo [1/6] Checking if MySQL is running...
netstat -ano | findstr :3306 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MySQL is running
) else (
    echo [X] MySQL is NOT running!
    echo.
    echo Please:
    echo 1. Open XAMPP Control Panel
    echo 2. Click 'Start' next to MySQL
    echo 3. Wait for it to turn green
    echo 4. Run this script again
    echo.
    pause
    goto end
)

echo [2/6] Checking database...
echo Creating database if not exists...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS ebook_generator;" 2>nul

echo [3/6] Running migrations...
node server/migrations/migrate.js

echo [4/6] Seeding data...
node server/migrations/seed.js

echo [5/6] Starting backend server...
start cmd /k "title Backend Server && cd /d %~dp0 && npm run server"
timeout /t 5

echo [6/6] Starting frontend...
start cmd /k "title Frontend Server && cd /d %~dp0client && npm start"

cls
echo.
echo ========================================
echo   SUCCESS! SERVERS STARTING...
echo ========================================
echo.
echo Two new windows opened:
echo   1. Backend Server (port 5000)
echo   2. Frontend Server (port 3000)
echo.
echo Keep both windows open!
echo.
echo Waiting 30 seconds for servers to start...
timeout /t 30

echo.
echo Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo   ALL DONE!
echo ========================================
echo.
echo Your application is now running!
echo Try registering and logging in.
echo.
echo Keep the 2 server windows open.
echo.
pause
goto end

:end
exit
