const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
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
    website: {
        type: String,
        trim: true
    },
    serviceType: {
        type: String,
        required: [true, 'Service type is required'],
        enum: ['branding', 'social_media_content', 'web_design', 'content', 'marketing_strategy', 'digital_ads_setup']
    },
    companySize: {
        type: String,
        required: [true, 'Company size is required'],
        enum: ['1-5', '6-20', '21-50', '51-200', '200+']
    },
    market: {
        type: String,
        required: [true, 'Market is required'],
        enum: ['us', 'europe', 'middle_east']
    },
    timeline: {
        type: String,
        trim: true
    },
    budget: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    quoteAmount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        enum: ['USD', 'EUR']
    },
    quoteDisplay: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'reviewed', 'sent', 'won', 'lost'],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quote', quoteSchema);
