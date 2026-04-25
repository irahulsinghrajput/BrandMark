const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a course title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a course description']
    },
    category: {
        type: String,
        enum: ['Foundation', 'Content & Copywriting', 'Paid Advertising', 'Social Media & Influencer', 'Advanced Strategy', 'Capstone'],
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Capstone'],
        required: true
    },
    duration: {
        type: Number,
        required: true,
        default: 0  // hours
    },
    moduleNumber: {
        type: Number,
        required: true,
        unique: true
    },
    lessons: [{
        title: String,
        duration: Number,  // minutes
        videoUrl: String,
        content: String,
        resources: [String]
    }],
    learningObjectives: [String],
    aiToolsFocused: [String],
    videoIntro: {
        url: String,
        duration: Number
    },
    resources: {
        pdf: [String],
        xlsx: [String],
        docx: [String],
        other: [String]
    },
    videoUrl: String,
    nextModule: Number,
    previousModule: Number,
    isPublished: {
        type: Boolean,
        default: false
    },
    enrollmentCount: {
        type: Number,
        default: 0
    },
    avgRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-generate slug from title
courseSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Course', courseSchema);
