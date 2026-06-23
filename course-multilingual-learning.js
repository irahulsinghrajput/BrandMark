(function () {
  var currentUtterance = null;
  var isSpeaking = false;
  var currentSpeed = 1;
  var currentLang = localStorage.getItem('BM_COURSE_AUDIO_LANG') || 'en';
  var translatedCache = {};

  var LANG_META = {
    en: { label: 'EN', voice: 'en-US', status: 'Listening in English' },
    hi: { label: 'हिंदी', voice: 'hi-IN', status: 'हिंदी में सुन रहे हैं' },
    ar: { label: 'AR', voice: 'ar-SA', status: 'يعمل الصوت باللغة العربية' }
  };

  function getLessonText() {
    var lesson = document.querySelector('.lesson-content');
    if (!lesson) return document.body.innerText || '';
    return lesson.innerText || '';
  }

  async function translateIfNeeded(text, lang) {
    if (!text) return '';
    if (lang === 'en') return text;

    var key = lang + '::' + text.slice(0, 400);
    if (translatedCache[key]) return translatedCache[key];

    try {
      var safe = encodeURIComponent(text.slice(0, 3200));
      var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + lang + '&dt=t&q=' + safe;
      var res = await fetch(url);
      if (!res.ok) throw new Error('Translate API failed');
      var data = await res.json();
      var translated = (data && data[0]) ? data[0].map(function (row) { return row[0] || ''; }).join('') : '';
      if (translated) {
        translatedCache[key] = translated;
        return translated;
      }
      return text;
    } catch (_err) {
      return text;
    }
  }

  async function initUtterance() {
    var lessonText = getLessonText();
    var content = await translateIfNeeded(lessonText, currentLang);
    currentUtterance = new SpeechSynthesisUtterance(content);
    currentUtterance.lang = LANG_META[currentLang].voice;
    currentUtterance.rate = currentSpeed;
    currentUtterance.onend = function () {
      isSpeaking = false;
      updatePlayButton();
    };
  }

  function updatePlayButton() {
    var btn = document.getElementById('audioPlayBtn');
    var txt = document.getElementById('playBtnText');
    if (!btn || !txt) return;
    btn.innerHTML = isSpeaking ? '<i class="fas fa-pause"></i><span id="playBtnText">Pause</span>' : '<i class="fas fa-play"></i><span id="playBtnText">Play</span>';
  }

  function updateLanguageUI() {
    var status = document.getElementById('bmAudioLanguageStatus');
    if (status) status.textContent = LANG_META[currentLang].status;

    var buttons = document.querySelectorAll('.bm-audio-lang-btn');
    buttons.forEach(function (b) {
      b.classList.toggle('bm-active', b.dataset.lang === currentLang);
    });
  }

  async function toggleAudio() {
    if (!window.speechSynthesis) {
      alert('Audio playback requires a modern browser.');
      return;
    }

    if (!currentUtterance) {
      await initUtterance();
    }

    if (isSpeaking) {
      window.speechSynthesis.pause();
      isSpeaking = false;
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.cancel();
        await initUtterance();
        window.speechSynthesis.speak(currentUtterance);
      }
      isSpeaking = true;
    }
    updatePlayButton();
  }

  function setAudioSpeed(speed, event) {
    currentSpeed = speed;
    document.querySelectorAll('.speed-btn').forEach(function (b) { b.classList.remove('active'); });
    if (event && event.target) {
      event.target.classList.add('active');
    }
    if (currentUtterance) {
      currentUtterance.rate = speed;
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        initUtterance().then(function () {
          window.speechSynthesis.speak(currentUtterance);
        });
      }
    }
  }

  function addLanguageControls(audioContainer) {
    if (!audioContainer || document.getElementById('bmAudioLanguageStatus')) return;

    var infoBar = document.createElement('div');
    infoBar.className = 'bm-audio-lang-group';
    infoBar.style.marginTop = '0.75rem';
    infoBar.innerHTML =
      '<span id="bmAudioLanguageStatus" style="font-size:0.85rem;color:#dbeafe;min-width:185px;">' + LANG_META[currentLang].status + '</span>' +
      '<button class="bm-audio-lang-btn" data-lang="en">EN</button>' +
      '<button class="bm-audio-lang-btn" data-lang="hi">हिंदी</button>' +
      '<button class="bm-audio-lang-btn" data-lang="ar">AR</button>';

    audioContainer.appendChild(infoBar);

    audioContainer.querySelectorAll('.bm-audio-lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        currentLang = btn.dataset.lang;
        localStorage.setItem('BM_COURSE_AUDIO_LANG', currentLang);
        currentUtterance = null;
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        isSpeaking = false;
        updatePlayButton();
        updateLanguageUI();
      });
    });

    updateLanguageUI();
  }

  function ensureAudioSection() {
    var audio = document.querySelector('.audio-player');
    if (audio) return audio;

    var lesson = document.querySelector('.lesson-content');
    if (!lesson || !lesson.parentElement) return null;

    var section = document.createElement('div');
    section.className = 'audio-player';
    section.style.background = 'linear-gradient(135deg, #0B2C4D, #081F36)';
    section.style.padding = '1.5rem';
    section.style.borderRadius = '12px';
    section.style.margin = '1.25rem 0';
    section.style.color = '#fff';
    section.innerHTML =
      '<div class="audio-controls" style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">' +
      '<button id="audioPlayBtn" class="play-btn"><i class="fas fa-play"></i><span id="playBtnText">Play</span></button>' +
      '<div style="display:flex;gap:.5rem;align-items:center">' +
      '<span class="text-sm">Speed:</span>' +
      '<button class="speed-btn active" data-speed="1">1x</button>' +
      '<button class="speed-btn" data-speed="1.5">1.5x</button>' +
      '<button class="speed-btn" data-speed="2">2x</button>' +
      '</div>' +
      '</div>';

    lesson.parentElement.insertBefore(section, lesson);
    return section;
  }

  function wireControls() {
    var playBtn = document.getElementById('audioPlayBtn');
    if (playBtn) {
      playBtn.onclick = function () { toggleAudio(); };
    }

    document.querySelectorAll('.speed-btn').forEach(function (btn) {
      var speedVal = parseFloat(btn.dataset.speed || btn.textContent) || 1;
      btn.onclick = function (e) { setAudioSpeed(speedVal, e); };
    });
  }

  window.toggleAudio = toggleAudio;
  window.setAudioSpeed = setAudioSpeed;

  document.addEventListener('DOMContentLoaded', function () {
    var audioSection = ensureAudioSection();
    if (!audioSection) return;
    addLanguageControls(audioSection);
    wireControls();
  });
})();
