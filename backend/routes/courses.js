const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { verifyToken, isAdmin } = require('../middleware/auth');

// ==================== PUBLIC ROUTES ====================

// @route   GET /api/courses
// @desc    Get all published courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, level, sort } = req.query;
        
        let query = { isPublished: true };
        
        // Filter by category
        if (category) {
            query.category = category;
        }
        
        // Filter by level
        if (level) {
            query.level = level;
        }
        
        // Determine sort order
        let sortOrder = {};
        if (sort === 'newest') {
            sortOrder = { createdAt: -1 };
        } else if (sort === 'popular') {
            sortOrder = { enrollmentCount: -1 };
        } else if (sort === 'rating') {
            sortOrder = { avgRating: -1 };
        } else {
            sortOrder = { moduleNumber: 1 };  // Default: by module order
        }
        
        const courses = await Course.find(query)
            .select('title slug category level duration moduleNumber enrollmentCount avgRating totalReviews learningObjectives')
            .sort(sortOrder);
        
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message
        });
    }
});

// @route   GET /api/courses/categories
// @desc    Get all course categories
// @access  Public
router.get('/categories', async (req, res) => {
    try {
        const categories = await Course.distinct('category', { isPublished: true });
        
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
});

// IMPORTANT: POST/specific routes MUST come BEFORE generic /:slug route
// Otherwise /:slug will match :courseId/order and cause 404 errors

// @route   POST /api/courses/:courseId/order
// @desc    Create Razorpay order for course enrollment
// @access  Public
router.post('/:courseId/order', async (req, res) => {
    try {
        const { courseId } = req.params;
        const { email } = req.body;
        
        console.log('🔵 Order request received for courseId:', courseId, 'email:', email);
        
        if (!email) {
            console.log('❌ Email missing');
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Course pricing map (hardcoded for now, can be extended)
        const coursePrices = {
            'digital-marketing-001': {
                title: 'Digital Marketing Mastery with Gen AI',
                price: 49, // ₹49 (will be converted to paise by * 100)
                moduleNumber: 1
            }
        };

        const courseInfo = coursePrices[courseId] || {
            title: 'BrandMark Course',
            price: 49,
            moduleNumber: 1
        };

        console.log('📚 Course info:', courseInfo);

        // Initialize Razorpay
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error('❌ Razorpay credentials missing');
            return res.status(500).json({
                success: false,
                message: 'Payment system not configured'
            });
        }

        console.log('💳 Initializing Razorpay...');
        const Razorpay = require('razorpay');
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const options = {
            amount: courseInfo.price * 100, // Razorpay expects amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                courseId,
                email,
                courseTitle: courseInfo.title
            }
        };

        console.log('📦 Creating Razorpay order with options:', options);
        const order = await razorpay.orders.create(options);
        console.log('✅ Order created:', order.id);

        const responseData = {
            success: true,
            message: 'Order created successfully',
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: process.env.RAZORPAY_KEY_ID
            }
        };
        
        console.log('📤 Sending response:', responseData);
        res.status(200).json(responseData);
    } catch (error) {
        console.error('❌ Order creation error:', error.message);
        console.error('Full error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
});

// ==================== WEBHOOK ROUTES ====================

// @route   POST /api/courses/webhook/razorpay
// @desc    Razorpay webhook handler - validates signature and processes payment
// @access  Public (but signature-protected)
router.post('/webhook/razorpay', async (req, res) => {
    try {
        const { verifyWebhookSignature } = require('../utils/razorpayUtils');
        
        // Get signature from header
        const webhookSignature = req.headers['x-razorpay-signature'];
        
        if (!webhookSignature) {
            console.warn('⚠️  Webhook signature missing from headers');
            return res.status(400).json({
                success: false,
                message: 'Webhook signature missing'
            });
        }

        // Get webhook secret from environment
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error('❌ RAZORPAY_WEBHOOK_SECRET not configured');
            return res.status(500).json({
                success: false,
                message: 'Webhook not configured'
            });
        }

        // Get raw body for signature verification
        const webhookBody = JSON.stringify(req.body);

        // Verify webhook signature
        if (!verifyWebhookSignature(webhookBody, webhookSignature, webhookSecret)) {
            console.error('❌ Webhook signature verification failed');
            return res.status(401).json({
                success: false,
                message: 'Webhook signature verification failed'
            });
        }

        console.log('✅ Webhook signature verified');

        const event = req.body.event;
        const payload = req.body.payload;

        // Handle different event types
        if (event === 'payment.authorized') {
            console.log('💳 Payment authorized:', payload.payment.entity.id);
            
            const paymentEntity = payload.payment.entity;
            const { email, courseId, courseTitle } = paymentEntity.notes;

            // Create enrollment record
            const enrollment = new Enrollment({
                studentEmail: email,
                courseId: courseId,
                courseTitle: courseTitle,
                paymentId: paymentEntity.id,
                amount: paymentEntity.amount / 100, // Convert from paise
                currency: paymentEntity.currency,
                status: 'completed',
                paymentMethod: paymentEntity.method,
                transactionDate: new Date(paymentEntity.created_at * 1000)
            });

            await enrollment.save();
            console.log('✅ Enrollment created:', enrollment._id);
        } 
        else if (event === 'payment.failed') {
            console.log('❌ Payment failed:', payload.payment.entity.id);
            // Log failed payment for analysis
        }
        else if (event === 'refund.created') {
            console.log('💰 Refund created:', payload.refund.entity.id);
            // Update enrollment status
        }

        // Always respond with 200 to acknowledge receipt
        res.status(200).json({
            success: true,
            message: 'Webhook processed'
        });

    } catch (error) {
        console.error('❌ Webhook processing error:', error.message);
        // Still return 200 to prevent Razorpay retries for processing errors
        res.status(200).json({
            success: false,
            message: 'Webhook error (logged)',
            error: error.message
        });
    }
});

// ==================== PUBLIC ROUTES ====================

// @route   GET /api/courses/:slug
// @desc    Get single course by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const course = await Course.findOne({
            slug: req.params.slug,
            isPublished: true
        });
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching course',
            error: error.message
        });
    }
});

// ==================== ENROLLMENT ROUTES ====================

// @route   POST /api/courses/enroll
// @desc    Enroll user in a course
// @access  Private
router.post('/enroll', verifyToken, async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;
        const email = req.user.email;
        
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Course ID is required'
            });
        }
        
        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        
        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            userId,
            courseId
        });
        
        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: 'Already enrolled in this course'
            });
        }
        
        // Create enrollment
        const enrollment = await Enrollment.create({
            userId,
            email,
            courseId,
            moduleNumber: course.moduleNumber
        });
        
        // Update course enrollment count
        course.enrollmentCount += 1;
        await course.save();
        
        res.status(201).json({
            success: true,
            message: 'Successfully enrolled in course',
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error enrolling in course',
            error: error.message
        });
    }
});

// @route   GET /api/courses/user/enrollments
// @desc    Get user's course enrollments
// @access  Private
router.get('/user/enrollments', verifyToken, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            userId: req.user.id
        }).populate('courseId', 'title slug category level duration moduleNumber');
        
        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching enrollments',
            error: error.message
        });
    }
});

// @route   PATCH /api/courses/:courseId/progress
// @desc    Update course progress
// @access  Private
router.patch('/:courseId/progress', verifyToken, async (req, res) => {
    try {
        const { lessonId, timeSpent } = req.body;
        const userId = req.user.id;
        const { courseId } = req.params;
        
        // Find enrollment
        const enrollment = await Enrollment.findOne({
            userId,
            courseId
        });
        
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }
        
        // Add completed lesson
        if (lessonId) {
            const existingLesson = enrollment.completedLessons.find(
                l => l.lessonId === lessonId
            );
            
            if (!existingLesson) {
                enrollment.completedLessons.push({
                    lessonId,
                    completedAt: new Date(),
                    timeSpent: timeSpent || 0
                });
            }
        }
        
        // Update progress percentage
        const course = await Course.findById(courseId);
        const totalLessons = course.lessons.length;
        const completedCount = enrollment.completedLessons.length;
        enrollment.overallProgress = Math.round((completedCount / totalLessons) * 100);
        enrollment.totalCompletedLessons = completedCount;
        
        // Update status
        if (enrollment.overallProgress === 100) {
            enrollment.status = 'in-progress'; // Change to 'in-progress' so they can take quiz
        } else if (enrollment.overallProgress > 0) {
            enrollment.status = 'in-progress';
        }
        
        enrollment.lastAccessedAt = new Date();
        
        await enrollment.save();
        
        res.status(200).json({
            success: true,
            message: 'Progress updated',
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating progress',
            error: error.message
        });
    }
});

// @route   POST /api/courses/:courseId/review
// @desc    Add course review
// @access  Private
router.post('/:courseId/review', verifyToken, async (req, res) => {
    try {
        const { rating, review } = req.body;
        const userId = req.user.id;
        const { courseId } = req.params;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }
        
        // Find enrollment
        const enrollment = await Enrollment.findOneAndUpdate(
            { userId, courseId },
            { rating, review },
            { new: true }
        );
        
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }
        
        // Update course avg rating
        const course = await Course.findById(courseId);
        const allReviews = await Enrollment.find({
            courseId,
            rating: { $exists: true, $ne: null }
        });
        
        const avgRating = allReviews.reduce((sum, e) => sum + e.rating, 0) / allReviews.length;
        course.avgRating = Math.round(avgRating * 10) / 10;
        course.totalReviews = allReviews.length;
        
        await course.save();
        
        res.status(200).json({
            success: true,
            message: 'Review added successfully',
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding review',
            error: error.message
        });
    }
});

// ==================== PAYMENT ROUTES ====================

// @route   POST /api/courses/payment/verify
// @desc    Verify Razorpay payment and create enrollment
// @access  Public
router.post('/payment/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, email } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courseId || !email) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification details'
            });
        }

        // Verify signature
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed - signature mismatch'
            });
        }

        // Payment verified successfully! Save enrollment.
        const Student = require('../models/Student');
        const enrollmentId = `enroll_${Date.now()}`;

        // Check if student already enrolled (prevent duplicate enrollment on retry)
        const existingStudent = await Student.findOne({ email });
        const alreadyEnrolled = existingStudent &&
            existingStudent.enrolledCourses.some(e => e.courseId === courseId);

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully!',
            data: {
                enrollmentId,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                email,
                courseId,
                alreadyHasAccount: !!existingStudent,
                alreadyEnrolled
            }
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
});

// ==================== ADMIN ROUTES ====================

// @route   POST /api/courses
// @desc    Create new course (admin)
// @access  Private/Admin
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { title, description, category, level, duration, moduleNumber, lessons, learningObjectives, aiToolsFocused } = req.body;
        
        // Validate required fields
        if (!title || !description || !category || !level || !moduleNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }
        
        // Check if module number already exists
        const existingCourse = await Course.findOne({ moduleNumber });
        if (existingCourse) {
            return res.status(400).json({
                success: false,
                message: `Course with module number ${moduleNumber} already exists`
            });
        }
        
        const course = await Course.create({
            title,
            description,
            category,
            level,
            duration: duration || 0,
            moduleNumber,
            lessons: lessons || [],
            learningObjectives: learningObjectives || [],
            aiToolsFocused: aiToolsFocused || []
        });
        
        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating course',
            error: error.message
        });
    }
});

// @route   PATCH /api/courses/:id
// @desc    Update course (admin)
// @access  Private/Admin
router.patch('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating course',
            error: error.message
        });
    }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course (admin)
// @access  Private/Admin
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        
        // Delete all enrollments for this course
        await Enrollment.deleteMany({ courseId: req.params.id });
        
        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting course',
            error: error.message
        });
    }
});

// @route   PATCH /api/courses/:id/publish
// @desc    Publish/unpublish course (admin)
// @access  Private/Admin
router.patch('/:id/publish', verifyToken, isAdmin, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { isPublished: req.body.isPublished },
            { new: true }
        );
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: `Course ${req.body.isPublished ? 'published' : 'unpublished'} successfully`,
            data: course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating course status',
            error: error.message
        });
    }
});

module.exports = router;
