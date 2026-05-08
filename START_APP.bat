@echo off
title AI Co-Teacher - Launcher
echo =========================================
echo   AI Co-Teacher - Starting Servers...
echo =========================================
echo.

:: Start Backend (port 5000) in new window
start "AI Co-Teacher BACKEND :5000" cmd /k "cd /d C:\Users\NEXAWAVE\Desktop\ai-co-teacher-main && echo Starting Backend on port 5000... && npm run server"

:: Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

:: Start Frontend (Vite, port 8080) in new window
start "AI Co-Teacher FRONTEND :8080" cmd /k "cd /d C:\Users\NEXAWAVE\Desktop\ai-co-teacher-main && echo Starting Frontend on port 8080... && npm run dev"

echo.
echo =========================================
echo   Both servers are launching!
echo   Backend  --> http://localhost:5000/api/health
echo   Frontend --> http://localhost:8080
echo =========================================
echo.
echo This window will close in 5 seconds...
timeout /t 5 /nobreak >nul
