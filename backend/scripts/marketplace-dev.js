/**
 * Local test run of the BrandMark backend with a throwaway in-memory MongoDB.
 * Your real MongoDB (MONGODB_URI in .env) is NOT touched. All data vanishes when this stops.
 *
 *   node scripts/marketplace-dev.js
 *
 * Dev-only admin login for /admin/marketplace (exists only in this in-memory database):
 *   email:    devadmin@example.com
 *   password: dev-only-Admin#2026
 */
const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
    const mongo = await MongoMemoryServer.create();
    // Set before server.js loads .env — dotenv never overrides variables that are already set.
    process.env.MONGODB_URI = mongo.getUri('brandmark_marketplace_dev');
    process.env.NODE_ENV = 'development';
    process.env.MARKETPLACE_DEV_OTP = 'true'; // show OTP on screen instead of sending SMS
    process.env.PORT = process.env.PORT || '5000';
    process.env.JWT_SECRET = 'dev-only-local-jwt-secret';

    const app = require('../server');
    const connectDB = require('../config/db');
    await connectDB();

    const Admin = require('../models/Admin');
    if (!(await Admin.findOne({ email: 'devadmin@example.com' }))) {
        await Admin.create({ email: 'devadmin@example.com', password: 'dev-only-Admin#2026', name: 'Dev Admin', role: 'superadmin' });
    }

    app.listen(process.env.PORT, () => {
        console.log(`\n[marketplace-dev] API on http://localhost:${process.env.PORT} (in-memory MongoDB)`);
    });

    const stop = async () => { await mongo.stop(); process.exit(0); };
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
})();
