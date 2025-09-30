# Stable Dev Server Startup Script
# This script ensures a clean start and prevents reload issues

Write-Host "🚀 Starting stable development server..." -ForegroundColor Green

# Kill any existing Node processes to avoid conflicts
Write-Host "🔧 Cleaning up existing processes..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Cleaned up existing Node processes" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ No existing Node processes to clean up" -ForegroundColor Blue
}

# Clean up cache and temporary files
Write-Host "🧹 Cleaning up cache and temporary files..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item "node_modules/.vite" -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path ".temp") {
    Remove-Item ".temp" -Recurse -Force -ErrorAction SilentlyContinue  
}
if (Test-Path ".tmp") {
    Remove-Item ".tmp" -Recurse -Force -ErrorAction SilentlyContinue
}

# Clean up any leftover report files that might cause issues
Get-ChildItem -Path "." -Filter "*audit-report*" | Remove-Item -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path "." -Filter "*optimization-report*" | Remove-Item -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path "." -Filter "*.csv" | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "✅ Cache cleanup complete" -ForegroundColor Green

# Set environment variables for stable operation
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:VITE_CHOKIDAR_USEPOLLING = "false"
$env:GENERATE_SOURCEMAP = "false"

Write-Host "🔧 Environment configured for stability" -ForegroundColor Green

# Start the development server
Write-Host "🌐 Starting Vite development server..." -ForegroundColor Cyan
Write-Host "📍 Server will be available at: http://localhost:3000" -ForegroundColor White
Write-Host "🔥 HMR will be available on port: 24678" -ForegroundColor White
Write-Host "" 
Write-Host "⚡ If you experience reload issues:" -ForegroundColor Yellow
Write-Host "   1. Press Ctrl+C to stop the server" -ForegroundColor White
Write-Host "   2. Run this script again" -ForegroundColor White
Write-Host ""

# Start the dev server
npm run dev