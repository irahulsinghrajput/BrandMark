# Security Improvements Script for BrandMark
# Run this to generate a strong JWT secret

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "BrandMark Security Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Generate strong JWT secret
Write-Host "Generating strong JWT secret..." -ForegroundColor Yellow
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
Write-Host ""
Write-Host "Your new JWT secret (save this!):" -ForegroundColor Green
Write-Host $jwtSecret -ForegroundColor White
Write-Host ""

# Update .env file
Write-Host "Do you want to update the .env file with this secret? (Y/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq 'Y' -or $response -eq 'y') {
    $envPath = ".\backend\.env"
    if (Test-Path $envPath) {
        (Get-Content $envPath) -replace 'JWT_SECRET=.*', "JWT_SECRET=$jwtSecret" | Set-Content $envPath
        Write-Host "✓ .env file updated successfully!" -ForegroundColor Green
        Write-Host "✓ Please restart your backend server" -ForegroundColor Yellow
    } else {
        Write-Host "✗ .env file not found!" -ForegroundColor Red
    }
} else {
    Write-Host "Remember to manually update JWT_SECRET in backend/.env" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Security Checklist:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "[✓] JWT Secret Generated" -ForegroundColor Green
Write-Host "[ ] Update MongoDB password" -ForegroundColor Yellow
Write-Host "[ ] Set up HTTPS for production" -ForegroundColor Yellow
Write-Host "[ ] Install additional security packages" -ForegroundColor Yellow
Write-Host "[ ] Enable 2FA for admin accounts" -ForegroundColor Yellow
Write-Host ""
Write-Host "See SECURITY_AUDIT.md for detailed recommendations" -ForegroundColor Cyan
Write-Host ""
