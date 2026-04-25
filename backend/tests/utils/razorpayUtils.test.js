// tests/utils/razorpayUtils.test.js

const { verifyWebhookSignature, validatePaymentSignature } = require('../../utils/razorpayUtils');
const crypto = require('crypto');

describe('Razorpay Utilities', () => {
    const webhookSecret = 'test-webhook-secret';
    const keySecret = 'test-key-secret';

    describe('verifyWebhookSignature', () => {
        it('should verify a valid webhook signature', () => {
            const webhookBody = JSON.stringify({
                event: 'payment.authorized',
                payload: { payment: { entity: { id: 'test-123' } } }
            });

            // Create valid signature
            const validSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(webhookBody)
                .digest('hex');

            const result = verifyWebhookSignature(webhookBody, validSignature, webhookSecret);
            expect(result).toBe(true);
        });

        it('should reject an invalid webhook signature', () => {
            const webhookBody = JSON.stringify({
                event: 'payment.authorized',
                payload: { payment: { entity: { id: 'test-123' } } }
            });

            const invalidSignature = 'invalid-signature-hex-string';

            const result = verifyWebhookSignature(webhookBody, invalidSignature, webhookSecret);
            expect(result).toBe(false);
        });

        it('should handle malformed input gracefully', () => {
            const result = verifyWebhookSignature(null, 'sig', webhookSecret);
            expect(result).toBe(false);
        });
    });

    describe('validatePaymentSignature', () => {
        it('should validate a correct payment signature', () => {
            const orderId = 'order_123';
            const paymentId = 'pay_456';
            const body = `${orderId}|${paymentId}`;

            const validSignature = crypto
                .createHmac('sha256', keySecret)
                .update(body)
                .digest('hex');

            const result = validatePaymentSignature(
                { order_id: orderId, payment_id: paymentId },
                validSignature,
                keySecret
            );

            expect(result).toBe(true);
        });

        it('should reject an incorrect payment signature', () => {
            const result = validatePaymentSignature(
                { order_id: 'order_123', payment_id: 'pay_456' },
                'invalid-signature',
                keySecret
            );

            expect(result).toBe(false);
        });
    });
});
