@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo ========================================
echo  职业股市 · 构建并发布到 GitHub Pages
echo ========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [错误] 未找到 Node.js，请先安装 https://nodejs.org
  pause
  exit /b 1
)

where git >nul 2>&1
if errorlevel 1 (
  echo [错误] 未找到 Git，请先安装 https://git-scm.com
  pause
  exit /b 1
)

echo [1/5] 构建游戏 HTML...
call node build.js
if errorlevel 1 (
  echo [错误] 构建失败
  pause
  exit /b 1
)

if not exist index.html (
  echo [错误] 未生成 index.html
  pause
  exit /b 1
)
echo       已生成 career-stock-game.html 与 index.html
echo.

if not exist .git (
  echo [提示] 当前目录还不是 Git 仓库，正在初始化...
  git init
  git branch -M main
  echo.
  echo 请先在 GitHub 新建空仓库，然后执行：
  echo   git remote add origin https://github.com/你的用户名/你的仓库名.git
  echo   再重新运行本脚本
  echo.
  pause
  exit /b 0
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  echo [提示] 尚未绑定 GitHub 远程仓库
  echo 请执行：git remote add origin https://github.com/你的用户名/你的仓库名.git
  pause
  exit /b 1
)

echo [2/5] 添加文件...
git add build.js data.json real-companies.js career-stock-game.html index.html deploy-github.bat .gitignore README.md 2>nul

echo [3/5] 当前变更：
git status -s
echo.

set "MSG=update: rebuild game for GitHub Pages"
set /p INPUT=提交说明（直接回车使用默认）: 
if not "%INPUT%"=="" set "MSG=%INPUT%"

echo [4/5] 提交...
git commit -m "%MSG%"
if errorlevel 1 (
  echo [提示] 没有新变更需要提交，或提交失败
)

echo [5/5] 推送到 GitHub...
git push -u origin main
if errorlevel 1 (
  echo 尝试 master 分支...
  git push -u origin master
)

echo.
echo ========================================
echo  完成！
echo  1. 打开 GitHub 仓库 - Settings - Pages
echo  2. Source 选 Deploy from a branch
echo  3. Branch 选 main，文件夹选 / (root)
echo  4. 保存后访问：https://你的用户名.github.io/仓库名/
echo.
echo  存档说明：昵称与存档保存在玩家浏览器本地，不会上传。
echo ========================================
pause
