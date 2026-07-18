/**
 * n8nWebhookService.js
 * Sends lead data to the n8n automation workflow via HTTP POST.
 * Reads credentials from environment variables for security.
 * Falls back gracefully so lead is never lost if n8n is unreachable.
 */

// Timeout for webhook requests (ms) - keeps server responsive on free Render tier
const WEBHOOK_TIMEOUT_MS = 15000;

/**
 * Sends lead data to the configured n8n webhook.
 * @param {object} leadData - The lead payload (fullName, email, websiteUrl, source, etc.)
 * @returns {Promise<object>} n8n response JSON or { success: true } fallback
 */
const sendToN8nWebhook = async (leadData) => {
  // Using the correct production Render URL for your n8n instance
  const webhookUrl = process.env.N8N_WEBHOOK_URL || "https://n8n-latest-jyat.onrender.com/webhook/af413bd6-3005-467c-b419-aeabf12e9697";
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET || "W27fFgcKR9HdjN4";

  // Abort controller for request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    console.log(`📤 Sending lead to n8n: ${leadData.email} | URL: ${webhookUrl}`);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": webhookSecret
      },
      body: JSON.stringify({
        ...leadData,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`n8n returned HTTP ${response.status}: ${body}`);
    }

    console.log(`✅ n8n webhook success for ${leadData.email}`);

    // Handle non-JSON responses (n8n can return plain text in test mode)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return { success: true };

  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.error(`⏱️  n8n webhook timed out after ${WEBHOOK_TIMEOUT_MS}ms for ${leadData.email}`);
      throw new Error(`n8n webhook timed out after ${WEBHOOK_TIMEOUT_MS}ms`);
    }

    console.error(`❌ n8n webhook error for ${leadData.email}:`, error.message);
    throw error;
  }
};

/**
 * Diagnostic ping to check if n8n is reachable (does not trigger workflow).
 * @returns {Promise<boolean>} true if n8n server responds
 */
const pingN8n = async () => {
  const baseUrl = (process.env.N8N_WEBHOOK_URL || "https://n8n-latest-jyat.onrender.com/webhook-test/af413bd6-3005-467c-b419-aeabf12e9697")
    .replace(/\/webhook.*$/, "");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(baseUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response.status < 500;
  } catch {
    return false;
  }
};

module.exports = { sendToN8nWebhook, pingN8n };
