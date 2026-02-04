@echo off
color 0A
title AI Research - Full Stack Development Server
cls

echo.
echo ===============================================
echo     AI Research - Full Stack Application
echo ===============================================
echo.

cd /d "%~dp0"

REM Check if we're in the right directory
if not exist "backend\manage.py" (
    echo Error: backend/manage.py not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo Starting servers...
echo.

REM Start Django backend server
echo [1/2] Starting Django Backend Server...
start "AI Research Backend - Django" cmd /k "cd /d "%CD%\backend" && python manage.py runserver"
timeout /t 3 /nobreak > nul

REM Start Vite frontend server
echo [2/2] Starting React Frontend Server...
start "AI Research Frontend - Vite" cmd /k "cd /d "%CD%\frontend" && npx vite"

echo.
echo ===============================================
echo    Servers are starting in separate windows
echo ===============================================
echo.
echo Backend:  http://127.0.0.1:8000/
echo Frontend: http://localhost:5173/
echo.
echo Press Ctrl+C in each window to stop servers
echo ===============================================
echo.
pause
