const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        index: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true
    },
    studentName: {
        type: String,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    moduleNumber: Number,
    completedLessons: [{
        lessonId: String,
        completedAt: Date,
        timeSpent: Number  // minutes
    }],
    totalCompletedLessons: {
        type: Number,
        default: 0
    },
    overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    // Quiz & Certification Fields
    quizAttempts: [{
        attemptNumber: Number,
        score: {
            type: Number,
            min: 0,
            max: 100
        },
        totalQuestions: Number,
        correctAnswers: Number,
        attemptedAt: {
            type: Date,
            default: Date.now
        },
        nextRetakeAvailable: Date,
        isPassing: Boolean
    }],
    highest_score: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    certificateInfo: {
        certificateId: String,
        issuedAt: Date,
        certificateUrl: String,
        verificationCode: String,
        qrCode: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: String,
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    lastAccessedAt: Date,
    status: {
        type: String,
        enum: ['enrolled', 'in-progress', 'completed', 'certified'],
        default: 'enrolled'
    }
});

// Index for efficient queries
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
enrollmentSchema.index({ certificateInfo: 1 });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
