# Diagnostic Script to Monitor File Changes
# This script helps identify what files are being modified and causing reloads

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Dev Server Reload Diagnostics" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check for running Vite processes
Write-Host "[1] Checking for running Vite processes..." -ForegroundColor Yellow
$viteProcesses = Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*vite*"}
if ($viteProcesses) {
    Write-Host "⚠️  Found running Node/Vite processes:" -ForegroundColor Red
    $viteProcesses | ForEach-Object {
        Write-Host "   PID: $($_.Id) - $($_.ProcessName)" -ForegroundColor Red
    }
    Write-Host ""
    $response = Read-Host "Do you want to kill these processes? (y/n)"
    if ($response -eq 'y') {
        $viteProcesses | Stop-Process -Force
        Write-Host "✓ Processes terminated" -ForegroundColor Green
    }
} else {
    Write-Host "✓ No running Vite processes found" -ForegroundColor Green
}
Write-Host ""

# 2. Check ports
Write-Host "[2] Checking if ports are in use..." -ForegroundColor Yellow
$ports = @(3000, 24678, 24680, 3005)
foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "⚠️  Port $port is in use by PID: $($connection.OwningProcess)" -ForegroundColor Red
    } else {
        Write-Host "✓ Port $port is available" -ForegroundColor Green
    }
}
Write-Host ""

# 3. Check for recently modified files (last 5 minutes)
Write-Host "[3] Checking for recently modified files..." -ForegroundColor Yellow
$fiveMinutesAgo = (Get-Date).AddMinutes(-5)
$recentFiles = Get-ChildItem -Path . -Recurse -File -ErrorAction SilentlyContinue | 
    Where-Object { 
        $_.LastWriteTime -gt $fiveMinutesAgo -and
        $_.FullName -notlike "*node_modules*" -and
        $_.FullName -notlike "*dist*" -and
        $_.FullName -notlike "*.git*"
    } |
    Select-Object FullName, LastWriteTime |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 20

if ($recentFiles) {
    Write-Host "Recently modified files:" -ForegroundColor Yellow
    $recentFiles | ForEach-Object {
        $relativePath = $_.FullName.Replace((Get-Location).Path, ".")
        Write-Host "  $relativePath - $($_.LastWriteTime)" -ForegroundColor White
    }
} else {
    Write-Host "✓ No recent file modifications detected" -ForegroundColor Green
}
Write-Host ""

# 4. Check for problematic files in scripts directory
Write-Host "[4] Checking scripts directory for JSON/log files..." -ForegroundColor Yellow
$problemFiles = Get-ChildItem -Path ".\scripts" -Filter "*.json" -ErrorAction SilentlyContinue
if ($problemFiles) {
    Write-Host "⚠️  Found JSON files in scripts directory:" -ForegroundColor Red
    $problemFiles | ForEach-Object {
        Write-Host "   $($_.Name) - Last modified: $($_.LastWriteTime)" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "These files might trigger reloads if your scripts are running." -ForegroundColor Yellow
    Write-Host "Consider moving them to a 'reports' folder or adding to .gitignore" -ForegroundColor Yellow
} else {
    Write-Host "✓ No JSON files in scripts directory" -ForegroundColor Green
}
Write-Host ""

# 5. Check Vite cache
Write-Host "[5] Checking Vite cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    $cacheSize = (Get-ChildItem "node_modules\.vite" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "Vite cache size: $([math]::Round($cacheSize, 2)) MB" -ForegroundColor White
    Write-Host ""
    $response = Read-Host "Do you want to clear the Vite cache? (y/n)"
    if ($response -eq 'y') {
        Remove-Item "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Vite cache cleared" -ForegroundColor Green
    }
} else {
    Write-Host "✓ No Vite cache found" -ForegroundColor Green
}
Write-Host ""

# 6. Recommendations
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Recommendations:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "1. Use the new stable config: npm run dev:stable" -ForegroundColor White
Write-Host "2. If still reloading, try: npm run dev:fix" -ForegroundColor White
Write-Host "3. For no HMR at all: npm run dev:no-hmr" -ForegroundColor White
Write-Host "4. Always stop all dev servers before starting a new one" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
