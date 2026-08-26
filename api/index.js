let app;
try {
    app = require('../backend/server.js');
} catch (error) {
    console.error("Initialization error:", error);
    app = (req, res) => {
        res.status(500).json({
            error: 'Serverless Function Initialization Failed',
            message: error.message,
            stack: error.stack
        });
    };
}
module.exports = app;
