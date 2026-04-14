# 🚀 Complete Deployment Guide - BrandMark Course Platform

## Overview
- **Frontend:** https://brandmarksolutions.site (Static Files - Hosted on GitHub Pages/Render)
- **Backend API:** https://brandmark-backend.onrender.com (Node.js - Hosted on Render)
- **Database:** MongoDB Atlas (Cloud)
- **Payment:** Razorpay (Live Mode)
- **Email:** Gmail SMTP

---

## Prerequisites

Before deploying, ensure you have:

1. ✅ **GitHub Account** - https://github.com
2. ✅ **Render Account** - https://render.com (free tier available)
3. ✅ **MongoDB Atlas Account** - https://www.mongodb.com/cloud/atlas
4. ✅ **Razorpay Production Account** - https://razorpay.com
5. ✅ **Gmail Account with App Password** - https://myaccount.google.com/apppasswords

---

## Phase 1: Push Code to GitHub

### Step 1.1: Initialize Git Repository

```powershell
cd c:\Users\djmun\OneDrive\Desktop\BrandMark

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: BrandMark course platform with Razorpay payment and certificates"

# Add remote (replace with your GitHub repo)
git remote add origin https://github.com/YOUR_USERNAME/BrandMark.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Expected Output:**
```
✅ Enumerating objects: 350, done.
✅ Counting objects: 100% (350/350), done.
✅ Compressing objects: 100% (280/280), done.
✅ Writing objects: 100% (350/350), done.
✅ Branch 'main' set up to track 'origin/main'.
```

**Verify on GitHub:**
- Visit: https://github.com/YOUR_USERNAME/BrandMark
- Should see all project files

---

## Phase 2: Deploy Backend to Render.com

### Step 2.1: Create Render Account
1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (recommended)
4. Verify email

### Step 2.2: Create Web Service for Backend

1. **Login to Render Dashboard**
   - URL: https://dashboard.render.com

2. **Click "New +" → "Web Service"**

3. **Connect GitHub Repository**
   - Select your BrandMark repository
   - Click "Connect"

4. **Configure Service:**

| Field | Value |
|-------|-------|
| **Name** | `brandmark-backend` |
| **Environment** | `Node` |
| **Region** | Choose closest (e.g., Singapore) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

5. **Click "Advanced"** and add Environment Variables:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/brandmark
JWT_SECRET = your-super-secret-jwt-key-min-32-characters
RAZORPAY_KEY_ID = rzp_live_SdXeFmb44CZY37
RAZORPAY_KEY_SECRET = 79Mkzv3vXIm3xA084O4aAzI0
EMAIL_USER = info.aimservicesprivatelimited@gmail.com
EMAIL_PASSWORD = @Rahul3031@
GEMINI_API_KEY = your-gemini-api-key
FRONTEND_URL = https://brandmarksolutions.site
NODE_ENV = production
```

6. **Click "Create Web Service"**

**Deployment starts automatically:**
```
Building: Bundling dependencies...
✅ Build started
✅ Installing dependencies
✅ Running npm start
✅ Deployed! https://brandmark-backend.onrender.com
```

### Step 2.3: Note Your Backend URL
```
🔗 Backend API: https://brandmark-backend.onrender.com/api
```

---

## Phase 3: Update Frontend for Production

### Step 3.1: Update API URLs in Frontend Files

Update all HTML files to use the production backend URL:

**File: courses.html**
```javascript
const API_BASE_URL = 'https://brandmark-backend.onrender.com/api';
```

**File: digital-marketing-course.html**
```javascript
const API_BASE_URL = 'https://brandmark-backend.onrender.com/api';
```

**File: quiz.html** (if making API calls)
```javascript
const API_BASE_URL = 'https://brandmark-backend.onrender.com/api';
```

### Step 3.2: Update Frontend Server Configuration

Update `server.js` if needed:
```javascript
app.listen(3000, '0.0.0.0', () => {
    console.log('Frontend serving on http://localhost:3000');
});
```

---

## Phase 4: Deploy Frontend to GitHub Pages OR Render

### Option A: GitHub Pages (Recommended for Static Files)

1. **Go to Repository Settings**
   - URL: https://github.com/YOUR_USERNAME/BrandMark/settings

2. **Click "Pages"** (left sidebar)

3. **Select Source:**
   - Branch: `main`
   - Folder: `/ (root)`
   - Click "Save"

4. **Your site publishes at:**
   ```
   https://YOUR_USERNAME.github.io/BrandMark
   ```

**Then set custom domain:**
1. Buy domain (if not already purchased)
2. In GitHub Pages settings, set custom domain: `brandmarksolutions.site`
3. Configure DNS with your registrar

---

### Option B: Render.com (Frontend Service)

1. **Create Static Site on Render**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Build Command: `npm run build` (or leave empty)
   - Publish directory: `/`

2. **Add Custom Domain**
   - In service settings
   - Add domain: `brandmarksolutions.site`

---

## Phase 5: Configure Production Environment

### Step 5.1: MongoDB Atlas Setup

1. **Create Cluster**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free tier cluster
   - Create database: `brandmark`

2. **Create Collections** (automatically created on first write)
   ```
   - enrollments
   - courses
   - users
   - quizzes
   - certificates
   ```

3. **Get Connection String**
   - Click "Connect" → "Drivers"
   - Copy connection string
   - Replace username/password
   - Add to Render environment variables

### Step 5.2: Razorpay Production Setup

1. **Switch to Live Mode**
   - Log in to https://dashboard.razorpay.com
   - Settings → API Keys
   - Copy Live Keys (not test keys)
   - Add to environment variables

### Step 5.3: Email Configuration

1. **Gmail App Password**
   - https://myaccount.google.com/apppasswords
   - Generate new app password
   - Use in EMAIL_PASSWORD variable

---

## Phase 6: Update CORS and Settings

### Step 6.1: Update Backend CORS

**File: backend/server.js**

Update allowed origins:
```javascript
const allowedOrigins = [
    'https://brandmarksolutions.site',
    'https://www.brandmarksolutions.site',
    'http://localhost:5500'  // Keep for local testing
];
```

### Step 6.2: Update .env Files

**backend/.env** (Production):
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/brandmark
JWT_SECRET=your-secret-key-min-32-chars
RAZORPAY_KEY_ID=rzp_live_SdXeFmb44CZY37
RAZORPAY_KEY_SECRET=79Mkzv3vXIm3xA084O4aAzI0
EMAIL_USER=info.aimservicesprivatelimited@gmail.com
EMAIL_PASSWORD=@Rahul3031@
GEMINI_API_KEY=your-gemini-key
FRONTEND_URL=https://brandmarksolutions.site
PORT=10000
```

---

## Phase 7: Deploy & Test

### Step 7.1: Push Updated Code to GitHub

```powershell
git add .
git commit -m "Update API URLs for production deployment"
git push origin main
```

**Render auto-redeploys:**
- Backend redeploys automatically (watch at https://dashboard.render.com)
- Frontend updates (if using GitHub Pages or Render)

### Step 7.2: Test Live Website

#### Test 1: Check Homepage
```
Visit: https://brandmarksolutions.site
Should load without errors
```

#### Test 2: Browse Courses
```
Visit: https://brandmarksolutions.site/courses.html
Should show:
- Digital Marketing course card
- "Enroll Now (₹49)" button
- Course details
```

#### Test 3: Test Payment Flow
```
1. Click "Enroll Now" button
2. Enter email: test@example.com
3. Check console (F12) for API call:
   POST https://brandmark-backend.onrender.com/api/courses/digital-marketing-001/order
4. Razorpay modal should open
5. Click "Test Payment"
6. Complete test payment
```

#### Test 4: Access Course Module
```
Visit: https://brandmarksolutions.site/digital-marketing-course.html
Should show:
- Course overview
- Module curriculum
- "Mark as Complete" button
```

#### Test 5: Take Quiz
```
Visit: https://brandmarksolutions.site/quiz.html
Should show:
- 15 questions
- Score calculation
- Certificate generation (if passing)
```

#### Test 6: Verify Certificate
```
Visit: https://brandmarksolutions.site/verify-certificate.html
Enter: CERT-C1E89F4D6E68
Should show:
- Certificate details
- QR code
- Share buttons
- Valid ✓ status
```

---

## Phase 8: Production Monitoring

### Monitor Backend

**Check Render Dashboard:**
```
https://dashboard.render.com → brandmark-backend
```

**Monitor logs:**
```
Click "Logs" tab
Should see:
✅ MongoDB Connected
✅ BrandMark API is running
```

**Test API health:**
```
GET https://brandmark-backend.onrender.com/api/health
Response:
{
  "status": "OK",
  "message": "BrandMark API is running",
  "timestamp": "2026-04-15T10:30:00.000Z"
}
```

### Monitor Certificate Emails

1. **Test email sending:**
   - Complete a course quiz with passing score
   - Check inbox for certificate email

2. **Email security:**
   - Verify "From" address shows correctly
   - Check email formatting
   - Verify QR code link works

### Monitor Payments

1. **Check Razorpay Dashboard:**
   - https://dashboard.razorpay.com
   - Live Payments tab
   - Verify transactions

2. **Monitor enrollment records:**
   - Check MongoDB Atlas
   - See enrollments collection
   - Verify student records

---

## 🎯 Complete Deployment Checklist

### Pre-Deployment
- ✅ All HTML files have production API URLs
- ✅ .env file has all required variables
- ✅ CORS settings allow production domain
- ✅ Git repository is up to date
- ✅ All code committed and pushed

### Backend Deployment
- ✅ Render service created (brandmark-backend)
- ✅ Environment variables configured
- ✅ Build successful
- ✅ API health check passes
- ✅ Database connected

### Frontend Deployment
- ✅ Frontend hosted (GitHub Pages or Render)
- ✅ Custom domain configured
- ✅ SSL certificate active
- ✅ CORS headers correct
- ✅ Assets loading

### Live Testing
- ✅ Homepage loads
- ✅ Courses page displays
- ✅ Payment flow works
- ✅ Enrollment successful
- ✅ Quiz submission works
- ✅ Certificates generated
- ✅ Email delivery confirmed

### Production
- ✅ HTTPS enabled
- ✅ Error logging configured
- ✅ Monitoring active
- ✅ Backups enabled
- ✅ Support documentation ready

---

## 📊 Production URLs

```
🌐 Frontend:        https://brandmarksolutions.site
🔗 Courses Hub:     https://brandmarksolutions.site/courses.html
📚 Course Page:     https://brandmarksolutions.site/digital-marketing-course.html
📝 Quiz:            https://brandmarksolutions.site/quiz.html
🎓 Certificates:    https://brandmarksolutions.site/verify-certificate.html

⚙️ Backend API:      https://brandmark-backend.onrender.com/api
💻 Health Check:    https://brandmark-backend.onrender.com/api/health
```

---

## 🔒 Security Checklist

### Frontend Security
- ✅ HTTPS enabled
- ✅ Content Security Policy headers
- ✅ No sensitive data in localStorage
- ✅ Input validation on all forms
- ✅ XSS protection enabled

### Backend Security
- ✅ Environment variables not exposed
- ✅ MongoDB injection prevention (mongoSanitize)
- ✅ XSS protection (xss-clean)
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Helmet security headers
- ✅ JWT token validation

### Payment Security
- ✅ Razorpay signature verification
- ✅ Only live keys in production
- ✅ No test mode on live site
- ✅ Payment amount validation
- ✅ Order verification before enrollment

### Email Security
- ✅ App-specific password used (not Gmail password)
- ✅ TLS encryption enabled
- ✅ No sensitive data in email body
- ✅ Certificate QR codes expire-able

---

## 📞 Troubleshooting

### Issue: 404 API Errors
**Solution:**
```
Check:
1. Backend URL in HTML files
2. Render service name (brandmark-backend)
3. API route prefix (/api)
4. CORS allowed origins
```

### Issue: CORS Errors
**Solution:**
```
Update backend/server.js:
const allowedOrigins = [
    'https://your-domain.com',
    'https://www.your-domain.com'
];
```

### Issue: Certificate Email Not Sending
**Solution:**
```
Check:
1. EMAIL_USER and EMAIL_PASSWORD in .env
2. Gmail 2FA enabled and app password generated
3. EmailAddress is registered in Nodemailer
4. SMTP settings in certificateGenerator.js
```

### Issue: Razorpay Modal Not Opening
**Solution:**
```
Check:
1. Razorpay script loaded: https://checkout.razorpay.com/v1/checkout.js
2. Live keys configured (not test keys)
3. Order ID returned from backend
4. Browser console for errors (F12)
```

---

## 🆘 Support & Monitoring

### Daily Checks
```
Every morning:
1. Check Render dashboard for errors
2. Monitor Razorpay transactions
3. Review enrollment metrics
4. Check email delivery logs
```

### Weekly Reviews
```
Every week:
1. Review backend logs
2. Check database growth
3. Verify email sends
4. Monitor uptime
5. Review performance metrics
```

### Monthly Maintenance
```
Every month:
1. Review and rotate secrets/keys
2. Update dependencies
3. Run security checks
4. Backup database
5. Review metrics and analytics
```

---

## ✅ Deployment Complete!

Your BrandMark Course Platform is now live on:
- **https://brandmarksolutions.site**

Students can now:
✅ Browse courses
✅ Enroll with real payments (₹49)
✅ Access course materials
✅ Complete quizzes
✅ Earn and share certificates
✅ Verify credentials publicly

**Congratulations! 🎉**
