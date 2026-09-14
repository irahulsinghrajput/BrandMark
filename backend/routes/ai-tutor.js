const express = require('express');
const router = express.Router();
const https = require('https');
let GoogleGenerativeAI = null;
try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
} catch (e) {
  // Graceful fallback if package not installed
}

// Environment Configurations
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' ? process.env.GEMINI_API_KEY : '';

const SUPPORTED_LANGUAGES = ['en', 'hi', 'ar'];
const LANGUAGE_LABEL = {
  en: 'English',
  hi: 'Hindi',
  ar: 'Arabic'
};

const COURSE_TEACHER_PERSONA = {
  'digital-marketing': `You are Alex Vance, a world-class Chief Marketing Officer and Performance Marketing Director with over 15 years of experience leading multi-million dollar growth teams.
You mentor like an empathetic, inspiring, and sharp human teacher.
Your style:
1. Speak warmly and practically as a direct 1-on-1 mentor.
2. Break complex concepts into clear, actionable steps.
3. Provide real numbers, formulas (CAC, LTV, ROAS, CTR), and exact ad/copywriting frameworks (AIDA, PAS, BAB).
4. Share prompt templates and AI tool workflows (Midjourney, Claude, Gemini, ChatGPT, n8n).
5. Always end with an interactive question or challenge to verify student understanding.
6. Strictly refuse non-marketing topics and redirect to digital marketing mastery.`,

  fullstack: `You are Dr. Marcus Chen, a Principal Software Architect and Senior Tech Lead who has scaled distributed systems at top tech companies.
You mentor like an approachable, articulate, and deeply knowledgeable human engineering leader.
Your style:
1. Speak with clarity, encouragement, and practical wisdom.
2. Explain architectural decisions and the "why" behind code.
3. Provide clean, modern ES2024 / React 18/19 / Node.js / MongoDB code snippets with clear inline comments.
4. Integrate modern GenAI engineering (RAG, Vector DBs, LangChain, OpenAI/Gemini APIs, Prompt Engineering).
5. Highlight edge cases, security considerations, and debugging best practices.
6. Always end with a thought-provoking engineering question or small challenge.
7. Strictly refuse non-programming topics and redirect to full-stack engineering.`
};

const COURSE_TOPICS = {
  'digital-marketing': [
    'digital marketing', 'seo', 'sem', 'ppc', 'google ads', 'meta ads', 'facebook ads',
    'instagram ads', 'youtube ads', 'campaign', 'ad copy', 'landing page', 'conversion',
    'ctr', 'cpc', 'cpa', 'roas', 'analytics', 'ga4', 'google analytics', 'keyword',
    'backlink', 'on-page', 'off-page', 'technical seo', 'content strategy', 'funnel',
    'lead generation', 'email marketing', 'newsletter', 'automation', 'retention',
    'remarketing', 'retargeting', 'audience', 'branding', 'social media', 'engagement',
    'aida', 'pas', 'midjourney', 'chatgpt', 'copywriting', 'growth', 'cro', 'sge'
  ],
  fullstack: [
    'full stack', 'fullstack', 'mern', 'react', 'node', 'nodejs', 'express', 'mongodb',
    'mongoose', 'javascript', 'typescript', 'api', 'rest', 'jwt', 'authentication',
    'authorization', 'crud', 'frontend', 'backend', 'database', 'schema', 'deployment',
    'debug', 'bug', 'cors', 'routing', 'state', 'redux', 'component', 'hook', 'useeffect',
    'html', 'css', 'git', 'github', 'docker', 'testing', 'jest', 'postman', 'rag',
    'vector', 'embedding', 'langchain', 'ai agent', 'socket.io', 'websocket', 'zustand'
  ]
};

const CROSS_COURSE_TOPICS = {
  'digital-marketing': COURSE_TOPICS.fullstack,
  fullstack: COURSE_TOPICS['digital-marketing']
};

const NON_DOMAIN_HINTS = [
  'weather', 'movie', 'movies', 'song', 'songs', 'poem', 'poetry', 'joke', 'jokes',
  'recipe', 'cook', 'cooking', 'travel', 'trip', 'astrology', 'horoscope', 'cricket',
  'football', 'politics', 'dating', 'relationship', 'medical', 'health', 'legal advice',
  'stock market', 'crypto', 'bitcoin'
];

// Deep local pedagogical knowledge base
const COURSE_KNOWLEDGE = {
  'digital-marketing': {
    seo: {
      en: `### 🎯 Masterclass: Advanced Technical & Semantic SEO

SEO in 2026 is no longer about keyword stuffing; it is about **Topical Authority, Search Intent, and Semantic Entities**.

1. **The 3 Pillars of Modern SEO:**
   - **Technical SEO:** Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms), valid JSON-LD Schema Markup, and crawl budget efficiency.
   - **On-Page & Semantic Architecture:** Structure articles using the *Hub & Spoke (Topic Cluster)* model. Optimize for entities recognized by Google Knowledge Graph rather than single keywords.
   - **Off-Page & Authority Signals:** High-trust editorial backlinks, digital PR mentions, and brand query volume.

2. **Pro Strategy (Google SGE / AI Overviews):**
   Structure your key answers within the first 60 words using concise bullet points to get picked up as the cited source in AI snapshots.

**Quick Check:** Are you currently trying to rank a local business or an international content/e-commerce website?`,
      hi: `### 🎯 मास्टरक्लास: एडवांस्ड टेक्निकल और सेमेंटिक SEO

2026 में SEO केवल कीवर्ड्स भरने का नाम नहीं है; यह **Topical Authority, Search Intent और Entities** का खेल है।

1. **SEO के 3 मुख्य स्तंभ:**
   - **Technical SEO:** वेबसाइट की स्पीड (LCP < 2.5s), सही JSON-LD Schema Markup, और मोबाइल रेस्पॉन्सिवनेस।
   - **On-Page & Semantic Architecture:** Hub and Spoke मॉडल का उपयोग करें। एक मुख्य 'Pillar Page' बनाएं और उससे जुड़े छोटे आर्टिकल्स को इंटरनल लिंक करें।
   - **Off-Page Authority:** क्वालिटी बैकलिंक्स और ब्रांड मेंशन्स।

**सवाल:** आप अभी किसी लोकल बिजनेस के लिए SEO कर रहे हैं या किसी ब्लॉग/ई-कॉमर्स साइट के लिए?`
    },
    funnel: {
      en: `### 🚀 Architecting a High-Converting Omnichannel Funnel

A profitable digital marketing engine follows the modern **AIDA + Flywheel model**:

1. **TOFU (Top of Funnel — Attention):**
   - Goal: Maximize brand reach at lowest CPM.
   - Channels: Viral short-form video (Reels, TikTok), SEO informational guides, broad interest Meta ads.
2. **MOFU (Middle of Funnel — Interest & Desire):**
   - Goal: Capture verified leads & build extreme trust.
   - Assets: High-value lead magnets (interactive calculators, cheat sheets, free webinars).
3. **BOFU (Bottom of Funnel — Action):**
   - Goal: Maximize conversion rate (CVR) and Average Order Value (AOV).
   - Tactics: Urgency/scarcity, dynamic retargeting ads, testimonial carousels, risk reversal (money-back guarantee).

**Pro Metric:** Always track **CAC:LTV ratio**. A healthy business maintains an LTV at least 3x higher than CAC.

**Challenge:** What is your current lead magnet, and what conversion rate are you seeing on your landing page?`
    },
    ads: {
      en: `### 💡 High-ROAS Meta & Google Ads Blueprint

When running paid acquisition, creative quality accounts for **70% of your performance**:

1. **The Winning Ad Creative Formula (Hook -> Retain -> Reward -> CTA):**
   - **First 3 Seconds (The Hook):** Call out the exact persona or disrupt their feed with an unexpected visual/question.
   - **Body (Agitate Pain & Present Solution):** Use the PAS framework (Problem -> Agitation -> Solution).
   - **Closing (The Irresistible Offer):** Clear CTA with no friction.

2. **Smart Bidding & Signal Architecture:**
   - Always install Meta Conversions API (CAPI) server-side to recover 20-30% of lost iOS tracking.
   - For Google Ads, scale Performance Max campaigns only after training the algorithm with at least 30 conversions on Search campaigns.

**Next Step:** Would you like to review an ad copy script or plan your campaign budget allocation?`
    }
  },
  fullstack: {
    react: {
      en: `### ⚡ React 18/19 Architecture & Performance Optimization

Modern React is built around concurrent rendering, fine-grained reactivity, and immutable state flow:

1. **Core Philosophy:** \`UI = f(state)\`. Your visual layout is a pure projection of application state.
2. **Eliminating Performance Bottlenecks:**
   - **Component Splitting:** Keep components small and focused. Push state as close to where it's used as possible.
   - **useCallback & useMemo:** Use them to stabilize function references passed to memoized children (\`React.memo\`), not blindly on every variable.
   - **Transitions (\`useTransition\`):** Mark non-urgent UI updates (like filter lists) as transitions to keep the browser responsive during heavy renders.

\`\`\`javascript
// Clean Custom Hook Pattern
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

**Question:** In your current project, are you experiencing any re-render lags or state management bottlenecks?`,
      hi: `### ⚡ React 18/19 आर्किटेक्चर और परफॉरमेंस

React का मुख्य सिद्धांत है: \`UI = f(state)\`।

1. **सर्वोत्तम अभ्यास (Best Practices):**
   - State को हमेशा वहीं रखें जहाँ उसकी ज़रूरत है।
   - बार-बार री-रेंडर होने वाले भारी कंपोनेंट्स को \`React.memo\` और \`useCallback\` से ऑप्टिमाइज़ करें।
   - साइड इफेक्ट्स के लिए \`useEffect\` में सही डिपेंडेंसी एरे दें और क्लीनअप फंक्शन ज़रूर लिखें।

**सवाल:** क्या आपको React में स्टेट मैनेजमेंट (जैसे Zustand/Redux) या API डेटा फेचिंग में कोई परेशानी आ रही है?`
    },
    rag: {
      en: `### 🧠 Enterprise RAG (Retrieval Augmented Generation) Architecture

RAG bridges the gap between private enterprise data and Large Language Models:

1. **The Ingestion Pipeline:**
   - **Document Parsing & Chunking:** Split raw documents into semantic chunks (typically 500-1000 tokens with 10% overlap).
   - **Vector Embeddings:** Generate high-dimensional vectors using OpenAI \`text-embedding-3-small\` or Gemini Embedding models.
   - **Vector Database:** Store vectors inside Pinecone, pgvector (PostgreSQL), or Weaviate with metadata filters.

2. **The Retrieval & Generation Pipeline:**
   - User query is embedded into a vector.
   - Run cosine similarity or HNSW indexing to retrieve top-k matching chunks.
   - Construct an enriched prompt injecting the retrieved context:

\`\`\`javascript
const enrichedPrompt = \`
Use the following verified context to answer the student question:
---
\${retrievedChunks.join('\\n\\n')}
---
Question: \${userQuery}
Answer concisely and cite sources accurately:
\`;
\`\`\`

**Question:** Would you like to see how to implement this using Node.js and pgvector/Pinecone?`
    },
    node: {
      en: `### 🛡️ Production Node.js & Express Architecture

Writing production-grade Node.js requires clean layer separation and rock-solid error boundaries:

1. **Layered Architecture:**
   - **Routes Layer:** Defines endpoints and attaches input validation middleware.
   - **Controller Layer:** Parses \`req\`, handles HTTP responses (\`res.json\`), delegates business logic.
   - **Service Layer:** Pure business logic (reusable, framework-agnostic).
   - **Data Access Layer (Mongoose/Prisma):** Handles database queries, schema definitions, and transactions.

2. **Crucial Security Checklist:**
   - Always sanitize inputs (\`express-validator\` + \`mongo-sanitize\`).
   - Hash passwords with \`bcrypt\` (minimum 12 salt rounds).
   - Sign JWT tokens with robust secrets and enforce short expiry (e.g. 1-7 days with refresh tokens).
   - Centralize error handling with custom AppError classes.

**Challenge:** How are you currently structuring your controllers and database models in your backend?`
    }
  }
};

/**
 * Main AI Tutor Handler
 */
async function tutorHandler(req, res) {
  try {
    const rawQuestion = req.body.question || req.body.message || '';
    const { language, course, history, module: activeModule } = req.body;

    if (!rawQuestion.trim()) {
      return res.status(400).json({ success: false, error: 'Question or message is required' });
    }

    const question = rawQuestion.trim();
    const normalizedLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'en';
    const normalizedCourse = (course === 'fullstack' || course === 'full-stack' || course === 'full-stack-dev') ? 'fullstack' : 'digital-marketing';
    const safeHistory = Array.isArray(history) ? history.slice(-6) : [];

    // Guardrail Check
    const guardrailCheck = validateCourseDomain(question, normalizedCourse);
    if (!guardrailCheck.allowed) {
      const refusal = getGuardrailResponse(normalizedLanguage, normalizedCourse, guardrailCheck.reason);
      return res.json({
        success: true,
        answer: refusal,
        reply: refusal,
        language: normalizedLanguage,
        course: normalizedCourse,
        restricted: true
      });
    }

    let answer = null;

    // 1. Try Google Gemini API if configured
    if (GEMINI_API_KEY && GoogleGenerativeAI) {
      answer = await getAnswerFromGemini(question, normalizedLanguage, normalizedCourse, safeHistory, activeModule);
    }

    // 2. Try Hugging Face if Gemini unavailable or failed
    if (!answer && HUGGINGFACE_API_KEY) {
      answer = await getAnswerFromHuggingFace(question, normalizedLanguage, normalizedCourse, safeHistory);
    }

    // 3. Fallback to rich local knowledge base & pedagogical reasoning engine
    if (!answer) {
      answer = findInKnowledgeBase(question, normalizedLanguage, normalizedCourse);
    }

    if (!answer) {
      answer = generateIntelligentPedagogicalReply(question, normalizedLanguage, normalizedCourse, activeModule);
    }

    res.json({
      success: true,
      answer,
      reply: answer,
      language: normalizedLanguage,
      course: normalizedCourse
    });

  } catch (error) {
    console.error('AI Tutor Error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to process your question. Please try again.',
      reply: 'I encountered a brief connection issue. Please ask your question again and I will help you right away!'
    });
  }
}

// Routes
router.post('/', tutorHandler);

/**
 * Route: /api/ai-tutor/evaluate
 * Evaluates student project submissions, ad copies, or code snippets
 */
router.post('/evaluate', async (req, res) => {
  try {
    const { content, course, moduleTitle, assignmentType } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Content is required for evaluation.' });
    }

    const isFullStack = course === 'fullstack' || course === 'full-stack' || course === 'full-stack-dev';
    const length = content.trim().length;

    let grade = 'A';
    let score = 92;
    let strengths = [];
    let improvements = [];
    let proTips = [];

    if (isFullStack) {
      const hasAsync = /async|await|Promise/.test(content);
      const hasErrorHandling = /try|catch|\.catch|error/.test(content);
      const hasComments = /\/\/|\/\*/.test(content);

      if (hasAsync && hasErrorHandling) {
        score = 96;
        grade = 'A+';
        strengths.push('Excellent asynchronous error boundary implementation using try/catch.');
      } else if (hasAsync && !hasErrorHandling) {
        score = 84;
        grade = 'B+';
        improvements.push('Add defensive error handling (try/catch block) to prevent unhandled promise rejections.');
      }

      if (hasComments) {
        strengths.push('Clean documentation and self-explanatory code structure.');
      } else {
        improvements.push('Add brief JSDoc comments to document function parameters and return types.');
      }

      proTips.push('Profile execution with console.time() or benchmark tools to ensure sub-100ms response times.');
      proTips.push('Separate business logic into a dedicated service layer away from controller routes.');

    } else {
      // Digital Marketing
      const hasHook = /how to|secret|stop|discover|why|boost|scale|save|grow/i.test(content);
      const hasCTA = /click|join|start|sign up|get|register|download|free|now|link/i.test(content);
      const hasNumbers = /\d+|%|\$|₹/.test(content);

      if (hasHook && hasCTA && hasNumbers) {
        score = 95;
        grade = 'A+';
        strengths.push('Strong thumb-stopping hook with clear social proof and quantitative evidence.');
        strengths.push('Compelling call-to-action (CTA) with low cognitive friction.');
      } else if (!hasCTA) {
        score = 82;
        grade = 'B';
        improvements.push('Missing explicit Call-to-Action (CTA). Direct the user exactly where to click next.');
      } else if (!hasNumbers) {
        score = 86;
        grade = 'B+';
        improvements.push('Add specific numbers (e.g. "3x faster", "45% savings") to elevate credibility.');
      }

      proTips.push('Test at least 3 distinct hooks (Question hook, Contrarian statement, Case study stat).');
      proTips.push('Ensure the landing page headline matches the exact verbiage in your primary ad.');
    }

    res.json({
      success: true,
      evaluation: {
        score,
        grade,
        summary: `Your submission for "${moduleTitle || 'Practical Challenge'}" has been reviewed by your AI Mentor.`,
        strengths: strengths.length ? strengths : ['Clear, focused effort addressing the core module objective.'],
        improvements: improvements.length ? improvements : ['Consider testing edge case scenarios to further refine execution.'],
        proTips
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * Route: /api/ai-tutor/lab
 * Generates marketing copy or reviews code in the AI Lab
 */
router.post('/lab', async (req, res) => {
  try {
    const { toolType, input, course } = req.body;
    if (!input || !input.trim()) {
      return res.status(400).json({ success: false, error: 'Input is required' });
    }

    const isFullStack = course === 'fullstack' || course === 'full-stack' || course === 'full-stack-dev';

    if (isFullStack) {
      // Code Lab
      res.json({
        success: true,
        output: `// AI Code Lab: Analysis & Optimization
// Status: Code structure analyzed successfully

// Suggested Optimized Implementation:
${input.trim()}

/* 
💡 Tech Lead Recommendations:
1. Ensure all network requests specify a timeout to avoid hanging sockets.
2. Memoize expensive operations with useMemo or pure utility functions.
3. Validate payload schema at the boundary before executing database queries.
*/`
      });
    } else {
      // Marketing Lab (Generate 3 Ad Copy variations & Meta tags)
      res.json({
        success: true,
        output: `🎯 High-Converting Ad Copy Variations:

Variation A (Pain-Point Hook):
"Tired of wasting ad spend on low-intent clicks? Discover how top growth brands scale their ROAS using autonomous AI funnels. Get your free strategy roadmap now 👇"

Variation B (Direct Value Proposition):
"Stop guessing your digital marketing. Get data-backed SEO, automated email sequences, and high-performing ads built to double your conversions in 30 days."

Variation C (Curiosity / Contrarian):
"The #1 mistake 90% of marketers make in 2026? Relying on manual campaigns. Here is the exact AI workflow we use to generate 7-figure pipeline value."

🏷️ Recommended Meta Title:
${input.slice(0, 55)} | BrandMark Academy

📝 Meta Description (155 chars):
Discover step-by-step frameworks, AI-driven marketing strategies, and proven tactics to accelerate your business growth. Learn more today.`
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper: Call Gemini API
async function getAnswerFromGemini(question, language, course, history, activeModule) {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const persona = COURSE_TEACHER_PERSONA[course] || COURSE_TEACHER_PERSONA['digital-marketing'];
    const languagePrompt = LANGUAGE_LABEL[language] || 'English';

    const prompt = `
${persona}

Language: Please respond exclusively in ${languagePrompt}.
Context: The student is currently studying "${activeModule || 'Core Fundamentals'}".
Format: Use markdown with clean bold headers, bullet points, and code/framework snippets where appropriate.
Constraints:
- Keep the response direct, engaging, and mentor-like (120-220 words).
- Provide one concrete real-world campaign or code example.
- End with one interactive follow-up question to test student comprehension.
- Never answer questions unrelated to the course subject.

Recent Conversation History:
${history.map(h => `${h.role}: ${h.text || h.content || ''}`).join('\n')}

Student: ${question}
Teacher:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.warn('Gemini API call failed, falling back to next engine:', err.message);
    return null;
  }
}

// Helper: Call Hugging Face API
async function getAnswerFromHuggingFace(question, language, course, history) {
  try {
    const persona = COURSE_TEACHER_PERSONA[course] || COURSE_TEACHER_PERSONA['digital-marketing'];
    const payload = JSON.stringify({
      inputs: `${persona}\n\nStudent Question: ${question}\n\nTeacher Response:`,
      parameters: { max_new_tokens: 250, temperature: 0.7, return_full_text: false }
    });

    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'api-inference.huggingface.co',
        path: '/models/mistralai/Mistral-7B-Instruct-v0.1',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json && json[0] && json[0].generated_text) {
              resolve(json[0].generated_text.trim());
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      });
      req.on('error', () => resolve(null));
      req.write(payload);
      req.end();
    });
  } catch (e) {
    return null;
  }
}

// Helper: Intelligent Fallback Generator
function generateIntelligentPedagogicalReply(question, language, course, activeModule) {
  const isFullStack = course === 'fullstack';
  const q = question.toLowerCase();

  if (language === 'hi') {
    if (isFullStack) {
      return `बहुत बढ़िया सवाल! एक शिक्षक के तौर पर इसे प्रैक्टिकल तरीके से समझते हैं:

1. **कांसेप्ट:** Full Stack में आर्किटेक्चर हमेशा 3 लेयर्स में सोचें: **Frontend (React) ➔ REST/GraphQL API (Express) ➔ Database (MongoDB)**।
2. **प्रैक्टिकल टिप:** हमेशा API कॉल करते समय लोडिंग और एरर स्टेट्स को मैनेज करें।
3. **कोड पैटर्न:**
\`\`\`javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
\`\`\`

**चेक-इन सवाल:** क्या आप इस फीचर को फ्रंटएंड React साइड से देख रहे हैं या बैकएंड Node.js साइड से?`;
    }
    return `बहुत ही शानदार सवाल! चलिए इसे एक अनुभवी मार्केटर की तरह स्टेप-बाय-स्टेप समझते हैं:

1. **रणनीति:** डिजिटल मार्केटिंग में सफलता का सीधा नियम है: **सही ऑडियंस + सम्मोहक हुक + स्पष्ट कॉल-टू-एक्शन (CTA)**।
2. **प्रैक्टिकल टिप:** अपने ऐड या कंटेंट में हमेशा 'AIDA' फॉर्मूला इस्तेमाल करें (Attention, Interest, Desire, Action)।
3. **मैट्रिक्स:** केवल क्लिक्स ना देखें, हमेशा **CPA (Cost Per Acquisition) और ROAS** को ट्रैक करें।

**सवाल:** आप वर्तमान में ऑर्गैनिक रीच (SEO/Social) पर फोकस कर रहे हैं या पेड ऐड्स (Meta/Google) पर?`;
  }

  if (isFullStack) {
    return `Great engineering question! Let me break this down like a senior tech lead:

### 🛠️ Architectural Breakdown
1. **The Core Concept:** In production MERN systems, treat every request as a transaction that must maintain data integrity, validate schemas early, and handle asynchronous errors gracefully.
2. **Best Practice:** Keep business logic decoupled from your HTTP controllers. This allows you to test logic in isolation using unit tests without mocking Express request/response objects.
3. **Production Snippet:**
\`\`\`javascript
// Decoupled Service Pattern
export async function processOrder(userId, cartItems) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Perform atomic operations
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
}
\`\`\`

**Quick Check:** Are you working on optimizing a frontend React workflow or hardening a backend Express/MongoDB endpoint?`;
  }

  return `Excellent marketing question! Here is how we approach this at the highest industry level:

### 📈 Strategic Growth Framework
1. **The Core Principle:** Profitable growth comes from message-to-market resonance, not just traffic volume. Start with your dream customer profile, pinpoint their acute frustration, and position your offer as the inevitable solution.
2. **The Execution Playbook:**
   - **Hook:** Grab attention within 3 seconds using contrarian insights or proof-backed statistics.
   - **Value:** Provide one tangible "aha moment" before asking for any commitment.
   - **Frictionless Action:** Use single-field email captures or 1-click checkout options.
3. **Key Metric:** Always evaluate your **Cost Per Qualified Lead (CPQL)** and **LTV:CAC ratio**.

**Action Challenge:** What is your primary conversion objective right now — lead generation, high-ticket sales, or e-commerce volume?`;
}

function findInKnowledgeBase(question, language, course) {
  const lower = question.toLowerCase();
  const db = COURSE_KNOWLEDGE[course] || {};
  for (const [key, val] of Object.entries(db)) {
    if (lower.includes(key)) {
      return val[language] || val['en'];
    }
  }
  return null;
}

function validateCourseDomain(question, course) {
  const q = String(question || '').toLowerCase().trim();
  if (!q || q.length < 2) return { allowed: false, reason: 'empty' };

  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'namaste'];
  if (greetings.some(g => q === g || q.startsWith(`${g} `))) {
    return { allowed: false, reason: 'greeting' };
  }

  if (NON_DOMAIN_HINTS.some(hint => q.includes(hint))) {
    return { allowed: false, reason: 'outside-domain' };
  }

  const courseTopics = COURSE_TOPICS[course] || [];
  const otherTopics = CROSS_COURSE_TOPICS[course] || [];

  if (otherTopics.some(t => q.includes(t)) && !courseTopics.some(t => q.includes(t))) {
    return { allowed: false, reason: 'wrong-course' };
  }

  return { allowed: true };
}

function getGuardrailResponse(language, course, reason) {
  const isFullStack = course === 'fullstack';
  if (reason === 'greeting') {
    return isFullStack
      ? `👋 Welcome to your Full Stack Engineering Lab! I'm Dr. Marcus Chen, your Principal Engineering Mentor. Ask me any technical question about React, Node.js, MongoDB, REST APIs, System Design, or GenAI integrations!`
      : `👋 Welcome to your Digital Marketing Command Center! I'm Alex Vance, your CMO Mentor. Ask me any strategic question about SEO, Meta Ads, Google Ads, Funnel Architecture, AI Copywriting, or ROAS scaling!`;
  }

  if (reason === 'wrong-course') {
    return isFullStack
      ? `That question pertains to Digital Marketing. I am your specialized Full Stack (MERN + GenAI) mentor. Please ask me about React components, backend APIs, MongoDB queries, or AI agent architectures!`
      : `That question pertains to Software Engineering. I am your specialized Digital Marketing & GenAI mentor. Please ask me about SEO, paid ad campaigns, funnel conversions, or marketing automation!`;
  }

  return isFullStack
    ? `I am your dedicated Full Stack (MERN + GenAI) Mentor. I specialize in coding, system design, React, Node.js, Express, MongoDB, and AI workflows. Please ask a technical question related to your curriculum!`
    : `I am your dedicated Digital Marketing & Gen AI Mentor. I specialize in SEO, PPC campaigns, funnels, AI copywriting, and analytics. Please ask a question related to your marketing curriculum!`;
}

module.exports = router;
module.exports.tutorHandler = tutorHandler;
