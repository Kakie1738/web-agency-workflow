@echo off
echo ========================================
echo   Web Agency Workflow - Vercel Deploy
echo ========================================
echo.
echo Due to network connectivity issues with Vercel CLI,
echo please use the manual deployment method:
echo.
echo 1. Go to: https://vercel.com/dashboard
echo 2. Click "New Project"
echo 3. Import from GitHub (connect your repo)
echo 4. Use these settings:
echo    - Framework: Next.js
echo    - Build Command: npm run build
echo    - Install Command: npm install
echo    - Output Directory: .next
echo.
echo 5. Add Environment Variables:
echo    NEXT_PUBLIC_CONVEX_URL=https://famous-gull-199.convex.cloud
echo    CONVEX_DEPLOY_KEY=dev:famous-gull-199^|eyJ2MiI6Ijc4OTllN2Y1OGFjNjQ0N2FhNTgzOGFkNmI0NDUyMDY3In0=
echo.
echo 6. Click "Deploy"
echo.
echo Your project will be available at: https://your-project-name.vercel.app
echo.
pause