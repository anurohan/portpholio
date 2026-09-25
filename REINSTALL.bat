@echo off
REM ============================================================
REM  Raushan Kumar Portfolio - CLEAN REINSTALL
REM  Fixes: "not a valid Win32 application" / "Failed to load SWC binary".
REM  Cause: node_modules was copied/installed on another OS, so the
REM  Windows SWC binary is missing. This wipes it and reinstalls fresh.
REM ============================================================
cd /d "%~dp0"
title Portfolio - Clean Reinstall

echo.
echo  Removing old node_modules (this can take a minute)...
if exist "node_modules" rmdir /s /q "node_modules"

echo  Removing old package-lock.json (regenerated with correct OS binaries)...
if exist "package-lock.json" del /f /q "package-lock.json"

echo  Clearing npm cache...
call npm cache clean --force

echo.
echo  Installing dependencies for Windows...
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
echo  Clean install complete. Now run BUILD.bat (or START.bat for dev).
echo.
pause
