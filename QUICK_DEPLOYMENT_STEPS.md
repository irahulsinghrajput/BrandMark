# 🚀 Quick Deployment Steps - BrandMark Course Platform

## What's Updated ✅
Your frontend files now support both local and production environments:
- ✅ **courses.html** - Environment-aware API URL
- ✅ **digital-marketing-course.html** - Environment-aware API URL  
- ✅ **quiz.html** - Relative API paths (auto-works on any domain)
- ✅ **course-module-1/2/3.html** - Relative API paths (auto-works on any domain)

**How it works:**
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://brandmark-backend.onrender.com/api';
```

When you open the site:
- **Locally:** Uses `http://localhost:5000/api` (your development server)
- **On production:** Uses `https://brandmark-backend.onrender.com/api` (live server)

---

## Deployment Checklist

### ✅ DONE (Already Complete)
- Frontend files updated with production API URLs
- LIVE_DEPLOYMENT_GUIDE.md created with full instructions
- Razorpay live keys configured
- Email system configured and tested
- Backend code ready for Render deployment
- Database models and routes complete

### ⏳ TODO (Next Steps in Order)

#### Step 1: Push code to GitHub (5 minutes)
```powershell
cd c:\Users\djmun\OneDrive\Desktop\BrandMark
git add .
git commit -m "Production deployment: environment-aware API URLs and deployment guide"
git push origin main
```

#### Step 2: Deploy Backend to Render (10 minutes)
See **LIVE_DEPLOYMENT_GUIDE.md → Phase 2: Deploy Backend to Render.com**

Actions:
1. Create Render account (if needed)
2. Connect GitHub repository
3. Create Web Service for backend
4. Configure environment variables (6 required)
5. Deploy

#### Step 3: Get Your Backend URL
After Render deploys, you'll get:
```
🔗 https://brandmark-backend.onrender.com
```

#### Step 4: Deploy Frontend (Choose One Option)
**Option A: GitHub Pages** (Free, Simple)
- Go to GitHub repo settings
- Enable Pages
- Set custom domain: brandmarksolutions.site
- Configure DNS with registrar

**Option B: Render Static Site** (Free, Integrated)
- Create static site on Render
- Connect same GitHub repo
- Add custom domain

#### Step 5: Test on Live Site
```
Visit: https://brandmarksolutions.site/courses.html
Click: "Enroll Now (₹49)"
Should see: Razorpay payment modal
```

---

## Files to Commit to GitHub

```
✅ All HTML files (updated API URLs)
✅ backend/ directory (Node.js server)
✅ brandmark.js, brandmark.css (styling)
✅ render.yaml (deployment config)
✅ LIVE_DEPLOYMENT_GUIDE.md (deployment docs)
✅ README.md
✅ Other existing content

❌ DO NOT COMMIT:
- backend/.env (secrets)
- node_modules/ (install on server)
- .git/ (already exists)
```

---

## Environment Variables Needed on Render

Add these in Render Dashboard → Environment:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/brandmark
JWT_SECRET = your-super-secret-key-32-chars-min
RAZORPAY_KEY_ID = rzp_live_SdXeFmb44CZY37
RAZORPAY_KEY_SECRET = 79Mkzv3vXIm3xA084O4aAzI0
EMAIL_USER = info.aimservicesprivatelimited@gmail.com
EMAIL_PASSWORD = @Rahul3031@
GEMINI_API_KEY = (your-gemini-key if using)
FRONTEND_URL = https://brandmarksolutions.site
NODE_ENV = production
```

---

## Estimated Timeline

| Step | Task | Time | Status |
|------|------|------|--------|
| 1 | Push to GitHub | 5 min | ⏳ TODO |
| 2 | Create Render account | 5 min | ⏳ TODO |
| 3 | Deploy backend | 10 min | ⏳ TODO |
| 4 | Get backend URL | 1 min | ⏳ TODO |
| 5 | Deploy frontend | 5 min | ⏳ TODO |
| 6 | Configure domain | 10 min | ⏳ TODO |
| 7 | Test live site | 5 min | ⏳ TODO |
| **TOTAL** | **Full deployment** | **~45 min** | ⏳ TODO |

---

## Support Links

📖 **Full deployment guide:** LIVE_DEPLOYMENT_GUIDE.md
🔐 **Create MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
🚀 **Create Render account:** https://render.com
💻 **GitHub:** https://github.com

---

## 🎯 After Deployment

**You can:**
✅ Accept real student enrollments (₹49 per course)
✅ Process real Razorpay payments
✅ Generate certificates with QR codes
✅ Email certificates to students
✅ Track quiz scores and progress
✅ Verify student credentials publicly

**Students can:**
✅ Explore courses on brandmarksolutions.site
✅ Enroll with payment
✅ Access course modules
✅ Complete quizzes
✅ Download certificates
✅ Share on social media
✅ Use QR code for credential verification

---

## 💡 Pro Tips

1. **Test locally first**: Before going live, test on localhost:5500
2. **Monitor logs**: Check Render dashboard daily for errors
3. **Monitor payments**: Review Razorpay dashboard for transactions
4. **Send test quiz**: Verify email and certificate generation
5. **Share QR code**: Test certificate verification link
6. **Backup database**: Keep MongoDB Atlas automatic backups enabled

---

## ❓ Common Questions

**Q: Can I test without deploying?**
A: Yes! Run locally: `npm start` (backend on 5000) and open courses.html in browser at localhost:5500

**Q: What if payment fails?**
A: Check Razorpay live keys and email in Render environment variables. See error logs in browser console (F12).

**Q: How do students get certificates?**
A: Auto-emailed when they pass the quiz (80% threshold). Uses Nodemailer with your Gmail account.

**Q: Can I change the course price?**
A: Yes, update amount in payment script. Change `amount: 4900` (₹49 in paise).

**Q: Is my data secure?**
A: Yes! MongoDB passwords in environment variables, Razorpay signature verification, JWT tokens for auth.

---

## Ready to Deploy?

1. Start with **Phase 1** in LIVE_DEPLOYMENT_GUIDE.md
2. Follow each step carefully
3. Share the site URL when ready!

**Let's make BrandMark live! 🎉**
