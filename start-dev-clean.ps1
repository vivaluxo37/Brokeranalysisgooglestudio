# Comprehensive Dev Server Restart Script (Anti-Reload)
# Run this script whenever you experience auto-reload issues

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  COMPREHENSIVE DEV SERVER RESTART (ANTI-RELOAD)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill ALL Node processes
Write-Host "[1/7] Killing all Node.js processes..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "      Done." -ForegroundColor Green
} catch {
    Write-Host "      No Node processes to kill." -ForegroundColor Gray
}

# Step 2: Clean Vite cache
Write-Host "[2/7] Cleaning Vite cache..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item "node_modules/.vite" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "      Vite cache cleaned." -ForegroundColor Green
} else {
    Write-Host "      No Vite cache found." -ForegroundColor Gray
}

# Step 3: Clean temp directories
Write-Host "[3/7] Cleaning temp directories..." -ForegroundColor Yellow
if (Test-Path ".temp") { Remove-Item ".temp" -Recurse -Force -ErrorAction SilentlyContinue }
if (Test-Path ".tmp") { Remove-Item ".tmp" -Recurse -Force -ErrorAction SilentlyContinue }
Write-Host "      Done." -ForegroundColor Green

# Step 4: Remove report files that trigger reloads
Write-Host "[4/7] Removing report files..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Filter "*report*.json" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path "." -Filter "*report*.csv" -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
if (Test-Path "reports") { Remove-Item "reports" -Recurse -Force -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Path "reports" -Force | Out-Null
Write-Host "      Done." -ForegroundColor Green

# Step 5: Set environment variables
Write-Host "[5/7] Configuring environment..." -ForegroundColor Yellow
$env:NODE_ENV = "development"
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:VITE_CHOKIDAR_USEPOLLING = "false"
$env:GENERATE_SOURCEMAP = "false"
$env:FAST_REFRESH = "true"
$env:FAST_REFRESH_DEBUG = "false"
Write-Host "      Environment configured." -ForegroundColor Green

# Step 6: Browser cache reminder
Write-Host "[6/7] IMPORTANT: Clear your browser cache!" -ForegroundColor Red
Write-Host "      Press Ctrl+Shift+Delete in your browser" -ForegroundColor White
Write-Host "      and clear cached images and files." -ForegroundColor White
Write-Host ""
Start-Sleep -Seconds 3

# Step 7: Start dev server
Write-Host "[7/7] Starting dev server on http://localhost:5173" -ForegroundColor Yellow
Write-Host "      HMR available on port 24678" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Server starting... Press Ctrl+C to stop" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

npm run dev
