const mongoose = require('mongoose');

/**
 * A "Request Strategy Outline" enquiry from the Contact page.
 * Saved before anything else happens, so an enquiry is never lost even if the
 * n8n automation is asleep or down. `automation` records whether it reached n8n.
 */
const strategyRequestSchema = new mongoose.Schema({
    contactName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 30 },
    companyName: { type: String, required: true, trim: true, maxlength: 160 },
    website: { type: String, trim: true, maxlength: 300 },
    city: { type: String, required: true, trim: true, maxlength: 120 },
    budget: { type: String, required: true, trim: true, maxlength: 40 },
    services: { type: [String], default: [] },
    message: { type: String, trim: true, maxlength: 2000 },
    source: { type: String, trim: true, maxlength: 80 },
    consent: {
        given: { type: Boolean, required: true },
        version: { type: String, required: true },
        text: { type: String, required: true },
        at: { type: Date, required: true }
    },
    status: { type: String, enum: ['new', 'contacted', 'qualified', 'won', 'lost', 'spam'], default: 'new' },
    automation: {
        state: { type: String, enum: ['pending', 'sent', 'failed', 'not_configured'], default: 'pending' },
        attempts: { type: Number, default: 0 },
        lastAttemptAt: Date,
        lastError: String
    }
}, { timestamps: true });

strategyRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('StrategyRequest', strategyRequestSchema);
