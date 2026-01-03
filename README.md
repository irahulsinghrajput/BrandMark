# BrandMark Website - Quick Start Guide

## 🚀 Starting the Application

### Option 1: Double-click the batch file
Simply double-click `START-SERVERS.bat` to start both servers automatically.

### Option 2: Manual start
**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
npx http-server -p 5500 -c-1
```

## 🔗 Access URLs

- **Main Website:** http://localhost:5500
- **Admin Dashboard:** http://localhost:5500/admin-dashboard.html
- **Backend API:** http://localhost:5000

## 🔑 Admin Credentials

- **Email:** test@test.com
- **Password:** test123

## ✅ Working Features

### 1. Contact Form (index.html)
- ✅ Submit contact messages
- ✅ View submissions in admin dashboard
- ✅ Email notifications (if configured)

### 2. Career Applications
- ✅ All career pages working:
  - internphotographercareers.html
  - internUIUXcareer.html
  - internwebdesignercareers.html
  - Socialmediainterncareers.html
  - career-application-form.html
- ✅ Resume upload support
- ✅ View applications in admin dashboard

### 3. Newsletter Subscriptions
- ✅ Subscribe from any page
- ✅ Email collection and management
- ✅ View subscribers in admin dashboard

### 4. Admin Dashboard
- ✅ View all contact messages
- ✅ Manage career applications
- ✅ View newsletter subscribers
- ✅ Blog post management (UI ready)
- ✅ Secure authentication

## 🗄️ Database

**MongoDB Atlas:**
- Connected to cloud database
- Auto-saves all form submissions
- Persistent data storage

## 📝 Configuration Files

- **Backend API:** `backend/.env`
- **Frontend API URL:** 
  - `brandmark.js` (line 3)
  - `career-form.js` (line 3)
  - `brandmarkpersonalblogs.html` (line 644)

## 🔧 Troubleshooting

**"Connection error":**
- Make sure backend server is running (port 5000)
- Check if MongoDB is connected (look for ✅ in terminal)

**"Admin login fails":**
- Use credentials: test@test.com / test123
- Make sure backend is running

**"Form not submitting":**
- Check browser console (F12) for errors
- Verify API_URL is set to http://localhost:5000/api

## 📦 Production Deployment

When deploying to production, update API URLs in:
1. `brandmark.js` → Change to production backend URL
2. `career-form.js` → Change to production backend URL
3. `brandmarkpersonalblogs.html` → Change API_URL
4. `admin-dashboard.html` → Change API_URL

---

**Need help?** All systems are configured and ready to use!
