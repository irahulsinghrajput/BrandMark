const mongoose = require('mongoose');

let cachedConnection = null;
let isConnecting = null;

/**
 * Connect to MongoDB with connection caching for serverless (Vercel) & traditional environments.
 * bufferCommands: false prevents queries from hanging for 10 seconds when disconnected.
 */
const connectDB = async () => {
    // 1. If connection is already open, reuse it immediately
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // 2. If a connection is already in flight, await the existing promise
    if (isConnecting) {
        return await isConnecting;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI environment variable is not defined.');
    }

    // 3. Initiate new connection
    isConnecting = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false // Fail fast rather than buffering queries for 10s!
    });

    try {
        const conn = await isConnecting;
        cachedConnection = conn;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name || 'default'}`);
        return conn;
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        throw err;
    } finally {
        isConnecting = null;
    }
};

module.exports = connectDB;
