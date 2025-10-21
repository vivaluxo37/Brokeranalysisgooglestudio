@echo off
echo ========================================
echo Starting Development Server with AI Features
echo ========================================
echo.

REM Kill any existing node processes on port 3001
echo Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 ^| findstr LISTENING') do (
    taskkill /F /PID %%a > nul 2>&1
)

REM Start proxy server in the background
echo Starting AI Proxy Server on port 3001...
cd api
start /min cmd /c "node proxy-server.js"
cd ..

REM Wait a moment for the proxy server to start
timeout /t 3 /nobreak > nul

REM Verify proxy server is running
echo.
echo Checking proxy server status...
curl -s http://localhost:3001/health > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Proxy server failed to start!
    echo Please check api/proxy-server.js and api/.env
    echo Make sure PORT in proxy-server.js is set to 3001
    pause
    exit /b 1
) else (
    echo [SUCCESS] Proxy server is running on port 3001
)

echo.
echo Starting main development server on port 3000...
npm run dev

pause
