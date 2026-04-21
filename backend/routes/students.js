const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Helper to generate JWT
const generateToken = (student) => {
    return jwt.sign(
        { id: student._id, email: student.email },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// @route   POST /api/students/register
// @desc    Register student after successful payment (or add enrollment to existing account)
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, courseId, courseTitle, paymentId, orderId } = req.body;

        if (!name || !email || !password || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password and courseId are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        let student = await Student.findOne({ email });

        if (student) {
            // Student exists - add enrollment if not already enrolled
            const alreadyEnrolled = student.enrolledCourses.some(e => e.courseId === courseId);
            if (!alreadyEnrolled) {
                student.enrolledCourses.push({ courseId, courseTitle, paymentId, orderId });
                await student.save();
            }
            const token = generateToken(student);
            return res.status(200).json({
                success: true,
                message: 'Enrollment added to your account!',
                data: { token, name: student.name, email: student.email, enrolledCourses: student.enrolledCourses }
            });
        }

        // Create new student account
        student = await Student.create({
            name,
            email,
            password,
            enrolledCourses: [{ courseId, courseTitle, paymentId, orderId }]
        });

        const token = generateToken(student);
        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            data: { token, name: student.name, email: student.email, enrolledCourses: student.enrolledCourses }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
        }
        res.status(500).json({ success: false, message: 'Error creating account', error: error.message });
    }
});

// @route   POST /api/students/login
// @desc    Login student with email and password
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const student = await Student.findOne({ email }).select('+password');
        if (!student) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await student.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken(student);
        res.status(200).json({
            success: true,
            message: 'Login successful!',
            data: { token, name: student.name, email: student.email, enrolledCourses: student.enrolledCourses }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
    }
});

// @route   GET /api/students/me
// @desc    Get logged-in student profile and enrollments
// @access  Private (JWT)
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const student = await Student.findById(decoded.id);

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.status(200).json({
            success: true,
            data: { name: student.name, email: student.email, enrolledCourses: student.enrolledCourses }
        });

    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
});

module.exports = router;
