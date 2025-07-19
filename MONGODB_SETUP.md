# 🔧 MongoDB Setup Guide

## ❌ Current Issue
Your application is showing: `Operation 'users.findOne()' buffering timed out after 10000ms`

This means MongoDB is not running or not accessible.

## 🚀 Quick Solutions (Choose One)

### Option 1: MongoDB Atlas (Cloud - Recommended)
**No installation required!**

1. **Sign up for free MongoDB Atlas:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Click "Try Free"
   - Create account and verify email

2. **Create a cluster:**
   - Choose "FREE" tier (M0)
   - Select cloud provider (AWS/Google Cloud/Azure)
   - Choose region closest to you
   - Click "Create"

3. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Create `.env` file in `server` folder:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/nextgenfreeedu?retryWrites=true&w=majority
   PORT=3000
   JWT_SECRET=your-secret-key
   ```

5. **Replace username/password** in the connection string with your actual credentials

### Option 2: Local MongoDB Installation

#### Windows Installation:
1. **Download MongoDB:**
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Select "Windows x64" and "msi"
   - Download and run installer

2. **Install as Service:**
   - Choose "Complete" installation
   - Install MongoDB Compass (optional)
   - Let it install as Windows service

3. **Start MongoDB:**
   - Open Services (Win+R, type `services.msc`)
   - Find "MongoDB" service
   - Right-click → Start

4. **Test Connection:**
   ```bash
   cd server
   npm run dev
   ```

#### Alternative: Use the Setup Script
Run the `setup-mongodb.bat` file in this directory for guided installation.

## 🔍 Troubleshooting

### If MongoDB service won't start:
1. Check if port 27017 is free:
   ```bash
   netstat -an | findstr 27017
   ```

2. Create data directory manually:
   ```bash
   mkdir C:\data\db
   ```

3. Start MongoDB manually:
   ```bash
   mongod --dbpath C:\data\db
   ```

### If connection still fails:
1. Check firewall settings
2. Ensure MongoDB is running on port 27017
3. Try restarting the MongoDB service

## ✅ Success Indicators
When MongoDB is working correctly, you should see:
```
🔗 Attempting to connect to MongoDB...
📍 Connection string: mongodb://localhost:27017/nextgenfreeedu
✅ MongoDB connected successfully
📊 Database: nextgenfreeedu
🌐 Host: localhost
```

## 🆘 Still Having Issues?
1. Try MongoDB Atlas (Option 1) - it's the easiest solution
2. Check the server console for detailed error messages
3. Ensure no other application is using port 27017 