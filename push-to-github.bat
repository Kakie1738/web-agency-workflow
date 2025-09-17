@echo off
echo =================================================
echo   Web Agency Workflow - GitHub Push Script
echo =================================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: Not in the correct project directory
    echo Please navigate to the web-agency-workflow folder first
    pause
    exit /b 1
)

echo Current project status:
git status
echo.

echo =================================================
echo STEP 1: Create GitHub Repository
echo =================================================
echo Please complete this step manually:
echo 1. Go to https://github.com
echo 2. Click "+" -^> "New repository"  
echo 3. Repository name: web-agency-workflow
echo 4. Description: Web Agency Workflow Management System with Convex integration
echo 5. Choose Public or Private
echo 6. DO NOT initialize with README (we already have one)
echo 7. Click "Create repository"
echo.

set /p username="Enter your GitHub username: "
if "%username%"=="" (
    echo ERROR: GitHub username is required
    pause
    exit /b 1
)

echo.
echo =================================================
echo STEP 2: Configure Git Remote
echo =================================================
echo Adding remote repository...
git remote add origin https://github.com/%username%/web-agency-workflow.git

if %errorlevel% neq 0 (
    echo ERROR: Failed to add remote. Repository might already exist.
    echo Updating remote instead...
    git remote set-url origin https://github.com/%username%/web-agency-workflow.git
)

echo.
echo =================================================
echo STEP 3: Set Main Branch
echo =================================================
git branch -M main

echo.
echo =================================================
echo STEP 4: Push to GitHub
echo =================================================
echo Pushing your Web Agency Workflow project to GitHub...
echo This includes:
echo - Complete Next.js application (109 files)
echo - Convex backend integration
echo - UI components and styling
echo - Documentation and deployment guides
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =================================================
    echo SUCCESS! Your project is now on GitHub
    echo =================================================
    echo Repository URL: https://github.com/%username%/web-agency-workflow
    echo.
    echo What you can do next:
    echo 1. Visit your repository on GitHub
    echo 2. Set up automatic deployment
    echo 3. Add collaborators
    echo 4. Enable GitHub Pages for documentation
    echo.
) else (
    echo.
    echo =================================================
    echo PUSH FAILED
    echo =================================================
    echo This might be because:
    echo 1. Repository doesn't exist on GitHub yet
    echo 2. Authentication issues
    echo 3. Network connectivity problems
    echo.
    echo Please check the error above and try again.
    echo.
)

echo Press any key to exit...
pause >nul