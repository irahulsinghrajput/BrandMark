const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini with warning if key is missing
const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
if (!hasGeminiKey) {
    console.error('CRITICAL ERROR: GEMINI_API_KEY is missing in environment variables.');
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_API_KEY');

// SYSTEM INSTRUCTION: The personality of your bot
const SYSTEM_INSTRUCTION = `
You are 'Mark', the AI Assistant for Brand Mark Solutions.
Your Goal: Help clients with Web Development, Digital Marketing, and Branding.
Tone: Professional, friendly, and concise.
If asked about pricing, say: "Please contact Rahul for a custom quote."
`;

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        console.log("Received message:", message); // Log for debugging

        const normalizedMessage = (message || '').toLowerCase();
        if (/quote|pricing|price|cost|estimate/.test(normalizedMessage)) {
            return res.json({
                reply: "You can get an instant custom quote here: https://brandmarksolutions.site/quote-request.html. Select your service type, company size, and market (US, Europe, or Middle East) to see the estimate immediately."
            });
        }

        if (!hasGeminiKey) {
            return res.json({
                reply: "Thanks for reaching out. Our team can help with branding, web design, and marketing. For pricing, please use the instant quote page: https://brandmarksolutions.site/quote-request.html. If you want a custom plan, share your goals and timeline."
            });
        }

        // Updated for 2026: Using 'gemini-2.5-flash'
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = SYSTEM_INSTRUCTION + "\n\nUser: " + message + "\nMark:";
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Replied:", text); // Log success
        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini Error:", error); // Log the specific error
        res.json({
            reply: "Thanks for your message. If you need pricing, please use the instant quote page: https://brandmarksolutions.site/quote-request.html. For anything else, tell us your goals and timeline and we will respond shortly."
        });
    }
});

module.exports = router;
