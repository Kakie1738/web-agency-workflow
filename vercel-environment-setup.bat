@echo off
echo ========================================
echo   Vercel Environment Variables Setup
echo ========================================
echo.
echo INSTRUCTIONS: Add these environment variables to your Vercel project
echo.
echo 1. Go to: https://vercel.com/dashboard
echo 2. Select your project: web-agency-workflow
echo 3. Go to Settings -^> Environment Variables
echo 4. Add these variables:
echo.
echo Variable 1:
echo    Name: NEXT_PUBLIC_CONVEX_URL
echo    Value: https://famous-gull-199.convex.cloud
echo    Environments: Production, Preview, Development (all)
echo.
echo Variable 2:
echo    Name: CONVEX_DEPLOY_KEY
echo    Value: dev:famous-gull-199^|eyJ2MiI6Ijc4OTllN2Y1OGFjNjQ0N2FhNTgzOGFkNmI0NDUyMDY3In0=
echo    Environments: Production, Preview, Development (all)
echo.
echo 5. Save variables
echo 6. Go to Deployments tab
echo 7. Click "..." on latest deployment -^> "Redeploy"
echo.
echo Your app will then connect to Convex database successfully!
echo.
pause