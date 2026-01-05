# 🚀 Render Deployment - Quick Start Guide

## ✅ Pre-Deployment Checklist (COMPLETED)

✅ Backend code pushed to GitHub (gh-pages branch)
✅ Security updates applied (JWT secret secured)
✅ render.yaml configuration file ready
✅ package.json with correct start script
✅ Environment variables documented

---

## 🎯 DEPLOY NOW - Follow These Steps:

### Step 1: Open Render Dashboard
👉 **Click here:** https://dashboard.render.com/

### Step 2: Sign In / Sign Up
- **Recommended:** Sign in with GitHub account
- Or create account with email

### Step 3: Create New Web Service
1. Click **"New +"** button (top right corner)
2. Select **"Web Service"**
3. Click **"Build and deploy from a Git repository"**

### Step 4: Connect Your Repository
1. Click **"Connect GitHub"** (if not already connected)
2. Search for: **irahulsinghrajput/BrandMark**
3. Click **"Connect"**

### Step 5: Configure Service Settings

**Copy these EXACT settings:**

```
Name: brandmark-backend
Region: Singapore (or closest to you)
Branch: gh-pages
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### Step 6: Add Environment Variables

Click **"Advanced"** → Scroll to **"Environment Variables"**

Add these 6 variables (copy from below):

```
MONGODB_URI
mongodb+srv://brandmark_admin:%40Gangotri3031%40@cluster0.90ocq4y.mongodb.net/brandmark?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET
Y4wgmT7htSBCO1uGvEjUJpeK8RdXqWDbx2cioHZ5Q3MlskFVnLPIzy96AfN0ar

NODE_ENV
production

PORT
10000

FRONTEND_URL
https://brandmarksolutions.site

EMAIL_USER
your-email@gmail.com

EMAIL_PASS
your-app-password
```

⚠️ **Note:** Last 2 email variables are optional (forms will work without them)

### Step 7: Deploy!
1. Scroll to bottom
2. Click **"Create Web Service"**
3. Wait 2-3 minutes for deployment

---

## 📋 What Happens Next:

1. **Build Phase** (~1 minute)
   - Render will run `npm install`
   - Install all dependencies
   
2. **Start Phase** (~30 seconds)
   - Run `npm start`
   - Connect to MongoDB
   - Server goes live!

3. **Your Backend URL:**
   ```
   https://brandmark-backend.onrender.com
   ```

---

## ✅ After Deployment - Verify:

Test your backend is live:
```powershell
curl.exe https://brandmark-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "BrandMark API is running",
  "timestamp": "2026-01-05T..."
}
```

---

## 🔄 Update Frontend to Use New Backend:

After backend is live, update API URLs in these files:

1. **brandmark.js** (line 3)
2. **career-form.js** (line 3)
3. **admin-dashboard.html** (line 494)
4. **brandmarkpersonalblogs.html** (line 644)

Change from:
```javascript
const API_URL = 'http://localhost:5000/api';
```

To:
```javascript
const API_URL = 'https://brandmark-backend.onrender.com/api';
```

---

## 🎉 Success Indicators:

✅ Build logs show "Build succeeded"
✅ Server logs show "🚀 Server running on port 10000"
✅ Health check returns 200 OK
✅ MongoDB Connected message appears

---

## ⚠️ Troubleshooting:

**If deployment fails:**
1. Check build logs in Render dashboard
2. Verify root directory is set to `backend`
3. Ensure all environment variables are added
4. Check MongoDB URI is correct

**If health check fails:**
- Wait 30 seconds (cold start)
- Try again
- Check Render logs for errors

---

## 🆘 Need Help?

Render provides excellent documentation:
- https://render.com/docs/web-services

Or check the full guide:
- See DEPLOYMENT_GUIDE.md in your project

---

**Ready? Click the link above and let's deploy! 🚀**
