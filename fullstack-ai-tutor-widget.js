/**
 * BrandMark Full Stack Learning Assistant Widget
 */
(function () {
  if (window.__bmFsAssistantLoaded) return;
  window.__bmFsAssistantLoaded = true;

  var COURSE = 'fullstack';
  var STORAGE_KEY = 'bm-assistant-fs-v2';
  var MAX_HISTORY = 24;
  var API_BASE_URLS = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? ['http://localhost:5000/api', 'http://localhost:5001/api']
    : ['https://brandmark-api-2026.onrender.com/api'];

  var state = {
    lang: 'en',
    busy: false,
    opened: false,
    history: loadHistory()
  };

  var TEXT = {
    en: {
      title: 'Full Stack Learning Assistant',
      subtitle: 'MERN-focused practical guidance',
      greeting: 'Hi, I am your Full Stack Learning Assistant. Ask me about React, Node, Express, MongoDB, APIs, auth, and deployment.',
      placeholder: 'Ask your coding question...',
      typing: 'Thinking',
      offline: 'I could not reach the server, so I gave you a quick offline answer.',
      chips: ['Explain useEffect', 'JWT auth flow', 'Fix CORS error', 'MongoDB schema design']
    },
    hi: {
      title: 'फुल स्टैक लर्निंग असिस्टेंट',
      subtitle: 'MERN आधारित व्यावहारिक मार्गदर्शन',
      greeting: 'नमस्ते, मैं आपका Full Stack Learning Assistant हूँ। React, Node, Express, MongoDB, API, Auth और Deployment पूछें।',
      placeholder: 'अपना coding सवाल पूछें...',
      typing: 'सोच रहा हूँ',
      offline: 'सर्वर नहीं मिला, इसलिए मैंने ऑफलाइन त्वरित उत्तर दिया।',
      chips: ['useEffect समझाएँ', 'JWT flow', 'CORS error fix', 'MongoDB schema']
    },
    ar: {
      title: 'مساعد تعلم Full Stack',
      subtitle: 'إرشاد عملي يركز على MERN',
      greeting: 'مرحباً، أنا مساعدك لتعلم Full Stack. اسألني عن React وNode وExpress وMongoDB وAPIs والمصادقة والنشر.',
      placeholder: 'اكتب سؤالك البرمجي...',
      typing: 'جاري التفكير',
      offline: 'تعذر الوصول للخادم، لذلك قدمت إجابة سريعة بدون اتصال.',
      chips: ['شرح useEffect', 'تدفق JWT', 'حل خطأ CORS', 'تصميم MongoDB schema']
    }
  };

  var FALLBACK = {
    en: {
      react: 'For React, keep components small, lift shared state up, and use useEffect only for side effects with clean dependency arrays.',
      auth: 'JWT auth flow: login validates credentials, server signs token, client sends Bearer token, middleware verifies and attaches user.',
      cors: 'Fix CORS by allowing only your frontend origin, required methods, and headers. Handle preflight OPTIONS and avoid wildcard in production.',
      mongo: 'Start MongoDB schema with required fields, indexes for common queries, and validation for business rules before writing routes.',
      default: 'Ask a more specific coding question, for example: fix CORS in Express, explain useEffect dependencies, or structure MERN auth.'
    },
    hi: {
      default: 'कृपया specific coding सवाल पूछें, जैसे useEffect, JWT auth, CORS fix, या MongoDB schema design.'
    },
    ar: {
      default: 'يرجى إرسال سؤال برمجي محدد مثل useEffect أو JWT أو CORS أو تصميم MongoDB schema.'
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
    if (document.getElementById('bm-assistant-fs-style')) return;
    var style = document.createElement('style');
    style.id = 'bm-assistant-fs-style';
    style.textContent = '' +
      '#bm-fs-assist-fab{position:fixed;right:24px;bottom:24px;z-index:9999;width:58px;height:58px;border:0;border-radius:50%;background:linear-gradient(145deg,#0f4d89,#0a3a67);color:#fff;font-size:24px;cursor:pointer;box-shadow:0 10px 30px rgba(10,58,103,.35);transition:transform .18s ease,box-shadow .18s ease}' +
      '#bm-fs-assist-fab:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 14px 36px rgba(10,58,103,.45)}' +
      '#bm-fs-assist-panel{position:fixed;right:24px;bottom:94px;z-index:9999;width:390px;max-width:calc(100vw - 20px);height:570px;max-height:74vh;background:#fff;border:1px solid #cfe0f0;border-radius:20px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 70px rgba(9,17,33,.2);transform-origin:right bottom;transition:opacity .18s ease,transform .18s ease}' +
      '#bm-fs-assist-panel.hidden{opacity:0;transform:scale(.92);pointer-events:none}' +
      '#bm-fs-assist-head{background:linear-gradient(130deg,#0c2a49,#184d7e);padding:14px 14px 12px 14px;color:#fff;display:flex;align-items:center;gap:10px}' +
      '.bm-fs-icon{width:36px;height:36px;border-radius:11px;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-size:18px}' +
      '.bm-fs-t1{font:700 13px/1.2 Outfit,sans-serif}.bm-fs-t2{font:500 11px/1.2 Outfit,sans-serif;opacity:.9;margin-top:2px}' +
      '#bm-fs-assist-close{margin-left:auto;border:0;background:rgba(255,255,255,.12);color:#fff;width:30px;height:30px;border-radius:8px;cursor:pointer}' +
      '#bm-fs-assist-tools{display:flex;align-items:center;gap:8px;padding:8px 10px;background:#f6faff;border-bottom:1px solid #e0ebf5}' +
      '.bm-fs-lang{border:1px solid #0f4d89;background:#fff;color:#0f4d89;padding:4px 10px;border-radius:99px;font:600 11px Outfit,sans-serif;cursor:pointer}' +
      '.bm-fs-lang.active{background:#0f4d89;color:#fff}' +
      '#bm-fs-assist-clear{margin-left:auto;border:0;background:#e6f0fb;color:#184b78;padding:5px 10px;border-radius:8px;font:600 11px Outfit,sans-serif;cursor:pointer}' +
      '#bm-fs-assist-msgs{flex:1;overflow:auto;padding:12px;background:radial-gradient(circle at 100% 0%,#eef6ff 0,#fff 40%),#fff}' +
      '.bm-fs-row{display:flex;margin:8px 0}.bm-fs-row.user{justify-content:flex-end}' +
      '.bm-fs-bubble{max-width:85%;padding:10px 12px;border-radius:14px;font:500 13px/1.45 Outfit,sans-serif;white-space:pre-wrap;word-break:break-word}' +
      '.bm-fs-row.user .bm-fs-bubble{background:linear-gradient(145deg,#0f4d89,#0a3a67);color:#fff;border-bottom-right-radius:6px}' +
      '.bm-fs-row.bot .bm-fs-bubble{background:#f4f9ff;color:#123047;border:1px solid #dbe8f5;border-bottom-left-radius:6px}' +
      '.bm-fs-row.bot.warn .bm-fs-bubble{background:#fff8f0;border:1px solid #ffd7b6;color:#7a3b11}' +
      '#bm-fs-assist-chips{padding:8px 10px;display:flex;gap:6px;flex-wrap:wrap;border-top:1px solid #f1f2f4;background:#fff}' +
      '.bm-fs-chip{border:1px solid #d0dfef;background:#f4f9ff;color:#17466f;padding:4px 9px;border-radius:999px;font:600 11px Outfit,sans-serif;cursor:pointer}' +
      '#bm-fs-assist-input{display:flex;gap:8px;padding:10px;background:#fff;border-top:1px solid #eceef2}' +
      '#bm-fs-assist-text{flex:1;min-width:0;border:1px solid #dfe6ee;border-radius:10px;padding:10px 11px;font:500 13px Outfit,sans-serif;outline:0}' +
      '#bm-fs-assist-text:focus{border-color:#0f4d89;box-shadow:0 0 0 3px rgba(15,77,137,.12)}' +
      '.bm-fs-btn{border:0;border-radius:10px;width:38px;height:38px;cursor:pointer;font-size:16px}' +
      '#bm-fs-assist-voice{background:#123f6a;color:#fff}#bm-fs-assist-send{background:#0f4d89;color:#fff}' +
      '.bm-fs-typing{display:inline-flex;align-items:center;gap:5px}.bm-fs-typing i{display:block;width:6px;height:6px;border-radius:50%;background:#0f4d89;animation:bmFsA 1s infinite}.bm-fs-typing i:nth-child(2){animation-delay:.15s}.bm-fs-typing i:nth-child(3){animation-delay:.3s}@keyframes bmFsA{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-4px);opacity:1}}' +
      '@media (max-width:540px){#bm-fs-assist-panel{right:10px;bottom:84px;width:calc(100vw - 20px);height:70vh}#bm-fs-assist-fab{right:14px;bottom:16px}}';
    document.head.appendChild(style);
  }

  function buildUi() {
    var root = document.createElement('div');
    root.id = 'bm-fs-assistant-root';
    root.innerHTML = '' +
      '<button id="bm-fs-assist-fab" title="Open Learning Assistant" aria-label="Open Learning Assistant">FS</button>' +
      '<div id="bm-fs-assist-panel" class="hidden">' +
      '  <div id="bm-fs-assist-head">' +
      '    <div class="bm-fs-icon">FS</div>' +
      '    <div><div class="bm-fs-t1"></div><div class="bm-fs-t2"></div></div>' +
      '    <button id="bm-fs-assist-close" title="Close">x</button>' +
      '  </div>' +
      '  <div id="bm-fs-assist-tools">' +
      '    <button class="bm-fs-lang active" data-lang="en">EN</button>' +
      '    <button class="bm-fs-lang" data-lang="hi">HI</button>' +
      '    <button class="bm-fs-lang" data-lang="ar">AR</button>' +
      '    <button id="bm-fs-assist-clear" title="Clear chat">Clear</button>' +
      '  </div>' +
      '  <div id="bm-fs-assist-msgs"></div>' +
      '  <div id="bm-fs-assist-chips"></div>' +
      '  <div id="bm-fs-assist-input">' +
      '    <input id="bm-fs-assist-text" type="text" />' +
      '    <button id="bm-fs-assist-voice" class="bm-fs-btn" title="Voice">🎤</button>' +
      '    <button id="bm-fs-assist-send" class="bm-fs-btn" title="Send">➜</button>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(root);

    return {
      root: root,
      fab: root.querySelector('#bm-fs-assist-fab'),
      panel: root.querySelector('#bm-fs-assist-panel'),
      close: root.querySelector('#bm-fs-assist-close'),
      title: root.querySelector('.bm-fs-t1'),
      subtitle: root.querySelector('.bm-fs-t2'),
      langButtons: root.querySelectorAll('.bm-fs-lang'),
      clear: root.querySelector('#bm-fs-assist-clear'),
      msgs: root.querySelector('#bm-fs-assist-msgs'),
      chips: root.querySelector('#bm-fs-assist-chips'),
      input: root.querySelector('#bm-fs-assist-text'),
      send: root.querySelector('#bm-fs-assist-send'),
      voice: root.querySelector('#bm-fs-assist-voice')
    };
  }

  function bindEvents(ui) {
    refreshStaticText(ui);

    ui.fab.addEventListener('click', function () {
      state.opened = !state.opened;
      ui.panel.classList.toggle('hidden', !state.opened);
      ui.fab.textContent = state.opened ? 'x' : 'FS';
      if (state.opened) setTimeout(function () { ui.input.focus(); }, 30);
    });

    ui.close.addEventListener('click', function () {
      state.opened = false;
      ui.panel.classList.add('hidden');
      ui.fab.textContent = 'FS';
    });

    ui.send.addEventListener('click', function () { sendMessage(ui); });
    ui.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendMessage(ui);
    });

    ui.clear.addEventListener('click', function () {
      state.history = [];
      saveHistory();
      ui.msgs.innerHTML = '';
      appendBot(ui, TEXT[state.lang].greeting, false);
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
      var chip = e.target.closest('.bm-fs-chip');
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
      return '<button class="bm-fs-chip" data-q="' + escapeHtml(chip) + '">' + escapeHtml(chip) + '</button>';
    }).join('');
  }

  function hydrateMessages() {
    var msgs = document.getElementById('bm-fs-assist-msgs');
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
    wrap.className = 'bm-fs-row user';
    wrap.innerHTML = '<div class="bm-fs-bubble">' + escapeHtml(text) + '</div>';
    ui.msgs.appendChild(wrap);
    ui.msgs.scrollTop = ui.msgs.scrollHeight;
  }

  function appendBot(ui, text, warning) {
    var wrap = document.createElement('div');
    wrap.className = 'bm-fs-row bot' + (warning ? ' warn' : '');
    wrap.innerHTML = '<div class="bm-fs-bubble"></div>';
    var bubble = wrap.querySelector('.bm-fs-bubble');
    typeText(bubble, text);
    ui.msgs.appendChild(wrap);
    ui.msgs.scrollTop = ui.msgs.scrollHeight;
  }

  function showTyping(ui) {
    var wrap = document.createElement('div');
    wrap.className = 'bm-fs-row bot';
    wrap.id = 'bm-fs-typing';
    wrap.innerHTML = '<div class="bm-fs-bubble"><span class="bm-fs-typing"><span style="font-size:12px;color:#617689">' +
      escapeHtml((TEXT[state.lang] || TEXT.en).typing) + '</span><i></i><i></i><i></i></span></div>';
    ui.msgs.appendChild(wrap);
    ui.msgs.scrollTop = ui.msgs.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById('bm-fs-typing');
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
    if (q.indexOf('react') !== -1 || q.indexOf('useeffect') !== -1 || q.indexOf('component') !== -1) return map.react || FALLBACK.en.react;
    if (q.indexOf('jwt') !== -1 || q.indexOf('auth') !== -1 || q.indexOf('token') !== -1) return map.auth || FALLBACK.en.auth;
    if (q.indexOf('cors') !== -1 || q.indexOf('origin') !== -1 || q.indexOf('preflight') !== -1) return map.cors || FALLBACK.en.cors;
    if (q.indexOf('mongo') !== -1 || q.indexOf('schema') !== -1 || q.indexOf('mongoose') !== -1) return map.mongo || FALLBACK.en.mongo;
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
    state.history.push({ role: 'assistant', content: result.answer, warning: result.warning ? 1 : 0 });
    state.history = state.history.slice(-MAX_HISTORY);
    saveHistory();

    state.busy = false;
  }
})();
