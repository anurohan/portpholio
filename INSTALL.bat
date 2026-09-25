@echo off
REM ============================================================
REM  Raushan Kumar Portfolio - one-time dependency install
REM ============================================================
cd /d "%~dp0"
echo.
echo  Installing dependencies (this may take a few minutes)...
echo.
where npm >nul 2>nul
if errorlevel 1 (
  echo  [ERROR] Node.js / npm was not found on your PATH.
  echo  Install Node.js 18+ from https://nodejs.org and re-run this script.
  echo.
  pause
  exit /b 1
)
call npm install
if errorlevel 1 (
  echo.
  echo  [ERROR] npm install failed. Scroll up to read the error.
  echo.
  pause
  exit /b 1
)
echo.
echo  Dependencies installed. You can now run START.bat
echo.
pause
