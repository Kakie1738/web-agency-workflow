@echo off
echo Fixing Vercel CLI Network Issues...
echo.

echo Step 1: Clear npm cache
npm cache clean --force

echo.
echo Step 2: Update Vercel CLI
npm uninstall -g vercel
npm install -g vercel@latest

echo.
echo Step 3: Check network connectivity
ping api.vercel.com

echo.
echo Step 4: Try deployment with debug info
vercel --debug

echo.
echo If this still fails, use manual deployment via web interface.
pause