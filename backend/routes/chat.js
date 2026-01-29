const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini with the API Key from Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

        // CRITICAL FIX: Using 'gemini-pro' which is the stable, free model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = SYSTEM_INSTRUCTION + "\n\nUser: " + message + "\nMark:";
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Replied:", text); // Log success
        res.json({ reply: text });

    } catch (error) {
        console.error("Gemini Error:", error); // Log the specific error
        res.status(500).json({ reply: "I'm having a bit of trouble connecting right now. Please try again." });
    }
});

module.exports = router;
