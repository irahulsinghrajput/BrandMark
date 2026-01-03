# Frontend-Backend Integration Guide

## ✅ Completed Integrations

### 1. Contact Form (index.html)
- **Location**: [index.html](index.html) (Lines 195-214)
- **API Endpoint**: `POST http://localhost:5001/api/contact`
- **JavaScript**: [brandmark.js](brandmark.js) - Contact form handler
- **Fields**: name, email, phone, subject, message
- **Response**: Success message + email notifications sent

### 2. Newsletter Subscription (brandmarkpersonalblogs.html)
- **Location**: [brandmarkpersonalblogs.html](brandmarkpersonalblogs.html) (Line 600)
- **API Endpoint**: `POST http://localhost:5001/api/newsletter`
- **JavaScript**: [brandmark.js](brandmark.js) - Newsletter handler
- **Fields**: email
- **Response**: Success message + welcome email sent

### 3. Career Application Form (internphotographercareers.html)
- **Location**: [internphotographercareers.html](internphotographercareers.html)
- **API Endpoint**: `POST http://localhost:5001/api/careers`
- **JavaScript**: [career-form.js](career-form.js)
- **Fields**: position, name, email, phone, experience, coverLetter, resume (file), portfolio (file)
- **Response**: Success message + email with attachments sent
- **Note**: Handles multipart/form-data for file uploads (max 5MB)

---

## 📋 Next Steps to Complete Integration

### Step 1: Add Career Forms to Remaining Pages
Copy the application form from [internphotographercareers.html](internphotographercareers.html) to:
- [ ] [internUIUXcareer.html](internUIUXcareer.html) - Change position to "Intern UI/UX Designer"
- [ ] [internwebdesignercareers.html](internwebdesignercareers.html) - Change position to "Intern Web Designer"
- [ ] [Socialmediainterncareers.html](Socialmediainterncareers.html) - Change position to "Social Media Intern"

**What to copy**:
1. The entire `<section class="application-section">` HTML block
2. The CSS styles for `.application-section` and form elements
3. The `<script src="career-form.js"></script>` line before `</body>`

**What to change**: Update the hidden input value:
```html
<input type="hidden" name="position" value="[POSITION NAME]">
```

### Step 2: Test All Forms Locally

#### Test Contact Form:
1. Open [index.html](index.html) in browser
2. Fill contact form and submit
3. Verify success message appears
4. Check backend terminal for MongoDB entry
5. Check email (info.aimservicesprivatelimited@gmail.com) for notification

#### Test Newsletter Form:
1. Open [brandmarkpersonalblogs.html](brandmarkpersonalblogs.html)
2. Enter email and submit
3. Verify success alert
4. Check email for welcome message

#### Test Career Form:
1. Open [internphotographercareers.html](internphotographercareers.html)
2. Fill all fields and upload resume
3. Verify success message
4. Check `backend/uploads/` folder for uploaded files
5. Check email for application notification with attachments

### Step 3: Register Admin User

**Using PowerShell**:
```powershell
$body = @{
    email = "admin@brandmarksolutions.site"
    password = "Admin@2025"
    name = "BrandMark Admin"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5001/api/admin/register" -Method POST -Body $body -ContentType "application/json"
```

**Or using Postman**:
- POST to `http://localhost:5001/api/admin/register`
- Body (JSON):
```json
{
  "email": "admin@brandmarksolutions.site",
  "password": "Admin@2025",
  "name": "BrandMark Admin"
}
```

### Step 4: Test Admin Login

```powershell
$body = @{
    email = "admin@brandmarksolutions.site"
    password = "Admin@2025"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5001/api/admin/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"
```

Save the token for authenticated requests.

### Step 5: View Dashboard Data

**Using saved token**:
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5001/api/admin/dashboard" -Method GET -Headers $headers
```

This returns:
- Total contacts
- Total career applications
- Total newsletter subscribers
- Recent contacts (last 5)
- Recent applications (last 5)

---

## 🔧 Backend API Reference

### Public Endpoints (No Auth Required)

#### Contact Form
```
POST /api/contact
Body: {
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string
}
```

#### Newsletter Signup
```
POST /api/newsletter
Body: {
  email: string
}
```

#### Newsletter Unsubscribe
```
DELETE /api/newsletter/:email
```

#### Career Application
```
POST /api/careers
Content-Type: multipart/form-data
Body: {
  position: string,
  name: string,
  email: string,
  phone: string,
  experience: string (optional),
  coverLetter: string (optional),
  resume: file (required, max 5MB),
  portfolio: file (optional, max 5MB)
}
```

### Protected Endpoints (Require JWT Token)

#### Get All Contacts
```
GET /api/contact
Headers: { Authorization: "Bearer <token>" }
```

#### Update Contact Status
```
PATCH /api/contact/:id/status
Headers: { Authorization: "Bearer <token>" }
Body: { status: "read" | "replied" | "archived" }
```

#### Get All Career Applications
```
GET /api/careers
Headers: { Authorization: "Bearer <token>" }
```

#### Update Application Status
```
PATCH /api/careers/:id/status
Headers: { Authorization: "Bearer <token>" }
Body: { status: "reviewing" | "shortlisted" | "rejected" | "hired" }
```

#### Get Dashboard Stats
```
GET /api/admin/dashboard
Headers: { Authorization: "Bearer <token>" }
```

---

## 🚀 Production Deployment Checklist

### Before Deploying:

1. **Update Environment Variables**:
   - Change `NODE_ENV` to `production` in `.env`
   - Update `FRONTEND_URL` to `https://brandmarksolutions.site`
   - Generate strong `JWT_SECRET` (use random string generator)

2. **Update Frontend API URL**:
   - In [brandmark.js](brandmark.js): Change `API_URL` to production backend URL
   - In [career-form.js](career-form.js): Change `API_URL` to production backend URL

3. **Test Everything Locally First**:
   - All forms submit successfully
   - Emails are received
   - Files upload correctly
   - Admin login works

### Recommended Hosting:

**Backend**: 
- Render.com (Free tier available)
- Railway.app (Free tier available)
- Vercel (Serverless functions)

**Frontend**: 
- Already on GitHub Pages at brandmarksolutions.site

### Deploy Backend to Render.com:

1. Create account on render.com
2. Connect GitHub repository (backend folder)
3. Create new Web Service
4. Set environment variables from `.env`
5. Deploy
6. Get production URL (e.g., `https://brandmark-api.onrender.com`)
7. Update `API_URL` in frontend JavaScript files

---

## 📧 Email Configuration

**Current Setup**:
- SMTP: Gmail (smtp.gmail.com:587)
- Email: info.aimservicesprivatelimited@gmail.com
- App Password: vbzxyxpsmohjgbjj

**Email Templates** ([backend/config/email.js](backend/config/email.js)):
- `sendContactEmail()` - Notification when contact form submitted
- `sendContactAutoReply()` - Auto-reply to user who submitted contact form
- `sendCareerEmail()` - Notification with resume/portfolio attachments
- `sendNewsletterWelcome()` - Welcome email for new subscribers

---

## 🗄️ Database Schema

**MongoDB Atlas**: cluster0.90ocq4y.mongodb.net/brandmark

### Collections:

1. **contacts**
   - name, email, phone, subject, message
   - status: new | read | replied | archived
   - createdAt

2. **careers**
   - position, name, email, phone, experience, coverLetter
   - resume, portfolio (file paths)
   - status: new | reviewing | shortlisted | rejected | hired
   - createdAt

3. **newsletters**
   - email (unique)
   - isActive: boolean
   - subscribedAt, unsubscribedAt

4. **admins**
   - email (unique), password (hashed)
   - name, role: admin | superadmin
   - lastLogin

---

## 🐛 Troubleshooting

### Form Not Submitting
- Check browser console for errors
- Verify backend server is running (port 5001)
- Check network tab for API response
- Ensure CORS is configured correctly

### Files Not Uploading
- Check file size (max 5MB)
- Verify file type is accepted
- Check backend uploads/ directory exists
- Review Multer middleware configuration

### Emails Not Sending
- Verify Gmail app password is correct
- Check spam/junk folder
- Review backend logs for email errors
- Ensure 2-Step Verification is enabled on Gmail

### Database Connection Issues
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
- Verify connection string is URL-encoded
- Check database user permissions
- Review MongoDB Atlas cluster status

---

## ✅ Current Status

- ✅ Backend API fully functional (Node.js + Express)
- ✅ MongoDB Atlas connected
- ✅ Gmail email service configured
- ✅ Contact form integrated
- ✅ Newsletter form integrated
- ✅ Career application form created (Photographer page)
- ⚠️ Career forms pending for 3 other job pages
- ⏳ Admin registration pending
- ⏳ Production deployment pending

---

**Last Updated**: December 2025
**Server**: http://localhost:5001
**Frontend**: brandmarksolutions.site
