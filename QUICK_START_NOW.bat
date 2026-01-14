@echo off
echo.
echo ========================================
echo   QUICK START - AI EBOOK GENERATOR
echo ========================================
echo.
echo Checking your system...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Docker is installed
    goto docker_start
) else (
    echo [X] Docker is not installed
    goto manual_start
)

:docker_start
echo.
echo Starting with Docker...
echo.
docker-compose up -d
echo.
echo ========================================
echo   SUCCESS! Starting services...
echo ========================================
echo.
echo Please wait 60 seconds for everything to start.
echo.
echo Then open your browser to:
echo   http://localhost:3000
echo.
echo Press any key to open browser automatically...
pause >nul
timeout /t 60
start http://localhost:3000
goto end

:manual_start
echo.
echo Docker is not installed. Let's try manual start.
echo.
echo Checking if MySQL is running...
echo.

REM Check if MySQL is running
netstat -ano | findstr :3306 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MySQL is running
    goto start_app
) else (
    echo [X] MySQL is not running
    goto install_help
)

:start_app
echo.
echo Starting application...
echo.
echo This will open 2 windows:
echo   1. Backend Server (port 5000)
echo   2. Frontend Server (port 3000)
echo.
pause

REM Start backend in new window
start cmd /k "cd /d %~dp0 && echo Starting Backend... && npm run server"

REM Wait 5 seconds
timeout /t 5

REM Start frontend in new window
start cmd /k "cd /d %~dp0client && echo Starting Frontend... && npm start"

echo.
echo ========================================
echo   Servers are starting...
echo ========================================
echo.
echo Wait 30 seconds, then your browser will open automatically.
echo.
timeout /t 30
start http://localhost:3000
goto end

:install_help
echo.
echo ========================================
echo   SETUP REQUIRED
echo ========================================
echo.
echo You need to install either:
echo.
echo Option 1 (EASIEST): Docker Desktop
echo   Download: https://www.docker.com/products/docker-desktop
echo   Then run this script again.
echo.
echo Option 2: XAMPP (includes MySQL)
echo   Download: https://www.apachefriends.org/
echo   Install, start MySQL, then run this script again.
echo.
echo Press any key to open Docker download page...
pause >nul
start https://www.docker.com/products/docker-desktop
goto end

:end
echo.
echo ========================================
echo   Thank you!
echo ========================================
echo.
pause
