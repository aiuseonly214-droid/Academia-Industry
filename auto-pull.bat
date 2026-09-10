@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo               GitHub Auto-Pull Tool
echo ========================================================
echo.

:: Get current branch name
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD 2^>nul') do set BRANCH=%%b
if "%BRANCH%"=="" (
    echo [ERROR] Not a git repository or Git is not installed.
    goto end
)

:: Get remote URL
for /f "delims=" %%u in ('git config --get remote.origin.url 2^>nul') do set REMOTE_URL=%%u
if "%REMOTE_URL%"=="" (
    echo [ERROR] No remote 'origin' configured.
    goto end
)

echo Current Branch : %BRANCH%
echo Remote URL     : %REMOTE_URL%
echo.

echo [1/1] Pulling latest changes from origin/%BRANCH%...
git pull origin %BRANCH%

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  [SUCCESS] Local repository is up to date with GitHub!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo  [FAILED] Pull encountered an error. Check above.
    echo ========================================================
)

:end
echo.
if "%~1"=="--no-pause" goto finish
if "%~2"=="--no-pause" goto finish
pause
:finish

