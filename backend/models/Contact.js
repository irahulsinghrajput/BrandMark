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

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    attribution: {
        type: attributionSchema,
        default: null
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', contactSchema);
