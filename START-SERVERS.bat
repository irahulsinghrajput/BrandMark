@echo off
echo ========================================
echo Starting BrandMark Development Servers
echo ========================================
echo.

echo [1/2] Starting Backend Server (Port 5000) with PM2...
cd backend
pm2 start server.js --name brandmark-backend 2>nul || pm2 restart brandmark-backend
cd ..
timeout /t 2 /nobreak >nul
echo Backend server started with PM2!
echo.

echo [2/2] Starting Frontend Server (Port 5500)...
cd ..
start "BrandMark Frontend" cmd /k "npx http-server -p 5500 -c-1"
timeout /t 3 /nobreak >nul
echo Frontend server started!
echo.

echo ========================================
echo Both servers are now running!
echo ========================================
echo.
echo Frontend: http://localhost:5500
echo Backend:  http://localhost:5000
echo Admin:    http://localhost:5500/admin-dashboard.html
echo.
echo Press any key to open the website in your browser...
pause >nul
start http://localhost:5500
