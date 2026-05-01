/**
 * BrandMark AI Tutor Floating Widget
 * Drop into any page: <script src="ai-tutor-widget.js"></script>
 * Shows a floating button → small chat window. No backend, 100% free.
 */
(function () {
  // ── Knowledge Base ─────────────────────────────────────────────────────────
  const KB = {
    en: {
      'seo': 'SEO (Search Engine Optimization) improves your website ranking on Google. Key elements: keyword research, on-page optimization, quality content, backlinks, and technical SEO. Good SEO drives free organic traffic.',
      'search engine': 'Search Engine Optimization helps your website appear higher on Google and Bing. Focus on: relevant keywords, fast page speed, mobile-friendly design, and quality backlinks.',
      'social media': 'Social Media Marketing promotes your brand on Facebook, Instagram, Twitter, LinkedIn. Strategies: consistent posting, engaging content, hashtags, paid ads, and influencer collaborations.',
      'content': 'Content Marketing creates valuable blog posts, videos, and infographics to attract customers. Good content builds trust, improves SEO, and brings free traffic.',
      'email': 'Email Marketing sends targeted messages to subscribers. Highest ROI of any digital channel — ₹40 return per ₹1 spent! Build your list and send valuable content regularly.',
      'ppc': 'PPC (Pay-Per-Click) shows ads on Google and social media. You only pay when someone clicks. Google Ads and Facebook Ads are most popular for quick, targeted results.',
      'google ads': 'Google Ads shows your website at the top of search results. Bid on keywords and pay per click. Target by location, language, device, and more.',
      'facebook ads': 'Facebook Ads reach 2+ billion users with precise targeting by age, location, interests, and behavior. Use carousel, video ads, and retargeting to maximize conversions.',
      'branding': 'Branding creates your company identity — logo, colors, voice, and values. Strong branding builds customer trust and loyalty across all channels.',
      'digital marketing': 'Digital Marketing promotes products online through SEO, social media, email, PPC, and content. Measurable, cost-effective, and targets specific audiences.',
      'analytics': 'Digital Analytics tracks campaign performance using Google Analytics. Key metrics: traffic, bounce rate, conversion rate, CTR, and ROI.',
      'conversion': 'Conversion Rate Optimization (CRO) increases the % of visitors who buy or sign up. Use A/B testing, clear CTAs, faster loading, and trust signals.',
      'influencer': 'Influencer Marketing partners with social media personalities to promote your brand. Micro-influencers (10K–100K followers) often have higher engagement rates.',
      'affiliate': 'Affiliate Marketing pays partners a commission per sale. You only pay for results! Join networks like Amazon Associates or create your own program.',
      'video': 'Video Marketing is the most engaging content type. YouTube is the 2nd largest search engine! Short Reels and TikToks get massive reach. Always add a clear call-to-action.',
      'funnel': 'Marketing Funnel guides customers: Awareness → Interest → Decision → Action. Top: blogs/social. Middle: email. Bottom: offers and demos to convert leads.',
      'keyword': 'Keyword Research finds what your audience searches for. Use Google Keyword Planner or Ubersuggest. Target long-tail keywords (3+ words) for less competition.',
      'backlink': 'Backlinks are links from other websites to yours — they signal authority to Google. Earn them through guest posting and creating shareable content.',
      'landing page': 'Landing Pages convert visitors with a focused message: strong headline, clear CTA, social proof, no distractions. A good landing page can double your conversion rate.',
      'roi': 'ROI = (Revenue − Cost) / Cost × 100%. Track ROI per channel to invest more in what works and cut what doesn\'t.',
      'hello': 'Hello! I\'m your BrandMark AI Tutor 🤖 Ask me anything about Digital Marketing!',
      'hi': 'Hi there! 👋 Ask me about SEO, Social Media, Email, PPC, Branding, or Analytics!',
      'help': 'I can answer questions about: SEO, Social Media, Email Marketing, PPC Ads, Content Marketing, Branding, Analytics, Funnels, Keywords, Backlinks, and more!',
      'default': 'Great question! Try asking about: "What is SEO?", "social media marketing", "email marketing", "PPC ads", or "branding strategy".'
    },
    hi: {
      'seo': 'SEO आपकी वेबसाइट को Google पर ऊपर लाता है। मुख्य तत्व: कीवर्ड रिसर्च, क्वालिटी कंटेंट, बैकलिंक्स, तकनीकी SEO।',
      'social media': 'सोशल मीडिया मार्केटिंग Facebook, Instagram पर ब्रांड प्रमोट करती है। नियमित पोस्टिंग और इन्फ्लुएंसर सहयोग से फॉलोवर्स बढ़ते हैं।',
      'email': 'ईमेल मार्केटिंग सबसे अधिक ROI वाला चैनल है। हर ₹1 पर ₹40 की वापसी!',
      'digital marketing': 'डिजिटल मार्केटिंग में SEO, सोशल मीडिया, ईमेल, PPC और कंटेंट शामिल है।',
      'content': 'कंटेंट मार्केटिंग ब्लॉग, वीडियो और इन्फोग्राफिक्स से ग्राहकों को आकर्षित करती है।',
      'hello': 'नमस्ते! मैं BrandMark AI ट्यूटर हूँ 🤖 डिजिटल मार्केटिंग के बारे में कुछ भी पूछें!',
      'hi': 'नमस्ते! 👋 SEO, सोशल मीडिया, ईमेल, PPC या ब्रांडिंग के बारे में पूछें!',
      'default': 'अच्छा सवाल! पूछें: "SEO क्या है?", "सोशल मीडिया मार्केटिंग", "ईमेल मार्केटिंग"।'
    },
    ar: {
      'seo': 'تحسين محركات البحث يساعد موقعك على الظهور في أعلى نتائج Google. الأساسيات: الكلمات المفتاحية، المحتوى الجيد، الروابط الخلفية.',
      'social media': 'التسويق عبر وسائل التواصل يروّج لعلامتك على Facebook و Instagram. المفتاح: النشر المنتظم والتعاون مع المؤثرين.',
      'email': 'التسويق بالبريد الإلكتروني له أعلى عائد استثمار — 40 مقابل كل 1 ريال!',
      'digital marketing': 'التسويق الرقمي يشمل SEO ووسائل التواصل والبريد الإلكتروني وإعلانات PPC والمحتوى.',
      'hello': 'مرحباً! أنا معلمك الذكي من BrandMark 🤖 اسألني أي شيء عن التسويق الرقمي!',
      'hi': 'مرحباً! 👋 اسألني عن SEO أو وسائل التواصل أو البريد الإلكتروني أو إعلانات PPC!',
      'default': 'سؤال رائع! جرّب السؤال عن: "ما هو SEO؟" أو "التسويق عبر وسائل التواصل".'
    }
  };

  function getAnswer(question, lang) {
    const q = question.toLowerCase();
    const kb = KB[lang] || KB.en;
    for (const [kw, ans] of Object.entries(kb)) {
      if (kw !== 'default' && q.includes(kw)) return ans;
    }
    if (lang !== 'en') {
      for (const [kw, ans] of Object.entries(KB.en)) {
        if (kw !== 'default' && q.includes(kw)) return ans;
      }
    }
    return kb.default || KB.en.default;
  }

  // ── State ──────────────────────────────────────────────────────────────────
  let lang = 'en';
  let isOpen = false;
  let isLoading = false;

  const greetings = {
    en: '👋 Hi! I\'m your AI Tutor. Ask me anything about this module or Digital Marketing!',
    hi: '👋 नमस्ते! मैं आपका AI ट्यूटर हूँ। इस मॉड्यूल या डिजिटल मार्केटिंग के बारे में पूछें!',
    ar: '👋 مرحباً! أنا معلمك الذكي. اسألني عن هذه الوحدة أو التسويق الرقمي!'
  };
  const placeholders = { en: 'Ask a question...', hi: 'प्रश्न पूछें...', ar: 'اطرح سؤالاً...' };

  // ── Inject Styles ──────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #bm-tutor-fab {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, #F26A21, #E65C17);
      color: #fff; border: none; cursor: pointer; font-size: 26px;
      box-shadow: 0 6px 20px rgba(242,106,33,0.5);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      font-family: 'Outfit', sans-serif;
    }
    #bm-tutor-fab:hover { transform: scale(1.1); box-shadow: 0 8px 24px rgba(242,106,33,0.6); }
    #bm-tutor-fab .bm-badge {
      position: absolute; top: -4px; right: -4px;
      background: #0B2C4D; color: #F26A21; font-size: 9px; font-weight: 700;
      padding: 2px 5px; border-radius: 10px; border: 2px solid #fff;
      white-space: nowrap;
    }
    #bm-tutor-window {
      position: fixed; bottom: 100px; right: 28px; z-index: 9998;
      width: 360px; max-width: calc(100vw - 40px);
      background: #fff; border-radius: 18px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.18);
      display: flex; flex-direction: column; overflow: hidden;
      border: 2px solid #F26A21;
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
      transform-origin: bottom right;
    }
    #bm-tutor-window.bm-hidden { transform: scale(0.85); opacity: 0; pointer-events: none; }
    #bm-tutor-header {
      background: linear-gradient(135deg, #0B2C4D, #081F36);
      padding: 12px 16px; display: flex; align-items: center; gap: 10px;
    }
    #bm-tutor-header .bm-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: rgba(242,106,33,0.2); border: 2px solid #F26A21;
      display: flex; align-items: center; justify-content: center; font-size: 18px;
    }
    #bm-tutor-header .bm-title { color: #fff; font-weight: 700; font-size: 13px; font-family: 'Outfit', sans-serif; }
    #bm-tutor-header .bm-status { color: #86efac; font-size: 11px; font-family: 'Outfit', sans-serif; }
    #bm-tutor-header .bm-close {
      margin-left: auto; background: none; border: none; color: #fff;
      cursor: pointer; font-size: 18px; padding: 2px 6px; border-radius: 6px; line-height: 1;
    }
    #bm-tutor-header .bm-close:hover { background: rgba(255,255,255,0.15); }
    #bm-tutor-langs {
      background: #f8fafc; padding: 8px 12px; display: flex; gap: 6px;
      border-bottom: 1px solid #e2e8f0;
    }
    .bm-lang-btn {
      padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;
      border: 1.5px solid #F26A21; background: transparent; color: #F26A21;
      cursor: pointer; transition: all 0.2s; font-family: 'Outfit', sans-serif;
    }
    .bm-lang-btn.bm-active, .bm-lang-btn:hover { background: #F26A21; color: #fff; }
    #bm-tutor-messages {
      height: 280px; overflow-y: auto; padding: 14px; display: flex;
      flex-direction: column; gap: 10px; background: #f8fafc;
    }
    #bm-tutor-messages::-webkit-scrollbar { width: 3px; }
    #bm-tutor-messages::-webkit-scrollbar-thumb { background: #F26A21; border-radius: 3px; }
    .bm-msg-bot {
      background: linear-gradient(135deg, #0B2C4D, #0d3560); color: #fff;
      padding: 10px 14px; border-radius: 14px 14px 14px 4px;
      max-width: 88%; font-size: 13px; line-height: 1.6;
      box-shadow: 0 2px 8px rgba(11,44,77,0.15); font-family: 'Outfit', sans-serif;
    }
    .bm-msg-user {
      background: linear-gradient(135deg, #F26A21, #E65C17); color: #fff;
      padding: 10px 14px; border-radius: 14px 14px 4px 14px;
      max-width: 88%; align-self: flex-end; font-size: 13px; line-height: 1.6;
      box-shadow: 0 2px 8px rgba(242,106,33,0.25); font-family: 'Outfit', sans-serif;
    }
    .bm-thinking {
      display: flex; gap: 4px; padding: 10px 14px;
      background: #e2e8f0; border-radius: 14px 14px 14px 4px; width: fit-content;
    }
    .bm-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #F26A21;
      animation: bm-bounce 1.4s infinite;
    }
    .bm-dot:nth-child(2) { animation-delay: 0.2s; }
    .bm-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bm-bounce {
      0%,60%,100% { transform: translateY(0); }
      30% { transform: translateY(-7px); }
    }
    #bm-tutor-input-area {
      display: flex; gap: 6px; padding: 10px 12px;
      background: #fff; border-top: 1px solid #e2e8f0;
    }
    #bm-tutor-input {
      flex: 1; padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px;
      font-size: 13px; font-family: 'Outfit', sans-serif; color: #1e293b;
      background: #f8fafc; outline: none; transition: border-color 0.2s;
    }
    #bm-tutor-input:focus { border-color: #F26A21; }
    #bm-tutor-send, #bm-tutor-voice {
      width: 36px; height: 36px; border-radius: 9px; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center; transition: all 0.2s;
      font-size: 14px;
    }
    #bm-tutor-send { background: #F26A21; color: #fff; }
    #bm-tutor-send:hover { background: #E65C17; }
    #bm-tutor-voice { background: #0B2C4D; color: #fff; }
    #bm-tutor-voice:hover { background: #081F36; }
    #bm-tutor-voice.bm-recording { background: #dc2626; animation: bm-pulse 1s infinite; }
    @keyframes bm-pulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.4); }
      50% { box-shadow: 0 0 0 8px rgba(220,38,38,0); }
    }
    @media (max-width: 480px) {
      #bm-tutor-window { right: 12px; bottom: 90px; width: calc(100vw - 24px); }
      #bm-tutor-fab { right: 16px; bottom: 20px; }
    }
  `;
  document.head.appendChild(style);

  // ── Build HTML ─────────────────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <!-- Floating Button -->
    <button id="bm-tutor-fab" title="Ask AI Tutor" aria-label="Open AI Tutor">
      🤖
      <span class="bm-badge">AI</span>
    </button>

    <!-- Chat Window -->
    <div id="bm-tutor-window" class="bm-hidden">
      <div id="bm-tutor-header">
        <div class="bm-avatar">🤖</div>
        <div>
          <div class="bm-title">BrandMark AI Tutor</div>
          <div class="bm-status">● Online · Instant Answers</div>
        </div>
        <button class="bm-close" id="bm-tutor-close" title="Close">✕</button>
      </div>
      <div id="bm-tutor-langs">
        <button class="bm-lang-btn bm-active" data-lang="en">🇬🇧 EN</button>
        <button class="bm-lang-btn" data-lang="hi">🇮🇳 हिंदी</button>
        <button class="bm-lang-btn" data-lang="ar">🇸🇦 AR</button>
      </div>
      <div id="bm-tutor-messages"></div>
      <div id="bm-tutor-input-area">
        <input id="bm-tutor-input" type="text" placeholder="Ask a question..." />
        <button id="bm-tutor-send" title="Send">&#9658;</button>
        <button id="bm-tutor-voice" title="Voice Input">🎤</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // ── Elements ───────────────────────────────────────────────────────────────
  const fab     = document.getElementById('bm-tutor-fab');
  const win     = document.getElementById('bm-tutor-window');
  const closeBtn= document.getElementById('bm-tutor-close');
  const input   = document.getElementById('bm-tutor-input');
  const sendBtn = document.getElementById('bm-tutor-send');
  const voiceBtn= document.getElementById('bm-tutor-voice');
  const msgs    = document.getElementById('bm-tutor-messages');
  const langBtns= document.querySelectorAll('.bm-lang-btn');

  // ── Helpers ────────────────────────────────────────────────────────────────
  function addMsg(type, text) {
    const d = document.createElement('div');
    d.className = type === 'user' ? 'bm-msg-user' : 'bm-msg-bot';
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function showThinking() {
    const d = document.createElement('div');
    d.className = 'bm-thinking'; d.id = 'bm-thinking';
    d.innerHTML = '<div class="bm-dot"></div><div class="bm-dot"></div><div class="bm-dot"></div>';
    msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }

  function removeThinking() {
    const t = document.getElementById('bm-thinking');
    if (t) t.remove();
  }

  function speak(text) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'hi' ? 'hi-IN' : lang === 'ar' ? 'ar-SA' : 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  // ── Toggle Window ──────────────────────────────────────────────────────────
  function openWidget() {
    isOpen = true;
    win.classList.remove('bm-hidden');
    fab.innerHTML = '✕ <span class="bm-badge">AI</span>';
    if (msgs.children.length === 0) addMsg('bot', greetings[lang]);
    setTimeout(() => input.focus(), 300);
  }

  function closeWidget() {
    isOpen = false;
    win.classList.add('bm-hidden');
    fab.innerHTML = '🤖 <span class="bm-badge">AI</span>';
  }

  fab.addEventListener('click', () => isOpen ? closeWidget() : openWidget());
  closeBtn.addEventListener('click', closeWidget);

  // ── Language Switch ────────────────────────────────────────────────────────
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lang = btn.dataset.lang;
      langBtns.forEach(b => b.classList.remove('bm-active'));
      btn.classList.add('bm-active');
      input.placeholder = placeholders[lang];
      msgs.innerHTML = '';
      addMsg('bot', greetings[lang]);
    });
  });

  // ── Send Message ───────────────────────────────────────────────────────────
  async function sendMessage() {
    if (isLoading) return;
    const q = input.value.trim();
    if (!q) return;
    addMsg('user', q);
    input.value = '';
    isLoading = true;
    showThinking();
    await new Promise(r => setTimeout(r, 700));
    removeThinking();
    const answer = getAnswer(q, lang);
    addMsg('bot', answer);
    speak(answer);
    isLoading = false;
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

  // ── Voice Input ────────────────────────────────────────────────────────────
  voiceBtn.addEventListener('click', () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input requires Chrome browser.'); return; }
    const r = new SR();
    r.lang = lang === 'hi' ? 'hi-IN' : lang === 'ar' ? 'ar-SA' : 'en-US';
    r.onstart = () => { voiceBtn.classList.add('bm-recording'); voiceBtn.textContent = '⏹'; };
    r.onresult = e => { input.value = Array.from(e.results).map(x => x[0].transcript).join(''); };
    r.onend = () => { voiceBtn.classList.remove('bm-recording'); voiceBtn.textContent = '🎤'; };
    r.onerror = () => { voiceBtn.classList.remove('bm-recording'); voiceBtn.textContent = '🎤'; };
    r.start();
  });

})();
