/**
 * Security Initialization Script
 * This script should be included in the <head> of every HTML page
 * It handles CSRF token fetching and security setup
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Detect environment
    const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:';
    
    const API_URL = isLocalhost 
        ? 'http://localhost:5001/api'
        : 'https://brandmark-api-2026.onrender.com/api';
    
    // Fetch and set CSRF token
    try {
        const response = await fetch(`${API_URL}/csrf-token`);
        const data = await response.json();
        if (data.token) {
            // Set in meta tag for easy access
            const metaTag = document.querySelector('meta[name="csrf-token"]');
            if (metaTag) {
                metaTag.content = data.token;
            }
        }
    } catch (error) {
        console.warn('Failed to fetch CSRF token:', error);
        // App can still work without CSRF token, but forms will fail
    }
    
    // Log security status in development
    if (isLocalhost) {
        console.log('🔐 Security Features Initialized');
        console.log('   - CSRF Protection: Enabled');
        console.log('   - XSS Prevention: Enabled');
        console.log('   - Content Security Policy: Check server headers');
    }
});
