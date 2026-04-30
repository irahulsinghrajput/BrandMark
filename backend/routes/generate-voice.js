const express = require('express');
const router = express.Router();
const axios = require('axios');

// FREE Text-to-Speech using Google Translate API (completely free, no API key needed)
// Alternative: Use browser Web Speech API (client-side, completely free)

router.post('/', async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Using free TTS endpoint (no authentication needed)
    // Option 1: Google Translate TTS (free, no API key)
    const langCode = language === 'hi' ? 'hi' : language === 'ar' ? 'ar' : 'en';
    
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${langCode}&client=tw-ob&ttsspeed=1`;

    // Fetch audio from Google Translate
    const audioResponse = await axios.get(ttsUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 10000
    });

    // Send audio as response
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioResponse.data.length
    });

    res.send(audioResponse.data);

  } catch (error) {
    console.log('Voice generation error:', error.message);
    // Gracefully fail - client will still work without audio
    res.status(500).json({ error: 'Voice generation unavailable' });
  }
});

module.exports = router;
