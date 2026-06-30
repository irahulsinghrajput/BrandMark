# BrandMark Backend Improvements - Implementation Guide

## 🚀 Recent Enhancements

### ✅ PRIORITY 1 - SECURITY FIXES (COMPLETED)

#### 1. **Razorpay Webhook Signature Validation** ✅
**Location**: `backend/utils/razorpayUtils.js` & `backend/routes/courses.js`

**What's Fixed**:
- Implements HMAC SHA256 signature verification for Razorpay webhooks
- Prevents unauthorized webhook access (man-in-the-middle attacks)
- Validates payment events before processing

**Setup Required**:
```bash
# 1. Go to Razorpay Dashboard > Settings > Webhooks
# 2. Create a new webhook with URL: https://brandmark-backend.onrender.com/api/courses/webhook/razorpay
# 3. Copy the signing secret and add to Render environment:
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

**Usage**:
```javascript
const { verifyWebhookSignature } = require('../utils/razorpayUtils');

// Automatically validated in POST /api/courses/webhook/razorpay
router.post('/webhook/razorpay', (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    if (verifyWebhookSignature(webhookBody, signature, process.env.RAZORPAY_WEBHOOK_SECRET)) {
        // Process payment
    }
});
```

---

#### 2. **Input Validation Middleware** ✅
**Location**: `backend/middleware/validation.js`

**Features**:
- Email validation with normalization
- Phone number validation (minimum 10 digits)
- Text length constraints
- URL validation for portfolio links
- Array validation for quiz answers

**Available Validators**:
- `validateContactForm` - Contact form fields
- `validateCareerApplication` - Job application data
- `validateNewsletter` - Email subscription
- `validateCourseOrder` - Course purchase
- `validateAdminLogin` - Admin authentication
- `validateQuizAnswer` - Quiz submissions

**Usage in Routes**:
```javascript
const { validateContactForm } = require('../middleware/validation');
const { asyncHandler } = require('../utils/errorHandler');

router.post('/contact', validateContactForm, asyncHandler(async (req, res) => {
    // req body is guaranteed to be valid
    // errors already caught and returned
}));
```

---

#### 3. **Enhanced Error Handling** ✅
**Location**: `backend/utils/errorHandler.js` & `backend/server.js`

**Features**:
- Centralized error handler with custom error types
- Specific handling for MongoDB, JWT, Multer errors
- Environment-aware error responses (dev vs production)
- Request logging with context
- Async route wrapper to catch unhandled rejections

**Custom Error Types**:
```javascript
const { 
    APIError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    PaymentError,
    asyncHandler
} = require('../utils/errorHandler');

// Usage in routes
router.get('/:id', asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) throw new NotFoundError('Item');
    res.json(item);
}));
```

---

#### 4. **Improved File Upload Validation** ✅
**Location**: `backend/middleware/upload.js`

**Features**:
- MIME type validation (security check)
- File extension validation
- Size limits per file type (5MB resume, 20MB portfolio, 10MB image)
- Secure filename generation (removes special chars, adds hash)
- Field-specific configurations

**Configuration**:
```javascript
const FILE_TYPES = {
    resume: {
        extensions: ['.pdf', '.doc', '.docx'],
        mimeTypes: ['application/pdf', ...],
        maxSize: 5 * 1024 * 1024
    },
    portfolio: {
        extensions: ['.pdf', '.zip', '.rar'],
        mimeTypes: ['application/pdf', ...],
        maxSize: 20 * 1024 * 1024
    }
};
```

---

### ✅ PRIORITY 2 - CODE QUALITY & TESTING (COMPLETED)

#### 5. **ESLint & Prettier Setup** ✅
**Files**:
- `backend/.eslintrc.json` - Linting rules
- `backend/.prettierrc.json` - Code formatting rules

**Commands**:
```bash
npm run lint              # Check for linting errors
npm run lint:fix        # Auto-fix linting errors
npm run format          # Format all files
npm run format:check    # Check formatting without changes
```

**Install Dependencies**:
```bash
cd backend
npm install --save-dev eslint prettier
```

---

#### 6. **Jest Testing Framework** ✅
**Files**:
- `backend/jest.config.js` - Jest configuration
- `backend/tests/setup.js` - Test environment setup
- `backend/tests/utils/razorpayUtils.test.js` - Sample test file

**Commands**:
```bash
npm test                # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Generate coverage report
```

**Install Dependencies**:
```bash
npm install --save-dev jest supertest
```

**Write Tests**:
```javascript
// tests/routes/courses.test.js
describe('Courses API', () => {
    it('should get all courses', async () => {
        const response = await request(app).get('/api/courses');
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });
});
```

---

### ✅ PRIORITY 3 - DOCUMENTATION & CONFIGURATION (COMPLETED)

#### 7. **Environment Variables Template** ✅
**File**: `backend/.env.example`

All required environment variables documented:
- Node environment & server config
- Database connection
- JWT authentication
- Razorpay payment gateway (including webhook secret)
- Email configuration
- Google Gemini API
- File upload settings
- Security & rate limiting
- CORS origins

---

#### 8. **Swagger API Documentation** ✅
**File**: `backend/config/swagger.js`

**Setup**:
```bash
npm install swagger-ui-express swagger-jsdoc
```

**Add to server.js**:
```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

**Access**: `http://localhost:5001/api-docs`

---

## 🔧 Installation Steps

### 1. Install New Dependencies
```bash
cd backend
npm install
```

This installs:
- **jest** - Testing framework
- **supertest** - API testing
- **eslint** - Code linting
- **prettier** - Code formatting
- **swagger-ui-express** & **swagger-jsdoc** - API documentation

### 2. Configure Environment Variables
```bash
# Copy template
cp .env.example .env

# Edit .env with your values:
# - Add RAZORPAY_WEBHOOK_SECRET from Razorpay dashboard
# - Verify all other credentials
```

### 3. Run Linter
```bash
npm run lint:fix        # Fix all linting errors
npm run format          # Format code
```

### 4. Write Tests
```bash
# Create test files in tests/ directory
npm test                # Run tests
npm run test:coverage   # View coverage
```

---

## 📋 Quick Reference

### Using Error Handler in Routes
```javascript
const { asyncHandler, NotFoundError, ValidationError } = require('../utils/errorHandler');
const { validateContactForm } = require('../middleware/validation');

router.post('/contact', validateContactForm, asyncHandler(async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.json({ success: true, data: contact });
    } catch (error) {
        throw new APIError('Failed to save contact', 500);
    }
}));
```

### Razorpay Webhook Flow
```
1. User clicks "Buy Course"
2. POST /api/courses/:courseId/order → Creates order, returns orderId
3. Frontend shows Razorpay modal
4. User completes payment on Razorpay
5. Razorpay sends webhook to POST /api/courses/webhook/razorpay
6. Webhook signature verified
7. Enrollment record created
8. Email confirmation sent to user
```

### File Upload Example
```javascript
const upload = require('../middleware/upload');
const { asyncHandler } = require('../utils/errorHandler');

router.post('/apply', upload.single('resume'), asyncHandler(async (req, res) => {
    // req.file contains uploaded file info
    // Validation already done by middleware
    const application = await Career.create({
        ...req.body,
        resumePath: req.file.path
    });
    res.json({ success: true, data: application });
}));
```

---

## ✅ Testing Checklist

- [ ] Run `npm run lint` - should have 0 errors
- [ ] Run `npm run format:check` - verify code formatting
- [ ] Run `npm test` - run test suite
- [ ] Test Razorpay webhook: `curl -X POST http://localhost:5001/api/courses/webhook/razorpay` with proper signature
- [ ] Test contact form validation: missing email should return 400
- [ ] Test file upload: oversized file should return error
- [ ] Check error responses: should include errorCode and timestamp

---

## 🚀 Next Steps

**Still TODO**:
- [ ] Implement JWT refresh token rotation
- [ ] Refactor 15 course modules into template system
- [ ] Build Tailwind CSS locally (remove CDN)
- [ ] Add Redis caching layer
- [ ] Implement payment webhook in other routes
- [ ] Add database query optimization
- [ ] Create GitHub Actions CI/CD pipeline

---

## 📞 Support

For issues or questions:
1. Check the console for detailed error logs
2. Review the error code in response body
3. Check .env variables are all set correctly
4. Run tests to verify functionality

