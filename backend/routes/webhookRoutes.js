/**
 * webhookRoutes.js
 * ─────────────────────────────────────────────────────
 * Meta (Facebook / Instagram / WhatsApp) Webhook Router
 *
 * Handles:
 *  GET  /api/webhooks/meta  → Challenge handshake verification
 *  POST /api/webhooks/meta  → Incoming event dispatcher
 *
 * Incoming payloads are:
 *  1. Classified by channel (whatsapp / instagram / facebook)
 *  2. Logged for Render diagnostics
 *  3. Forwarded asynchronously to n8n for AI processing
 *  4. Routed to the MetaWebhookController for any sync side-effects
 */

const express = require('express');
const router  = express.Router();
const metaWebhookController = require('../controllers/metaWebhookController');

// ─── Configuration (all from .env) ───────────────────────────────────────────
const VERIFY_TOKEN  = process.env.META_VERIFY_TOKEN  || 'brandmark_meta_secret_2026';
const N8N_URL       = process.env.N8N_WEBHOOK_URL    || 'https://n8n-latest-jyat.onrender.com/webhook/af413bd6-3005-467c-b419-aeabf12e9697';
const N8N_SECRET    = process.env.N8N_WEBHOOK_SECRET || 'W27fFgcKR9HdjN4';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Classify which Meta channel sent this payload.
 * @param {object} body - Raw webhook body
 * @returns {'whatsapp'|'instagram'|'facebook'|'unknown'}
 */
function classifyChannel(body) {
  const obj = body.object || '';
  if (obj === 'whatsapp_business_account') return 'whatsapp';
  if (obj === 'instagram')                 return 'instagram';
  if (obj === 'page')                      return 'facebook';
  return 'unknown';
}

/**
 * Extract the first message text from a WhatsApp / Instagram payload.
 * @param {object} body
 * @returns {{ senderId: string, text: string, channel: string } | null}
 */
function extractMessage(body, channel) {
  try {
    if (channel === 'whatsapp') {
      const entry   = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const msg     = changes?.value?.messages?.[0];
      if (!msg) return null;
      return {
        senderId:    msg.from,
        text:        msg.text?.body || '',
        messageType: msg.type       || 'text',
        channel,
        phoneNumberId: changes?.value?.metadata?.phone_number_id,
        timestamp:   msg.timestamp
      };
    }

    if (channel === 'instagram') {
      const entry    = body.entry?.[0];
      const msg      = entry?.messaging?.[0];
      if (!msg) return null;
      return {
        senderId: msg.sender?.id,
        text:     msg.message?.text || '',
        messageType: 'text',
        channel,
        timestamp: msg.timestamp
      };
    }

    if (channel === 'facebook') {
      const entry = body.entry?.[0];
      const msg   = entry?.messaging?.[0];
      if (!msg) return null;
      return {
        senderId: msg.sender?.id,
        text:     msg.message?.text || '',
        messageType: 'text',
        channel,
        pageId: entry.id,
        timestamp: msg.timestamp
      };
    }
  } catch (err) {
    console.error('[MetaWebhook] extractMessage error:', err.message);
  }
  return null;
}

/**
 * Forward event to n8n asynchronously (fire-and-forget).
 * Wraps the raw Meta payload with enriched metadata.
 */
async function forwardToN8n(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(N8N_URL, {
      method: 'POST',
      headers: {
        'Content-Type':   'application/json',
        'x-webhook-secret': N8N_SECRET,
        'x-source-channel': payload.channel || 'meta'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.error(`[MetaWebhook→n8n] HTTP ${res.status}: ${await res.text()}`);
    } else {
      console.log(`[MetaWebhook→n8n] ✅ Forwarded ${payload.channel} event (${res.status})`);
    }
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      console.error('[MetaWebhook→n8n] ⏱️ Request timed out after 10s');
    } else {
      console.error('[MetaWebhook→n8n] ❌ Forward error:', err.message);
    }
  }
}

// ─── GET /api/webhooks/meta ─── Challenge Verification ───────────────────────
router.get('/meta', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('[MetaWebhook] 🔐 Verification request — mode:', mode, '| token match:', token === VERIFY_TOKEN);

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[MetaWebhook] ✅ Webhook VERIFIED — returning challenge');
    return res.status(200).send(challenge);
  }

  console.warn('[MetaWebhook] ⛔ Verification FAILED — invalid token');
  return res.sendStatus(403);
});

// ─── POST /api/webhooks/meta ─── Incoming Event Handler ──────────────────────
router.post('/meta', (req, res) => {
  const body    = req.body;
  const channel = classifyChannel(body);
  const message = extractMessage(body, channel);

  // ─ Diagnostic logs (visible on Render) ─
  console.log(`[MetaWebhook] 📨 Incoming event | Channel: ${channel} | Object: ${body.object}`);
  if (message) {
    console.log(`[MetaWebhook]   From: ${message.senderId} | Text: "${message.text?.substring(0, 80)}" | Type: ${message.messageType}`);
  }

  // ─ Respond immediately with 200 (required by Meta — must be < 20s) ─
  res.status(200).send('EVENT_RECEIVED');

  // ─ Async processing (non-blocking) ─
  setImmediate(async () => {
    try {
      // 1. Forward enriched payload to n8n for AI processing
      const n8nPayload = {
        source:   'meta_webhook',
        channel,
        object:   body.object,
        message:  message || null,
        rawBody:  body,
        receivedAt: new Date().toISOString()
      };
      await forwardToN8n(n8nPayload);

      // 2. Trigger local controller for any sync side-effects
      if (message) {
        await metaWebhookController.handleIncomingMessage(message);
      }
    } catch (err) {
      console.error('[MetaWebhook] Async processing error:', err.message);
    }
  });
});

// ─── GET /api/webhooks/health ─── Webhook health check ───────────────────────
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Meta Webhook Router',
    verifyTokenConfigured: VERIFY_TOKEN !== 'brandmark_meta_secret_2026',
    n8nUrl: N8N_URL.replace(/\/webhook.*$/, '/webhook/***'),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
