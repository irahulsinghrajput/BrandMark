@echo off
echo Starting BrandMark Backend with PM2...
cd /d "%~dp0backend"
pm2 start server.js --name brandmark-backend 2>nul || pm2 restart brandmark-backend
pm2 logs brandmark-backend
