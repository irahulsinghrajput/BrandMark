/**
 * BrandMark Lead Marketplace models.
 * Requirement = a customer's request (a "lead"), posted by the customer with explicit consent.
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;

const requirementSchema = new Schema({
    category: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    locality: { type: String, trim: true, maxlength: 80 },
    pincode: { type: String, trim: true, maxlength: 6 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    budget: { type: String },
    timeline: { type: String },

    // Personal data — shown only to businesses that unlock, wiped on deletion
    name: { type: String, trim: true, maxlength: 80 },
    phone: { type: String },
    email: { type: String, trim: true, lowercase: true },
    phoneHash: { type: String, index: true },

    phoneVerified: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['pending_otp', 'live', 'rejected', 'withdrawn', 'deleted'],
        default: 'pending_otp',
        index: true
    },
    shareLimit: { type: Number, required: true },
    unlockCount: { type: Number, default: 0 },
    manageTokenHash: { type: String, index: true },
    expiresAt: { type: Date },
    ipHash: { type: String },
    source: { type: String, default: 'website' }
}, { timestamps: true });

const consentRecordSchema = new Schema({
    requirement: { type: Schema.Types.ObjectId, ref: 'MpRequirement', index: true },
    consentVersion: { type: String, required: true },
    consentText: { type: String, required: true },
    purpose: { type: String, required: true },
    shareLimit: { type: Number, required: true },
    phoneHash: { type: String },       // no raw personal data in the consent log
    ipHash: { type: String },
    userAgent: { type: String },
    givenAt: { type: Date, default: Date.now },
    phoneVerifiedAt: { type: Date },
    withdrawnAt: { type: Date },
    deletedAt: { type: Date },
    events: [{
        type: { type: String },        // given | verified | shared | withdrawn | deleted | rejected
        at: { type: Date, default: Date.now },
        business: { type: Schema.Types.ObjectId, ref: 'MpBusiness' },
        note: String
    }]
});

const otpSchema = new Schema({
    requirement: { type: Schema.Types.ObjectId, ref: 'MpRequirement', index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    resends: { type: Number, default: 0 },
    used: { type: Boolean, default: false }
}, { timestamps: true });

const businessSchema = new Schema({
    businessName: { type: String, required: true, trim: true, maxlength: 120 },
    ownerName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    categories: [{ type: String }],
    cities: [{ type: String }],
    gstin: { type: String, trim: true, uppercase: true },
    website: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'suspended'], default: 'pending', index: true },
    credits: { type: Number, default: 0, min: 0 },
    termsAcceptedAt: { type: Date }
}, { timestamps: true });

const unlockSchema = new Schema({
    business: { type: Schema.Types.ObjectId, ref: 'MpBusiness', required: true },
    requirement: { type: Schema.Types.ObjectId, ref: 'MpRequirement', required: true },
    creditsSpent: { type: Number, default: 1 },
    reported: { type: Boolean, default: false },
    reportReason: { type: String, maxlength: 300 },
    reportStatus: { type: String, enum: ['none', 'open', 'refunded', 'declined'], default: 'none' }
}, { timestamps: true });
unlockSchema.index({ business: 1, requirement: 1 }, { unique: true });

const creditTxnSchema = new Schema({
    business: { type: Schema.Types.ObjectId, ref: 'MpBusiness', required: true, index: true },
    delta: { type: Number, required: true },
    reason: { type: String, enum: ['admin_grant', 'unlock', 'refund', 'purchase'], required: true },
    ref: { type: Schema.Types.ObjectId },
    note: { type: String, maxlength: 200 },
    by: { type: String }
}, { timestamps: true });

module.exports = {
    Requirement: mongoose.models.MpRequirement || mongoose.model('MpRequirement', requirementSchema),
    ConsentRecord: mongoose.models.MpConsentRecord || mongoose.model('MpConsentRecord', consentRecordSchema),
    OtpChallenge: mongoose.models.MpOtpChallenge || mongoose.model('MpOtpChallenge', otpSchema),
    Business: mongoose.models.MpBusiness || mongoose.model('MpBusiness', businessSchema),
    Unlock: mongoose.models.MpUnlock || mongoose.model('MpUnlock', unlockSchema),
    CreditTxn: mongoose.models.MpCreditTxn || mongoose.model('MpCreditTxn', creditTxnSchema)
};
