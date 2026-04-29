/**
 * Analytics routes for course enrollment statistics
 * GET /api/analytics/summary - Get dashboard summary (public)
 * GET /api/analytics/enrollments - Get all enrollment stats (admin only)
 * GET /api/analytics/courses/:courseId/enrollments - Get enrollments for specific course (admin only)
 */

const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/auth');
const { asyncHandler, NotFoundError } = require('../utils/errorHandler');

// @route   GET /api/analytics/summary
// @desc    Get dashboard summary (PUBLIC - no auth required)
// @access  Public
router.get('/summary', asyncHandler(async (req, res) => {
    console.log('📊 Fetching public dashboard summary...');

    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // Get top courses
    const courseStats = await Course.aggregate([
        {
            $lookup: {
                from: 'enrollments',
                localField: '_id',
                foreignField: 'courseId',
                as: 'enrolledStudents'
            }
        },
        {
            $project: {
                title: 1,
                moduleNumber: 1,
                category: 1,
                level: 1,
                enrollmentCount: { $size: '$enrolledStudents' }
            }
        },
        {
            $sort: { enrollmentCount: -1 }
        },
        {
            $limit: 5
        }
    ]);

    // Calculate average completion
    const avgCompletion = totalEnrollments > 0
        ? Math.round((await Enrollment.countDocuments({ overallProgress: 100 }) / totalEnrollments) * 100)
        : 0;

    res.json({
        success: true,
        data: {
            totalCourses,
            totalEnrollments,
            uniqueStudents: totalEnrollments,
            avgCompletion,
            topCourses: courseStats.map(c => ({
                title: c.title,
                enrollments: c.enrollmentCount
            }))
        }
    });
}));

// @route   GET /api/analytics/enrollments
// @desc    Get overall enrollment statistics
// @access  Private (Admin only)
router.get('/enrollments', auth, isAdmin, asyncHandler(async (req, res) => {
    console.log('📊 Fetching overall enrollment statistics...');

    // Total enrollments
    const totalEnrollments = await Enrollment.countDocuments();

    // Enrollments by course
    const enrollmentsByCoourse = await Enrollment.aggregate([
        {
            $group: {
                _id: '$courseId',
                count: { $sum: 1 },
                emails: { $push: '$email' }
            }
        },
        {
            $lookup: {
                from: 'courses',
                localField: '_id',
                foreignField: '_unique',
                as: 'courseInfo'
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    // Get all courses with enrollment count
    const courseStats = await Course.aggregate([
        {
            $lookup: {
                from: 'enrollments',
                localField: '_id',
                foreignField: 'courseId',
                as: 'enrolledStudents'
            }
        },
        {
            $project: {
                title: 1,
                moduleNumber: 1,
                category: 1,
                level: 1,
                enrollmentCount: { $size: '$enrolledStudents' },
                students: {
                    $map: {
                        input: '$enrolledStudents',
                        as: 'student',
                        in: '$$student.email'
                    }
                }
            }
        },
        {
            $sort: { enrollmentCount: -1 }
        }
    ]);

    // Top course
    const topCourse = courseStats[0] || null;

    // Average enrollments per course
    const avgEnrollments = courseStats.length > 0
        ? Math.round(totalEnrollments / courseStats.length)
        : 0;

    res.json({
        success: true,
        data: {
            summary: {
                totalEnrollments,
                totalCourses: courseStats.length,
                averageEnrollmentsPerCourse: avgEnrollments,
                topCourse: topCourse ? {
                    title: topCourse.title,
                    enrollments: topCourse.enrollmentCount
                } : null
            },
            courseStats: courseStats
        }
    });
}));

// @route   GET /api/analytics/courses/:courseId/enrollments
// @desc    Get enrollments for specific course
// @access  Private (Admin only)
router.get('/courses/:courseId/enrollments', auth, isAdmin, asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    console.log(`📊 Fetching enrollments for course: ${courseId}`);

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
        throw new NotFoundError('Course');
    }

    // Get all enrollments for this course
    const enrollments = await Enrollment.find({ courseId: courseId })
        .select('email studentName overallProgress highest_score createdAt')
        .sort({ createdAt: -1 });

    // Calculate statistics
    const totalEnrollments = enrollments.length;
    const avgProgress = enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + e.overallProgress, 0) / enrollments.length)
        : 0;

    const avgScore = enrollments.length > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + (e.highest_score || 0), 0) / enrollments.length)
        : 0;

    const completedCount = enrollments.filter(e => e.overallProgress === 100).length;

    res.json({
        success: true,
        data: {
            course: {
                id: course._id,
                title: course.title,
                moduleNumber: course.moduleNumber,
                category: course.category
            },
            statistics: {
                totalEnrollments,
                completedCount,
                inProgressCount: totalEnrollments - completedCount,
                completionRate: totalEnrollments > 0
                    ? Math.round((completedCount / totalEnrollments) * 100)
                    : 0,
                averageProgress: avgProgress,
                averageScore: avgScore
            },
            students: enrollments.map((e, index) => ({
                rank: index + 1,
                email: e.email,
                name: e.studentName,
                progress: e.overallProgress + '%',
                highestScore: e.highest_score || 0,
                enrolledAt: e.createdAt
            }))
        }
    });
}));

// @route   GET /api/analytics/courses/:courseId/enrollments/email/:email
// @desc    Get specific student enrollment in course
// @access  Private (Admin only)
router.get('/courses/:courseId/enrollments/email/:email', auth, isAdmin, asyncHandler(async (req, res) => {
    const { courseId, email } = req.params;

    console.log(`📊 Fetching enrollment for ${email} in course ${courseId}`);

    const enrollment = await Enrollment.findOne({
        courseId: courseId,
        email: email.toLowerCase()
    });

    if (!enrollment) {
        throw new NotFoundError('Enrollment');
    }

    res.json({
        success: true,
        data: {
            email: enrollment.email,
            studentName: enrollment.studentName,
            progress: enrollment.overallProgress,
            completedLessons: enrollment.totalCompletedLessons,
            quizScores: enrollment.quizAttempts.map(attempt => ({
                attempt: attempt.attemptNumber,
                score: attempt.score,
                maxScore: 100,
                isPassing: attempt.isPassing,
                attemptedAt: attempt.attemptedAt
            })),
            highestScore: enrollment.highest_score,
            certificateStatus: enrollment.highest_score >= 70 ? 'Eligible' : 'Not Yet Eligible',
            enrolledAt: enrollment.createdAt
        }
    });
}));

// @route   GET /api/analytics/summary
// @desc    Quick summary for dashboard
// @access  Private (Admin only)
router.get('/summary', auth, isAdmin, asyncHandler(async (req, res) => {
    console.log('📊 Fetching analytics summary...');

    const totalEnrollments = await Enrollment.countDocuments();
    const totalCourses = await Course.countDocuments();
    const uniqueStudents = await Enrollment.distinct('email').then(emails => emails.length);

    // Get top 5 courses by enrollment
    const topCourses = await Course.aggregate([
        {
            $lookup: {
                from: 'enrollments',
                localField: '_id',
                foreignField: 'courseId',
                as: 'students'
            }
        },
        {
            $project: {
                title: 1,
                enrollmentCount: { $size: '$students' }
            }
        },
        {
            $sort: { enrollmentCount: -1 }
        },
        {
            $limit: 5
        }
    ]);

    res.json({
        success: true,
        data: {
            totalEnrollments,
            totalCourses,
            uniqueStudents,
            topCourses: topCourses.map((course, idx) => ({
                rank: idx + 1,
                title: course.title,
                enrollments: course.enrollmentCount
            }))
        }
    });
}));

module.exports = router;
