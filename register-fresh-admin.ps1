# Register Fresh Admin - PowerShell Script
Write-Host "`nREGISTERING FRESH ADMIN USER" -ForegroundColor Cyan
Write-Host "==============================`n" -ForegroundColor Cyan

$uri = "https://brandmark-api-2026.onrender.com/api/admin/register"
$body = @{
    email = "admin@brandmarksolutions.site"
    password = "Admin@2025"
    name = "BrandMark Admin"
}

$jsonBody = $body | ConvertTo-Json

Write-Host "Sending registration request..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $jsonBody -ContentType "application/json"
    
    Write-Host "`n✓ SUCCESS!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)`n" -ForegroundColor Green
    
    # Now test login
    Write-Host "Testing login..." -ForegroundColor Yellow
    $loginUri = "https://brandmark-api-2026.onrender.com/api/admin/login"
    $loginBody = @{
        email = "admin@brandmarksolutions.site"
        password = "Admin@2025"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri $loginUri -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "`n✓ LOGIN WORKS!" -ForegroundColor Green
    Write-Host "Token received: $($loginResponse.token.Substring(0,30))...`n" -ForegroundColor Green
    
} catch {
    Write-Host "`n✗ FAILED!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        $errorObj = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "API Response: $($errorObj.message)`n" -ForegroundColor Red
    }
}
