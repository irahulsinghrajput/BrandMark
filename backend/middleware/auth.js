const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token, access denied'
            });
        }

        // Verify token
        const jwtSecret = process.env.JWT_SECRET;
        
        if (!jwtSecret || jwtSecret === 'your-super-secret-jwt-key-change-this-in-production') {
            console.warn('⚠️  WARNING: Using default JWT secret! Change JWT_SECRET in .env file!');
        }
        
        const decoded = jwt.verify(token, jwtSecret || 'your-secret-key-change-in-production');

        // Find admin
        const admin = await Admin.findById(decoded.id).select('-password');
        
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Token is not valid'
            });
        }

        if (!admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Admin account is deactivated'
            });
        }

        // Add admin to request object
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

// Check if admin is superadmin
const isSuperAdmin = (req, res, next) => {
    if (req.admin && req.admin.role === 'superadmin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Superadmin privileges required.'
        });
    }
};

// Check if user/admin is admin
const isAdmin = (req, res, next) => {
    if (req.admin && (req.admin.role === 'admin' || req.admin.role === 'superadmin')) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

// Alias verifyToken to auth for consistency
const verifyToken = auth;
const authenticateToken = auth;

module.exports = auth;
module.exports.verifyToken = verifyToken;
module.exports.authenticateToken = authenticateToken;
module.exports.isSuperAdmin = isSuperAdmin;
module.exports.isAdmin = isAdmin;
