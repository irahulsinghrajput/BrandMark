# UptimeRobot Setup Guide - Keep Your Backend Alive 24/7

## 🎯 What is UptimeRobot?

UptimeRobot is a FREE service that:
- ✅ Pings your website every 5 minutes
- ✅ Keeps Render free tier from sleeping
- ✅ Monitors if your site goes down
- ✅ Sends alerts when site is offline
- ✅ 100% FREE for 50 monitors

---

## 📋 Setup Steps (5 Minutes)

### Step 1: Create Free Account
👉 Go to: https://uptimerobot.com/signUp

**Choose:**
- Sign up with Google (fastest)
- Or use email

### Step 2: Verify Email
- Check your email inbox
- Click verification link
- Log in to dashboard

### Step 3: Add New Monitor
1. Click **"+ Add New Monitor"** button (orange button, top left)

2. Fill in these details:

```
Monitor Type: HTTP(s)

Friendly Name: BrandMark Backend API

URL: https://brandmark-api-2026.onrender.com/api/health

Monitoring Interval: Every 5 minutes (FREE tier)

Alert Contacts: Your email (auto-added)
```

3. Click **"Create Monitor"**

### Step 4: Verify Setup
✅ Monitor should show "Up" status
✅ Response time displayed (usually 200-500ms)
✅ Uptime percentage starts tracking

---

## ✅ That's It!

Your backend will now:
- ✅ Stay awake 24/7 (no more cold starts)
- ✅ Be checked every 5 minutes
- ✅ Alert you if it goes down
- ✅ Track uptime statistics

---

## 📊 What You'll See:

**Dashboard shows:**
- Current status (Up/Down)
- Response time
- Uptime percentage
- Total uptime/downtime

**You'll get emails when:**
- ⚠️ Site goes down
- ✅ Site comes back up

---

## 🎁 Bonus: Add Frontend Monitor Too

You can also monitor your main website:

```
Monitor Type: HTTP(s)
Friendly Name: BrandMark Website
URL: https://brandmarksolutions.site
Interval: Every 5 minutes
```

This gives you uptime stats for both frontend and backend!

---

## 💡 Pro Tips:

1. **Free tier includes:**
   - 50 monitors
   - 5-minute intervals
   - Email alerts
   - Mobile app access

2. **Reduce Cold Starts:**
   - UptimeRobot keeps Render awake
   - First load always fast for users
   - No more 30-second waits

3. **Monitor Dashboard:**
   - View stats anytime
   - Share public status page
   - Export reports

---

## 🔗 Quick Links:

**Sign Up:** https://uptimerobot.com/signUp
**Dashboard:** https://uptimerobot.com/dashboard
**Mobile App:** Available on iOS and Android

---

## ⚙️ Your Monitor Details:

```
Backend Monitor:
- URL: https://brandmark-api-2026.onrender.com/api/health
- Type: HTTP(s)
- Interval: 5 minutes
- Expected Response: 200 OK

Frontend Monitor (Optional):
- URL: https://brandmarksolutions.site
- Type: HTTP(s)  
- Interval: 5 minutes
- Expected Response: 200 OK
```

---

## 📧 Email Alerts:

When site goes down, you'll receive:
- Subject: "[Down] BrandMark Backend API"
- Details: Error code, time, duration
- You can reply to pause alerts

When site recovers:
- Subject: "[Up] BrandMark Backend API"
- Details: Downtime duration, recovered time

---

## 🎉 Benefits:

**Before UptimeRobot:**
- ❌ Backend sleeps after 15 min
- ❌ First request = 30-50 sec wait
- ❌ Bad user experience

**After UptimeRobot:**
- ✅ Backend always awake
- ✅ All requests fast (~200ms)
- ✅ Professional experience
- ✅ Uptime monitoring
- ✅ Free forever!

---

**Ready? Click the sign-up link above and add your monitor! 🚀**
