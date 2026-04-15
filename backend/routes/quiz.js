const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { authenticateToken } = require('../middleware/auth');
const {
    generateQRCode,
    generateCertificatePDF,
    sendCertificateEmail,
    generateVerificationCode
} = require('../utils/certificateGenerator');
const crypto = require('crypto');

// Constants
const PASSING_SCORE = 80;
const RETAKE_WAIT_HOURS = 24;

/**
 * POST /api/quiz/submit
 * Submit quiz answers and calculate score
 */
router.post('/submit', authenticateToken, async (req, res) => {
    try {
        const { enrollmentId, courseId, answers, totalQuestions } = req.body;
        const userId = req.user.id;

        // Validation
        if (!enrollmentId || !courseId || !answers || !totalQuestions) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: enrollmentId, courseId, answers, totalQuestions'
            });
        }

        // Find enrollment
        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        // Verify user owns this enrollment
        if (enrollment.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: You do not own this enrollment'
            });
        }

        // Check if student can retake (24-hour rule)
        if (enrollment.quizAttempts && enrollment.quizAttempts.length > 0) {
            const lastAttempt = enrollment.quizAttempts[enrollment.quizAttempts.length - 1];
            
            // If last attempt was passing, don't allow retake
            if (lastAttempt.isPassing) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already passed this course. Certificate cannot be reissued.'
                });
            }

            // Check 24-hour wait period
            const now = new Date();
            if (lastAttempt.nextRetakeAvailable && now < lastAttempt.nextRetakeAvailable) {
                const hoursLeft = Math.ceil((lastAttempt.nextRetakeAvailable - now) / (1000 * 60 * 60));
                return res.status(400).json({
                    success: false,
                    message: `Please wait ${hoursLeft} more hours before retaking the quiz`,
                    nextRetakeAvailable: lastAttempt.nextRetakeAvailable
                });
            }
        }

        // Calculate score (simple: count correct answers)
        const correctAnswers = answers.filter(a => a.isCorrect).length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const isPassing = score >= PASSING_SCORE;

        // Calculate next retake available
        const nextRetakeAvailable = new Date(Date.now() + RETAKE_WAIT_HOURS * 60 * 60 * 1000);

        // Create quiz attempt record
        const attemptNumber = (enrollment.quizAttempts?.length || 0) + 1;
        const quizAttempt = {
            attemptNumber,
            score,
            totalQuestions,
            correctAnswers,
            nextRetakeAvailable: isPassing ? null : nextRetakeAvailable,
            isPassing
        };

        // Update enrollment with quiz attempt
        enrollment.quizAttempts = enrollment.quizAttempts || [];
        enrollment.quizAttempts.push(quizAttempt);

        // Update highest score
        if (score > enrollment.highest_score) {
            enrollment.highest_score = score;
        }

        // If passing, generate certificate
        let certificateData = null;
        if (isPassing) {
            certificateData = await issueCertificate(enrollment, courseId);
            enrollment.status = 'certified';
            enrollment.completedAt = new Date();
            enrollment.certificateInfo = {
                certificateId: certificateData.certificateId,
                issuedAt: new Date(),
                certificateUrl: certificateData.certificateUrl,
                verificationCode: certificateData.verificationCode,
                qrCode: certificateData.qrCode
            };

            // Send certificate email
            try {
                await sendCertificateEmail(enrollment.email, enrollment.studentName, {
                    certificateId: certificateData.certificateId,
                    score: score,
                    fileName: certificateData.fileName,
                    html: certificateData.html
                });
            } catch (emailError) {
                console.error('Error sending certificate email:', emailError);
                // Don't fail the quiz submission if email fails
            }
        }

        // Save updated enrollment
        await enrollment.save();

        return res.status(200).json({
            success: true,
            message: isPassing 
                ? 'Congratulations! You passed and earned your certificate!'
                : `Your score: ${score}%. You need ${PASSING_SCORE}% to pass. Retake available after ${RETAKE_WAIT_HOURS} hours.`,
            data: {
                attempt: quizAttempt,
                isPassing,
                score,
                highestScore: enrollment.highest_score,
                certificateData: isPassing ? certificateData : null
            }
        });

    } catch (error) {
        console.error('Quiz submission error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error submitting quiz',
            error: error.message
        });
    }
});

/**
 * GET /api/quiz/enrollment/:enrollmentId
 * Get quiz attempts and progress for an enrollment
 */
router.get('/enrollment/:enrollmentId', authenticateToken, async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const userId = req.user.id;

        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        // Verify user owns this enrollment
        if (enrollment.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                quizAttempts: enrollment.quizAttempts,
                highestScore: enrollment.highest_score,
                isPassed: enrollment.status === 'certified',
                certificateInfo: enrollment.certificateInfo,
                canRetake: enrollment.quizAttempts?.length === 0 || 
                           (enrollment.quizAttempts[enrollment.quizAttempts.length - 1].isPassing === false &&
                            new Date() >= enrollment.quizAttempts[enrollment.quizAttempts.length - 1].nextRetakeAvailable)
            }
        });

    } catch (error) {
        console.error('Error fetching quiz data:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching quiz data',
            error: error.message
        });
    }
});

/**
 * GET /api/quiz/verify-certificate/:certificateId
 * Public endpoint to verify certificate authenticity
 */
router.get('/verify-certificate/:certificateId', async (req, res) => {
    try {
        const { certificateId } = req.params;

        const enrollment = await Enrollment.findOne({
            'certificateInfo.certificateId': certificateId
        });

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Certificate not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                studentName: enrollment.studentName,
                courseId: enrollment.courseId,
                score: enrollment.highest_score,
                issuedAt: enrollment.certificateInfo.issuedAt,
                certificateId: enrollment.certificateInfo.certificateId,
                verificationCode: enrollment.certificateInfo.verificationCode,
                status: 'valid'
            }
        });

    } catch (error) {
        console.error('Error verifying certificate:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verifying certificate',
            error: error.message
        });
    }
});

/**
 * Helper function to issue certificate
 */
async function issueCertificate(enrollment, courseId) {
    try {
        // Get course title
        const course = await Course.findById(courseId);
        const courseTitle = course?.title || 'Digital Marketing Mastery with Gen AI';

        // Generate unique certificate ID
        const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const verificationCode = generateVerificationCode();

        // Generate QR code
        const qrCodeDataURL = await generateQRCode(certificateId, enrollment.studentName);

        // Generate certificate PDF
        const certificateData = await generateCertificatePDF(
            enrollment.studentName,
            courseTitle,
            enrollment.highest_score,
            certificateId,
            qrCodeDataURL
        );

        return {
            certificateId,
            verificationCode,
            qrCode: qrCodeDataURL,
            certificateUrl: `https://brandmarksolutions.site/verify-certificate?id=${certificateId}`,
            ...certificateData
        };

    } catch (error) {
        console.error('Error issuing certificate:', error);
        throw error;
    }
}

module.exports = router;
