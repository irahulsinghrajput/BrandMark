/**
 * Forwards a saved strategy request to the n8n lead-capture workflow.
 *
 * Configuration (environment variables only, nothing hard-coded):
 *   N8N_LEAD_WEBHOOK_URL   Production webhook URL of the "BrandMark lead capture" workflow
 *   N8N_LEAD_WEBHOOK_SECRET Shared secret, sent as the x-webhook-secret header
 *
 * Never throws: the result is written to the document's `automation` field so a
 * failed hand-off can be retried from the admin endpoint.
 */

const FORWARD_TIMEOUT_MS = 8000;

function payloadFor(doc) {
    return {
        id: String(doc._id),
        receivedAt: doc.createdAt ? doc.createdAt.toISOString() : new Date().toISOString(),
        contactName: doc.contactName,
        email: doc.email,
        phone: doc.phone || '',
        companyName: doc.companyName,
        website: doc.website || '',
        city: doc.city,
        budget: doc.budget,
        services: doc.services || [],
        message: doc.message || '',
        source: doc.source || '',
        consent: { given: doc.consent.given, version: doc.consent.version, at: doc.consent.at }
    };
}

async function forwardStrategyRequest(doc, { fetchImpl = fetch } = {}) {
    const url = process.env.N8N_LEAD_WEBHOOK_URL;
    const secret = process.env.N8N_LEAD_WEBHOOK_SECRET;

    doc.automation = doc.automation || {};
    doc.automation.attempts = (doc.automation.attempts || 0) + 1;
    doc.automation.lastAttemptAt = new Date();

    if (!url || !secret) {
        doc.automation.state = 'not_configured';
        doc.automation.lastError = 'N8N_LEAD_WEBHOOK_URL or N8N_LEAD_WEBHOOK_SECRET is not set';
        await doc.save();
        return doc.automation.state;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FORWARD_TIMEOUT_MS);
    try {
        const res = await fetchImpl(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-webhook-secret': secret },
            body: JSON.stringify(payloadFor(doc)),
            signal: controller.signal
        });
        if (!res.ok) throw new Error(`n8n returned HTTP ${res.status}`);
        doc.automation.state = 'sent';
        doc.automation.lastError = undefined;
    } catch (err) {
        doc.automation.state = 'failed';
        doc.automation.lastError = err.name === 'AbortError' ? `n8n did not answer within ${FORWARD_TIMEOUT_MS / 1000}s` : err.message;
        console.error(`[leads] n8n hand-off failed for ${doc._id}: ${doc.automation.lastError}`);
    } finally {
        clearTimeout(timer);
    }
    await doc.save();
    return doc.automation.state;
}

module.exports = { forwardStrategyRequest, payloadFor };
