const express = require('express');
const router = express.Router();

let GoogleGenerativeAI = null;
try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (e) {
  // Graceful fallback if package is missing
}

/**
 * Dynamically retrieve a configured Gemini client
 */
function getGeminiClient() {
  const rawGeminiKey = (process.env.GEMINI_API_KEY || '').trim();
  const hasGeminiKey = Boolean(
    rawGeminiKey && 
    rawGeminiKey !== 'your_gemini_api_key_here' && 
    rawGeminiKey.length > 20 &&
    !rawGeminiKey.includes('placeholder')
  );

  if (!hasGeminiKey || !GoogleGenerativeAI) {
    return null;
  }

  try {
    return new GoogleGenerativeAI(rawGeminiKey);
  } catch (err) {
    console.warn('Gemini AI initialization notice:', err.message);
    return null;
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
3. If asked about pricing or quotes, direct them to our contact page: https://www.brandmarksolutions.site/contact or mention booking a call with Rahul (+91 7091863003).
4. Always guide the user toward clear next steps (scheduling a consultation, getting a quote, or exploring our portfolio).
`;

/**
 * Intelligent Local Knowledge & Intent Engine
 * Guarantees 100% uptime with rich, human-like answers even without third-party API keys
 */
function getIntelligentReply(rawMessage) {
  const rawStr = String(rawMessage ?? '').trim();
  if (!rawStr) {
    return "Hello! I'm Mark, your BrandMark AI Assistant. How can I help scale your brand or web presence today?";
  }

  const msg = rawStr.toLowerCase();

  // Strip greeting prefix if user provided an additional query (e.g. "Hi, what are your services?")
  const queryWithoutGreeting = msg.replace(
    /^(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening))\s*(mark)?\s*([!,.-]\s*)*/i,
    ''
  ).trim();
  const testMsg = queryWithoutGreeting.length > 0 ? queryWithoutGreeting : msg;

  // 1. Contact, Phone, WhatsApp & Office Location
  if (/\b(contact|phone|call|whatsapp|email|location|address|where\s*are\s*you|office|reach|meet|rahul|appointment)\b/i.test(testMsg)) {
    return "You can reach our team and founder Rahul directly: 📱 WhatsApp/Call: +91 7091863003 | ✉️ Email: info.aimservicesprivatelimited@gmail.com | 📍 Office: Gangotri, Buddha Colony, Patna, Bihar, India (serving global clients across US, UK, Middle East, and India). Feel free to message anytime!";
  }

  // 2. Careers & Hiring (with word boundaries to avoid collision with 'app' keywords)
  if (/\b(job|jobs|career|careers|hiring|internship|internships|vacancy|vacancies|work\s*with\s*you|apply|apply\s*for)\b/i.test(testMsg)) {
    return "We are always scouting for exceptional developers, performance marketers, and creative designers. Explore open positions and submit your profile at https://www.brandmarksolutions.site/careers.";
  }

  // 3. Pricing, Quotes & Costs
  if (/\b(quote|quotes|pricing|price|prices|cost|costs|how\s*much|estimate|budget|fee|rate|rates|package|packages)\b/i.test(testMsg)) {
    return "You can request a custom proposal or project estimate directly on our Contact Page: https://www.brandmarksolutions.site/contact. For immediate scope discussions or an enterprise quote, connect directly with our founder Rahul on WhatsApp at +91 7091863003.";
  }

  // 4. Services Overview
  if (/\bservices?|what\s*(do\s*you|can\s*you)\s*(do|offer|provide)|what\s*are\s*your\s*services|offerings?|solutions\b/i.test(testMsg)) {
    return "BrandMark Solutions is a full-service digital agency. We specialize in: 1) Custom Web & SaaS Development (React, Next.js, MERN), 2) High-ROAS Performance Marketing (Meta & Google Ads), 3) Advanced Search Engine Optimization (SEO & AI Search), and 4) Brand Identity & PR Strategy. Which area can we assist you with?";
  }

  // 5. Web & App Development (safe boundaries for 'apps' to avoid colliding with 'whatsapp' / 'apply')
  if (/\b(web|websites?|mern|react(\.js)?|next(\.js)?|node(\.js)?|apps?|applications?|web\s*apps?|mobile\s*apps?|frontend|backend|full\s*stack|software|developer|coding|e-?commerce|shopify|wordpress)\b/i.test(testMsg)) {
    return "We engineer ultra-fast, modern web applications and scalable SaaS platforms using React, Next.js, Node.js, and cloud architectures. Our builds boast sub-2-second load times, mobile-first responsiveness, and conversion-optimized UX. What type of web platform are you planning to build?";
  }

  // 6. Digital Marketing, SEO & Ads
  if (/\b(marketing|seo|google\s*ads|meta\s*ads|facebook\s*ads|instagram\s*ads|ppc|roas|lead\s*gen|traffic|ranking|funnel)\b/i.test(testMsg)) {
    return "Our growth marketing engine specializes in high-ROAS Meta & Google advertising, technical SEO (ranking for high-intent keywords), and automated lead-generation funnels. We focus on measurable revenue rather than vanity metrics. Are you looking to generate qualified B2B leads or scale direct-to-consumer sales?";
  }

  // 7. Branding, PR & Creative Design
  if (/\b(branding|brand\s*identity|logos?|graphic\s*design|creative|pr|public\s*relations|rebrand)\b/i.test(testMsg)) {
    return "From distinctive brand identities and visual guidelines to strategic Public Relations (PR) and social media acceleration, we shape how the market perceives your business. We recently led the social media and PR strategy for Govinda International School driving record admissions. Would you like to review our creative portfolio?";
  }

  // 8. Portfolio & Case Studies
  if (/\b(portfolio|case\s*stud(y|ies)|our\s*work|previous\s*work|past\s*work|client\s*results|gis|govinda)\b/i.test(testMsg)) {
    return "You can view our featured client work and case studies at https://www.brandmarksolutions.site/portfolio, including our Social Media & PR campaign for Govinda International School (GIS Patna), bespoke e-commerce platforms, and SaaS products. Would you like details on a specific industry?";
  }

  // 9. Academy & Courses
  if (/\b(courses?|academy|classes|curriculum|syllabus|enroll(ment)?|certificat(e|ion)|training\s*program)\b|\blearn\s+(web|marketing|coding|mern|dev)\b/i.test(testMsg)) {
    return "We offer two flagship masterclasses at BrandMark Academy: 1) Digital Marketing Mastery with Gen AI and 2) Full Stack Web Development (MERN + GenAI). Each features 15 comprehensive modules, 24/7 AI Tutor mentorship, hands-on labs, and verified certification. Learn more and enroll at https://www.brandmarksolutions.site/courses.";
  }

  // 10. Timelines & Delivery
  if (/\b(how\s*long|timeline|timelines|turnaround|delivery|deadline|duration|time\s*frame)\b/i.test(testMsg)) {
    return "Most custom website and branding projects are delivered within 2 to 4 weeks, while marketing campaigns and ad funnels typically go live within 5 to 7 business days following strategy sign-off. What is your target launch date?";
  }

  // 11. Greetings & Introductions (triggered when the message is solely a greeting)
  if (/^(hi|hello|hey|hola|namaste|good\s*(morning|afternoon|evening)|hi\s*mark|hey\s*mark|who\s*are\s*you|what\s*is\s*your\s*name)\b/i.test(msg)) {
    return "Hello! I'm Mark, your BrandMark AI Assistant. We help ambitious businesses build high-performance web applications, scale profitable ad campaigns, and dominate search rankings. How can I help scale your brand or project today?";
  }

  // 12. Intelligent Default
  return `Thanks for reaching out! At BrandMark Solutions, we help businesses scale with custom web development, high-ROAS digital marketing, and brand identity design. 

For an immediate project estimate, visit https://www.brandmarksolutions.site/contact or chat directly with our founder Rahul on WhatsApp at +91 7091863003. How can we best assist your project?`;
}

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body || {};
    console.log("ChatBot incoming message:", message);

    if (typeof message !== 'string' || !message.trim()) {
      return res.json({
        reply: "Hello! I'm Mark, your BrandMark AI Assistant. How can I help scale your brand or web presence today?",
        provider: 'default'
      });
    }

    const trimmedMessage = message.trim();
    const genAI = getGeminiClient();

    // Try Gemini AI if configured with valid key
    if (genAI) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_INSTRUCTION
          });

          // Build prompt with optional conversation history
          let prompt = '';
          if (Array.isArray(history) && history.length > 0) {
            const recentHistory = history.slice(-6).map(h => `${h.role === 'ai' ? 'Mark' : 'User'}: ${h.text || h.content || ''}`).join('\n');
            prompt = `${recentHistory}\nUser: ${trimmedMessage}\nMark:`;
          } else {
            prompt = `User: ${trimmedMessage}\nMark:`;
          }

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
    const localReply = getIntelligentReply(trimmedMessage);
    res.json({ reply: localReply, provider: 'brandmark-engine' });

  } catch (error) {
    console.error("Chat error:", error);
    const fallbackReply = getIntelligentReply(req.body?.message || '');
    res.json({ reply: fallbackReply, provider: 'fallback' });
  }
});

module.exports = router;
module.exports.getIntelligentReply = getIntelligentReply;
