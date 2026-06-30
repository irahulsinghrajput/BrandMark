const crypto = require('crypto');

/**
 * Verify Razorpay webhook signature
 * @param {string} webhookBody - Raw webhook request body as string
 * @param {string} webhookSignature - Signature from X-Razorpay-Signature header
 * @param {string} webhookSecret - Your webhook secret from Razorpay dashboard
 * @returns {boolean} True if signature is valid
 */
const verifyWebhookSignature = (webhookBody, webhookSignature, webhookSecret) => {
    try {
        // Create HMAC SHA256 hash
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(webhookBody)
            .digest('hex');

        // Compare signatures (constant-time comparison to prevent timing attacks)
        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(webhookSignature)
        );
    } catch (error) {
        console.error('❌ Webhook signature verification failed:', error.message);
        return false;
    }
};

/**
 * Generate Razorpay order ID with signature for frontend
 * @param {object} orderData - Order data from Razorpay
 * @param {string} keyId - Razorpay key ID
 * @returns {object} Order data with signature
 */
const generateOrderSignature = (orderData, keyId) => {
    return {
        ...orderData,
        key_id: keyId
    };
};

/**
 * Validate payment signature (frontend to backend)
 * @param {object} paymentData - Payment details
 * @param {string} signature - Payment signature
 * @param {string} secret - Key secret
 * @returns {boolean} True if valid
 */
const validatePaymentSignature = (paymentData, signature, secret) => {
    try {
        const { order_id, payment_id } = paymentData;
        const body = `${order_id}|${payment_id}`;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(signature)
        );
    } catch (error) {
        console.error('❌ Payment signature validation failed:', error.message);
        return false;
    }
};

module.exports = {
    verifyWebhookSignature,
    generateOrderSignature,
    validatePaymentSignature
};
