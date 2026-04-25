const { body, query, param, validationResult } = require('express-validator');

/**
 * Centralized validation error handler
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

/**
 * Validation chains for different endpoints
 */

// Contact form validation
const validateContactForm = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .matches(/^[\d\s\-\+\(\)]{10,}$/).withMessage('Invalid phone format (minimum 10 digits)'),
    
    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ min: 3, max: 200 }).withMessage('Subject must be 3-200 characters'),
    
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 5000 }).withMessage('Message must be 10-5000 characters'),
    
    handleValidationErrors
];

// Career application validation
const validateCareerApplication = [
    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .matches(/^[\d\s\-\+\(\)]{10,}$/).withMessage('Invalid phone format'),
    
    body('position')
        .trim()
        .notEmpty().withMessage('Position is required'),
    
    body('experience')
        .trim()
        .isInt({ min: 0, max: 60 }).withMessage('Experience must be a number between 0-60'),
    
    body('portfolio')
        .optional()
        .trim()
        .isURL().withMessage('Portfolio must be a valid URL'),
    
    body('linkedIn')
        .optional()
        .trim()
        .isURL().withMessage('LinkedIn must be a valid URL'),
    
    handleValidationErrors
];

// Newsletter subscription validation
const validateNewsletter = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    handleValidationErrors
];

// Course order validation
const validateCourseOrder = [
    param('courseId')
        .trim()
        .notEmpty().withMessage('Course ID is required'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    handleValidationErrors
];

// Blog comment validation
const validateBlogComment = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('comment')
        .trim()
        .notEmpty().withMessage('Comment is required')
        .isLength({ min: 2, max: 1000 }).withMessage('Comment must be 2-1000 characters'),
    
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    
    handleValidationErrors
];

// Admin login validation
const validateAdminLogin = [
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
    handleValidationErrors
];

// Quiz answer validation
const validateQuizAnswer = [
    body('quizId')
        .trim()
        .notEmpty().withMessage('Quiz ID is required'),
    
    body('answers')
        .isArray().withMessage('Answers must be an array')
        .notEmpty().withMessage('At least one answer is required'),
    
    handleValidationErrors
];

module.exports = {
    validateContactForm,
    validateCareerApplication,
    validateNewsletter,
    validateCourseOrder,
    validateBlogComment,
    validateAdminLogin,
    validateQuizAnswer,
    handleValidationErrors
};
