/**
 * Simple Express server to serve static frontend files
 * This solves CORS issues when testing locally
 */

const express = require('express');
const path = require('path');
const app = express();

// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// Route for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all for HTML files
app.get('/:page', (req, res) => {
    const filePath = path.join(__dirname, `${req.params.page}.html`);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Page not found');
        }
    });
});

// Start server
const PORT = 5500;
app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 BrandMark Frontend Server Running!`);
    console.log(`${'='.repeat(60)}`);
    console.log(`\n📍 Open in browser: http://localhost:${PORT}`);
    console.log(`\n✅ Frontend:     http://localhost:${PORT}`);
    console.log(`✅ Backend API:  http://localhost:5000/api`);
    console.log(`\n🔗 Links:`);
    console.log(`   Home:            http://localhost:${PORT}`);
    console.log(`   Courses:         http://localhost:${PORT}/courses.html`);
    console.log(`   Digital Marketing: http://localhost:${PORT}/digital-marketing-course.html`);
    console.log(`   Quiz:            http://localhost:${PORT}/quiz.html`);
    console.log(`   Certificate:     http://localhost:${PORT}/verify-certificate.html`);
    console.log(`\n${'-'.repeat(60)}\n`);
});
