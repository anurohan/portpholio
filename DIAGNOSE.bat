@echo off
REM ============================================================
REM  Raushan Kumar Portfolio - diagnostics (typecheck + lint)
REM ============================================================
cd /d "%~dp0"
title Portfolio - Diagnose

if not exist "node_modules" call npm install

echo.
echo  ==== TypeScript typecheck ====
call npm run typecheck
echo.
echo  ==== ESLint ====
call npm run lint
echo.
echo  Diagnostics complete. Review any messages above.
echo.
pause
