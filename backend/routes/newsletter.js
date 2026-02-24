const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Newsletter = require('../models/Newsletter');
const { sendNewsletterWelcome } = require('../config/email');
const auth = require('../middleware/auth');

// @route   POST /api/newsletter
// @desc    Subscribe to newsletter
// @access  Public
router.post('/',
    [
        body('email').isEmail().withMessage('Valid email is required')
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

            const { email } = req.body;

            // Check if already subscribed
            const existing = await Newsletter.findOne({ email });
            if (existing && existing.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'This email is already subscribed'
                });
            }

            // Reactivate if previously unsubscribed
            if (existing && !existing.isActive) {
                existing.isActive = true;
                existing.subscribedAt = Date.now();
                existing.unsubscribedAt = null;
                await existing.save();
            } else {
                // Create new subscription
                const subscriber = new Newsletter({ email });
                await subscriber.save();
            }

            // Send welcome email
            await sendNewsletterWelcome(email);

            res.status(201).json({
                success: true,
                message: 'Successfully subscribed to newsletter!'
            });
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to subscribe. Please try again.'
            });
        }
    }
);

// @route   GET /api/newsletter
// @desc    Get all subscribers (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { active = 'true', page = 1, limit = 50 } = req.query;
        const query = { isActive: active === 'true' };

        const subscribers = await Newsletter.find(query)
            .sort({ subscribedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Newsletter.countDocuments(query);

        res.json({
            success: true,
            data: subscribers,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscribers'
        });
    }
});

// @route   DELETE /api/newsletter/:email
// @desc    Unsubscribe from newsletter
// @access  Public
router.delete('/:email', async (req, res) => {
    try {
        const subscriber = await Newsletter.findOne({ email: req.params.email });
        
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Email not found'
            });
        }

        subscriber.isActive = false;
        subscriber.unsubscribedAt = Date.now();
        await subscriber.save();

        res.json({
            success: true,
            message: 'Successfully unsubscribed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe'
        });
    }
});

module.exports = router;
