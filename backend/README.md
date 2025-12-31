# BrandMark Solutions Backend API

Complete backend API for brandmarksolutions.site with contact forms, career applications, newsletter, blog CMS, and admin dashboard.

## Features

- ✅ Contact Form Processing with email notifications
- ✅ Career Applications with file uploads (resume/portfolio)
- ✅ Newsletter Subscription management
- ✅ Blog CMS with full CRUD operations
- ✅ Admin Dashboard with authentication (JWT)
- ✅ Email notifications (Nodemailer)
- ✅ File upload handling (Multer)
- ✅ MongoDB database (Mongoose)
- ✅ Input validation & error handling
- ✅ Security features (Helmet, CORS, Rate Limiting)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Update `.env` with your credentials:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/brandmark
JWT_SECRET=your_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=info.aimservicesprivatelimited@gmail.com
FRONTEND_URL=https://brandmarksolutions.site
```

### 3. Setup MongoDB

**Option A: Local MongoDB**
- Install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Create free account at https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Update `MONGODB_URI` in `.env`

### 4. Setup Email (Gmail Example)

1. Go to Google Account settings
2. Enable 2-Step Verification
3. Generate App Password (Security → 2-Step Verification → App passwords)
4. Use app password in `.env` as `EMAIL_PASSWORD`

### 5. Create Uploads Directory

```bash
mkdir uploads
```

### 6. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Admin)
- `PATCH /api/contact/:id/status` - Update status (Admin)

### Career Applications
- `POST /api/careers` - Submit application (with file upload)
- `GET /api/careers` - Get all applications (Admin)
- `PATCH /api/careers/:id/status` - Update status (Admin)

### Newsletter
- `POST /api/newsletter` - Subscribe
- `GET /api/newsletter` - Get subscribers (Admin)
- `DELETE /api/newsletter/:email` - Unsubscribe

### Blog
- `GET /api/blog` - Get published posts
- `GET /api/blog/:slug` - Get single post
- `POST /api/blog` - Create post (Admin)
- `PUT /api/blog/:id` - Update post (Admin)
- `DELETE /api/blog/:id` - Delete post (Admin)
- `GET /api/blog/admin/all` - Get all posts (Admin)

### Admin
- `POST /api/admin/register` - Register admin
- `POST /api/admin/login` - Login
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/me` - Current admin profile

## First Time Setup

### 1. Register First Admin

```bash
POST http://localhost:5000/api/admin/register
Content-Type: application/json

{
  "email": "admin@brandmarksolutions.site",
  "password": "your-secure-password",
  "name": "Admin Name"
}
```

### 2. Login to Get Token

```bash
POST http://localhost:5000/api/admin/login
Content-Type: application/json

{
  "email": "admin@brandmarksolutions.site",
  "password": "your-secure-password"
}
```

Save the returned token for authenticated requests.

### 3. Use Token for Admin Routes

```bash
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer YOUR_TOKEN_HERE
```

## Frontend Integration

Update your frontend forms to POST to these endpoints:

### Contact Form Example

```javascript
const handleContactSubmit = async (formData) => {
    try {
        const response = await fetch('https://your-backend-url.com/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data.success) {
            alert('Message sent successfully!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
```

### Career Application with File Upload

```javascript
const handleCareerSubmit = async (formData, files) => {
    const data = new FormData();
    data.append('position', formData.position);
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('resume', files.resume);
    
    try {
        const response = await fetch('https://your-backend-url.com/api/careers', {
            method: 'POST',
            body: data
        });
        const result = await response.json();
        if (result.success) {
            alert('Application submitted!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
```

## Deployment

### Deploy to Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect your GitHub repo
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add environment variables from `.env`

### Deploy to Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy automatically

### Deploy to Vercel (Serverless)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Add environment variables in Vercel dashboard

## Database Models

- **Contact**: name, email, phone, subject, message, status
- **Career**: position, name, email, phone, experience, resume, portfolio, status
- **Newsletter**: email, isActive, subscribedAt
- **Blog**: title, slug, author, excerpt, content, category, tags, published
- **Admin**: email, password, name, role

## Security Features

- JWT authentication for admin routes
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Helmet for HTTP headers security
- Input validation with express-validator
- File upload restrictions (type & size)

## Testing

Test API with Postman or Thunder Client:
1. Import endpoints
2. Test public routes (contact, careers, newsletter)
3. Register admin
4. Login to get token
5. Test protected routes with Authorization header

## Support

For issues or questions, contact the development team.
