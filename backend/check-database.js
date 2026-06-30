/**
 * Check all courses and enrollments in the database
 * Run: node check-database.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

async function checkDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Count documents
        const courseCount = await Course.countDocuments();
        const enrollmentCount = await Enrollment.countDocuments();

        console.log('=' .repeat(70));
        console.log('📊 DATABASE SUMMARY');
        console.log('='.repeat(70));
        console.log(`Total Courses in Database:      ${courseCount}`);
        console.log(`Total Enrollments in Database:  ${enrollmentCount}`);
        console.log('='.repeat(70));

        // List all courses
        if (courseCount === 0) {
            console.log('\n⚠️  No courses found in database yet.\n');
        } else {
            console.log('\n📚 ALL COURSES IN DATABASE:');
            console.log('-'.repeat(70));
            
            const courses = await Course.find()
                .select('title moduleNumber category level isPublished')
                .sort({ moduleNumber: 1 });

            courses.forEach((course, idx) => {
                console.log(`${idx + 1}. Module ${course.moduleNumber}: ${course.title}`);
                console.log(`   Category: ${course.category}, Level: ${course.level}`);
                console.log(`   Published: ${course.isPublished ? '✅ Yes' : '❌ No'}`);
                console.log('');
            });
        }

        // Get all enrollments
        if (enrollmentCount === 0) {
            console.log('\n⚠️  No enrollments found in database yet.\n');
        } else {
            console.log('\n👥 ALL ENROLLMENTS IN DATABASE:');
            console.log('-'.repeat(70));
            
            const enrollments = await Enrollment.aggregate([
                {
                    $group: {
                        _id: '$courseId',
                        count: { $sum: 1 },
                        students: {
                            $push: {
                                email: '$email',
                                name: '$studentName',
                                progress: '$overallProgress'
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'courses',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'courseInfo'
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);

            enrollments.forEach((enrollment, idx) => {
                const course = enrollment.courseInfo[0];
                const courseTitle = course ? course.title : 'Unknown Course';
                console.log(`${idx + 1}. ${courseTitle}`);
                console.log(`   Total Enrollments: ${enrollment.count}`);
                console.log(`   Students:`);
                
                enrollment.students.forEach((student, sidx) => {
                    console.log(`     ${sidx + 1}. ${student.name || 'N/A'} (${student.email})`);
                    console.log(`        Progress: ${student.progress}%`);
                });
                console.log('');
            });

            // Overall stats
            console.log('-'.repeat(70));
            const totalEnrollmentRecords = enrollments.reduce((sum, e) => sum + e.count, 0);
            console.log(`Total Enrollment Records: ${totalEnrollmentRecords}`);
        }

        console.log('\n✅ Database check completed');
        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkDatabase();
