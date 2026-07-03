require('dotenv').config({ path: __dirname + '/.env' });

// STARTUP LOG - Should appear immediately
console.log('🚀 ============================================');
console.log('🚀 BrandMark Backend Starting Up...');
console.log('🚀 Time:', new Date().toISOString());
console.log('🚀 Environment:', process.env.NODE_ENV || 'production');
console.log('🚀 ============================================');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const app = express();

// Trust proxy (Render/Load Balancer) so rate-limit works with X-Forwarded-For
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());
app.use(compression());
app.use(cookieParser()); // Parse cookies for CSRF tokens

// Enhanced Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// STRONGER rate limiting for forms
const formLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10 // limit each IP to 10 requests per hour
});

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5500',
    'http://localhost:5000',
    'http://localhost:5001',
    'https://brandmarksolutions.site',
    'https://www.brandmarksolutions.site',
    'null'
];

const CORS_ALLOWED_HEADERS = 'Content-Type, Authorization, X-CSRF-Token';
const CORS_ALLOWED_METHODS = 'GET,POST,PUT,DELETE,PATCH,OPTIONS';

// Ensure file:// (Origin: null) requests always get explicit CORS headers.
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || origin === 'null') {
        res.setHeader('Access-Control-Allow-Origin', 'null');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', CORS_ALLOWED_METHODS);
        res.setHeader('Access-Control-Allow-Headers', CORS_ALLOWED_HEADERS);
        res.setHeader('Vary', 'Origin');

        if (req.method === 'OPTIONS') {
            return res.sendStatus(204);
        }
    }
    next();
});

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or file:// pages)
        if (!origin || origin === 'null') return callback(null, true);
        
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true); // Allow all in development
        }
        
        if (allowedOrigins.indexOf(origin) === -1) {
            // Do not throw here; returning false avoids turning CORS mismatch into 500s.
            return callback(null, false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    optionsSuccessStatus: 204
}));

// Body Parser Middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Additional Security Middleware
app.use(mongoSanitize()); // Prevent MongoDB injection attacks
app.use(xss()); // Prevent XSS attacks by sanitizing user input
app.use(hpp()); // Prevent HTTP Parameter Pollution

// ============= CSRF PROTECTION =============
// Generate CSRF tokens for clients
const csrfTokens = new Map();

app.get('/api/csrf-token', (req, res) => {
    const token = crypto.randomBytes(32).toString('hex');
    csrfTokens.set(token, true);
    res.json({ token });
});

// Validate CSRF tokens
function validateCsrfToken(req, res, next) {
    const token = req.get('X-CSRF-Token') || req.body.csrf_token;
    
    if (!token || !csrfTokens.has(token)) {
        return res.status(403).json({ 
            success: false, 
            message: 'CSRF token validation failed' 
        });
    }
    
    // Token is valid, remove it (single use)
    csrfTokens.delete(token);
    next();
}

// Apply CSRF protection to form routes
app.use('/api/contact', validateCsrfToken);
app.use('/api/careers', validateCsrfToken);
app.use('/api/newsletter', validateCsrfToken);
app.use('/api/quotes', validateCsrfToken);

// Apply CSRF protection to admin endpoints
app.post('/api/admin/login', validateCsrfToken);
app.post('/api/admin/logout', validateCsrfToken);

// Static Files for Uploads
app.use('/uploads', express.static('uploads'));

// Database Connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('⚠️  Server will continue without database. Configure MONGODB_URI in .env file.');
    });
} else {
    console.log('⚠️  MONGODB_URI not configured. Server running without database.');
}

// Prevent unhandled rejections from crashing the server
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

// Routes
console.log('🔧 Loading routes...');
app.use('/api/contact', require('./routes/contact'));
console.log('✅ Contact routes loaded');
app.use('/api/careers', require('./routes/careers'));
console.log('✅ Careers routes loaded');
app.use('/api/newsletter', require('./routes/newsletter'));
console.log('✅ Newsletter routes loaded');
app.use('/api/blog', require('./routes/blog'));
console.log('✅ Blog routes loaded');
app.use('/api/ai-tutor', require('./routes/ai-tutor'));
console.log('✅ AI Tutor routes loaded');
app.use('/api/tutor', require('./routes/tutor'));
console.log('✅ Tutor compatibility route loaded');
app.use('/api/generate-voice', require('./routes/generate-voice'));
console.log('✅ Voice generation routes loaded');
app.use('/api/admin', require('./routes/admin'));
console.log('✅ Admin routes loaded');
app.use('/api/chat', require('./routes/chat'));
console.log('✅ Chat routes loaded');
app.use('/api/quotes', require('./routes/quotes'));
console.log('✅ Quotes routes loaded');
const coursesRoutes = require('./routes/courses');
console.log('✅ Courses routes required');
app.use('/api/courses', coursesRoutes);
console.log('✅ Courses routes mounted');
app.use('/api/quiz', require('./routes/quiz'));
console.log('✅ Quiz routes loaded');
app.use('/api/students', require('./routes/students'));
console.log('✅ Students routes loaded');
app.use('/api/analytics', require('./routes/analytics'));
console.log('✅ Analytics routes loaded');

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'BrandMark API is running',
        timestamp: new Date().toISOString()
    });
});

// Debug: Test order route
app.get('/api/test-order-route', (req, res) => {
    res.json({ 
        status: 'OK',
        message: 'Order route test endpoint working',
        timestamp: new Date().toISOString()
    });
});

// Enhanced Error Handling Middleware (must be last)
const { errorHandler } = require('./utils/errorHandler');

// 404 Handler (before error handler)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Global error handler (MUST be last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
