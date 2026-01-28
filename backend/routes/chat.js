const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

const SYSTEM_INSTRUCTION = `
You are 'Mark', the AI Assistant for Brand Mark Solutions, a digital agency in Patna, Bihar founded by Rahul Singh Rajput.
Your Tone: Professional, tech-savvy, yet friendly.
Your Goal: Help MSME clients understand our services (Web Dev, Digital Marketing, Branding).
Services:
1. MERN Stack Web Development.
2. Digital Marketing (SEO, Social Media).
3. Branding (Logos, Identity).
If asked about pricing, say: "Projects are custom. Please fill out the contact form for a quote."
Do NOT make up facts. If you don't know, ask them to contact Rahul.
`;

let model = null;

function getModel() {
    if (model) return model;

    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    model = genAI.getGenerativeModel({ model: modelName });
    return model;
}

router.post('/', async (req, res) => {
    try {
        const { message } = req.body || {};

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ reply: 'Please enter a message.' });
        }

        if (message.length > 2000) {
            return res.status(400).json({ reply: 'Message is too long. Please shorten it.' });
        }

        const prompt = `${SYSTEM_INSTRUCTION}\n\nUser: ${message.trim()}\nMark:`;

        const aiModel = getModel();
        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.json({ reply: text || 'Sorry, I could not generate a response right now.' });
    } catch (error) {
        console.error('Chat error:', error);

        if (error.message && error.message.includes('GEMINI_API_KEY')) {
            return res.status(503).json({ reply: 'AI is not configured yet. Please contact us for assistance.' });
        }

        return res.status(500).json({ reply: "I'm having trouble connecting right now. Please try again." });
    }
});

module.exports = router;
