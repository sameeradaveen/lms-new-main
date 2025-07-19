@echo off
echo ========================================
echo    MongoDB Setup for NextGenFreeEdu
echo ========================================
echo.

echo Step 1: Downloading MongoDB Community Server...
echo Please download MongoDB from: https://www.mongodb.com/try/download/community
echo Choose "Windows x64" and "msi" package
echo.
pause

echo Step 2: Installing MongoDB...
echo After downloading, run the installer and follow these steps:
echo 1. Choose "Complete" installation
echo 2. Install MongoDB Compass (optional but recommended)
echo 3. Let it install as a service
echo.
pause

echo Step 3: Creating data directory...
if not exist "C:\data\db" (
    mkdir "C:\data\db"
    echo Created data directory: C:\data\db
) else (
    echo Data directory already exists: C:\data\db
)

echo.
echo Step 4: Starting MongoDB service...
net start MongoDB
if %errorlevel% equ 0 (
    echo ✅ MongoDB service started successfully!
) else (
    echo ❌ Failed to start MongoDB service
    echo Please start it manually from Windows Services
)

echo.
echo Step 5: Testing connection...
echo Starting server to test MongoDB connection...
cd server
npm run dev

pause 