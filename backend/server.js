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

const app = express();

// Trust proxy (Render/Load Balancer) so rate-limit works with X-Forwarded-For
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet());
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5500',
    'https://brandmarksolutions.site',
    'https://www.brandmarksolutions.site'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true); // Allow all in development
        }
        
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('Not allowed by CORS'), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Additional Security Middleware
app.use(mongoSanitize()); // Prevent MongoDB injection attacks
app.use(xss()); // Prevent XSS attacks by sanitizing user input
app.use(hpp()); // Prevent HTTP Parameter Pollution

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
