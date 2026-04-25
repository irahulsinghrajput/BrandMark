/**
 * Custom error class for API errors
 */
class APIError extends Error {
    constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.timestamp = new Date().toISOString();
    }
}

/**
 * Custom error class for validation errors
 */
class ValidationError extends APIError {
    constructor(message, errors = []) {
        super(message, 400, 'VALIDATION_ERROR');
        this.errors = errors;
    }
}

/**
 * Custom error class for authentication errors
 */
class AuthenticationError extends APIError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'AUTH_ERROR');
    }
}

/**
 * Custom error class for authorization errors
 */
class AuthorizationError extends APIError {
    constructor(message = 'Access denied') {
        super(message, 403, 'FORBIDDEN');
    }
}

/**
 * Custom error class for resource not found
 */
class NotFoundError extends APIError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

/**
 * Custom error class for conflict errors
 */
class ConflictError extends APIError {
    constructor(message) {
        super(message, 409, 'CONFLICT');
    }
}

/**
 * Custom error class for payment errors
 */
class PaymentError extends APIError {
    constructor(message) {
        super(message, 402, 'PAYMENT_ERROR');
    }
}

/**
 * Global error handler middleware
 * Must be last middleware in the chain
 */
const errorHandler = (err, req, res, next) => {
    // Log error details
    console.error('🔴 ERROR OCCURRED:');
    console.error('   Message:', err.message);
    console.error('   Status:', err.statusCode || 500);
    console.error('   Code:', err.errorCode || 'UNKNOWN');
    console.error('   Path:', req.path);
    console.error('   Method:', req.method);
    if (process.env.NODE_ENV === 'development') {
        console.error('   Stack:', err.stack);
    }

    // Handle known error types
    if (err instanceof APIError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errorCode: err.errorCode,
            ...(err instanceof ValidationError && { errors: err.errors }),
            timestamp: err.timestamp,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    // Handle Multer errors
    if (err.name === 'MulterError') {
        let message = 'File upload error';
        let statusCode = 400;

        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File size exceeds limit';
        } else if (err.code === 'LIMIT_FILE_COUNT') {
            message = 'Too many files uploaded';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            message = 'Unexpected file field';
        }

        return res.status(statusCode).json({
            success: false,
            message,
            errorCode: 'UPLOAD_ERROR',
            timestamp: new Date().toISOString()
        });
    }

    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
        const errors = Object.keys(err.errors).map(field => ({
            field,
            message: err.errors[field].message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errorCode: 'VALIDATION_ERROR',
            errors,
            timestamp: new Date().toISOString()
        });
    }

    // Handle MongoDB duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            message: `${field} already exists`,
            errorCode: 'DUPLICATE_ERROR',
            timestamp: new Date().toISOString()
        });
    }

    // Handle MongoDB cast errors
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid resource ID format',
            errorCode: 'INVALID_ID',
            timestamp: new Date().toISOString()
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
            errorCode: 'JWT_ERROR',
            timestamp: new Date().toISOString()
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token expired',
            errorCode: 'TOKEN_EXPIRED',
            timestamp: new Date().toISOString()
        });
    }

    // Default error response (catch-all)
    res.status(err.statusCode || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message,
        errorCode: err.errorCode || 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * Async handler wrapper to catch unhandled promise rejections
 * Usage: router.get('/route', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    APIError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    PaymentError,
    errorHandler,
    asyncHandler
};
