/**
 * socialRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Social Automation API Routes
 *
 * POST /api/social/linkedin/post        — Publish AI-generated LinkedIn content
 * POST /api/social/linkedin/post-audit  — Post an audit result to LinkedIn
 * POST /api/social/whatsapp/send        — Send a WhatsApp message (internal use)
 * POST /api/social/ai/reply             — Generate a social reply (test endpoint)
 * POST /api/social/ai/qualify-lead      — Run AI lead qualification
 * GET  /api/social/health               — Full ecosystem health check
 *
 * Protected by: API key header (x-api-key: INTERNAL_API_KEY)
 * These are INTERNAL endpoints — not exposed to browser users.
 */

const express         = require('express');
const router          = express.Router();
const geminiService   = require('../services/geminiService');
const linkedinService = require('../services/linkedinService');
const metaMessaging   = require('../services/metaMessagingService');
const { body, validationResult } = require('express-validator');

// ─── Internal API Key Middleware ──────────────────────────────────────────────
function requireInternalKey(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.apiKey;
  const expected = process.env.INTERNAL_API_KEY;

  // If no key is configured, allow in development only
  if (!expected) {
    if (process.env.NODE_ENV === 'development') return next();
    return res.status(403).json({ success: false, message: 'INTERNAL_API_KEY not configured' });
  }

  if (key !== expected) {
    return res.status(403).json({ success: false, message: 'Invalid API key' });
  }

  next();
}

// ─── POST /api/social/linkedin/post ──────────────────────────────────────────
// Generate and post AI content to LinkedIn
router.post('/linkedin/post',
  requireInternalKey,
  [
    body('topic').notEmpty().withMessage('topic is required'),
    body('format').optional().isIn(['insight', 'tip', 'case_study', 'announcement'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { topic, industry, format = 'insight', url, urlTitle, target = 'both' } = req.body;

      // 1. Generate AI post
      const postText = await geminiService.generateLinkedInPost({ topic, industry, format });

      // 2. Publish to LinkedIn
      let publishResult;
      if (target === 'personal') {
        publishResult = await linkedinService.postToPersonalProfile({ text: postText, url, urlTitle });
      } else if (target === 'company') {
        publishResult = await linkedinService.postToCompanyPage({ text: postText, url, urlTitle });
      } else {
        publishResult = await linkedinService.postToBoth({ text: postText, url, urlTitle });
      }

      res.json({
        success: true,
        message: 'LinkedIn post published',
        postText,
        publishResult
      });

    } catch (err) {
      console.error('[Social/LinkedIn] post error:', err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─── POST /api/social/linkedin/post-audit ─────────────────────────────────────
// Auto-post an SEO audit result to LinkedIn as social proof
router.post('/linkedin/post-audit',
  requireInternalKey,
  async (req, res) => {
    try {
      const { clientName, websiteUrl, performanceScore, seoScore, lcp } = req.body;

      const topic = `We just ran a free SEO audit for a client. Their website ${websiteUrl} scored ${performanceScore}/100 on Performance and ${seoScore}/100 on SEO. LCP: ${lcp}. Here's what we found and fixed.`;

      const postText = await geminiService.generateLinkedInPost({
        topic,
        format: 'case_study',
        industry: 'Digital Marketing'
      });

      const publishResult = await linkedinService.postToBoth({
        text: postText,
        url: 'https://brandmarksolutions.site',
        urlTitle: 'Get Your Free SEO Audit',
        urlDesc: 'Analyze your website performance and SEO score in 60 seconds — completely free.'
      });

      res.json({ success: true, postText, publishResult });

    } catch (err) {
      console.error('[Social/LinkedIn] post-audit error:', err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─── POST /api/social/whatsapp/send ──────────────────────────────────────────
// Internal endpoint: send a WhatsApp message
router.post('/whatsapp/send',
  requireInternalKey,
  [
    body('to').notEmpty().withMessage('to (phone number) is required'),
    body('text').notEmpty().withMessage('text is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { to, text } = req.body;
      const result = await metaMessaging.sendWhatsAppMessage({ to, text });
      res.json({ success: true, result });
    } catch (err) {
      console.error('[Social/WhatsApp] send error:', err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─── POST /api/social/ai/reply ────────────────────────────────────────────────
// Generate an AI reply for a social DM (test/preview endpoint)
router.post('/ai/reply',
  requireInternalKey,
  [
    body('userMessage').notEmpty().withMessage('userMessage is required'),
    body('channel').optional().isIn(['whatsapp', 'instagram', 'facebook'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { userMessage, channel = 'whatsapp', intent } = req.body;

      const detectedIntent = intent || require('../controllers/metaWebhookController').detectIntent(userMessage);
      const reply = await geminiService.generateSocialReply({
        userMessage,
        intent: detectedIntent,
        channel,
        businessContext: 'BrandMark Solutions'
      });

      res.json({
        success: true,
        detectedIntent,
        channel,
        reply
      });

    } catch (err) {
      console.error('[Social/AI] reply error:', err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─── POST /api/social/ai/qualify-lead ────────────────────────────────────────
// AI lead qualification — use internally after audit form submission
router.post('/ai/qualify-lead',
  requireInternalKey,
  async (req, res) => {
    try {
      const qualification = await geminiService.qualifyLead(req.body);
      res.json({ success: true, qualification });
    } catch (err) {
      console.error('[Social/AI] qualify-lead error:', err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─── GET /api/social/health ────────────────────────────────────────────────────
// Full ecosystem health check — all channels + AI
router.get('/health', async (req, res) => {
  const [metaStatus, linkedInStatus] = await Promise.allSettled([
    metaMessaging.checkMetaCredentials(),
    linkedinService.checkLinkedInCredentials()
  ]);

  const geminiConfigured = !!(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
  );

  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    channels: {
      gemini: {
        configured: geminiConfigured,
        model: 'gemini-1.5-flash',
        rpmLimit: 15,
        tier: 'free'
      },
      meta: metaStatus.status === 'fulfilled'
        ? metaStatus.value
        : { error: metaStatus.reason?.message },
      linkedin: linkedInStatus.status === 'fulfilled'
        ? linkedInStatus.value
        : { error: linkedInStatus.reason?.message }
    },
    n8n: {
      url: (process.env.N8N_WEBHOOK_URL || '').replace(/\/webhook.*$/, '/webhook/***'),
      configured: !!process.env.N8N_WEBHOOK_URL
    }
  });
});

module.exports = router;
