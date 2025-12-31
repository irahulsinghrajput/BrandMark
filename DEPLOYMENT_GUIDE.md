# Backend Deployment Guide - Render.com

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Create Render Account
1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub account (recommended) or email
4. Verify your email

### Step 2: Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Choose **"Build and deploy from a Git repository"**
4. Click **"Next"**

### Step 3: Connect Repository
**Option A - If signed in with GitHub:**
1. Click **"Connect account"** to link GitHub
2. Find repository: **irahulsinghrajput/BrandMark**
3. Click **"Connect"**

**Option B - Use Public Repository:**
1. Paste repository URL: `https://github.com/irahulsinghrajput/BrandMark`
2. Click **"Continue"**

### Step 4: Configure Service
Fill in these details:

**Name:** `brandmark-backend`

**Region:** Choose closest to your location (e.g., Singapore, Oregon)

**Branch:** `gh-pages`

**Root Directory:** `backend` ⚠️ IMPORTANT!

**Runtime:** `Node`

**Build Command:** `npm install`

**Start Command:** `npm start`

**Instance Type:** `Free` (select the free tier)

### Step 5: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these **6 environment variables** (copy from your backend/.env file):

1. **MONGODB_URI**
   ```
   mongodb+srv://brandmark_admin:%40Gangotri3031%40@cluster0.90ocq4y.mongodb.net/brandmark?retryWrites=true&w=majority
   ```

2. **JWT_SECRET**
   ```
   brandmark_super_secret_jwt_key_2025_change_this
   ```

3. **EMAIL_USER**
   ```
   info.aimservicesprivatelimited@gmail.com
   ```

4. **EMAIL_PASS**
   ```
   vbzxyxpsmohjgbjj
   ```

5. **FRONTEND_URL**
   ```
   https://brandmarksolutions.site
   ```

6. **NODE_ENV**
   ```
   production
   ```

### Step 6: Deploy
1. Click **"Create Web Service"** button at the bottom
2. Wait 3-5 minutes for deployment (you'll see build logs)
3. Look for "Build successful" and "Your service is live"

### Step 7: Get Your Backend URL
Once deployed, you'll see:
```
Your service is live at https://brandmark-backend.onrender.com
```

**COPY THIS URL** - you'll need it for Step 8!

### Step 8: Update Frontend API URLs

#### File 1: brandmark.js
Open `C:\Users\djmun\OneDrive\Desktop\BrandMark\brandmark.js`

Change line 2 from:
```javascript
const API_URL = 'http://localhost:5001/api';
```

To:
```javascript
const API_URL = 'https://brandmark-backend.onrender.com/api';
```
(Replace with YOUR actual Render URL)

#### File 2: career-form.js
Open `C:\Users\djmun\OneDrive\Desktop\BrandMark\career-form.js`

Change line 2 from:
```javascript
const API_URL = 'http://localhost:5001/api';
```

To:
```javascript
const API_URL = 'https://brandmark-backend.onrender.com/api';
```

### Step 9: Commit and Push Frontend Changes
Open PowerShell and run:
```powershell
cd C:\Users\djmun\OneDrive\Desktop\BrandMark
git add brandmark.js career-form.js
git commit -m "Update API URLs to production backend"
git push origin gh-pages
```

### Step 10: Test Everything!
Wait 2 minutes for GitHub Pages to update, then:

1. **Test Contact Form:**
   - Go to https://brandmarksolutions.site
   - Fill and submit contact form
   - Check email for notification

2. **Test Career Application:**
   - Go to any career page
   - Upload resume and submit
   - Check email for confirmation

3. **Test Admin Dashboard:**
   - Go to https://brandmarksolutions.site/admin-dashboard.html
   - Register admin account (first time)
   - Login and view submissions

---

## 🎉 You're Done!

Your website is now **fully functional** with:
- ✅ Working contact forms
- ✅ Career applications with file uploads
- ✅ Newsletter subscriptions
- ✅ Email notifications
- ✅ Admin dashboard

---

## 🔧 Troubleshooting

### Build Failed on Render
**Error:** "Cannot find module"
**Fix:** Make sure Root Directory is set to `backend`

### Forms Not Working
**Error:** CORS error in browser console
**Fix:** Check FRONTEND_URL environment variable matches your domain exactly

### Emails Not Sending
**Error:** Authentication failed
**Fix:** Verify EMAIL_USER and EMAIL_PASS are correct (no spaces)

### "Service Unavailable"
**Error:** Backend not responding
**Fix:** Check Render logs - may need to upgrade from free tier if getting too much traffic

---

## 📊 Free Tier Limitations

Render free tier:
- ✅ 750 hours/month (more than enough)
- ⚠️ Spins down after 15 minutes of inactivity (first request takes ~30 seconds)
- ✅ 512MB RAM
- ✅ Unlimited bandwidth

**Upgrade to paid ($7/month) for:**
- Always-on service (no spin down)
- More RAM
- Custom domains
- Better performance

---

## 🆘 Need Help?

If you get stuck:
1. Check Render build logs for errors
2. Verify all environment variables are set correctly
3. Test backend URL directly: `https://your-backend.onrender.com/api/health`
4. Check browser console for CORS errors

---

**Deployment Date:** December 31, 2025
**Backend URL:** [To be filled after deployment]
**Status:** Ready to deploy
