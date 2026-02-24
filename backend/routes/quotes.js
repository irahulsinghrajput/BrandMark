const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Quote = require('../models/Quote');
const { sendQuoteEmail, sendQuoteAutoReply } = require('../config/email');
const auth = require('../middleware/auth');

const PRICE_MATRIX = {
    branding: {
        us: { amount: 499, currency: 'USD', display: '$499' },
        europe: { amount: 450, currency: 'EUR', display: '€450' },
        middle_east: { amount: 550, currency: 'USD', display: '$550' }
    },
    web_design: {
        us: { amount: 850, currency: 'USD', display: '$850' },
        europe: { amount: 750, currency: 'EUR', display: '€750' },
        middle_east: { amount: 900, currency: 'USD', display: '$900' }
    },
    marketing_strategy: {
        us: { amount: 350, currency: 'USD', display: '$350' },
        europe: { amount: 320, currency: 'EUR', display: '€320' },
        middle_east: { amount: 400, currency: 'USD', display: '$400' }
    },
    digital_ads_setup: {
        us: { amount: 199, currency: 'USD', display: '$199' },
        europe: { amount: 180, currency: 'EUR', display: '€180' },
        middle_east: { amount: 250, currency: 'USD', display: '$250' }
    },
    social_media_content: {
        us: { amount: 249, currency: 'USD', display: '$249' },
        europe: { amount: 220, currency: 'EUR', display: '€220' },
        middle_east: { amount: 300, currency: 'USD', display: '$300' }
    },
    content: {
        us: { amount: 249, currency: 'USD', display: '$249' },
        europe: { amount: 220, currency: 'EUR', display: '€220' },
        middle_east: { amount: 300, currency: 'USD', display: '$300' }
    }
};

const SERVICE_LABELS = {
    branding: 'Branding',
    social_media_content: 'Social Media / Content',
    web_design: 'Web Design',
    content: 'Content',
    marketing_strategy: 'Marketing Strategy',
    digital_ads_setup: 'Digital Ads (Setup)'
};

// @route   POST /api/quotes
// @desc    Generate and store custom quote
// @access  Public
router.post(
    '/',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('serviceType').isIn(Object.keys(SERVICE_LABELS)).withMessage('Invalid service type'),
        body('companySize').isIn(['1-5', '6-20', '21-50', '51-200', '200+']).withMessage('Invalid company size'),
        body('market').isIn(['us', 'europe', 'middle_east']).withMessage('Invalid market')
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

            const {
                name,
                email,
                phone,
                website,
                serviceType,
                companySize,
                market,
                timeline,
                budget,
                notes
            } = req.body;

            const pricing = PRICE_MATRIX[serviceType] && PRICE_MATRIX[serviceType][market];

            if (!pricing) {
                return res.status(400).json({
                    success: false,
                    message: 'Unable to generate quote for selected options.'
                });
            }

            const quote = new Quote({
                name,
                email,
                phone,
                website,
                serviceType,
                companySize,
                market,
                timeline,
                budget,
                notes,
                quoteAmount: pricing.amount,
                currency: pricing.currency,
                quoteDisplay: pricing.display
            });

            await quote.save();

            await sendQuoteEmail({
                ...quote.toObject(),
                serviceLabel: SERVICE_LABELS[serviceType]
            });

            await sendQuoteAutoReply({
                email,
                name,
                serviceLabel: SERVICE_LABELS[serviceType],
                quoteDisplay: pricing.display,
                market
            });

            return res.status(201).json({
                success: true,
                message: 'Quote generated successfully.',
                data: {
                    serviceType,
                    serviceLabel: SERVICE_LABELS[serviceType],
                    market,
                    quoteAmount: pricing.amount,
                    currency: pricing.currency,
                    quoteDisplay: pricing.display
                }
            });
        } catch (error) {
            console.error('Quote generation error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to generate quote. Please try again.'
            });
        }
    }
);

// @route   GET /api/quotes
// @desc    Get all quotes (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = status ? { status } : {};

        const quotes = await Quote.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Quote.countDocuments(query);

        return res.json({
            success: true,
            data: quotes,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            total: count
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch quotes'
        });
    }
});

module.exports = router;
