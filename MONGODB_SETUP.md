# MongoDB Setup Guide for BrandMark Backend

## Quick Setup - Choose ONE Option:

### Option 1: Install MongoDB Locally (Recommended for Development)

1. **Download MongoDB Community Edition**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI Installer
   - Download and run the installer

2. **Install MongoDB**
   - Choose "Complete" installation
   - Install "MongoDB as a Service" (check the box)
   - MongoDB Compass (GUI tool) is optional but helpful

3. **Verify Installation**
   Open PowerShell and run:
   ```powershell
   mongod --version
   ```

4. **Update .env file**
   Uncomment this line in `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/brandmark
   ```

5. **Restart the backend server**

---

### Option 2: Use MongoDB Atlas (Free Cloud Database)

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create a Cluster**
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Create username and password
   - Save credentials!

4. **Setup Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

6. **Update .env file**
   Add this line to `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/brandmark?retryWrites=true&w=majority
   ```

7. **Restart the backend server**

---

## Testing the Connection

After setting up MongoDB, restart your backend:

```powershell
cd C:\Users\djmun\OneDrive\Desktop\BrandMark\backend
node server.js
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

Then try the admin dashboard again!
