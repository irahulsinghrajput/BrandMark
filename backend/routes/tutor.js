const express = require('express');
const router = express.Router();

const aiTutorRoute = require('./ai-tutor');

function normalizeHistory(chatHistory) {
  if (!Array.isArray(chatHistory)) {
    return [];
  }

  return chatHistory
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const role = item.role === 'assistant' || item.role === 'model' ? 'assistant' : 'user';
      const content = typeof item.content === 'string'
        ? item.content
        : typeof item.text === 'string'
          ? item.text
          : '';

      return { role, content };
    })
    .filter((item) => item.content);
}

// Compatibility endpoint for Gemini-style payloads:
// POST /api/tutor with { message, chatHistory, language, course }
router.post('/', async (req, res) => {
  const { message, chatHistory, language, course } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }

  req.body = {
    question: message,
    history: normalizeHistory(chatHistory),
    language,
    course
  };

  try {
    await aiTutorRoute.tutorHandler(req, res);
  } catch (error) {
    console.error('Tutor compatibility route error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Unable to process your message.' });
    }
  }
});

module.exports = router;
