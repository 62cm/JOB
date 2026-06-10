@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo  Career Stock Game - Local Build
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)

echo [1/2] node build.js
node build.js
if errorlevel 1 (
  echo.
  echo [ERROR] Build failed.
  pause
  exit /b 1
)

echo.
echo [2/2] Done: index.html + career-stock-game.html
echo Opening index.html in browser. Use Ctrl+F5 if cached.
echo.
start "" "%~dp0index.html"
pause
