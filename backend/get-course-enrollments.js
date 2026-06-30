/**
 * Direct MongoDB query to check Digital Marketing course enrollments
 * Run: node get-course-enrollments.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

async function checkEnrollments() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find Digital Marketing course
        console.log('\n📚 Finding Digital Marketing course...');
        
        const digitalMarketingCourse = await Course.findOne({
            $or: [
                { title: { $regex: 'digital.*marketing', $options: 'i' } },
                { slug: 'digital-marketing-mastery-with-gen-ai' }
            ]
        });

        if (!digitalMarketingCourse) {
            console.log('❌ Digital Marketing course not found');
            console.log('\n📋 Available courses:');
            const allCourses = await Course.find().select('title moduleNumber category');
            allCourses.forEach(course => {
                console.log(`   - ${course.moduleNumber}: ${course.title}`);
            });
            await mongoose.connection.close();
            return;
        }

        console.log(`✅ Found: ${digitalMarketingCourse.title}`);
        console.log(`   Module: ${digitalMarketingCourse.moduleNumber}`);
        console.log(`   Category: ${digitalMarketingCourse.category}`);

        // Get enrollments for this course
        const enrollments = await Enrollment.find({ courseId: digitalMarketingCourse._id })
            .select('email studentName overallProgress highest_score createdAt')
            .sort({ createdAt: -1 });

        // Calculate statistics
        const totalEnrollments = enrollments.length;
        const completedCount = enrollments.filter(e => e.overallProgress === 100).length;
        const inProgressCount = totalEnrollments - completedCount;
        const avgProgress = totalEnrollments > 0
            ? Math.round(enrollments.reduce((sum, e) => sum + (e.overallProgress || 0), 0) / totalEnrollments)
            : 0;
        const avgScore = totalEnrollments > 0
            ? Math.round(enrollments.reduce((sum, e) => sum + (e.highest_score || 0), 0) / totalEnrollments)
            : 0;

        // Display results
        console.log('\n' + '='.repeat(60));
        console.log('📊 ENROLLMENT STATISTICS');
        console.log('='.repeat(60));
        console.log(`Total Enrollments:      ${totalEnrollments} students`);
        console.log(`Completed:              ${completedCount} students (${totalEnrollments > 0 ? Math.round((completedCount/totalEnrollments)*100) : 0}%)`);
        console.log(`In Progress:            ${inProgressCount} students`);
        console.log(`Average Progress:       ${avgProgress}%`);
        console.log(`Average Quiz Score:     ${avgScore}/100`);
        console.log('='.repeat(60));

        // Show individual students if any
        if (enrollments.length > 0) {
            console.log('\n👥 ENROLLED STUDENTS:');
            console.log('-'.repeat(60));
            enrollments.forEach((enrollment, index) => {
                console.log(`${index + 1}. ${enrollment.studentName || 'N/A'}`);
                console.log(`   Email: ${enrollment.email}`);
                console.log(`   Progress: ${enrollment.overallProgress}%`);
                console.log(`   Best Score: ${enrollment.highest_score || 'N/A'}`);
                console.log(`   Enrolled: ${new Date(enrollment.createdAt).toLocaleDateString()}`);
                console.log('');
            });
        } else {
            console.log('\n❌ No enrollments found for this course yet.');
        }

        // Show summary for all courses
        console.log('\n' + '='.repeat(60));
        console.log('📊 ALL COURSES ENROLLMENT SUMMARY');
        console.log('='.repeat(60));

        const allEnrollments = await Course.aggregate([
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
                    moduleNumber: 1,
                    category: 1,
                    enrollmentCount: { $size: '$students' }
                }
            },
            {
                $sort: { moduleNumber: 1 }
            }
        ]);

        console.log(`\n{'Module':<8} ${'Course Title':<40} ${'Category':<20} ${'Students':<10}`);
        console.log('-'.repeat(80));
        
        let totalStudents = 0;
        allEnrollments.forEach(course => {
            console.log(
                `${course.moduleNumber}       ${course.title.substring(0, 35).padEnd(40)} ` +
                `${(course.category || 'N/A').substring(0, 18).padEnd(20)} ${course.enrollmentCount}`
            );
            totalStudents += course.enrollmentCount;
        });
        
        console.log('-'.repeat(80));
        console.log(`TOTAL ENROLLMENTS ACROSS ALL COURSES: ${totalStudents}`);
        console.log('='.repeat(60));

        await mongoose.connection.close();
        console.log('\n✅ Query completed successfully');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkEnrollments();
