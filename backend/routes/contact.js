const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactEmail, sendContactAutoReply } = require('../config/email');
const auth = require('../middleware/auth');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('message').trim().notEmpty().withMessage('Message is required')
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

            const { name, email, phone, subject, message } = req.body;

            // Save to database
            const contact = new Contact({
                name,
                email,
                phone,
                subject,
                message
            });

            await contact.save();

            // Send emails
            await sendContactEmail(contact);
            await sendContactAutoReply(email, name);

            res.status(201).json({
                success: true,
                message: 'Thank you! We will get back to you soon.'
            });
        } catch (error) {
            console.error('Contact form error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again.'
            });
        }
    }
);

// @route   GET /api/contact
// @desc    Get all contact submissions (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = status ? { status } : {};

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Contact.countDocuments(query);

        res.json({
            success: true,
            data: contacts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts'
        });
    }
});

// @route   PATCH /api/contact/:id/status
// @desc    Update contact status (Admin only)
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update status'
        });
    }
});

module.exports = router;
