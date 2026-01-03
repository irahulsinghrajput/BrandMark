const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const Contact = require('../models/Contact');
const Career = require('../models/Career');
const Newsletter = require('../models/Newsletter');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

// @route   POST /api/admin/register
// @desc    Register new admin (First time setup or superadmin only)
// @access  Public (for first admin) / Private (for additional admins)
router.post('/register',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').trim().notEmpty().withMessage('Name is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { email, password, name } = req.body;

            // Check if admin already exists
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    message: 'Admin already exists'
                });
            }

            // Create first admin (no auth required for first admin)
            const adminCount = await Admin.countDocuments();
            const role = adminCount === 0 ? 'superadmin' : 'admin';

            const admin = new Admin({
                email,
                password,
                name,
                role
            });

            await admin.save();

            res.status(201).json({
                success: true,
                message: 'Admin registered successfully'
            });
        } catch (error) {
            console.error('Admin registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to register admin',
                error: error.message
            });
        }
    }
);

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { email, password } = req.body;

            // Find admin
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check password
            const isMatch = await admin.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Update last login
            admin.lastLogin = Date.now();
            await admin.save();

            // Generate token
            const token = jwt.sign(
                { id: admin._id, email: admin.email, role: admin.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                token,
                admin: {
                    id: admin._id,
                    email: admin.email,
                    name: admin.name,
                    role: admin.role
                }
            });
        } catch (error) {
            console.error('Admin login error:', error);
            res.status(500).json({
                success: false,
                message: 'Login failed'
            });
        }
    }
);

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
    try {
        const [
            totalContacts,
            newContacts,
            totalApplications,
            newApplications,
            totalSubscribers,
            totalBlogs,
            publishedBlogs
        ] = await Promise.all([
            Contact.countDocuments(),
            Contact.countDocuments({ status: 'new' }),
            Career.countDocuments(),
            Career.countDocuments({ status: 'new' }),
            Newsletter.countDocuments({ isActive: true }),
            Blog.countDocuments(),
            Blog.countDocuments({ published: true })
        ]);

        // Recent activities
        const recentContacts = await Contact.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email subject createdAt status');

        const recentApplications = await Career.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name position email createdAt status');

        res.json({
            success: true,
            data: {
                stats: {
                    contacts: { total: totalContacts, new: newContacts },
                    applications: { total: totalApplications, new: newApplications },
                    subscribers: totalSubscribers,
                    blogs: { total: totalBlogs, published: publishedBlogs }
                },
                recentActivities: {
                    contacts: recentContacts,
                    applications: recentApplications
                }
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data'
        });
    }
});

// @route   GET /api/admin/me
// @desc    Get current admin profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                id: req.admin._id,
                email: req.admin.email,
                name: req.admin.name,
                role: req.admin.role,
                lastLogin: req.admin.lastLogin
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
});

// @route   PUT /api/admin/change-password
// @desc    Change admin password
// @access  Private
router.put('/change-password',
    auth,
    [
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false, 
                    errors: errors.array() 
                });
            }

            const { currentPassword, newPassword } = req.body;

            // Find admin
            const admin = await Admin.findById(req.admin._id);
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            // Verify current password
            const isMatch = await admin.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Update password
            admin.password = newPassword;
            await admin.save();

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to change password'
            });
        }
    }
);

module.exports = router;
