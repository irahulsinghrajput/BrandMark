/**
 * metaMessagingService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Meta Cloud API — Send messages via WhatsApp, Instagram, and Facebook.
 *
 * Uses the Meta Graph API v19.0 (free tier):
 *  - WhatsApp: 1,000 customer-initiated conversations/month free
 *  - Instagram: Graph API replies to DMs (free)
 *  - Facebook: Graph API replies to DMs (free)
 *
 * All credentials come from environment variables.
 */

const META_API_BASE    = 'https://graph.facebook.com/v19.0';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || '';
const INSTAGRAM_PAGE_ID    = process.env.INSTAGRAM_PAGE_ID || '';
const FACEBOOK_PAGE_TOKEN  = process.env.FACEBOOK_PAGE_TOKEN || process.env.META_ACCESS_TOKEN || '';

// ─── Shared fetch helper ──────────────────────────────────────────────────────
async function metaApiCall(endpoint, body) {
  const url = `${META_API_BASE}/${endpoint}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${META_ACCESS_TOKEN}`
      },
      body:   JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timer);

    const data = await res.json();

    if (!res.ok) {
      console.error(`[MetaAPI] ❌ ${endpoint} — HTTP ${res.status}:`, JSON.stringify(data?.error || data));
      throw new Error(data?.error?.message || `Meta API error ${res.status}`);
    }

    return data;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('Meta API request timed out');
    throw err;
  }
}

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

/**
 * Send a WhatsApp text message.
 * @param {object} params
 * @param {string} params.to           - Recipient phone number (e.g. "919876543210")
 * @param {string} params.text         - Message text
 * @param {string} [params.phoneNumberId] - Override env var PHONE_NUMBER_ID
 */
async function sendWhatsAppMessage({ to, text, phoneNumberId }) {
  if (!META_ACCESS_TOKEN) {
    console.warn('[WhatsApp] META_ACCESS_TOKEN not configured — skipping send');
    return { skipped: true, reason: 'META_ACCESS_TOKEN not configured' };
  }

  const phoneId = phoneNumberId || META_PHONE_NUMBER_ID;
  if (!phoneId) {
    console.warn('[WhatsApp] META_PHONE_NUMBER_ID not configured — skipping send');
    return { skipped: true, reason: 'META_PHONE_NUMBER_ID not configured' };
  }

  console.log(`[WhatsApp] 📤 Sending to ${to}: "${text.substring(0, 60)}..."`);

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type:    'individual',
    to,
    type:              'text',
    text:              { preview_url: false, body: text }
  };

  const result = await metaApiCall(`${phoneId}/messages`, payload);
  console.log(`[WhatsApp] ✅ Message sent. Message ID: ${result?.messages?.[0]?.id}`);
  return result;
}

/**
 * Send a WhatsApp template message (for outbound business-initiated convos).
 * @param {object} params
 * @param {string} params.to           - Recipient phone number
 * @param {string} params.templateName - Approved template name
 * @param {string} params.languageCode - e.g. "en" or "en_US"
 * @param {Array}  params.components   - Template component parameters
 */
async function sendWhatsAppTemplate({ to, templateName, languageCode = 'en', components = [] }) {
  if (!META_ACCESS_TOKEN || !META_PHONE_NUMBER_ID) {
    return { skipped: true, reason: 'Meta credentials not configured' };
  }

  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name:     templateName,
      language: { code: languageCode },
      components
    }
  };

  const result = await metaApiCall(`${META_PHONE_NUMBER_ID}/messages`, payload);
  console.log(`[WhatsApp] ✅ Template "${templateName}" sent to ${to}`);
  return result;
}

// ─── Instagram ────────────────────────────────────────────────────────────────

/**
 * Send an Instagram DM reply.
 * @param {object} params
 * @param {string} params.recipientId - Instagram-scoped User ID
 * @param {string} params.text        - Message text
 */
async function sendInstagramMessage({ recipientId, text }) {
  if (!META_ACCESS_TOKEN) {
    console.warn('[Instagram] META_ACCESS_TOKEN not configured — skipping send');
    return { skipped: true, reason: 'META_ACCESS_TOKEN not configured' };
  }

  const pageId = INSTAGRAM_PAGE_ID;
  if (!pageId) {
    console.warn('[Instagram] INSTAGRAM_PAGE_ID not configured — skipping send');
    return { skipped: true, reason: 'INSTAGRAM_PAGE_ID not configured' };
  }

  console.log(`[Instagram] 📤 Replying to ${recipientId}: "${text.substring(0, 60)}..."`);

  const payload = {
    recipient: { id: recipientId },
    message:   { text: text.substring(0, 1000) } // Instagram limit
  };

  const result = await metaApiCall(`${pageId}/messages`, payload);
  console.log(`[Instagram] ✅ DM sent to ${recipientId}`);
  return result;
}

// ─── Facebook ─────────────────────────────────────────────────────────────────

/**
 * Send a Facebook Page DM reply.
 * @param {object} params
 * @param {string} params.recipientId - Facebook User ID
 * @param {string} params.text        - Message text
 * @param {string} [params.pageId]    - Override env PAGE_ID
 */
async function sendFacebookMessage({ recipientId, text, pageId }) {
  if (!FACEBOOK_PAGE_TOKEN) {
    console.warn('[Facebook] FACEBOOK_PAGE_TOKEN not configured — skipping send');
    return { skipped: true, reason: 'FACEBOOK_PAGE_TOKEN not configured' };
  }

  const fbPageId = pageId || INSTAGRAM_PAGE_ID;
  if (!fbPageId) {
    console.warn('[Facebook] Page ID not configured — skipping send');
    return { skipped: true, reason: 'Page ID not configured' };
  }

  console.log(`[Facebook] 📤 Replying to ${recipientId}: "${text.substring(0, 60)}..."`);

  const payload = {
    recipient: { id: recipientId },
    message:   { text: text.substring(0, 2000) } // FB limit
  };

  const result = await metaApiCall(`${fbPageId}/messages`, payload);
  console.log(`[Facebook] ✅ Message sent to ${recipientId}`);
  return result;
}

// ─── Health Check ─────────────────────────────────────────────────────────────

async function checkMetaCredentials() {
  const status = {
    accessTokenConfigured:   !!META_ACCESS_TOKEN,
    phoneNumberIdConfigured: !!META_PHONE_NUMBER_ID,
    instagramPageIdConfigured: !!INSTAGRAM_PAGE_ID,
    facebookPageTokenConfigured: !!FACEBOOK_PAGE_TOKEN
  };

  // Quick test to verify the access token is valid
  if (META_ACCESS_TOKEN) {
    try {
      const res = await fetch(`${META_API_BASE}/me?access_token=${META_ACCESS_TOKEN}`, {
        signal: AbortSignal.timeout(5000)
      });
      const data = await res.json();
      status.tokenValid = res.ok;
      status.tokenOwner = data?.name || data?.id || 'Unknown';
    } catch {
      status.tokenValid = false;
    }
  }

  return status;
}

module.exports = {
  sendWhatsAppMessage,
  sendWhatsAppTemplate,
  sendInstagramMessage,
  sendFacebookMessage,
  checkMetaCredentials
};
