# Admin Credentials Setup Guide

## 🔒 Secure Admin Credential Management

**IMPORTANT**: Never store admin credentials in your repository!

## Current Setup

Your admin login is handled through your backend API at:
- **API**: `https://brandmark-api-2026.onrender.com/api/admin/login`
- **Dashboard**: [admin-dashboard.html](admin-dashboard.html)

## Step 1: Change Default Password

### Current Credentials (TEMPORARY - CHANGE IMMEDIATELY):
```
Email: admin@brandmarksolutions.site
Password: Admin@2025
```

### How to Change Password:

1. **Through MongoDB Atlas** (Recommended):
   - Go to https://cloud.mongodb.com
   - Navigate to your `brandmark` database
   - Find the `admins` collection
   - Locate the admin user document
   - Update the password hash (the password is hashed with bcrypt)

2. **Through Backend API** (If you have an update endpoint):
   - Create a password change endpoint in your backend
   - Use bcrypt to hash the new password
   - Update the database record

3. **Using MongoDB Compass** (GUI Tool):
   - Download MongoDB Compass: https://www.mongodb.com/products/compass
   - Connect using your connection string
   - Navigate to `brandmark` > `admins` collection
   - Edit the admin document directly

## Step 2: Secure Password Storage

### ✅ DO:
- Use strong passwords (12+ characters, mixed case, numbers, symbols)
- Store passwords hashed with bcrypt (already implemented in backend)
- Use environment variables for sensitive data
- Keep credentials in password managers (1Password, LastPass, Bitwarden)
- Use different passwords for different environments (dev, staging, production)

### ❌ DON'T:
- Store plain text passwords in files
- Commit credential files to Git
- Share passwords via email or chat
- Use simple/common passwords
- Reuse passwords across services

## Step 3: Environment Variable Setup

For local development, create a `.env` file in the backend folder:

```bash
# backend/.env (NEVER commit this file!)
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5000
NODE_ENV=production
```

This file is already in `.gitignore` and won't be committed.

## Step 4: Admin Password Reset Process

If you forget your admin password:

1. **Option A - Direct Database Update**:
   ```javascript
   // Run this in MongoDB Shell or Compass
   const bcrypt = require('bcrypt');
   const newPassword = 'YourNewStrongPassword123!';
   const hashedPassword = await bcrypt.hash(newPassword, 10);
   
   db.admins.updateOne(
     { email: 'admin@brandmarksolutions.site' },
     { $set: { password: hashedPassword } }
   );
   ```

2. **Option B - Backend Script**:
   Create a one-time script in your backend folder:
   ```javascript
   // backend/reset-admin-password.js
   const mongoose = require('mongoose');
   const bcrypt = require('bcrypt');
   const Admin = require('./models/Admin');
   
   async function resetPassword() {
     await mongoose.connect(process.env.MONGODB_URI);
     const newPassword = 'YourNewPassword123!';
     const hashedPassword = await bcrypt.hash(newPassword, 10);
     
     await Admin.updateOne(
       { email: 'admin@brandmarksolutions.site' },
       { password: hashedPassword }
     );
     
     console.log('Password reset successful!');
     process.exit(0);
   }
   
   resetPassword();
   ```

   Run: `cd backend && node reset-admin-password.js`

## Step 5: Multi-Admin Setup (Optional)

To add more admins:

1. Send a POST request to `/api/admin/register` with:
   ```json
   {
     "email": "newadmin@brandmarksolutions.site",
     "password": "StrongPassword123!",
     "name": "Admin Name"
   }
   ```

2. Or create a registration script:
   ```javascript
   // backend/create-admin.js
   const mongoose = require('mongoose');
   const bcrypt = require('bcrypt');
   const Admin = require('./models/Admin');
   
   async function createAdmin() {
     await mongoose.connect(process.env.MONGODB_URI);
     
     const admin = new Admin({
       email: 'newadmin@brandmarksolutions.site',
       password: await bcrypt.hash('StrongPassword123!', 10),
       name: 'New Admin Name'
     });
     
     await admin.save();
     console.log('Admin created successfully!');
     process.exit(0);
   }
   
   createAdmin();
   ```

## Security Best Practices

### 1. **Password Requirements**:
- Minimum 8 characters (recommend 12+)
- Mix of uppercase and lowercase
- Include numbers and special characters
- Not based on dictionary words
- Unique to this application

### 2. **JWT Secret**:
Your JWT_SECRET in Render.com should be:
- At least 32 characters long
- Random string (use password generator)
- Never shared or committed to Git
- Different from your admin password

### 3. **Two-Factor Authentication** (Future Enhancement):
Consider adding 2FA using:
- Google Authenticator
- Email OTP
- SMS verification

### 4. **Session Management**:
- Tokens expire after 24 hours (configured in backend)
- Clear localStorage on logout
- Don't store sensitive data in browser storage

## Emergency Access

If completely locked out:

1. Access your Render.com dashboard
2. Navigate to your backend service
3. Open Shell tab
4. Run MongoDB commands directly through Render's shell
5. Reset password using bcrypt hash

## Quick Reference

| Item | Location | Security Level |
|------|----------|----------------|
| Admin Dashboard | `admin-dashboard.html` | Public (login required) |
| Login API | `/api/admin/login` | Public endpoint |
| Admin Database | MongoDB Atlas | Encrypted at rest |
| JWT Tokens | Browser localStorage | Expire in 24h |
| Backend Logs | Render.com Logs | Private |

---

## 🚨 IMPORTANT REMINDERS

1. ✅ Changed default password from `Admin@2025`
2. ✅ Removed `register-admin.json` from Git
3. ✅ Added to `.gitignore`
4. ✅ Store new password in password manager
5. ⚠️ **CHANGE PASSWORD NOW** before any production use!

---

**Last Updated**: January 10, 2026  
**Contact**: If you have security concerns, contact your backend administrator immediately.
