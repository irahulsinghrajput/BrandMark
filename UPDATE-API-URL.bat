@echo off
REM Quick API URL Update Script
REM Usage: UPDATE-API-URL.bat <your-backend-url>

echo ========================================
echo   BrandMark API URL Update Tool
echo ========================================
echo.

if "%~1"=="" (
    echo ERROR: Please provide your backend URL
    echo.
    echo Usage: UPDATE-API-URL.bat ^<backend-url^>
    echo Example: UPDATE-API-URL.bat https://brandmark-backend.onrender.com
    echo.
    pause
    exit /b 1
)

set BACKEND_URL=%~1
set API_URL=%BACKEND_URL%/api

echo Backend URL: %BACKEND_URL%
echo API URL: %API_URL%
echo.
echo This will update API URLs in:
echo   - brandmark.js
echo   - career-form.js
echo   - admin-dashboard.html
echo.
pause

REM Note: PowerShell replacement script
powershell -Command "(Get-Content 'brandmark.js') -replace 'http://localhost:5000/api', '%API_URL%' | Set-Content 'brandmark.js'"
powershell -Command "(Get-Content 'career-form.js') -replace 'http://localhost:5000/api', '%API_URL%' | Set-Content 'career-form.js'"
powershell -Command "(Get-Content 'admin-dashboard.html') -replace 'http://localhost:5000/api', '%API_URL%' | Set-Content 'admin-dashboard.html'"

echo.
echo ✓ API URLs updated successfully!
echo.
echo Next steps:
echo   1. Test the website locally
echo   2. Commit changes: git add .
echo   3. Commit: git commit -m "Update API URLs to production"
echo   4. Push: git push origin gh-pages
echo.
pause
