@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo          GitHub Auto-Sync Tool (Pull + Push)
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

:: Step 1: Pull
echo [1/4] Pulling latest changes from remote...
git pull origin %BRANCH%
if %errorlevel% neq 0 (
    echo [WARNING] Pull reported conflicts or issues. Resolve them before pushing.
    goto end
)

:: Check commit message from command line argument
set "MSG=%~1"
if "%MSG%"=="" (
    set /p "MSG=Enter commit message (Press Enter for auto timestamp): "
)

if "%MSG%"=="" (
    set "MSG=Auto sync: %date% %time%"
)

echo.
echo [2/4] Staging modified and new files...
git add -A

:: Step 2 & 3: Check and Commit
git diff --cached --quiet
if %errorlevel% neq 0 (
    echo [3/4] Committing changes with message: "%MSG%"...
    git commit -m "%MSG%"
) else (
    echo [3/4] No local file changes to commit. Checking for unpushed commits...
)

:: Step 4: Push
echo [4/4] Pushing to origin/%BRANCH%...
git push -u origin %BRANCH%

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo  [SUCCESS] Successfully synced with GitHub!
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
