@echo off
echo ================================================
echo  COMPREHENSIVE DEV SERVER RESTART (ANTI-RELOAD)
echo ================================================
echo.

REM Step 1: Kill ALL Node processes aggressively
echo [1/7] Killing all Node.js processes...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo       Done.

REM Step 2: Clean Vite cache
echo [2/7] Cleaning Vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite" >nul 2>&1
    echo       Vite cache cleaned.
) else (
    echo       No Vite cache found.
)

REM Step 3: Clean temp directories
echo [3/7] Cleaning temp directories...
if exist ".temp" rmdir /s /q ".temp" >nul 2>&1
if exist ".tmp" rmdir /s /q ".tmp" >nul 2>&1
echo       Done.

REM Step 4: Remove any report files that trigger reloads
echo [4/7] Removing report files...
del /F /Q "*report*.json" >nul 2>&1
del /F /Q "*report*.csv" >nul 2>&1
if exist "reports" rmdir /s /q "reports" >nul 2>&1
mkdir reports >nul 2>&1
echo       Done.

REM Step 5: Set environment variables for maximum stability
echo [5/7] Configuring environment...
set NODE_ENV=development
set NODE_OPTIONS=--max-old-space-size=4096
set VITE_CHOKIDAR_USEPOLLING=false
set GENERATE_SOURCEMAP=false
set FAST_REFRESH=true
set FAST_REFRESH_DEBUG=false
echo       Environment configured.

REM Step 6: Clear browser cache recommendation
echo [6/7] IMPORTANT: Clear your browser cache!
echo       Press Ctrl+Shift+Delete in your browser
echo       and clear cached images and files.
echo.
timeout /t 3 >nul

REM Step 7: Start the dev server
echo [7/7] Starting dev server on http://localhost:5173
echo       HMR available on port 24678
echo.
echo ================================================
echo  Server starting... Press Ctrl+C to stop
echo ================================================
echo.

npm run dev
