# Admin Management Scripts

This folder contains secure scripts for managing admin users in your BrandMark application.

## 📋 Available Scripts

### 1. **reset-admin-password.js** - Change Admin Password
Reset or change the password for an existing admin account.

**Usage:**
```bash
cd backend
node reset-admin-password.js
```

**What it does:**
- Prompts for admin email address
- Validates admin exists in database
- Asks for new password (hidden input with asterisks)
- Validates password strength (8+ chars, mixed case, numbers, symbols)
- Confirms password matches
- Hashes password with bcrypt (10 rounds)
- Updates database securely

**When to use:**
- Forgot your admin password
- Want to change password for security
- Need to reset compromised credentials

---

### 2. **create-admin.js** - Create New Admin User
Add a new administrator to your BrandMark dashboard.

**Usage:**
```bash
cd backend
node create-admin.js
```

**What it does:**
- Prompts for full name
- Asks for email address (validates format)
- Checks if email already exists
- Requests password (hidden input)
- Validates password strength
- Confirms password matches
- Creates new admin with hashed password

**When to use:**
- Adding team members with admin access
- Creating backup admin accounts
- Onboarding new administrators

---

## 🔒 Security Features

Both scripts include:
- ✅ **Password masking** (shows asterisks during input)
- ✅ **Bcrypt hashing** (10 rounds, industry standard)
- ✅ **Password strength validation**
- ✅ **Secure database connections**
- ✅ **Error handling** with helpful messages
- ✅ **No plain text password storage**

## 📝 Password Requirements

Your password must contain:
- ✅ Minimum 8 characters (12+ recommended)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one number (0-9)
- ✅ At least one special character (!@#$%^&*)

**Good password examples:**
- `BrandMark2026!`
- `Admin@Secure#123`
- `MyStr0ng!Pass`

**Bad passwords:**
- `password` (too simple)
- `12345678` (no letters)
- `admin` (too short)

---

## 🚀 Prerequisites

Before running scripts, ensure:

1. **Dependencies installed:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment variables set** in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://your-connection-string
   ```

3. **MongoDB Atlas accessible** (check IP whitelist)

---

## 📖 Step-by-Step Usage

### Changing Your Password

1. Open terminal/command prompt
2. Navigate to backend folder:
   ```bash
   cd C:\Users\djmun\OneDrive\Desktop\BrandMark\backend
   ```
3. Run the reset script:
   ```bash
   node reset-admin-password.js
   ```
4. Follow the prompts:
   ```
   👤 Enter admin email address: admin@brandmarksolutions.site
   🔐 Enter new password: ************
   🔐 Confirm new password: ************
   ✅ PASSWORD RESET SUCCESSFUL!
   ```
5. Log out and log back in with new password

### Creating New Admin

1. Open terminal/command prompt
2. Navigate to backend folder:
   ```bash
   cd C:\Users\djmun\OneDrive\Desktop\BrandMark\backend
   ```
3. Run the create script:
   ```bash
   node create-admin.js
   ```
4. Provide details:
   ```
   📝 Enter admin full name: John Doe
   📧 Enter admin email address: john@brandmarksolutions.site
   🔐 Enter password: ************
   🔐 Confirm password: ************
   ✅ ADMIN USER CREATED SUCCESSFULLY!
   ```

---

## ⚠️ Troubleshooting

### Error: "Cannot find module 'mongoose'"
**Solution:** Install dependencies
```bash
cd backend
npm install
```

### Error: "MONGODB_URI is not defined"
**Solution:** Create `.env` file in backend folder with your MongoDB connection string

### Error: "Admin with email not found"
**Solution:** 
- Check email spelling
- Verify admin exists in database
- Use `create-admin.js` to create new admin

### Error: "Admin with this email already exists"
**Solution:** Use `reset-admin-password.js` instead to change their password

### Error: "Connection timeout"
**Solution:**
- Check internet connection
- Verify MongoDB Atlas cluster is running
- Ensure IP address is whitelisted in MongoDB Atlas
- Check if connection string is correct

---

## 🔐 Best Practices

1. **Never commit credentials:**
   - Don't save passwords in files
   - Don't share passwords via email/chat
   - Use password managers

2. **Change default passwords immediately:**
   - Run `reset-admin-password.js` on first deployment
   - Use strong, unique passwords

3. **Limit admin access:**
   - Only create admin accounts for trusted users
   - Remove admin access when no longer needed

4. **Regular password updates:**
   - Change passwords every 90 days
   - Change immediately if compromised

5. **Secure your environment:**
   - Keep `.env` file private
   - Never commit `.env` to Git
   - Use different passwords for dev/prod

---

## 📞 Support

If you encounter issues:
1. Check the error message carefully
2. Review this README
3. Check [ADMIN_SETUP.md](../ADMIN_SETUP.md) for more details
4. Verify MongoDB connection in Render.com dashboard

---

**Last Updated:** January 10, 2026  
**Version:** 1.0.0
