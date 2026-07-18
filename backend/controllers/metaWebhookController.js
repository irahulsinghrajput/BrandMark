/**
 * metaWebhookController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Processes incoming Meta social messages (WhatsApp / Instagram / Facebook).
 *
 * Responsibilities:
 *  - Detect intent: SEO Audit request, general inquiry, or unknown
 *  - Generate AI response via Gemini 1.5 Flash
 *  - Send reply via Meta Cloud API (WhatsApp / Instagram / Facebook)
 *  - Log all interactions for analytics
 */

const geminiService       = require('../services/geminiService');
const metaMessagingService = require('../services/metaMessagingService');

// ─── Intent Detection ─────────────────────────────────────────────────────────

const AUDIT_KEYWORDS = [
  'audit', 'seo', 'website', 'score', 'rank', 'ranking', 'speed',
  'performance', 'analyze', 'analyse', 'check my site', 'check my website',
  'free audit', 'seo audit', 'site audit'
];

const PRICING_KEYWORDS = [
  'price', 'pricing', 'cost', 'how much', 'package', 'plan', 'fee', 'charge'
];

const CONTACT_KEYWORDS = [
  'contact', 'call', 'reach', 'speak', 'talk', 'human', 'agent', 'support', 'help'
];

/**
 * Classify message intent.
 * @param {string} text
 * @returns {'audit_request'|'pricing_inquiry'|'contact_request'|'general'}
 */
function detectIntent(text) {
  const lower = (text || '').toLowerCase();
  if (AUDIT_KEYWORDS.some(k => lower.includes(k)))   return 'audit_request';
  if (PRICING_KEYWORDS.some(k => lower.includes(k))) return 'pricing_inquiry';
  if (CONTACT_KEYWORDS.some(k => lower.includes(k))) return 'contact_request';
  return 'general';
}

// ─── Pre-built Response Templates (instant fallbacks) ────────────────────────

const TEMPLATES = {
  audit_request: `🚀 *BrandMark Solutions* — Free SEO Audit

Hi! I noticed you're interested in a free SEO audit.

Here's how to get yours in 60 seconds:
👉 Visit: *brandmarksolutions.site*
📋 Fill in your name, email & website URL
📊 We'll analyze your site with Google PageSpeed & send your full report by email!

Your report includes:
✅ Performance Score
✅ SEO Score  
✅ Core Web Vitals (LCP, FCP, CLS)
✅ Top 5 Actionable Recommendations

Reply *"AUDIT"* and your website URL to fast-track your analysis! 🎯`,

  pricing_inquiry: `💼 *BrandMark Solutions* — Pricing

We offer flexible packages for every budget:

🥉 *Starter* — ₹9,999/month
• SEO Optimization
• Social Media (2 platforms)
• Monthly Report

🥈 *Growth* — ₹19,999/month  
• Full SEO + Content Strategy
• Social Media (4 platforms)
• Paid Ads Management

🥇 *Enterprise* — Custom Pricing
• Full-Service Digital Marketing
• Dedicated Account Manager
• AI-Powered Analytics

📞 Book a FREE 30-min strategy call: *brandmarksolutions.site*
Or reply with your business size and we'll recommend the best plan! 🎯`,

  contact_request: `👋 *BrandMark Solutions* — We're Here!

Our team is ready to help you grow your business online.

📧 Email: info.aimservicesprivatelimited@gmail.com
🌐 Website: brandmarksolutions.site
📱 WhatsApp: This chat!

💬 Reply with your question and we'll get back to you within 2 business hours.

Or book a FREE strategy call directly: brandmarksolutions.site 🚀`,

  general: `👋 Hi from *BrandMark Solutions*!

We help businesses grow online through:
🔍 SEO & Content Marketing
📱 Social Media Management  
🎨 Brand Identity & Design
💻 Website Development
🤖 AI-Powered Automation

How can we help you today? Try:
• *"AUDIT"* — Get a free SEO audit
• *"PRICING"* — See our packages
• *"CONTACT"* — Talk to our team

Visit us: *brandmarksolutions.site* 🚀`
};

// ─── Controller Methods ───────────────────────────────────────────────────────

/**
 * Main handler for incoming social messages.
 * Called by webhookRoutes after the 200 response is sent.
 * @param {object} message - Extracted message object from webhookRoutes
 */
async function handleIncomingMessage(message) {
  const { senderId, text, channel, phoneNumberId, pageId } = message;

  if (!senderId || !text) {
    console.log('[MetaController] Skipping non-text message event');
    return;
  }

  const intent = detectIntent(text);
  console.log(`[MetaController] 🧠 Intent: "${intent}" | Channel: ${channel} | From: ${senderId}`);

  try {
    let replyText;

    // Try AI-generated response first, fall back to template
    try {
      replyText = await geminiService.generateSocialReply({
        userMessage: text,
        intent,
        channel,
        businessContext: 'BrandMark Solutions — Digital Marketing Agency'
      });
      console.log(`[MetaController] ✨ AI reply generated (${replyText.length} chars)`);
    } catch (aiErr) {
      console.warn(`[MetaController] ⚠️ Gemini fallback — ${aiErr.message}`);
      replyText = TEMPLATES[intent] || TEMPLATES.general;
    }

    // Send reply via Meta Cloud API
    await sendReplyByChannel({ channel, senderId, phoneNumberId, pageId, replyText });

  } catch (err) {
    console.error(`[MetaController] ❌ handleIncomingMessage error: ${err.message}`);
  }
}

/**
 * Route reply to the correct Meta channel API.
 */
async function sendReplyByChannel({ channel, senderId, phoneNumberId, pageId, replyText }) {
  switch (channel) {
    case 'whatsapp':
      await metaMessagingService.sendWhatsAppMessage({
        to: senderId,
        phoneNumberId,
        text: replyText
      });
      break;

    case 'instagram':
      await metaMessagingService.sendInstagramMessage({
        recipientId: senderId,
        text: replyText
      });
      break;

    case 'facebook':
      await metaMessagingService.sendFacebookMessage({
        recipientId: senderId,
        pageId,
        text: replyText
      });
      break;

    default:
      console.warn(`[MetaController] Unknown channel: ${channel} — reply not sent`);
  }
}

/**
 * Handle audit trigger from social: user sends their website URL.
 * Extracts URL, triggers audit, replies with scores.
 * @param {object} message
 * @param {string} websiteUrl
 */
async function handleAuditTrigger(message, websiteUrl) {
  const { senderId, channel, phoneNumberId } = message;

  const processingMsg = `⏳ Running your free SEO audit for *${websiteUrl}*...\n\nThis takes about 30 seconds. I'll send your results right here! 🔍`;
  await sendReplyByChannel({ channel, senderId, phoneNumberId, replyText: processingMsg });

  // The full audit pipeline runs in n8n — this just acknowledges
  console.log(`[MetaController] 🎯 Audit triggered via social for: ${websiteUrl} | user: ${senderId}`);
}

module.exports = {
  handleIncomingMessage,
  handleAuditTrigger,
  detectIntent
};
