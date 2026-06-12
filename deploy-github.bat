@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo  Deploy to GitHub Pages
echo  Repo: https://github.com/62cm/JOB
echo  Site: https://62cm.github.io/JOB/
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not found.
  pause
  exit /b 1
)

where git >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Git not found.
  pause
  exit /b 1
)

if not exist ".git" (
  echo [ERROR] Not a git repo. Run once:
  echo   git init
  echo   git branch -M main
  echo   git remote add origin https://github.com/62cm/JOB.git
  pause
  exit /b 1
)

echo [1/4] node build.js
node build.js
if errorlevel 1 (
  echo [ERROR] Build failed.
  pause
  exit /b 1
)

echo.
echo [2/4] git add
git add build.js index.html career-stock-game.html data.json
git add *.js
if exist README.md git add README.md
if exist .gitignore git add .gitignore
if exist build.bat git add build.bat
if exist deploy-github.bat git add deploy-github.bat

echo [3/4] git commit
git commit -m "deploy game build"
if errorlevel 1 (
  echo [NOTE] Nothing to commit, will still try push...
)

echo.
echo [4/4] git push origin main
git push origin main
if errorlevel 1 (
  echo [ERROR] push failed. Check login / token.
  pause
  exit /b 1
)

echo.
echo ========================================
echo  OK. Wait 1-2 min then open:
echo  https://62cm.github.io/JOB/
echo  Hard refresh: Ctrl+F5
echo ========================================
pause
