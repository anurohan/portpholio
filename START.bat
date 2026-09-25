@echo off
REM ============================================================
REM  Raushan Kumar Portfolio - START (development server)
REM ============================================================
cd /d "%~dp0"
title Raushan Kumar Portfolio

if not exist "node_modules" (
  echo.
  echo  Dependencies are not installed yet. Running install first...
  echo.
  call npm install
  if errorlevel 1 (
    echo  [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo  Starting dev server at http://localhost:3000
echo  The browser will open automatically. Press Ctrl+C here to stop.
echo.
start "" http://localhost:3000
call npm run dev
pause
