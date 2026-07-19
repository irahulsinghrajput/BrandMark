const mongoose = require('mongoose');

const attributionTouchSchema = new mongoose.Schema({
    source: { type: String, trim: true },
    medium: { type: String, trim: true },
    campaign: { type: String, trim: true },
    referrer: { type: String, trim: true },
    landingPath: { type: String, trim: true },
    capturedAt: { type: String, trim: true },
    utm: {
        type: Map,
        of: String,
        default: {}
    }
}, { _id: false });

const attributionSchema = new mongoose.Schema({
    firstTouch: { type: attributionTouchSchema, default: null },
    lastTouch: { type: attributionTouchSchema, default: null },
    sessionPath: { type: String, trim: true },
    pageUrl: { type: String, trim: true },
    userAgent: { type: String, trim: true }
}, { _id: false });

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    attribution: {
        type: attributionSchema,
        default: null
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    unsubscribedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
