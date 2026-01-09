@echo off
echo ====================================
echo  BrandMark Admin Registration
echo ====================================
echo.
echo Registering admin user on production backend...
echo.

curl -X POST "https://brandmark-api-2026.onrender.com/api/admin/register" ^
-H "Content-Type: application/json" ^
-d "{\"email\":\"admin@brandmarksolutions.site\",\"password\":\"Admin@2025\",\"name\":\"BrandMark Admin\"}"

echo.
echo.
echo ====================================
echo Registration Complete!
echo ====================================
echo.
echo Now you can login at:
echo https://brandmarksolutions.site/admin-dashboard.html
echo.
echo Credentials:
echo   Email: admin@brandmarksolutions.site
echo   Password: Admin@2025
echo.
pause
