# Security Setup Instructions

Follow these steps to complete your website security setup.

---

## 1. ✅ Additional Security Packages (COMPLETED)

**Status:** ✅ DONE - Packages installed and configured

The following security packages have been added to your backend:
- **express-mongo-sanitize**: Prevents MongoDB injection attacks
- **xss-clean**: Prevents Cross-Site Scripting (XSS) attacks
- **hpp**: Prevents HTTP Parameter Pollution attacks

These are now active on your server!

---

## 2. 📧 Email Configuration for Contact Form Notifications

Your contact form currently can't send email notifications. Follow these steps to enable it:

### Step 1: Get Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Step Verification** (if not already enabled):
   - Go to Security → 2-Step Verification
   - Follow the setup process

3. **Create App Password**:
   - Go to Security → 2-Step Verification → App passwords
   - Or visit directly: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other" and enter "BrandMark Website"
   - Click **Generate**
   - **Copy the 16-character password** (example: `abcd efgh ijkl mnop`)

### Step 2: Update Local .env File

Open `backend/.env` and update these lines:

```env
EMAIL_USER=info.aimservicesprivatelimited@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

Replace `abcd efgh ijkl mnop` with your actual app password (remove spaces).

### Step 3: Update Render Environment Variables

1. Go to your Render dashboard: https://dashboard.render.com/
2. Click on your backend service: **brandmark-api-2026**
3. Go to **Environment** tab
4. Add/Update these variables:
   - `EMAIL_USER` = `info.aimservicesprivatelimited@gmail.com`
   - `EMAIL_PASS` = `your-16-char-app-password`
5. Click **Save Changes**

Your backend will automatically restart and contact form emails will work!

---

## 3. 🔐 MongoDB Password Rotation

**Current password:** `@Gangotri3031@` (needs rotation for security)

### Step 1: Change Password in MongoDB Atlas

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. Log in to your account
3. Click on your **Cluster** (Cluster0)
4. Go to **Database Access** in left sidebar
5. Find user: `brandmark_admin`
6. Click **Edit** (pencil icon)
7. Click **Edit Password**
8. Choose a **strong new password** (example: `Secure@Brand2026!`)
   - Use mix of uppercase, lowercase, numbers, special characters
   - At least 12 characters long
9. Click **Update User**

### Step 2: Update Connection String

Your new connection string format will be:
```
mongodb+srv://brandmark_admin:<NEW_PASSWORD>@cluster0.90ocq4y.mongodb.net/brandmark?retryWrites=true&w=majority&appName=Cluster0
```

**IMPORTANT:** If your password contains special characters, you need to URL encode them:
- `@` becomes `%40`
- `!` becomes `%21`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- `&` becomes `%26`

Example: If password is `Secure@Brand2026!`, encode as `Secure%40Brand2026%21`

### Step 3: Update Local .env File

Open `backend/.env` and update:

```env
MONGODB_URI=mongodb+srv://brandmark_admin:YOUR_URL_ENCODED_PASSWORD@cluster0.90ocq4y.mongodb.net/brandmark?retryWrites=true&w=majority&appName=Cluster0
```

### Step 4: Test Locally

```powershell
cd backend
node server.js
```

You should see: `✅ MongoDB Connected`

If you see an error, double-check your password encoding!

### Step 5: Update Render Environment Variables

1. Go to Render dashboard: https://dashboard.render.com/
2. Click on **brandmark-api-2026**
3. Go to **Environment** tab
4. Find `MONGODB_URI` variable
5. Click **Edit**
6. Paste your new connection string with URL-encoded password
7. Click **Save Changes**

Render will automatically restart with the new credentials!

---

## 4. 🧪 Testing After Setup

### Test Email Configuration:
1. Visit your website: https://brandmarksolutions.site
2. Fill out the contact form
3. Submit it
4. Check `info.aimservicesprivatelimited@gmail.com` inbox
5. You should receive the contact form notification!

### Test MongoDB Connection:
1. Visit admin dashboard: https://brandmarksolutions.site/admin-dashboard.html
2. Log in with: `admin@brandmarksolutions.site` / `Admin@2025`
3. If you can log in, MongoDB is working correctly!

### Test Security Packages:
Security packages run in the background automatically. They will:
- Block MongoDB injection attempts
- Sanitize any XSS attack attempts
- Prevent duplicate parameter pollution

---

## 5. ⚠️ Important Security Notes

1. **Never commit .env files** to Git (already protected by .gitignore)
2. **Keep app passwords secret** - treat them like regular passwords
3. **Rotate passwords every 3-6 months** for best security
4. **Use different passwords** for each service
5. **Enable 2FA** on all important accounts (Gmail, GitHub, MongoDB, Render)

---

## Need Help?

If you encounter any issues:
1. Check the error messages in terminal/console
2. Verify all passwords are correctly URL-encoded
3. Make sure 2-Step Verification is enabled on Gmail
4. Restart services after making changes

Your website security will be significantly improved after completing these steps! 🔒
