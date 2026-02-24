const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true
    },
    excerpt: {
        type: String,
        required: [true, 'Excerpt is required'],
        maxlength: 300
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    featuredImage: {
        type: String // Image path or URL
    },
    category: {
        type: String,
        enum: ['Branding', 'Marketing', 'Design', 'Business Tips', 'Case Studies', 'Other'],
        default: 'Other'
    },
    tags: [{
        type: String,
        trim: true
    }],
    published: {
        type: Boolean,
        default: false
    },
    views: {
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

// Update slug from title
blogSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Blog', blogSchema);
