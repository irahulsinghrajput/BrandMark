/**
 * BrandMark Digital Marketing Learning Assistant Widget
 */
(function () {
  if (window.__bmDmAssistantLoaded) return;
  window.__bmDmAssistantLoaded = true;

  var COURSE = 'digital-marketing';
  var STORAGE_KEY = 'bm-assistant-dm-v2';
  var MAX_HISTORY = 24;
  var API_BASE_URLS = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? ['http://localhost:5000/api', 'http://localhost:5001/api']
    : ['https://brandmark-api-2026.onrender.com/api'];

  var state = {
    lang: 'en',
    busy: false,
    opened: false,
    audioEnabled: true,
    history: loadHistory()
  };

  var TEXT = {
    en: {
      title: 'Marketing Learning Assistant',
      subtitle: 'Course-aware and practical guidance',
      greeting: 'Hi, I am your Marketing Learning Assistant. Ask me about SEO, ads, funnels, analytics, or campaign strategy.',
      placeholder: 'Ask your course question...',
      typing: 'Thinking',
      offline: 'I could not reach the server, so I gave you a quick offline answer.',
      chips: ['SEO basics', 'Google Ads setup', 'Improve conversion rate', 'Build content funnel']
    },
    hi: {
      title: 'मार्केटिंग लर्निंग असिस्टेंट',
      subtitle: 'कोर्स आधारित व्यावहारिक मार्गदर्शन',
      greeting: 'नमस्ते, मैं आपका Marketing Learning Assistant हूँ। SEO, Ads, Funnel, Analytics या Campaign Strategy पूछें।',
      placeholder: 'अपना कोर्स सवाल पूछें...',
      typing: 'सोच रहा हूँ',
      offline: 'सर्वर नहीं मिला, इसलिए मैंने ऑफलाइन त्वरित उत्तर दिया।',
      chips: ['SEO बेसिक्स', 'Google Ads सेटअप', 'Conversion Rate बढ़ाएँ', 'Content Funnel बनाएं']
    },
    ar: {
      title: 'مساعد التعلم للتسويق',
      subtitle: 'إرشاد عملي ضمن نطاق الدورة',
      greeting: 'مرحباً، أنا مساعدك للتسويق الرقمي. اسألني عن SEO أو الإعلانات أو القمع التسويقي أو التحليلات.',
      placeholder: 'اكتب سؤال الدورة...',
      typing: 'جاري التفكير',
      offline: 'تعذر الوصول للخادم، لذلك قدمت إجابة سريعة بدون اتصال.',
      chips: ['أساسيات SEO', 'إعداد Google Ads', 'تحسين التحويل', 'بناء قمع محتوى']
    }
  };

  var FALLBACK = {
    en: {
      seo: 'Start SEO with search intent, one primary keyword per page, stronger internal linking, and weekly ranking plus CTR tracking.',
      ads: 'For ads, align targeting, creative, and landing page goal. Track CPL and ROAS before scaling budget.',
      funnel: 'Use Awareness -> Consideration -> Conversion stages with one KPI per stage and clear handoff between channels.',
      analytics: 'In analytics, watch traffic quality, conversion rate, CAC, and ROAS. Report trend changes, not just snapshots.',
      default: 'Try a more specific course question like: improve ad CTR, fix landing page conversion, or build a 30-day SEO plan.'
    },
    hi: {
      default: 'कृपया course से जुड़ा specific सवाल पूछें, जैसे SEO plan, Ads optimization, या Funnel strategy.'
    },
    ar: {
      default: 'يرجى إرسال سؤال أكثر تحديداً من الدورة مثل SEO أو تحسين الإعلانات أو استراتيجية القمع.'
    }
  };

  injectStyles();
  var ui = buildUi();
  hydrateMessages();
  bindEvents(ui);

  function loadHistory() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.slice(-MAX_HISTORY) : [];
    } catch (_e) {
      return [];
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history.slice(-MAX_HISTORY)));
    } catch (_e) {
      // Ignore storage write errors
    }
  }

  function injectStyles() {
    if (document.getElementById('bm-assistant-dm-style')) return;
    var style = document.createElement('style');
    style.id = 'bm-assistant-dm-style';
    style.textContent = '' +
      '#bm-assist-fab{position:fixed;right:24px;bottom:24px;z-index:9999;width:58px;height:58px;border:0;border-radius:50%;background:linear-gradient(145deg,#f26a21,#dd4f11);color:#fff;font-size:24px;cursor:pointer;box-shadow:0 10px 30px rgba(242,106,33,.38);transition:transform .18s ease,box-shadow .18s ease}' +
      '#bm-assist-fab:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 14px 36px rgba(242,106,33,.45)}' +
      '#bm-assist-panel{position:fixed;right:24px;bottom:94px;z-index:9999;width:380px;max-width:calc(100vw - 20px);height:560px;max-height:74vh;background:#fff;border:1px solid #f3d2c0;border-radius:20px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 70px rgba(9,17,33,.2);transform-origin:right bottom;transition:opacity .18s ease,transform .18s ease}' +
      '#bm-assist-panel.hidden{opacity:0;transform:scale(.92);pointer-events:none}' +
      '#bm-assist-head{background:linear-gradient(130deg,#0b2c4d,#123e68);padding:14px 14px 12px 14px;color:#fff;display:flex;align-items:center;gap:10px}' +
      '.bm-a-icon{width:36px;height:36px;border-radius:11px;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-size:18px}' +
      '.bm-a-t1{font:700 13px/1.2 Outfit,sans-serif}.bm-a-t2{font:500 11px/1.2 Outfit,sans-serif;opacity:.9;margin-top:2px}' +
      '#bm-assist-close{margin-left:auto;border:0;background:rgba(255,255,255,.12);color:#fff;width:30px;height:30px;border-radius:8px;cursor:pointer}' +
      '#bm-assist-tools{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#fff7f2;border-bottom:1px solid #f4e5dc}' +
      '.bm-a-lang{border:1px solid #f26a21;background:#fff;color:#f26a21;padding:4px 10px;border-radius:99px;font:600 11px Outfit,sans-serif;cursor:pointer}' +
      '.bm-a-lang.active{background:#f26a21;color:#fff}' +
      '#bm-assist-clear{margin-left:auto;border:0;background:#ffe8db;color:#923f13;padding:5px 10px;border-radius:8px;font:600 11px Outfit,sans-serif;cursor:pointer}' +
      '#bm-assist-msgs{flex:1;overflow:auto;padding:12px;background:radial-gradient(circle at 100% 0%,#fff5ec 0,#fff 40%),#fff}' +
      '.bm-a-row{display:flex;margin:8px 0}.bm-a-row.user{justify-content:flex-end}' +
      '.bm-a-bubble{max-width:85%;padding:10px 12px;border-radius:14px;font:500 13px/1.45 Outfit,sans-serif;white-space:pre-wrap;word-break:break-word}' +
      '.bm-a-row.user .bm-a-bubble{background:linear-gradient(145deg,#f26a21,#e25917);color:#fff;border-bottom-right-radius:6px}' +
      '.bm-a-row.bot .bm-a-bubble{background:#f6f9fc;color:#123047;border:1px solid #e6edf5;border-bottom-left-radius:6px}' +
      '.bm-a-row.bot.warn .bm-a-bubble{background:#fff8f0;border:1px solid #ffd7b6;color:#7a3b11}' +
      '.bm-a-meta{font:600 10px Outfit,sans-serif;opacity:.58;margin-top:6px}' +
      '#bm-assist-chips{padding:8px 10px;display:flex;gap:6px;flex-wrap:wrap;border-top:1px solid #f1f2f4;background:#fff}' +
      '.bm-a-chip{border:1px solid #ebd5c8;background:#fff7f2;color:#734222;padding:4px 9px;border-radius:999px;font:600 11px Outfit,sans-serif;cursor:pointer}' +
      '#bm-assist-input{display:flex;gap:8px;padding:10px;background:#fff;border-top:1px solid #eceef2}' +
      '#bm-assist-text{flex:1;min-width:0;border:1px solid #dfe6ee;border-radius:10px;padding:10px 11px;font:500 13px Outfit,sans-serif;outline:0}' +
      '#bm-assist-text:focus{border-color:#f26a21;box-shadow:0 0 0 3px rgba(242,106,33,.12)}' +
      '.bm-a-btn{border:0;border-radius:10px;width:38px;height:38px;cursor:pointer;font-size:16px}' +
      '#bm-assist-audio{background:#0b2c4d;color:#fff}#bm-assist-audio.off{background:#9ca3af;color:#fff}' +
      '#bm-assist-voice{background:#193c62;color:#fff}#bm-assist-send{background:#f26a21;color:#fff}' +
      '.bm-a-typing{display:inline-flex;align-items:center;gap:5px}.bm-a-typing i{display:block;width:6px;height:6px;border-radius:50%;background:#f26a21;animation:bmA 1s infinite}.bm-a-typing i:nth-child(2){animation-delay:.15s}.bm-a-typing i:nth-child(3){animation-delay:.3s}@keyframes bmA{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-4px);opacity:1}}' +
      '@media (max-width:540px){#bm-assist-panel{right:10px;bottom:84px;width:calc(100vw - 20px);height:70vh}#bm-assist-fab{right:14px;bottom:16px}}';
    document.head.appendChild(style);
  }

  function buildUi() {
    var root = document.createElement('div');
    root.id = 'bm-assistant-root';
    root.innerHTML = '' +
      '<button id="bm-assist-fab" title="Open Learning Assistant" aria-label="Open Learning Assistant">A</button>' +
      '<div id="bm-assist-panel" class="hidden">' +
      '  <div id="bm-assist-head">' +
      '    <div class="bm-a-icon">A</div>' +
      '    <div><div class="bm-a-t1"></div><div class="bm-a-t2"></div></div>' +
      '    <button id="bm-assist-close" title="Close">x</button>' +
      '  </div>' +
      '  <div id="bm-assist-tools">' +
      '    <button class="bm-a-lang active" data-lang="en">EN</button>' +
      '    <button class="bm-a-lang" data-lang="hi">HI</button>' +
      '    <button class="bm-a-lang" data-lang="ar">AR</button>' +
      '    <button id="bm-assist-clear" title="Clear chat">Clear</button>' +
      '  </div>' +
      '  <div id="bm-assist-msgs"></div>' +
      '  <div id="bm-assist-chips"></div>' +
      '  <div id="bm-assist-input">' +
      '    <input id="bm-assist-text" type="text" />' +
      '    <button id="bm-assist-audio" class="bm-a-btn" title="Toggle voice output">🔊</button>' +
      '    <button id="bm-assist-voice" class="bm-a-btn" title="Voice">🎤</button>' +
      '    <button id="bm-assist-send" class="bm-a-btn" title="Send">➜</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(root);

    return {
      root: root,
      fab: root.querySelector('#bm-assist-fab'),
      panel: root.querySelector('#bm-assist-panel'),
      close: root.querySelector('#bm-assist-close'),
      title: root.querySelector('.bm-a-t1'),
      subtitle: root.querySelector('.bm-a-t2'),
      langButtons: root.querySelectorAll('.bm-a-lang'),
      clear: root.querySelector('#bm-assist-clear'),
      msgs: root.querySelector('#bm-assist-msgs'),
      chips: root.querySelector('#bm-assist-chips'),
      input: root.querySelector('#bm-assist-text'),
      audio: root.querySelector('#bm-assist-audio'),
      send: root.querySelector('#bm-assist-send'),
      voice: root.querySelector('#bm-assist-voice')
    };
  }

  function bindEvents(ui) {
    refreshStaticText(ui);
    refreshAudioButton(ui);

    ui.fab.addEventListener('click', function () {
      state.opened = !state.opened;
      ui.panel.classList.toggle('hidden', !state.opened);
      ui.fab.textContent = state.opened ? 'x' : 'A';
      if (state.opened) setTimeout(function () { ui.input.focus(); }, 30);
    });

    ui.close.addEventListener('click', function () {
      state.opened = false;
      ui.panel.classList.add('hidden');
      ui.fab.textContent = 'A';
    });

    ui.send.addEventListener('click', function () { sendMessage(ui); });
    ui.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage(ui);
    });

    ui.clear.addEventListener('click', function () {
      stopSpeaking();
      state.history = [];
      saveHistory();
      ui.msgs.innerHTML = '';
      appendBot(ui, TEXT[state.lang].greeting, false);
    });

    ui.audio.addEventListener('click', function () {
      state.audioEnabled = !state.audioEnabled;
      refreshAudioButton(ui);
      if (!state.audioEnabled) stopSpeaking();
    });

    ui.langButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        state.lang = button.getAttribute('data-lang');
        ui.langButtons.forEach(function (b) { b.classList.remove('active'); });
        button.classList.add('active');
        refreshStaticText(ui);
      });
    });

    ui.chips.addEventListener('click', function (e) {
      var chip = e.target.closest('.bm-a-chip');
      if (!chip) return;
      ui.input.value = chip.getAttribute('data-q') || '';
      sendMessage(ui);
    });

    ui.voice.addEventListener('click', function () {
      var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return;
      var recog = new SR();
      recog.lang = state.lang === 'hi' ? 'hi-IN' : state.lang === 'ar' ? 'ar-SA' : 'en-US';
      ui.voice.textContent = '◼';
      recog.onresult = function (event) {
        var transcript = Array.from(event.results).map(function (x) { return x[0].transcript; }).join(' ');
        ui.input.value = transcript;
      };
      recog.onerror = function () { ui.voice.textContent = '🎤'; };
      recog.onend = function () { ui.voice.textContent = '🎤'; };
      recog.start();
    });
  }

  function refreshAudioButton(ui) {
    if (!ui.audio) return;
    ui.audio.textContent = state.audioEnabled ? '🔊' : '🔇';
    ui.audio.classList.toggle('off', !state.audioEnabled);
  }

  function stopSpeaking() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
  }

  function speakAnswer(text) {
    if (!state.audioEnabled || !('speechSynthesis' in window)) return;

    var clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return;

    stopSpeaking();
    var utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = state.lang === 'hi' ? 'hi-IN' : state.lang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function refreshStaticText(ui) {
    var t = TEXT[state.lang] || TEXT.en;
    ui.title.textContent = t.title;
    ui.subtitle.textContent = t.subtitle;
    ui.input.placeholder = t.placeholder;
    renderChips(ui, t.chips);

    if (!ui.msgs.children.length) {
      appendBot(ui, t.greeting, false);
    }
  }

  function renderChips(ui, chips) {
    ui.chips.innerHTML = chips.map(function (chip) {
      return '<button class="bm-a-chip" data-q="' + escapeHtml(chip) + '">' + escapeHtml(chip) + '</button>';
    }).join('');
  }

  function hydrateMessages() {
    var msgs = document.getElementById('bm-assist-msgs');
    if (!msgs) return;

    if (!state.history.length) {
      appendBot({ msgs: msgs }, TEXT[state.lang].greeting, false);
      return;
    }

    state.history.forEach(function (item) {
      if (item.role === 'user') {
        appendUser({ msgs: msgs }, item.content);
      } else {
        appendBot({ msgs: msgs }, item.content, !!item.warning);
      }
    });
  }

  function appendUser(ui, text) {
    var wrap = document.createElement('div');
    wrap.className = 'bm-a-row user';
    wrap.innerHTML = '<div class="bm-a-bubble">' + escapeHtml(text) + '</div>';
    ui.msgs.appendChild(wrap);
    ui.msgs.scrollTop = ui.msgs.scrollHeight;
  }

  function appendBot(ui, text, warning) {
    var wrap = document.createElement('div');
    wrap.className = 'bm-a-row bot' + (warning ? ' warn' : '');
    wrap.innerHTML = '<div class="bm-a-bubble"></div>';
    var bubble = wrap.querySelector('.bm-a-bubble');
    typeText(bubble, text);
    ui.msgs.appendChild(wrap);
    ui.msgs.scrollTop = ui.msgs.scrollHeight;
  }

  function showTyping(ui) {
    var wrap = document.createElement('div');
    wrap.className = 'bm-a-row bot';
    wrap.id = 'bm-a-typing';
    wrap.innerHTML = '<div class="bm-a-bubble"><span class="bm-a-typing"><span style="font-size:12px;color:#617689">' +
      escapeHtml((TEXT[state.lang] || TEXT.en).typing) + '</span><i></i><i></i><i></i></span></div>';
    ui.msgs.appendChild(wrap);
    ui.msgs.scrollTop = ui.msgs.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById('bm-a-typing');
    if (el) el.remove();
  }

  function typeText(node, text) {
    var safe = escapeHtml(text);
    var i = 0;
    var chunk = 3;
    node.innerHTML = '';

    function paint() {
      i += chunk;
      node.innerHTML = safe.slice(0, i).replace(/\n/g, '<br>');
      if (i < safe.length) {
        requestAnimationFrame(paint);
      }
    }

    requestAnimationFrame(paint);
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getLocalFallback(question, lang) {
    var q = String(question || '').toLowerCase();
    var map = FALLBACK[lang] || FALLBACK.en;
    if (q.indexOf('seo') !== -1 || q.indexOf('keyword') !== -1) return map.seo || FALLBACK.en.seo;
    if (q.indexOf('ads') !== -1 || q.indexOf('ppc') !== -1 || q.indexOf('google') !== -1) return map.ads || FALLBACK.en.ads;
    if (q.indexOf('funnel') !== -1 || q.indexOf('lead') !== -1) return map.funnel || FALLBACK.en.funnel;
    if (q.indexOf('analytics') !== -1 || q.indexOf('ga4') !== -1 || q.indexOf('roas') !== -1) return map.analytics || FALLBACK.en.analytics;
    return map.default || FALLBACK.en.default;
  }

  async function fetchAnswer(question) {
    var shortHistory = state.history.slice(-8).map(function (item) {
      return { role: item.role, content: item.content };
    });

    for (var i = 0; i < API_BASE_URLS.length; i += 1) {
      var url = API_BASE_URLS[i] + '/ai-tutor';
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, 12000);

      try {
        var response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: question,
            language: state.lang,
            course: COURSE,
            history: shortHistory
          }),
          signal: controller.signal
        });

        clearTimeout(timer);

        if (!response.ok) continue;
        var data = await response.json();
        if (data && data.success && data.answer) {
          return {
            answer: String(data.answer),
            warning: !!data.restricted,
            fromServer: true
          };
        }
      } catch (_e) {
        clearTimeout(timer);
      }
    }

    return {
      answer: getLocalFallback(question, state.lang) + '\n\n' + (TEXT[state.lang] || TEXT.en).offline,
      warning: false,
      fromServer: false
    };
  }

  async function sendMessage(ui) {
    if (state.busy) return;

    var question = ui.input.value.trim();
    if (!question) return;

    state.busy = true;
    ui.input.value = '';
    appendUser(ui, question);
    state.history.push({ role: 'user', content: question });
    saveHistory();

    showTyping(ui);
    var result = await fetchAnswer(question);
    hideTyping();

    appendBot(ui, result.answer, result.warning);
    speakAnswer(result.answer);
    state.history.push({ role: 'assistant', content: result.answer, warning: result.warning ? 1 : 0 });
    state.history = state.history.slice(-MAX_HISTORY);
    saveHistory();

    state.busy = false;
  }
})();
