@echo off
echo 🚀 Starting stable development server...

REM Kill existing Node processes
echo 🔧 Cleaning up existing processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Cleaned up existing Node processes
) else (
    echo ℹ️ No existing Node processes to clean up
)

REM Clean up cache
echo 🧹 Cleaning up cache...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite" >nul 2>&1
if exist ".temp" rmdir /s /q ".temp" >nul 2>&1
if exist ".tmp" rmdir /s /q ".tmp" >nul 2>&1

REM Set environment variables
set NODE_OPTIONS=--max-old-space-size=4096
set VITE_CHOKIDAR_USEPOLLING=false
set GENERATE_SOURCEMAP=false

echo ✅ Environment configured for stability
echo 🌐 Starting Vite development server...
echo 📍 Server will be available at: http://localhost:3000
echo 🔥 HMR will be available on port: 24678
echo.

REM Start the dev server
npm run dev