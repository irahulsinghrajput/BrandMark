/**
 * Seed BrandMark Database with All 15 Course Modules
 * Run: node seed-courses.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

const courseData = [
    {
        moduleNumber: 1,
        title: 'Digital Marketing Fundamentals',
        slug: 'digital-marketing-fundamentals',
        description: 'Master the core concepts of digital marketing including strategy, channels, and KPIs for modern businesses.',
        category: 'Foundation',
        level: 'Beginner',
        duration: 8,
        isPublished: true,
        learningObjectives: [
            'Understand digital marketing ecosystem',
            'Master multi-channel marketing strategies',
            'Learn conversion funnel optimization',
            'Develop measurement frameworks'
        ],
        aiToolsFocused: ['ChatGPT', 'Perplexity', 'Google Bard'],
        resources: {
            pdf: ['Digital Marketing Blueprint 2026.pdf'],
            xlsx: ['Marketing Metrics Template.xlsx'],
            docx: ['Campaign Planning Checklist.docx'],
            other: []
        }
    },
    {
        moduleNumber: 2,
        title: 'Generative AI for Marketing',
        slug: 'generative-ai-for-marketing',
        description: 'Harness the power of Gen AI to create marketing content, personalize campaigns, and automate workflows.',
        category: 'Foundation',
        level: 'Intermediate',
        duration: 10,
        isPublished: true,
        learningObjectives: [
            'Master AI-powered content creation',
            'Learn prompt engineering for marketing',
            'Implement AI in email campaigns',
            'Use AI for customer segmentation'
        ],
        aiToolsFocused: ['ChatGPT-4', 'Claude', 'Gemini Pro', 'Copy.ai'],
        resources: {
            pdf: ['AI Prompt Library for Marketers.pdf'],
            xlsx: ['AI Tool Comparison Matrix.xlsx'],
            docx: [],
            other: []
        }
    },
    {
        moduleNumber: 3,
        title: 'Analytics & Metrics',
        slug: 'analytics-metrics',
        description: 'Learn to measure, analyze, and optimize every aspect of your marketing using data-driven insights.',
        category: 'Foundation',
        level: 'Intermediate',
        duration: 9,
        isPublished: true,
        learningObjectives: [
            'Master Google Analytics 4',
            'Create performance dashboards',
            'Analyze customer journey',
            'Implement attribution modeling'
        ],
        aiToolsFocused: ['Google Analytics 4', 'Tableau', 'Mixpanel'],
        resources: {
            pdf: ['GA4 Implementation Guide.pdf'],
            xlsx: ['Analytics Dashboard Template.xlsx'],
            docx: ['KPI Calculation Methods.docx'],
            other: []
        }
    },
    {
        moduleNumber: 4,
        title: 'Content Creation & Copywriting',
        slug: 'content-creation-copywriting',
        description: 'Create compelling content that resonates with your audience and drives conversions.',
        category: 'Content & Copywriting',
        level: 'Intermediate',
        duration: 10,
        isPublished: true,
        learningObjectives: [
            'Master copywriting frameworks',
            'Create engaging social content',
            'Write persuasive landing pages',
            'Develop content calendars'
        ],
        aiToolsFocused: ['ChatGPT', 'Copy.ai', 'Jasper'],
        resources: {
            pdf: ['Copywriting Formula Swipe File.pdf'],
            xlsx: ['Content Calendar Template.xlsx'],
            docx: [],
            other: []
        }
    },
    {
        moduleNumber: 5,
        title: 'Data Analytics Deep Dive',
        slug: 'data-analytics-deep-dive',
        description: 'Advanced data analysis techniques for marketing optimization and predictive modeling.',
        category: 'Advanced Strategy',
        level: 'Advanced',
        duration: 12,
        isPublished: true,
        learningObjectives: [
            'Perform cohort analysis',
            'Build predictive models',
            'Advanced segmentation techniques',
            'SQL for marketers'
        ],
        aiToolsFocused: ['SQL', 'Python', 'Tableau', 'Looker'],
        resources: {
            pdf: ['SQL Queries for Marketing.pdf'],
            xlsx: ['Cohort Analysis Template.xlsx'],
            docx: [],
            other: []
        }
    },
    {
        moduleNumber: 6,
        title: 'SEO & Organic Growth',
        slug: 'seo-organic-growth',
        description: 'Dominate search engines and build sustainable organic traffic for your business.',
        category: 'Content & Copywriting',
        level: 'Beginner',
        duration: 8,
        isPublished: true,
        learningObjectives: [
            'Master keyword research',
            'Optimize on-page SEO',
            'Build high-quality backlinks',
            'Implement technical SEO'
        ],
        aiToolsFocused: ['SEMrush', 'Ahrefs', 'Moz', 'Screaming Frog'],
        resources: {
            pdf: ['SEO Audit Checklist.pdf'],
            xlsx: ['Keyword Research Template.xlsx'],
            docx: ['Backlink Strategy Guide.docx'],
            other: []
        }
    },
    {
        moduleNumber: 7,
        title: 'Paid Advertising Mastery',
        slug: 'paid-advertising-mastery',
        description: 'Master Google Ads, Facebook Ads, and other paid channels to maximize ROI.',
        category: 'Paid Advertising',
        level: 'Beginner',
        duration: 10,
        isPublished: true,
        learningObjectives: [
            'Create high-converting Google Ads campaigns',
            'Master Facebook Ads targeting',
            'Optimize ad budgets',
            'Implement conversion tracking'
        ],
        aiToolsFocused: ['Google Ads', 'Facebook Ads Manager', 'TikTok Ads'],
        resources: {
            pdf: ['Paid Ads Strategy Framework.pdf'],
            xlsx: ['PPC Budget Calculator.xlsx'],
            docx: [],
            other: []
        }
    },
    {
        moduleNumber: 8,
        title: 'Social Media Strategy',
        slug: 'social-media-strategy',
        description: 'Build a powerful social media presence and engage your audience across all platforms.',
        category: 'Social Media & Influencer',
        level: 'Intermediate',
        duration: 9,
        isPublished: true,
        learningObjectives: [
            'Develop platform-specific strategies',
            'Create viral content frameworks',
            'Build community engagement',
            'Measure social ROI'
        ],
        aiToolsFocused: ['Buffer', 'Hootsuite', 'Later', 'Sprout Social'],
        resources: {
            pdf: ['Social Media Content Ideas Bank.pdf'],
            xlsx: ['Social Media Calendar.xlsx'],
            docx: [],
            other: []
        }
    },
    {
        moduleNumber: 9,
        title: 'Email Marketing Excellence',
        slug: 'email-marketing-excellence',
        description: 'Build high-performing email campaigns that drive sales and customer loyalty.',
        category: 'Content & Copywriting',
        level: 'Intermediate',
        duration: 8,
        isPublished: true,
        learningObjectives: [
            'Master email segmentation',
            'Write high-open-rate subject lines',
            'Design conversion-focused templates',
            'Automate email sequences'
        ],
        aiToolsFocused: ['Mailchimp', 'ConvertKit', 'ActiveCampaign'],
        resources: {
            pdf: ['Email Marketing Best Practices.pdf'],
            xlsx: ['Email Performance Analytics.xlsx'],
            docx: [],
            other: []
        }
    },
    {
        moduleNumber: 10,
        title: 'Marketing Automation',
        slug: 'marketing-automation',
        description: 'Automate repetitive tasks and scale your marketing efforts efficiently.',
        category: 'Advanced Strategy',
        level: 'Advanced',
        duration: 11,
        isPublished: true,
        learningObjectives: [
            'Setup marketing automation workflows',
            'Create lead nurturing sequences',
            'Implement lead scoring',
            'Integrate with CRM systems'
        ],
        aiToolsFocused: ['HubSpot', 'Marketo', 'Pardot', 'ActiveCampaign'],
        resources: {
            pdf: ['Marketing Automation Playbook.pdf'],
            xlsx: ['Workflow Builder Template.xlsx'],
            docx: [],
            other: []
        }
    },
    {
        moduleNumber: 11,
        title: 'Advanced Analytics & Attribution',
        slug: 'advanced-analytics-attribution',
        description: 'Understand complex attribution models and optimize your marketing mix.',
        category: 'Advanced Strategy',
        level: 'Advanced',
        duration: 12,
        isPublished: true,
        learningObjectives: [
            'Master multi-touch attribution',
            'Build custom analytics models',
            'Implement marketing mix modeling',
            'Predict customer lifetime value'
        ],
        aiToolsFocused: ['Google Analytics 4', 'Mixpanel', 'Amplitude'],
        resources: {
            pdf: ['Attribution Model Comparison.pdf'],
            xlsx: ['Customer LTV Calculator.xlsx'],
            docx: [],
            other: []
        }
    },
    {
        moduleNumber: 12,
        title: 'Customer Retention & Loyalty',
        slug: 'customer-retention-loyalty',
        description: 'Build strategies to maximize customer lifetime value and reduce churn.',
        category: 'Advanced Strategy',
        level: 'Advanced',
        duration: 10,
        isPublished: true,
        learningObjectives: [
            'Implement retention strategies',
            'Build loyalty programs',
            'Reduce customer churn',
            'Create win-back campaigns'
        ],
        aiToolsFocused: ['Klaviyo', 'Segment', 'Intercom'],
        resources: {
            pdf: ['Customer Retention Framework.pdf'],
            xlsx: ['Churn Prediction Model.xlsx'],
            docx: [],
            other: []
        }
    },
    {
        moduleNumber: 13,
        title: 'Crisis Management & Reputation',
        slug: 'crisis-management-reputation',
        description: 'Protect your brand and manage crises effectively in the digital age.',
        category: 'Advanced Strategy',
        level: 'Advanced',
        duration: 7,
        isPublished: true,
        learningObjectives: [
            'Create crisis communication plans',
            'Monitor brand reputation',
            'Respond to negative feedback',
            'Build brand resilience'
        ],
        aiToolsFocused: ['Brandwatch', 'Mention', 'Talkwalker'],
        resources: {
            pdf: ['Crisis Communication Template.pdf'],
            xlsx: ['Brand Monitoring Dashboard.xlsx'],
            docx: [],
            other: []
        }
    },
    {
        moduleNumber: 14,
        title: 'MarTech Stack & Integration',
        slug: 'martech-stack-integration',
        description: 'Master the marketing technology landscape and build an integrated tech stack.',
        category: 'Advanced Strategy',
        level: 'Advanced',
        duration: 9,
        isPublished: true,
        learningObjectives: [
            'Evaluate MarTech tools',
            'Implement tool integrations',
            'Optimize tech stack ROI',
            'Manage API connections'
        ],
        aiToolsFocused: ['Zapier', 'Integromat', 'Make', 'IFTTT'],
        resources: {
            pdf: ['MarTech Stack Buyer Guide.pdf'],
            xlsx: ['Technology ROI Calculator.xlsx'],
            docx: [],
            other: []
        }
    },
    {
        moduleNumber: 15,
        title: 'Capstone Project',
        slug: 'capstone-project',
        description: 'Apply everything you\'ve learned to create a complete marketing strategy for a real business.',
        category: 'Capstone',
        level: 'Advanced',
        duration: 15,
        isPublished: true,
        learningObjectives: [
            'Develop comprehensive marketing strategy',
            'Create integrated campaign plan',
            'Build measurement framework',
            'Present to stakeholders'
        ],
        aiToolsFocused: ['All Previous Tools'],
        resources: {
            pdf: ['Project Brief Template.pdf'],
            xlsx: ['Budget & Timeline Planner.xlsx'],
            docx: ['Presentation Outline.docx'],
            other: []
        }
    }
];

async function seedDatabase() {
    try {
        console.log('\n🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected successfully\n');

        // Check if courses already exist
        const existingCount = await Course.countDocuments();
        if (existingCount > 0) {
            console.log(`⚠️  Database already contains ${existingCount} courses`);
            console.log('   To clear and re-seed, run: node seed-courses.js --force\n');
            
            if (process.argv[2] !== '--force') {
                await mongoose.connection.close();
                process.exit(0);
            }

            console.log('🗑️  Clearing existing courses...');
            await Course.deleteMany({});
            console.log('✅ Cleared all courses\n');
        }

        // Insert all courses
        console.log('📚 Seeding 15 course modules...\n');
        const result = await Course.insertMany(courseData);

        console.log('✅ Successfully seeded all courses!\n');
        console.log('='.repeat(70));
        console.log('📊 SEEDING COMPLETE');
        console.log('='.repeat(70));
        
        result.forEach((course, idx) => {
            console.log(`${idx + 1}. Module ${course.moduleNumber}: ${course.title}`);
            console.log(`   Category: ${course.category}, Level: ${course.level}`);
            console.log(`   Published: ${course.isPublished ? '✅' : '❌'}`);
            console.log('');
        });

        console.log('='.repeat(70));
        console.log(`Total Courses Created: ${result.length}`);
        console.log('='.repeat(70));
        console.log('\n📝 Next Steps:');
        console.log('   1. Frontend will fetch these courses automatically');
        console.log('   2. Students can now enroll in courses');
        console.log('   3. Admin dashboard will track enrollments');
        console.log('   4. Run: npm run dev (in backend)');
        console.log('   5. Visit: http://localhost:5001/api/courses\n');

        await mongoose.connection.close();
        console.log('✅ Database connection closed');

    } catch (error) {
        console.error('\n❌ Seeding Error:', error.message);
        process.exit(1);
    }
}

seedDatabase();
