@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title Glance - push commits

rem ------------------------------------------------------------
rem push-commits.bat
rem Splits the Glance project files into several commits and
rem pushes them to your EXISTING GitHub repo.
rem
rem Usage:  push-commits.bat            (repo "glance", branch "main")
rem         push-commits.bat my-repo    (different repo name)
rem         push-commits.bat my-repo dev (different branch)
rem
rem Needs git and a signed-in GitHub CLI (gh auth login).
rem The window always stays open at the end so you can read it.
rem ------------------------------------------------------------

set "REPO=%~1"
if not defined REPO set "REPO=glance"
set "BRANCH=%~2"
if not defined BRANCH set "BRANCH=main"
set "MADE=0"
set "FAILED="

echo.
echo Folder: %CD%
echo.

rem --- 1. Tools and login ---
where git >nul 2>&1
if errorlevel 1 ( echo ERROR: git is not installed or not on PATH. & goto :fail )
where gh >nul 2>&1
if errorlevel 1 ( echo ERROR: GitHub CLI "gh" is not installed or not on PATH. & goto :fail )
gh auth status >nul 2>&1
if errorlevel 1 ( echo ERROR: gh is not signed in. Run: gh auth login & goto :fail )

set "LOGIN="
for /f "delims=" %%i in ('gh api user --jq .login') do set "LOGIN=%%i"
if not defined LOGIN ( echo ERROR: could not read your GitHub username from gh. & goto :fail )
set "SLUG=%LOGIN%/%REPO%"

gh repo view %SLUG% >nul 2>&1
if errorlevel 1 ( echo ERROR: repo %SLUG% was not found. Check the name, or run: push-commits.bat your-repo-name & goto :fail )
echo Target repo: https://github.com/%SLUG%  branch: %BRANCH%
echo.

rem --- 2. Git identity ---
set "GNAME="
set "GMAIL="
for /f "delims=" %%i in ('git config user.name') do set "GNAME=%%i"
for /f "delims=" %%i in ('git config user.email') do set "GMAIL=%%i"
if not defined GNAME ( echo ERROR: git user.name is not set. & echo Run: git config --global user.name "Your Name" & goto :fail )
if not defined GMAIL ( echo ERROR: git user.email is not set. & echo Run: git config --global user.email "you@example.com" & goto :fail )

rem --- 3. Local repo and remote ---
if not exist ".git" (
    git init
    if errorlevel 1 goto :fail
)
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin https://github.com/%SLUG%.git
    if errorlevel 1 goto :fail
)

echo Fetching from GitHub...
git fetch origin
if errorlevel 1 ( echo ERROR: git fetch failed. & goto :fail )

git rev-parse --verify --quiet origin/%BRANCH% >nul 2>&1
if errorlevel 1 ( set "REMOTE_HAS=0" ) else ( set "REMOTE_HAS=1" )
git rev-parse --verify --quiet HEAD >nul 2>&1
if errorlevel 1 ( set "LOCAL_HAS=0" ) else ( set "LOCAL_HAS=1" )

if "%LOCAL_HAS%"=="1" (
    git branch -M %BRANCH%
) else (
    git symbolic-ref HEAD refs/heads/%BRANCH%
)
if errorlevel 1 goto :fail

if "%REMOTE_HAS%"=="1" (
    if "%LOCAL_HAS%"=="0" (
        rem Fresh local folder: adopt the remote history, keep the files on disk.
        git reset origin/%BRANCH%
        if errorlevel 1 goto :fail
    ) else (
        git pull --rebase origin %BRANCH%
        if errorlevel 1 ( echo ERROR: git pull --rebase failed. Resolve it, then run this again. & goto :fail )
    )
)

rem --- 4. Show pending changes and confirm ---
echo.
echo Changes found:
git status --short
echo.
echo Press any key to create the commits and push, or close this window to cancel.
pause >nul

rem --- 5. The commits, in order. Groups with no changes are skipped. ---
call :commit "chore: add MIT license and .gitignore" LICENSE .gitignore
if defined FAILED goto :fail
call :commit "docs: add product requirements document v0.2" docs\PRD.md
if defined FAILED goto :fail
call :commit "docs: add hero image for the README" assets\hero.png assets\hero.svg
if defined FAILED goto :fail
call :commit "docs: add README with overview, widgets and roadmap" README.md
if defined FAILED goto :fail
call :commit "chore: add repo setup and push scripts" create-repo.ps1 create-repo.sh push-commits.bat push-commits.ps1
if defined FAILED goto :fail

rem Anything else that changed goes into one final commit.
git add -A
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "chore: update remaining project files"
    if errorlevel 1 goto :fail
    set /a MADE+=1
)

rem --- 6. Push ---
if "%MADE%"=="0" (
    echo.
    echo Nothing new to commit. Repo is already up to date.
    goto :end
)
echo.
echo Pushing %MADE% commit^(s^)...
git push -u origin %BRANCH%
if errorlevel 1 ( echo ERROR: git push failed. & goto :fail )

echo.
echo Done. Pushed %MADE% commit^(s^) to https://github.com/%SLUG%
echo.
git log --oneline -n %MADE%
goto :end


rem ---------- subroutine: commit "message" file1 file2 ... ----------
:commit
set "MSG=%~1"
shift
set "FILES="
:collect
if "%~1"=="" goto :docommit
if exist "%~1" set FILES=!FILES! "%~1"
shift
goto :collect
:docommit
if not defined FILES exit /b 0
git add -- !FILES!
if errorlevel 1 ( set "FAILED=1" & exit /b 1 )
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "%MSG%"
    if errorlevel 1 ( set "FAILED=1" & exit /b 1 )
    set /a MADE+=1
)
exit /b 0


:fail
echo.
echo ------------------------------------------------------------
echo Something went wrong. Read the messages above, fix the issue,
echo and run this script again. It is safe to re-run.
echo ------------------------------------------------------------

:end
echo.
pause
endlocal
