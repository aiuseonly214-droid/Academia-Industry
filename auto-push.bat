@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo               GitHub Auto-Push Tool
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

:: Check commit message from command line argument
set "MSG=%~1"
if "%MSG%"=="" (
    set /p "MSG=Enter commit message (Press Enter for auto timestamp): "
)

if "%MSG%"=="" (
    set "MSG=Auto update: %date% %time%"
)

echo.
echo [1/3] Staging modified and new files...
git add -A

:: Check if there are changes to commit
git diff --cached --quiet
if %errorlevel% neq 0 (
    echo [2/3] Committing changes with message: "%MSG%"...
    git commit -m "%MSG%"
) else (
    echo [2/3] No new local file changes to commit. Checking for unpushed commits...
)

echo [3/3] Pushing to origin/%BRANCH%...
git push -u origin %BRANCH%

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  [SUCCESS] Code successfully pushed to GitHub!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo  [FAILED] Push failed. Please check error messages above.
    echo ========================================================
)

:end
echo.
if "%~1"=="--no-pause" goto finish
if "%~2"=="--no-pause" goto finish
pause
:finish
