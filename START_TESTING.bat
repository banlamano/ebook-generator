@echo off
echo.
echo =========================================
echo   AI EBOOK GENERATOR - EASY START
echo =========================================
echo.
echo This script will help you start the application.
echo.
echo Choose your option:
echo.
echo [1] Start with Docker (Recommended - Auto-setup)
echo [2] Start without Docker (Manual setup needed)
echo [3] Check if dependencies are installed
echo [4] Install dependencies
echo [5] Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto docker
if "%choice%"=="2" goto manual
if "%choice%"=="3" goto check
if "%choice%"=="4" goto install
if "%choice%"=="5" goto end

:docker
echo.
echo Starting with Docker...
echo.
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed!
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    goto end
)

echo Docker detected! Starting services...
docker-compose up -d

echo.
echo =========================================
echo   SUCCESS! Application is starting...
echo =========================================
echo.
echo Please wait 30 seconds for services to start, then:
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo To stop: docker-compose down
echo.
pause
goto end

:manual
echo.
echo Starting manually...
echo.
echo IMPORTANT: You need MySQL running first!
echo.
echo Do you have MySQL installed and running? (Y/N)
set /p mysql="Enter choice: "

if /i "%mysql%"=="N" (
    echo.
    echo Please install XAMPP first:
    echo https://www.apachefriends.org/
    echo.
    pause
    goto end
)

echo.
echo Starting backend and frontend...
echo.
start cmd /k "echo Backend Server && npm run server"
timeout /t 5
start cmd /k "echo Frontend Server && cd client && npm start"

echo.
echo =========================================
echo   Servers starting in separate windows...
echo =========================================
echo.
echo Wait 30 seconds, then open: http://localhost:3000
echo.
pause
goto end

:check
echo.
echo Checking dependencies...
echo.

echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js not found
    echo     Download: https://nodejs.org/
) else (
    node --version
    echo [OK] Node.js installed
)

echo.
echo Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [X] npm not found
) else (
    npm --version
    echo [OK] npm installed
)

echo.
echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [X] Docker not found
    echo     Download: https://www.docker.com/products/docker-desktop
) else (
    docker --version
    echo [OK] Docker installed
)

echo.
echo Checking backend dependencies...
if exist "node_modules" (
    echo [OK] Backend dependencies installed
) else (
    echo [X] Backend dependencies not installed
    echo     Run: npm install
)

echo.
echo Checking frontend dependencies...
if exist "client\node_modules" (
    echo [OK] Frontend dependencies installed
) else (
    echo [X] Frontend dependencies not installed
    echo     Run: cd client && npm install
)

echo.
pause
goto end

:install
echo.
echo Installing dependencies...
echo.
echo This may take 5-10 minutes...
echo.

echo Installing backend dependencies...
call npm install

echo.
echo Installing frontend dependencies...
cd client
call npm install
cd ..

echo.
echo =========================================
echo   Installation complete!
echo =========================================
echo.
pause
goto end

:end
echo.
echo Thank you for using AI Ebook Generator!
echo.
exit
