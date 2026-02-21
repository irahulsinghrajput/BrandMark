const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true
    },
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
        required: [true, 'Phone is required'],
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    coverLetter: {
        type: String
    },
    resume: {
        type: String, // File path
        required: [true, 'Resume is required']
    },
    portfolio: {
        type: String // Optional file path or URL
    },
    status: {
        type: String,
        enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Career', careerSchema);
