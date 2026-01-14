@echo off
echo.
echo ========================================
echo   DIAGNOSING ISSUES
echo ========================================
echo.

echo Checking Backend Server (Port 5000)...
netstat -ano | findstr :5000
if %errorlevel% equ 0 (
    echo [OK] Backend is running
) else (
    echo [X] Backend is NOT running
    echo     Issue: Backend server needs to be started
    echo     Fix: Run npm run server
)

echo.
echo Checking MySQL (Port 3306)...
netstat -ano | findstr :3306
if %errorlevel% equ 0 (
    echo [OK] MySQL is running
) else (
    echo [X] MySQL is NOT running
    echo     Issue: Database is not available
    echo     Fix: Install XAMPP or use Docker
)

echo.
echo Checking .env file...
if exist .env (
    echo [OK] .env file exists
) else (
    echo [X] .env file NOT found
    echo     Issue: Environment configuration missing
    echo     Fix: Copy .env.example to .env
)

echo.
echo Checking node_modules...
if exist node_modules (
    echo [OK] Backend dependencies installed
) else (
    echo [X] Backend dependencies NOT installed
    echo     Issue: Dependencies missing
    echo     Fix: Run npm install
)

echo.
echo Checking client/node_modules...
if exist client\node_modules (
    echo [OK] Frontend dependencies installed
) else (
    echo [X] Frontend dependencies NOT installed
    echo     Issue: Frontend dependencies missing
    echo     Fix: cd client && npm install
)

echo.
echo ========================================
echo   DIAGNOSIS COMPLETE
echo ========================================
echo.
echo Review the issues above and follow the fixes.
echo.
pause
