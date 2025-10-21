# PowerShell script to start development server with AI features

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Development Server with AI Features" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start proxy server in the background
Write-Host "Starting AI Proxy Server on port 3001..." -ForegroundColor Yellow
Push-Location api
Start-Process -FilePath "node" -ArgumentList "proxy-server.js" -WindowStyle Hidden
Pop-Location

# Wait for proxy server to start
Write-Host "Waiting for proxy server to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Verify proxy server is running
Write-Host ""
Write-Host "Checking proxy server status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "[SUCCESS] Proxy server is running on port 3001" -ForegroundColor Green
        $healthData = $response.Content | ConvertFrom-Json
        Write-Host "Status: $($healthData.status)" -ForegroundColor Gray
    }
} catch {
    Write-Host "[ERROR] Proxy server failed to start!" -ForegroundColor Red
    Write-Host "Please check api/proxy-server.js and api/.env" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Starting main development server on port 3000..." -ForegroundColor Yellow

# Start the main development server
npm run dev

Read-Host "Press Enter to exit"
