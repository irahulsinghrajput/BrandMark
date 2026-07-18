const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { handleAuditSubmission } = require('../controllers/auditController');

// @route   POST /api/audit
// @desc    Submit SEO Audit request (creates lead and triggers n8n webhook)
// @access  Public
router.post('/',
    [
        body('fullName').trim().notEmpty().withMessage('Full name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('websiteUrl').trim().notEmpty().withMessage('Website URL is required')
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }
        next();
    },
    handleAuditSubmission
);

module.exports = router;
