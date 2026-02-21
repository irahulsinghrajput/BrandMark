require('dotenv').config({ path: __dirname + '/.env' });
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
app.use('/api/contact', require('./routes/contact'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/chat', require('./routes/chat'));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'BrandMark API is running',
        timestamp: new Date().toISOString()
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
