const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// File type configurations with size limits
const FILE_TYPES = {
    resume: {
        extensions: ['.pdf', '.doc', '.docx'],
        mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        maxSize: 5 * 1024 * 1024, // 5MB
        description: 'Resume (PDF, DOC, DOCX)'
    },
    portfolio: {
        extensions: ['.pdf', '.zip', '.rar', '.7z'],
        mimeTypes: ['application/pdf', 'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
        maxSize: 20 * 1024 * 1024, // 20MB
        description: 'Portfolio (PDF, ZIP, RAR, 7Z)'
    },
    image: {
        extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
        mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxSize: 10 * 1024 * 1024, // 10MB
        description: 'Image (JPG, PNG, GIF, WebP)'
    }
};

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Create secure filename: remove special chars, add hash
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9_-]/g, '_') // Replace special chars
            .substring(0, 50); // Limit length
        
        const hash = crypto.randomBytes(8).toString('hex');
        const timestamp = Date.now();
        
        cb(null, `${nameWithoutExt}-${timestamp}-${hash}${ext}`);
    }
});

// Enhanced file filter function
const fileFilter = (req, file, cb) => {
    const fieldConfig = FILE_TYPES[file.fieldname];

    if (!fieldConfig) {
        return cb(new Error(`Unknown file field: ${file.fieldname}`), false);
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    // Check extension
    if (!fieldConfig.extensions.includes(ext)) {
        return cb(new Error(
            `Invalid file type for ${file.fieldname}. Allowed: ${fieldConfig.extensions.join(', ')}`
        ), false);
    }

    // Check MIME type for security
    if (!fieldConfig.mimeTypes.includes(mimeType)) {
        return cb(new Error(
            `Invalid MIME type for ${file.fieldname}. Detected: ${mimeType}`
        ), false);
    }

    cb(null, true);
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 20MB global limit
        files: 1 // Only 1 file per request
    },
    fileFilter: fileFilter
});

// Enhanced error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Error uploading file'
        });
    }
    next();
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;
