// Quick test to verify routes are properly defined
const coursesRoutes = require('./backend/routes/courses');

// Get all route methods
console.log('🔍 Checking courses.js router...\n');

// Check if it's a valid router
if (!coursesRoutes.stack) {
    console.error('❌ coursesRoutes is not a valid Express router');
    process.exit(1);
}

console.log('✅ courses.js is a valid Express router');
console.log(`📊 Total routes defined: ${coursesRoutes.stack.length}`);

// List all routes
console.log('\n📋 Routes defined in courses.js:\n');
coursesRoutes.stack.forEach((middleware, index) => {
    if (middleware.route) {
        const methods = Object.keys(middleware.route.methods);
        const path = middleware.route.path;
        console.log(`  ${index + 1}. ${methods.map(m => m.toUpperCase()).join('|')} ${path}`);
    }
});

console.log('\n✅ Route verification complete!');
