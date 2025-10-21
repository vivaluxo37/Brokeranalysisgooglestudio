@echo off
echo ========================================
echo Starting Brokeranalysis Dev Server on Port 3000
echo ========================================
echo.
echo Cleaning up any existing Node processes...
powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force"
timeout /t 2 /nobreak > nul

echo Starting development servers...
echo - Frontend: http://localhost:3000
echo - API Proxy: http://localhost:3001
echo.
pnpm run dev

echo.
echo Dev server stopped. Press any key to exit...
pause > nul
