const express = require('express');
const router = express.Router();
const axios = require('axios');

// FREE Hugging Face API - No payment required
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || 'hf_YOUR_FREE_TOKEN'; // Get free from huggingface.co

// Course knowledge base (free local data)
const courseData = {
  'seo': {
    'en': 'SEO (Search Engine Optimization) is the practice of optimizing your website to rank higher in search engine results. Key aspects include: keyword research, on-page optimization, technical SEO, link building, and content quality. Good SEO practices help drive organic traffic to your website without paid advertising.',
    'hi': 'SEO (सर्च इंजन ऑप्टिमाइजेशन) आपकी वेबसाइट को सर्च इंजन परिणामों में उच्च रैंकिंग के लिए अनुकूलित करने की प्रथा है। मुख्य पहलू हैं: कीवर्ड रिसर्च, ऑन-पेज ऑप्टिमाइजेशन, तकनीकी SEO, लिंक बिल्डिंग, और सामग्री की गुणवत्ता।',
    'ar': 'تحسين محركات البحث (SEO) هو ممارسة تحسين موقع الويب الخاص بك للترتيب الأعلى في نتائج محرك البحث. تشمل الجوانب الرئيسية: البحث عن الكلمات الرئيسية، تحسين الصفحة، SEO التقني، بناء الروابط، وجودة المحتوى.'
  },
  'social-media': {
    'en': 'Social Media Marketing involves promoting your brand on social platforms like Facebook, Instagram, Twitter, and LinkedIn. Strategy includes: creating engaging content, building community, running paid ads, influencer partnerships, and analyzing metrics. Social media helps build brand awareness and customer engagement.',
    'hi': 'सोशल मीडिया मार्केटिंग में Facebook, Instagram, Twitter और LinkedIn जैसे सोशल प्लेटफॉर्म पर अपने ब्रांड को प्रचारित करना शामिल है। रणनीति में शामिल है: आकर्षक सामग्री बनाना, समुदाय बनाना, भुगतान किए गए विज्ञापन चलाना।',
    'ar': 'يتضمن التسويق عبر وسائل التواصل الاجتماعي ترويج علامتك التجارية على منصات مثل Facebook و Instagram و Twitter و LinkedIn. تشمل الإستراتيجية: إنشاء محتوى جذاب، بناء المجتمع، تشغيل الإعلانات المدفوعة.'
  },
  'content-marketing': {
    'en': 'Content Marketing is about creating valuable, relevant content to attract and retain customers. Types include: blog posts, videos, infographics, whitepapers, and case studies. Good content establishes authority, improves SEO, and builds customer trust over time.',
    'hi': 'कंटेंट मार्केटिंग मूल्यवान, प्रासंगिक सामग्री बनाने के बारे में है ताकि ग्राहकों को आकर्षित और बनाए रखा जा सके। प्रकार में शामिल हैं: ब्लॉग पोस्ट, वीडियो, इन्फोग्राफिक्स, व्हाइटपेपर, और केस स्टडीज।',
    'ar': 'التسويق بالمحتوى يتعلق بإنشاء محتوى قيم وذي صلة لجذب والاحتفاظ بالعملاء. تشمل الأنواع: منشورات المدونة والفيديو والرسوم البيانية والأوراق البيضاء ودراسات الحالة.'
  }
};

// FREE endpoint using Hugging Face API (5000 free requests/month)
router.post('/', async (req, res) => {
  try {
    const { question, language } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // First, check if answer is in local knowledge base
    let answer = findInKnowledgeBase(question, language);

    if (!answer) {
      // If not found, use Hugging Face free API
      answer = await getAnswerFromHuggingFace(question, language);
    }

    res.json({
      success: true,
      answer: answer || 'I\'m still learning about this topic. Can you ask me something else about Digital Marketing?'
    });

  } catch (error) {
    console.error('AI Tutor Error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to process your question. Please try again.'
    });
  }
});

// Search knowledge base
function findInKnowledgeBase(question, language) {
  const lowerQuestion = question.toLowerCase();
  
  for (const [topic, content] of Object.entries(courseData)) {
    if (lowerQuestion.includes(topic) || lowerQuestion.includes(topic.replace('-', ' '))) {
      return content[language] || content['en'];
    }
  }
  
  return null;
}

// FREE Hugging Face API (completely free)
async function getAnswerFromHuggingFace(question, language) {
  try {
    // Using free model from Hugging Face
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      {
        inputs: `You are a Digital Marketing tutor. Answer this question in ${language === 'hi' ? 'Hindi' : language === 'ar' ? 'Arabic' : 'English'}: ${question}. Keep answer concise (2-3 sentences).`,
        parameters: {
          max_length: 200,
          top_p: 0.9,
          temperature: 0.7
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data[0]) {
      return response.data[0].generated_text || 'I need more context to answer that.';
    }
  } catch (error) {
    console.log('HuggingFace API error:', error.message);
  }

  return null;
}

module.exports = router;
