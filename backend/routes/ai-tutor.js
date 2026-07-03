const express = require('express');
const router = express.Router();
const https = require('https');

// FREE Hugging Face API - No payment required
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || 'hf_YOUR_FREE_TOKEN';

const SUPPORTED_LANGUAGES = ['en', 'hi', 'ar'];
const LANGUAGE_LABEL = {
  en: 'English',
  hi: 'Hindi',
  ar: 'Arabic'
};

const COURSE_TEACHER_PERSONA = {
  'digital-marketing': 'You are a senior Digital Marketing teacher with practical industry experience. Explain using campaigns, funnels, ad copy, SEO, and analytics examples.',
  fullstack: 'You are a senior Full Stack MERN teacher and mentor. Explain with practical coding examples, architecture decisions, and debugging best practices.',
  default: 'You are a senior teacher for Digital Marketing and Full Stack subjects.'
};

const COURSE_TOPICS = {
  'digital-marketing': [
    'digital marketing', 'seo', 'sem', 'ppc', 'google ads', 'meta ads', 'facebook ads',
    'instagram ads', 'youtube ads', 'campaign', 'ad copy', 'landing page', 'conversion',
    'ctr', 'cpc', 'cpa', 'roas', 'analytics', 'ga4', 'google analytics', 'keyword',
    'backlink', 'on-page', 'off-page', 'technical seo', 'content strategy', 'funnel',
    'lead generation', 'email marketing', 'newsletter', 'automation', 'retention',
    'remarketing', 'retargeting', 'audience', 'branding', 'social media', 'engagement'
  ],
  fullstack: [
    'full stack', 'fullstack', 'mern', 'react', 'node', 'nodejs', 'express', 'mongodb',
    'mongoose', 'javascript', 'typescript', 'api', 'rest', 'jwt', 'authentication',
    'authorization', 'crud', 'frontend', 'backend', 'database', 'schema', 'deployment',
    'debug', 'bug', 'cors', 'routing', 'state', 'redux', 'component', 'hook', 'useeffect',
    'html', 'css', 'git', 'github', 'docker', 'testing', 'jest', 'postman'
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

const COURSE_KNOWLEDGE = {
  'digital-marketing': {
    seo: {
      en: 'SEO improves organic visibility by aligning content, technical setup, and authority signals. Start with search intent, map one primary keyword per page, optimize title/meta/headers, and improve internal links. Then build quality backlinks and track rankings, CTR, and conversions.',
      hi: 'SEO का मकसद organic visibility बढ़ाना है। पहले search intent समझें, फिर हर page पर एक primary keyword रखें, title/meta/heading optimize करें और internal linking मजबूत करें। उसके बाद quality backlinks बनाएं और ranking, CTR और conversion track करें।',
      ar: 'يهدف SEO إلى رفع الظهور العضوي عبر توافق المحتوى والبنية التقنية والسلطة. ابدأ بفهم نية البحث، ثم خصص كلمة مفتاحية أساسية لكل صفحة، وحسّن العنوان والوصف والعناوين الداخلية والروابط الداخلية. بعد ذلك اعمل على الروابط الخلفية عالية الجودة وتتبع الترتيب وCTR والتحويل.'
    },
    ppc: {
      en: 'PPC gives fast traffic, but profit comes from structure and testing. Keep separate campaigns by intent, write ad copy matching the keyword, and optimize landing pages for one clear action. Scale only ad groups with good ROAS, not just high clicks.',
      hi: 'PPC से जल्दी traffic मिलता है, लेकिन profit तभी आता है जब structure और testing सही हो। intent के हिसाब से campaigns अलग रखें, keyword-matched ad copy लिखें और landing page पर एक clear CTA रखें। scaling सिर्फ उन्हीं ad groups में करें जिनका ROAS अच्छा हो।',
      ar: 'يعطي PPC زيارات سريعة، لكن الربح يعتمد على الهيكلة والاختبار. افصل الحملات حسب نية المستخدم، واكتب إعلاناً يطابق الكلمة المفتاحية، وحسّن صفحة الهبوط لهدف واحد واضح. قم بالتوسيع فقط للمجموعات ذات ROAS الجيد وليس فقط النقرات العالية.'
    }
  },
  fullstack: {
    react: {
      en: 'Think of React as UI = f(state). Keep components small, move shared state up, and avoid unnecessary re-renders with memoization only when needed. For side effects use useEffect carefully with accurate dependency arrays.',
      hi: 'React को ऐसे समझें: UI = f(state). components छोटे रखें, shared state ऊपर रखें, और memoization तभी करें जब performance issue दिखे। side effects के लिए useEffect में dependency array सही रखना जरूरी है।',
      ar: 'فكّر في React بهذه الصيغة: UI = f(state). اجعل المكوّنات صغيرة، وارفع الحالة المشتركة للأعلى، واستخدم memoization فقط عند الحاجة الفعلية. وللتأثيرات الجانبية استخدم useEffect مع dependencies دقيقة.'
    },
    node: {
      en: 'In Node/Express, production quality comes from layered architecture: routes -> controllers -> services -> data layer. Validate input early, centralize error handling, and secure endpoints with JWT + rate limiting.',
      hi: 'Node/Express में production quality के लिए layered architecture रखें: routes -> controllers -> services -> data layer। input validation शुरू में करें, centralized error handling रखें, और endpoints को JWT + rate limiting से secure करें।',
      ar: 'في Node/Express، الجودة الإنتاجية تأتي من بنية طبقية: routes ثم controllers ثم services ثم data layer. تحقّق من المدخلات مبكراً، ووحّد معالجة الأخطاء، وأمّن endpoints باستخدام JWT مع rate limiting.'
    }
  }
};

// FREE endpoint using Hugging Face API (5000 free requests/month)
async function tutorHandler(req, res) {
  try {
    const { question, language, course, history } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const normalizedLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'en';
    const normalizedCourse = course === 'fullstack' ? 'fullstack' : 'digital-marketing';
    const safeHistory = Array.isArray(history) ? history.slice(-6) : [];

    const guardrailCheck = validateCourseDomain(question, normalizedCourse);
    if (!guardrailCheck.allowed) {
      return res.json({
        success: true,
        answer: getGuardrailResponse(normalizedLanguage, normalizedCourse, guardrailCheck.reason),
        language: normalizedLanguage,
        course: normalizedCourse,
        restricted: true
      });
    }

    // First, check if answer is in local knowledge base
    let answer = findInKnowledgeBase(question, normalizedLanguage, normalizedCourse);

    if (!answer) {
      // If not found, use Hugging Face free API with teacher-style prompt
      answer = await getAnswerFromHuggingFace(question, normalizedLanguage, normalizedCourse, safeHistory);
    }

    if (!answer) {
      answer = getTeacherFallback(question, normalizedLanguage, normalizedCourse);
    }

    res.json({
      success: true,
      answer,
      language: normalizedLanguage,
      course: normalizedCourse
    });

  } catch (error) {
    console.error('AI Tutor Error:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to process your question. Please try again.'
    });
  }
}

router.post('/', tutorHandler);

// Search knowledge base
function findInKnowledgeBase(question, language, course) {
  const lowerQuestion = question.toLowerCase();

  const localCourseData = COURSE_KNOWLEDGE[course] || {};
  for (const [topic, content] of Object.entries(localCourseData)) {
    if (lowerQuestion.includes(topic) || lowerQuestion.includes(topic.replace('-', ' '))) {
      return content[language] || content['en'];
    }
  }

  return null;
}

function hasAnyTopic(text, topics) {
  return topics.some((topic) => text.includes(topic));
}

function validateCourseDomain(question, course) {
  const q = String(question || '').toLowerCase().trim();
  if (!q) {
    return { allowed: false, reason: 'empty' };
  }

  if (q.length <= 3) {
    return { allowed: false, reason: 'vague' };
  }

  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good evening'];
  if (greetings.some((greet) => q === greet || q.startsWith(`${greet} `))) {
    return { allowed: false, reason: 'greeting' };
  }

  const courseTopics = COURSE_TOPICS[course] || [];
  const otherTopics = CROSS_COURSE_TOPICS[course] || [];

  if (hasAnyTopic(q, NON_DOMAIN_HINTS)) {
    return { allowed: false, reason: 'outside-domain' };
  }

  if (hasAnyTopic(q, otherTopics) && !hasAnyTopic(q, courseTopics)) {
    return { allowed: false, reason: 'wrong-course' };
  }

  if (!hasAnyTopic(q, courseTopics)) {
    return { allowed: false, reason: 'unclear-course-topic' };
  }

  return { allowed: true };
}

function getGuardrailResponse(language, course, reason) {
  const isFullStack = course === 'fullstack';

  if (language === 'hi') {
    if (reason === 'greeting') {
      return isFullStack
        ? 'नमस्ते! मैं सिर्फ Full Stack (MERN) कोर्स के सवालों में मदद करता हूँ। कृपया अपना coding सवाल भेजें, जैसे React, Node, Express, MongoDB, API, JWT या CORS।'
        : 'नमस्ते! मैं सिर्फ Digital Marketing कोर्स के सवालों में मदद करता हूँ। कृपया अपना सवाल भेजें, जैसे SEO, Ads, Funnel, Analytics, Content Strategy या Lead Generation।';
    }
    if (reason === 'wrong-course') {
      return isFullStack
        ? 'यह सवाल Full Stack कोर्स से बाहर लगता है। मैं अभी सिर्फ Full Stack (MERN) topics पर मदद कर सकता हूँ। अगर चाहें तो अपना coding सवाल भेजें।'
        : 'यह सवाल Digital Marketing कोर्स से बाहर लगता है। मैं अभी सिर्फ Digital Marketing topics पर मदद कर सकता हूँ। कृपया course-related सवाल भेजें।';
    }
    return isFullStack
      ? 'मैं केवल Full Stack (MERN) कोर्स से जुड़े सवालों का जवाब दे सकता हूँ। कृपया React, Node, Express, MongoDB, APIs, Auth, Debugging या Deployment से जुड़ा specific सवाल पूछें।'
      : 'मैं केवल Digital Marketing कोर्स से जुड़े सवालों का जवाब दे सकता हूँ। कृपया SEO, PPC, Social Media, Email Marketing, Funnel, Analytics या Campaign Optimization से जुड़ा specific सवाल पूछें।';
  }

  if (language === 'ar') {
    if (reason === 'greeting') {
      return isFullStack
        ? 'مرحباً! أنا أساعد فقط في أسئلة دورة Full Stack (MERN). أرسل سؤالك البرمجي حول React أو Node أو Express أو MongoDB أو APIs أو JWT أو CORS.'
        : 'مرحباً! أنا أساعد فقط في أسئلة دورة التسويق الرقمي. أرسل سؤالك حول SEO أو الإعلانات أو القمع التسويقي أو التحليلات أو استراتيجية المحتوى أو توليد العملاء المحتملين.';
    }
    if (reason === 'wrong-course') {
      return isFullStack
        ? 'يبدو أن هذا السؤال خارج نطاق دورة Full Stack. أستطيع المساعدة فقط في موضوعات Full Stack (MERN) حالياً.'
        : 'يبدو أن هذا السؤال خارج نطاق دورة التسويق الرقمي. أستطيع المساعدة فقط في موضوعات التسويق الرقمي حالياً.';
    }
    return isFullStack
      ? 'يمكنني الإجابة فقط على أسئلة دورة Full Stack (MERN). من فضلك اسأل سؤالاً محدداً عن React أو Node أو Express أو MongoDB أو APIs أو المصادقة أو النشر.'
      : 'يمكنني الإجابة فقط على أسئلة دورة التسويق الرقمي. من فضلك اسأل سؤالاً محدداً عن SEO أو PPC أو السوشال ميديا أو البريد الإلكتروني أو القمع أو التحليلات أو تحسين الحملات.';
  }

  if (reason === 'greeting') {
    return isFullStack
      ? 'Hi! I can help only with Full Stack (MERN) course questions. Ask me about React, Node, Express, MongoDB, APIs, JWT, CORS, debugging, or deployment.'
      : 'Hi! I can help only with Digital Marketing course questions. Ask me about SEO, ads, funnels, analytics, content strategy, or lead generation.';
  }

  if (reason === 'wrong-course') {
    return isFullStack
      ? 'This looks outside the current Full Stack course scope. I can help with Full Stack (MERN) topics only right now. Share a coding question and I will guide you step by step.'
      : 'This looks outside the current Digital Marketing course scope. I can help with Digital Marketing topics only right now. Share a campaign or growth question and I will guide you step by step.';
  }

  return isFullStack
    ? 'I can answer only Full Stack (MERN) course questions. Please ask a specific question on React, Node, Express, MongoDB, APIs, auth, debugging, or deployment.'
    : 'I can answer only Digital Marketing course questions. Please ask a specific question on SEO, PPC, social media, email marketing, funnel strategy, analytics, or campaign optimization.';
}

// FREE Hugging Face API (completely free)
async function getAnswerFromHuggingFace(question, language, course, history) {
  try {
    const responseLanguage = LANGUAGE_LABEL[language] || 'English';
    const teacherPersona = COURSE_TEACHER_PERSONA[course] || COURSE_TEACHER_PERSONA.default;
    const historyText = history
      .map((turn, idx) => {
        const speaker = turn && turn.role === 'assistant' ? 'Teacher' : 'Student';
        const content = turn && typeof turn.content === 'string' ? turn.content : '';
        return `${idx + 1}. ${speaker}: ${content}`;
      })
      .join('\n');

    const prompt = [
      teacherPersona,
      `Reply only in ${responseLanguage}.`,
      'Sound like a natural, warm mentor with human conversation style.',
      'Keep the response concise but helpful (90-170 words).',
      'Use simple language, short paragraphs, and practical clarity.',
      'Include one concrete example from real projects or campaigns.',
      'End with one short follow-up question to check understanding.',
      `If the question is not about ${course === 'fullstack' ? 'Full Stack (MERN)' : 'Digital Marketing'}, politely refuse and ask for a course-related question.`,
      historyText ? `Recent conversation:\n${historyText}` : 'No previous conversation.',
      `Student question: ${question}`
    ].join('\n\n');

    const payload = JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 260,
        top_p: 0.9,
        temperature: 0.65,
        return_full_text: false
      }
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api-inference.huggingface.co',
        path: '/models/mistralai/Mistral-7B-Instruct-v0.1',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': payload.length
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response && response[0] && response[0].generated_text) {
              resolve(cleanGeneratedText(response[0].generated_text));
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
  } catch (error) {
    console.log('HuggingFace API error:', error.message);
    return null;
  }
}

function cleanGeneratedText(text) {
  if (!text || typeof text !== 'string') return null;
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^\s*(Answer|Response)\s*:\s*/i, '').trim();
  cleaned = cleaned.replace(/\s{3,}/g, ' ');
  return cleaned || null;
}

function getTeacherFallback(question, language, course) {
  const q = question.toLowerCase();
  const isFullStack = course === 'fullstack';

  if (language === 'hi') {
    if (isFullStack) {
      return `बहुत अच्छा सवाल। इसे शिक्षक की तरह आसान तरीके से समझते हैं।\n\nFull Stack में हमेशा flow याद रखें: Frontend (React) -> API (Node/Express) -> Database (MongoDB)। पहले छोटे feature से शुरू करें, जैसे login या todo CRUD, फिर उसे secure करें (validation + JWT) और अंत में deploy करें।\n\nउदाहरण: अगर आप user profile बना रहे हैं, तो React form data भेजेगा, Express input validate करेगा, MongoDB में save करेगा, और फिर updated profile वापस आएगी।\n\nअब बताइए: इस flow में आपको सबसे ज्यादा confusion React side पर है या backend API side पर?`;
    }
    return `बहुत अच्छा सवाल। चलिए इसे step-by-step teacher style में समझते हैं।\n\nDigital Marketing में सही strategy हमेशा 3 चीज़ों से बनती है: audience clarity, message clarity, और measurement clarity। पहले target audience define करें, फिर channel चुनें (SEO/Ads/Social/Email), और हर campaign के लिए एक primary goal रखें (leads, sales, signups)।\n\nउदाहरण: अगर goal lead generation है, तो ad + landing page + follow-up email sequence साथ में design करें, केवल ad चलाना काफी नहीं होता।\n\nअब बताइए: आप currently organic growth पर focus करना चाहते हैं या paid campaigns पर?`;
  }

  if (language === 'ar') {
    if (isFullStack) {
      return `سؤال ممتاز، ولنشرحه كمدرّس بشكل بسيط.\n\nفي Full Stack تذكّر دائماً التسلسل: الواجهة (React) -> API (Node/Express) -> قاعدة البيانات (MongoDB). ابدأ بميزة صغيرة مثل تسجيل الدخول أو CRUD، ثم أضف الحماية (validation + JWT)، وبعدها انشر المشروع.\n\nمثال عملي: عند تحديث ملف المستخدم، ترسل React البيانات، يتحقق Express منها، تُحفَظ في MongoDB، ثم تعود النتيجة المحدثة للواجهة.\n\nسؤال متابعة: أين تشعر أن الفهم أصعب الآن، في React أم في تصميم الـ API؟`;
    }
    return `سؤال رائع، وسأشرحه بأسلوب تدريسي واضح.\n\nفي التسويق الرقمي، النجاح يعتمد على 3 نقاط: وضوح الجمهور، وضوح الرسالة، ووضوح القياس. حدّد الجمهور أولاً، ثم اختر القناة المناسبة (SEO/إعلانات/سوشال/بريد)، واجعل لكل حملة هدفاً رئيسياً واضحاً مثل leads أو مبيعات.\n\nمثال: إذا كان الهدف جمع العملاء المحتملين، فالإعلان وحده لا يكفي؛ يجب ربطه بصفحة هبوط قوية مع متابعة عبر البريد.\n\nسؤال متابعة: هل تريد التركيز حالياً على النمو العضوي أم الحملات المدفوعة؟`;
  }

  if (isFullStack) {
    return `Great question. Let me explain it like a teacher in a practical way.\n\nIn full stack development, think in one pipeline: UI state in React -> request handling in Express -> persistence in MongoDB. Build one small vertical slice first (for example, create/read/update for one entity), then harden it with validation, auth, and error handling.\n\nExample: for a notes app, React submits a note, Express validates the payload, MongoDB stores it, and the API returns the saved note to refresh UI instantly.\n\nQuick check: do you want me to break this down further from the frontend perspective or backend API perspective?`;
  }

  if (q.includes('seo') || q.includes('ads') || q.includes('campaign')) {
    return `Great question. Here is the teacher-style way to think about it.\n\nTreat digital marketing as a system, not isolated tactics: traffic source -> landing experience -> conversion action -> follow-up. Start with one clear goal, then choose channels that match that goal, and track only a few core metrics that reflect business outcomes.\n\nExample: if your goal is qualified leads, optimize for cost per qualified lead and conversion rate, not just clicks or impressions.\n\nWant me to help you build a 30-day action plan for your exact objective?`;
  }

  return `Great question. Let me teach it step by step in a practical way.\n\nFirst, define the core concept in one line. Then connect it to how it works in real projects, and finally apply it with one small experiment so you can see results quickly. Learning becomes faster when you move from theory -> implementation -> feedback.\n\nIf you share your exact use case, I can give you a personalized explanation with an actionable checklist.\n\nWhat are you currently building or marketing right now?`;
}

module.exports = router;
module.exports.tutorHandler = tutorHandler;
