@echo off
REM ============================================================
REM  Raushan Kumar Portfolio - production build + preview
REM ============================================================
cd /d "%~dp0"
title Portfolio - Production Build

if not exist "node_modules" call npm install

echo.
echo  Running production build...
echo.
call npm run build
if errorlevel 1 (
  echo.
  echo  [ERROR] Build failed. Scroll up to read the error.
  pause
  exit /b 1
)
echo.
echo  Build OK. Starting production server at http://localhost:3000
echo.
start "" http://localhost:3000
call npm run start
pause
