#!/usr/bin/env pwsh

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Brokeranalysis Dev Server on Port 3000" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Cleaning up any existing Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "Starting development servers..." -ForegroundColor Green
Write-Host "- Frontend: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Green
Write-Host "- API Proxy: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3001" -ForegroundColor Green
Write-Host ""

# Run the dev server
pnpm run dev

Write-Host ""
Write-Host "Dev server stopped. Press any key to exit..." -ForegroundColor Yellow
Read-Host
