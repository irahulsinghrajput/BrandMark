const express = require('express');
const router = express.Router();

let GoogleGenerativeAI = null;
try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (e) {
  // Graceful fallback if package is missing
}

const rawGeminiKey = process.env.GEMINI_API_KEY || '';
const hasGeminiKey = Boolean(
  rawGeminiKey && 
  rawGeminiKey !== 'your_gemini_api_key_here' && 
  rawGeminiKey.length > 20 &&
  !rawGeminiKey.includes('placeholder')
);

let genAI = null;
if (hasGeminiKey && GoogleGenerativeAI) {
  try {
    genAI = new GoogleGenerativeAI(rawGeminiKey);
  } catch (err) {
    console.warn('Gemini AI initialization notice:', err.message);
  }
}

// SYSTEM INSTRUCTION for Mark AI
const SYSTEM_INSTRUCTION = `
You are 'Mark', the Lead AI Strategy & Growth Consultant at BrandMark Solutions (https://www.brandmarksolutions.site).
Company Overview:
- BrandMark Solutions is a premier digital technology & growth agency founded by Rahul Singh Rajput.
- Core Services: Enterprise Web & SaaS Development (React, Next.js, Node.js, MERN, Python), High-ROAS Performance Marketing (Meta Ads, Google Ads, TikTok Ads), Technical SEO & AI Search Optimization, Brand Identity & PR Strategy, Video Production, and AI Agent Integration.
- Selected Works: Govinda International School (Social Media & PR), global e-commerce brands, high-growth B2B SaaS.
- Academy: Full Stack Web Development (MERN + GenAI) and Digital Marketing Mastery with Gen AI.
- Founder & Contact: Rahul Singh Rajput. Direct WhatsApp/Call: +91 7091863003. Email: info.aimservicesprivatelimited@gmail.com.
- Office: Gangotri, Buddha Colony, Patna, Bihar, India (serving global clients in US, UK, Middle East, and India).

Guidelines:
1. Tone: Executive, warm, professional, and results-focused.
2. Keep answers concise (2 to 4 sentences or punchy bullet points).
3. If asked about pricing or quotes, direct them to our instant calculator: https://www.brandmarksolutions.site/quote-request.html or mention booking a call with Rahul (+91 7091863003).
4. Always guide the user toward clear next steps (scheduling a consultation, getting a quote, or exploring our portfolio).
`;

/**
 * Intelligent Local Knowledge & Intent Engine
 * Guarantees 100% uptime with rich, human-like answers even without third-party API keys
 */
function getIntelligentReply(rawMessage) {
  const msg = (rawMessage || '').toLowerCase().trim();

  // 1. Greetings & Introductions
  if (/^(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening)|hi\s*mark|hey\s*mark|who\s*are\s*you|what\s*is\s*your\s*name)\b/i.test(msg) || msg === 'hi' || msg === 'hello') {
    return "Hello! I'm Mark, your BrandMark AI Assistant. We help ambitious businesses build high-performance web applications, scale profitable ad campaigns, and dominate search rankings. How can I help scale your brand or project today?";
  }

  // 2. Services Overview
  if (/services?|what\s*(do\s*you|can\s*you)\s*(do|offer|provide)|what\s*are\s*your\s*services|offerings?|solutions/i.test(msg)) {
    return "BrandMark Solutions is a full-service digital agency. We specialize in: 1) Custom Web & SaaS Development (React, Next.js, MERN), 2) High-ROAS Performance Marketing (Meta & Google Ads), 3) Advanced Search Engine Optimization (SEO & AI Search), and 4) Brand Identity & PR Strategy. Which area can we assist you with?";
  }

  // 3. Pricing, Quotes & Costs
  if (/quote|pricing|price|cost|how\s*much|estimate|budget|fee|rate|package/i.test(msg)) {
    return "You can calculate your estimated project investment instantly on our interactive Quote Calculator: https://www.brandmarksolutions.site/quote-request.html. For a tailored proposal or custom enterprise scope, you can also connect directly with our founder Rahul on WhatsApp at +91 7091863003.";
  }

  // 4. Web & App Development
  if (/web|website|mern|react|next\.?js|node|app|frontend|backend|full\s*stack|software|developer|coding|e-?commerce|shopify|wordpress/i.test(msg)) {
    return "We engineer ultra-fast, modern web applications and scalable SaaS platforms using React, Next.js, Node.js, and cloud architectures. Our builds boast sub-2-second load times, mobile-first responsiveness, and conversion-optimized UX. What type of web platform are you planning to build?";
  }

  // 5. Digital Marketing, SEO & Ads
  if (/marketing|seo|google\s*ads|meta\s*ads|facebook\s*ads|instagram\s*ads|ppc|roas|lead\s*gen|traffic|ranking|funnel/i.test(msg)) {
    return "Our growth marketing engine specializes in high-ROAS Meta & Google advertising, technical SEO (ranking for high-intent keywords), and automated lead-generation funnels. We focus on measurable revenue rather than vanity metrics. Are you looking to generate qualified B2B leads or scale direct-to-consumer sales?";
  }

  // 6. Branding, PR & Creative Design
  if (/\b(branding|brand\s*identity|logo|graphic\s*design|creative|pr|public\s*relations|rebrand)\b/i.test(msg)) {
    return "From distinctive brand identities and visual guidelines to strategic Public Relations (PR) and social media acceleration, we shape how the market perceives your business. We recently led the social media and PR strategy for Govinda International School driving record admissions. Would you like to review our creative portfolio?";
  }

  // 6. Portfolio & Case Studies
  if (/portfolio|work|case\s*stud|client|projects|example|previous\s*work|gis|govinda/i.test(msg)) {
    return "You can view our featured client work and case studies at https://www.brandmarksolutions.site/portfolio, including our Social Media & PR campaign for Govinda International School (GIS Patna), bespoke e-commerce platforms, and SaaS products. Would you like details on a specific industry?";
  }

  // 7. Academy & Courses
  if (/course|academy|learn|student|training|syllabus|enroll|full\s*stack\s*course|marketing\s*course|certificate/i.test(msg)) {
    return "We offer two flagship masterclasses at BrandMark Academy: 1) Digital Marketing Mastery with Gen AI and 2) Full Stack Web Development (MERN + GenAI). Each features 15 comprehensive modules, 24/7 AI Tutor mentorship, hands-on labs, and verified certification. Learn more and enroll at https://www.brandmarksolutions.site/courses.";
  }

  // 8. Contact, Phone, WhatsApp & Office Location
  if (/contact|phone|call|whatsapp|email|location|address|where\s*are\s*you|office|reach|meet|rahul/i.test(msg)) {
    return "You can reach our team and founder Rahul directly: 📱 WhatsApp/Call: +91 7091863003 | ✉️ Email: info.aimservicesprivatelimited@gmail.com | 📍 Office: Gangotri, Buddha Colony, Patna, Bihar, India (serving global clients across US, UK, Middle East, and India). Feel free to message anytime!";
  }

  // 9. Timelines & Delivery
  if (/how\s*long|timeline|turnaround|delivery|deadline|duration|time\s*frame/i.test(msg)) {
    return "Most custom website and branding projects are delivered within 2 to 4 weeks, while marketing campaigns and ad funnels typically go live within 5 to 7 business days following strategy sign-off. What is your target launch date?";
  }

  // 10. Careers & Hiring
  if (/job|career|hiring|internship|vacancy|work\s*with\s*you|apply/i.test(msg)) {
    return "We are always scouting for exceptional developers, performance marketers, and creative designers. Explore open positions and submit your profile at https://www.brandmarksolutions.site/careers.";
  }

  // 11. Intelligent Default
  return `Thanks for reaching out! At BrandMark Solutions, we help businesses scale with custom web development, high-ROAS digital marketing, and brand identity design. 

For an immediate project estimate, visit https://www.brandmarksolutions.site/quote-request.html or chat directly with our founder Rahul on WhatsApp at +91 7091863003. How can we best assist your project?`;
}

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    console.log("ChatBot incoming message:", message);

    if (!message || !message.trim()) {
      return res.json({
        reply: "Hello! I'm Mark, your BrandMark AI Assistant. How can I help scale your brand or web presence today?"
      });
    }

    // Try Gemini AI if configured with valid key
    if (hasGeminiKey && genAI) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-pro'];
      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const prompt = `${SYSTEM_INSTRUCTION}\n\nUser: ${message}\nMark:`;
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          if (text && text.trim()) {
            console.log(`Gemini (${modelName}) Replied:`, text.substring(0, 60));
            return res.json({ reply: text.trim(), provider: 'gemini' });
          }
        } catch (apiErr) {
          console.warn(`Gemini model ${modelName} notice:`, apiErr.message);
        }
      }
    }

    // High-performance, reliable local knowledge engine fallback
    const localReply = getIntelligentReply(message);
    res.json({ reply: localReply, provider: 'brandmark-engine' });

  } catch (error) {
    console.error("Chat error:", error);
    const fallbackReply = getIntelligentReply(req.body?.message || '');
    res.json({ reply: fallbackReply, provider: 'fallback' });
  }
});

module.exports = router;
