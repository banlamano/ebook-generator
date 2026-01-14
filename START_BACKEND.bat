@echo off
echo.
echo ========================================
echo   STARTING BACKEND SERVER
echo ========================================
echo.

REM Check if MySQL is running
echo Checking MySQL...
netstat -ano | findstr :3306 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MySQL is running
    goto start_backend
) else (
    echo [X] MySQL is NOT running!
    echo.
    echo You need MySQL running for login/register to work.
    echo.
    echo Options:
    echo 1. Install XAMPP and start MySQL
    echo 2. Use Docker: docker-compose up -d
    echo 3. Install MySQL standalone
    echo.
    echo Press any key to continue anyway (backend will fail)...
    pause >nul
    goto start_backend
)

:start_backend
echo.
echo Starting backend server on port 5000...
echo.
echo Keep this window open!
echo Backend logs will appear here.
echo.
echo ========================================
cd /d %~dp0
npm run server

pause
