@echo off
REM ============================================================
REM  Raushan Kumar Portfolio - FULL DIAGNOSIS (one shot)
REM  Finds missing files, placeholders, and runs typecheck +
REM  lint + production build, then prints ONE report.
REM  Tip: run "CHECK.bat fast" to skip the slow build.
REM ============================================================
cd /d "%~dp0"
title Portfolio - Full Check

if not exist "node_modules" (
  echo  node_modules not found - installing first...
  call npm install
)

if /I "%~1"=="fast" (
  node check.mjs --fast
) else (
  node check.mjs
)

echo.
pause
