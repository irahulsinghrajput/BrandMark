/**
 * geminiService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Google Gemini 1.5 Flash AI Service (Free Tier: 15 RPM)
 *
 * Powers:
 *  - Social media DM auto-replies (WhatsApp / Instagram / FB)
 *  - SEO audit insight narration
 *  - Lead qualification summaries
 *  - LinkedIn content generation
 *
 * Uses @google/generative-ai (already installed in package.json)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ─── Singleton model instance ─────────────────────────────────────────────────
let _model = null;

function getModel() {
  if (_model) return _model;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Add it to your .env file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  _model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature:     0.7,
      topP:            0.9,
      maxOutputTokens: 500
    }
  });

  return _model;
}

// ─── Rate-limit guard (15 RPM on free tier) ───────────────────────────────────
const _callTimestamps = [];
const RPM_LIMIT = 14; // stay safely under 15 RPM

function checkRateLimit() {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  // Remove timestamps older than 1 minute
  while (_callTimestamps.length && _callTimestamps[0] < oneMinuteAgo) {
    _callTimestamps.shift();
  }

  if (_callTimestamps.length >= RPM_LIMIT) {
    const waitMs = (_callTimestamps[0] + 60000) - now + 500;
    throw new Error(`Gemini rate limit — try again in ${Math.ceil(waitMs / 1000)}s`);
  }

  _callTimestamps.push(now);
}

// ─── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are BrandMark AI, the smart assistant for BrandMark Solutions — a premium digital marketing agency based in India.

Your personality:
- Friendly, professional, and enthusiastic
- Concise (max 150 words for social replies)
- Always end with a clear CTA
- Use emojis strategically (not excessively)
- Focus on value and results, never make vague promises

BrandMark Solutions offers:
- SEO & Content Marketing
- Social Media Management (Instagram, Facebook, LinkedIn, WhatsApp)
- Brand Identity & Logo Design
- Website Development
- AI-Powered Marketing Automation
- Digital Marketing Courses

Key info:
- Website: brandmarksolutions.site
- Email: info.aimservicesprivatelimited@gmail.com
- Free SEO Audit available at: brandmarksolutions.site

NEVER share: pricing (unless asked), specific employee names, or make guarantees about rankings.
ALWAYS: Offer the free SEO audit, mention the website, and be helpful.`;

// ─── Service Functions ─────────────────────────────────────────────────────────

/**
 * Generate an AI reply for a social media DM.
 * @param {object} params
 * @param {string} params.userMessage - The user's incoming message
 * @param {string} params.intent - Classified intent (audit_request|pricing|general)
 * @param {string} params.channel - whatsapp|instagram|facebook
 * @param {string} params.businessContext - Additional context
 * @returns {Promise<string>} AI-generated reply text
 */
async function generateSocialReply({ userMessage, intent, channel, businessContext }) {
  checkRateLimit();
  const model = getModel();

  const intentGuidance = {
    audit_request:   'The user wants an SEO audit. Offer the free audit tool on the website. Ask for their website URL.',
    pricing_inquiry: 'The user is asking about pricing. Outline the value proposition and invite them to book a free call.',
    contact_request: 'The user wants to speak with a human. Provide contact details and confirm response time.',
    general:         'Introduce BrandMark Solutions briefly and guide the user towards the free SEO audit.'
  };

  const channelGuidance = {
    whatsapp:  'This is a WhatsApp message. Use *bold* with asterisks. Keep it conversational.',
    instagram: 'This is an Instagram DM. Be friendly and brief. No markdown formatting.',
    facebook:  'This is a Facebook message. Professional but warm. No markdown formatting.'
  };

  const prompt = `${SYSTEM_PROMPT}

---
INCOMING MESSAGE (${channel.toUpperCase()}):
"${userMessage}"

DETECTED INTENT: ${intent}
GUIDANCE: ${intentGuidance[intent] || intentGuidance.general}
CHANNEL FORMAT: ${channelGuidance[channel] || 'Keep it brief and friendly.'}

Write a reply (max 120 words). Do not include any quotation marks around your response.`;

  try {
    const result = await model.generateContent(prompt);
    const text   = result.response.text().trim();
    console.log(`[Gemini] ✅ Social reply generated for intent: ${intent}`);
    return text;
  } catch (err) {
    console.error(`[Gemini] ❌ generateSocialReply error: ${err.message}`);
    throw err;
  }
}

/**
 * Generate a natural-language narrative summary of an SEO audit.
 * Used in emails and social replies to explain the scores.
 * @param {object} auditData - { websiteUrl, performanceScore, seoScore, lcp, fcp, cls }
 * @returns {Promise<string>} AI-generated insight paragraph
 */
async function generateAuditInsight(auditData) {
  checkRateLimit();
  const model = getModel();

  const { websiteUrl, performanceScore, seoScore, lcp, fcp, cls } = auditData;

  const prompt = `${SYSTEM_PROMPT}

---
Generate a brief, actionable 3-paragraph SEO audit insight for a client:

Website: ${websiteUrl}
Performance Score: ${performanceScore}/100
SEO Score: ${seoScore}/100
Largest Contentful Paint: ${lcp}
First Contentful Paint: ${fcp}
Cumulative Layout Shift: ${cls}

Paragraph 1: Summarize the overall health (1-2 sentences, enthusiastic but honest)
Paragraph 2: Highlight the biggest opportunity area
Paragraph 3: End with a compelling CTA to book a strategy call

Keep it under 120 words total. Do not use markdown headings or bullet points.`;

  try {
    const result = await model.generateContent(prompt);
    const text   = result.response.text().trim();
    console.log(`[Gemini] ✅ Audit insight generated for: ${websiteUrl}`);
    return text;
  } catch (err) {
    console.error(`[Gemini] ❌ generateAuditInsight error: ${err.message}`);
    throw err;
  }
}

/**
 * Generate a LinkedIn post for content marketing.
 * @param {object} params
 * @param {string} params.topic - Topic or hook for the post
 * @param {string} params.industry - Target industry
 * @param {string} params.format - 'insight'|'tip'|'case_study'|'announcement'
 * @returns {Promise<string>} LinkedIn-optimized post text
 */
async function generateLinkedInPost({ topic, industry, format = 'insight' }) {
  checkRateLimit();
  const model = getModel();

  const formatGuides = {
    insight:      'Share a counter-intuitive insight. Start with a bold statement. Use line breaks for readability.',
    tip:          'Share 3-5 actionable tips. Number them. Keep each tip to 1-2 lines.',
    case_study:   'Tell a story: Problem → Solution → Result. Be specific with numbers.',
    announcement: 'Professional announcement format. Lead with the news, explain the benefit, CTA.'
  };

  const prompt = `${SYSTEM_PROMPT}

---
Write a LinkedIn post for BrandMark Solutions:

Topic: ${topic}
Industry: ${industry || 'Digital Marketing'}
Format: ${format} — ${formatGuides[format]}

Requirements:
- 150-250 words
- Start with a hook (first line should make people stop scrolling)
- Include 3-5 relevant hashtags at the end
- End with a question or CTA to drive engagement
- Do NOT use markdown (no **, no ##)
- DO use line breaks between paragraphs`;

  try {
    const result = await model.generateContent(prompt);
    const text   = result.response.text().trim();
    console.log(`[Gemini] ✅ LinkedIn post generated: "${topic}"`);
    return text;
  } catch (err) {
    console.error(`[Gemini] ❌ generateLinkedInPost error: ${err.message}`);
    throw err;
  }
}

/**
 * Classify a lead's potential value and suggest next action.
 * @param {object} leadData - { fullName, email, websiteUrl, message }
 * @returns {Promise<{score: number, tier: string, nextAction: string, reasoning: string}>}
 */
async function qualifyLead(leadData) {
  checkRateLimit();
  const model = getModel();

  const prompt = `You are a lead qualification expert for BrandMark Solutions digital marketing agency.

Analyze this inbound lead and return a JSON object:

Lead Details:
Name: ${leadData.fullName || 'Unknown'}
Email: ${leadData.email || 'N/A'}
Website: ${leadData.websiteUrl || 'N/A'}
Message: ${leadData.message || 'N/A'}
Source: ${leadData.source || 'Unknown'}

Return ONLY valid JSON (no markdown, no explanation):
{
  "score": <number 1-10>,
  "tier": "<hot|warm|cold>",
  "estimatedRevenuePotential": "<low|medium|high>",
  "nextAction": "<specific action for sales team>",
  "followUpTiming": "<immediately|within 24h|within 3 days|nurture>",
  "reasoning": "<2 sentences explaining score>"
}`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const parsed = JSON.parse(text);
    console.log(`[Gemini] ✅ Lead qualified: ${leadData.email} → ${parsed.tier} (${parsed.score}/10)`);
    return parsed;
  } catch (err) {
    console.error(`[Gemini] ❌ qualifyLead error: ${err.message}`);
    // Return a safe default
    return {
      score: 5,
      tier: 'warm',
      estimatedRevenuePotential: 'medium',
      nextAction: 'Send follow-up email within 24 hours',
      followUpTiming: 'within 24h',
      reasoning: 'Default qualification — AI service temporarily unavailable.'
    };
  }
}

/**
 * Health check for the Gemini service.
 */
async function pingGemini() {
  try {
    checkRateLimit();
    const model = getModel();
    const result = await model.generateContent('Reply with just the word: OK');
    const text = result.response.text().trim();
    return text.includes('OK');
  } catch {
    return false;
  }
}

module.exports = {
  generateSocialReply,
  generateAuditInsight,
  generateLinkedInPost,
  qualifyLead,
  pingGemini
};
