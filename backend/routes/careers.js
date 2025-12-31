const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Career = require('../models/Career');
const { sendCareerEmail } = require('../config/email');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// @route   POST /api/careers
// @desc    Submit job application
// @access  Public
router.post('/',
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'portfolio', maxCount: 1 }
    ]),
    [
        body('position').trim().notEmpty().withMessage('Position is required'),
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').trim().notEmpty().withMessage('Phone is required')
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

            if (!req.files || !req.files.resume) {
                return res.status(400).json({
                    success: false,
                    message: 'Resume is required'
                });
            }

            const { position, name, email, phone, experience, coverLetter } = req.body;
            const resumePath = req.files.resume[0].path;
            const portfolioPath = req.files.portfolio ? req.files.portfolio[0].path : null;

            // Save to database
            const application = new Career({
                position,
                name,
                email,
                phone,
                experience,
                coverLetter,
                resume: resumePath,
                portfolio: portfolioPath
            });

            await application.save();

            // Send email notification
            await sendCareerEmail(application, resumePath);

            res.status(201).json({
                success: true,
                message: 'Application submitted successfully!'
            });
        } catch (error) {
            console.error('Career application error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to submit application. Please try again.'
            });
        }
    }
);

// @route   GET /api/careers
// @desc    Get all applications (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { status, position, page = 1, limit = 20 } = req.query;
        const query = {};
        if (status) query.status = status;
        if (position) query.position = new RegExp(position, 'i');

        const applications = await Career.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Career.countDocuments(query);

        res.json({
            success: true,
            data: applications,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications'
        });
    }
});

// @route   PATCH /api/careers/:id/status
// @desc    Update application status (Admin only)
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Career.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update status'
        });
    }
});

module.exports = router;
