const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const StrategyRequest = require('../models/StrategyRequest');
const { forwardStrategyRequest } = require('../services/leadAutomation');
const auth = require('../middleware/auth');

// Keep in sync with the checkbox text in brandmark-react/src/components/LeadCaptureForm.jsx
const CONSENT_VERSION = 'strategy-2026-11';
const CONSENT_TEXT = 'I agree that BrandMark Solutions may store these details and contact me by email, phone or WhatsApp about my enquiry.';

const SERVICES = [
    'Website Development',
    'SEO / Local SEO',
    'Performance Marketing (Ads)',
    'UI/UX Design',
    'Branding & Logo',
    'Social Media Management',
    'AI Automation (BM-OS)'
];
const BUDGETS = ['< 20,000', '20,000 - 50,000', '50,000 - 1,00,000', '1,00,000+'];

const rejectInvalid = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }
    next();
};

// @route   POST /api/leads/strategy
// @desc    "Request Strategy Outline" form. Saves first, then hands off to n8n.
// @access  Public (CSRF protected in server.js)
router.post('/strategy',
    [
        body('contact_name').trim().notEmpty().withMessage('Please enter your name').isLength({ max: 120 }),
        body('email').trim().isEmail().withMessage('Please enter a valid email').isLength({ max: 200 }),
        body('phone').optional({ values: 'falsy' }).trim().matches(/^[+\d][\d\s-]{6,19}$/).withMessage('Please enter a valid phone number'),
        body('company_name').trim().notEmpty().withMessage('Please enter your company name').isLength({ max: 160 }),
        body('website').optional({ values: 'falsy' }).trim().isURL({ require_protocol: false }).withMessage('Please enter a valid website address').isLength({ max: 300 }),
        body('city').trim().notEmpty().withMessage('Please enter your city or region').isLength({ max: 120 }),
        body('budget').isIn(BUDGETS).withMessage('Please choose a budget range'),
        body('services').isArray({ min: 1, max: SERVICES.length }).withMessage('Please choose at least one service'),
        body('services.*').isIn(SERVICES).withMessage('Unknown service'),
        body('message').optional({ values: 'falsy' }).trim().isLength({ max: 2000 }),
        body('source').optional({ values: 'falsy' }).trim().isLength({ max: 80 }),
        body('consent').equals('true').withMessage('Please tick the box so we can contact you')
    ],
    rejectInvalid,
    async (req, res) => {
        let doc;
        try {
            const b = req.body;
            doc = await StrategyRequest.create({
                contactName: b.contact_name,
                email: b.email,
                phone: b.phone || undefined,
                companyName: b.company_name,
                website: b.website || undefined,
                city: b.city,
                budget: b.budget,
                services: [...new Set(b.services)],
                message: b.message || undefined,
                source: b.source || undefined,
                consent: { given: true, version: CONSENT_VERSION, text: CONSENT_TEXT, at: new Date() }
            });
        } catch (error) {
            console.error('[leads] could not save strategy request:', error.message);
            return res.status(500).json({ success: false, message: 'Sorry, we could not save your request. Please try again or call +91 709 186 3003.' });
        }

        // The enquiry is safe in the database; the n8n hand-off result never changes the answer.
        await forwardStrategyRequest(doc).catch((err) => console.error('[leads] hand-off error:', err.message));
        return res.status(201).json({ success: true, id: String(doc._id), message: 'Thank you! A strategist will contact you within one working day.' });
    }
);

// @route   GET /api/leads/strategy
// @desc    List strategy requests (admin). Optional ?automation=failed to find hand-offs to retry.
// @access  Private
router.get('/strategy', auth, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
        const query = {};
        if (req.query.automation) query['automation.state'] = String(req.query.automation);
        if (req.query.status) query.status = String(req.query.status);
        const items = await StrategyRequest.find(query).sort({ createdAt: -1 }).limit(limit).lean();
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch strategy requests' });
    }
});

// @route   POST /api/leads/strategy/:id/forward
// @desc    Re-send one request to n8n (admin), e.g. after n8n was asleep.
// @access  Private
router.post('/strategy/:id/forward', auth, [param('id').isMongoId()], rejectInvalid, async (req, res) => {
    const doc = await StrategyRequest.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    const state = await forwardStrategyRequest(doc);
    res.json({ success: state === 'sent', state, error: doc.automation.lastError || null });
});

module.exports = router;
module.exports.CONSENT_TEXT = CONSENT_TEXT;
module.exports.SERVICES = SERVICES;
module.exports.BUDGETS = BUDGETS;
