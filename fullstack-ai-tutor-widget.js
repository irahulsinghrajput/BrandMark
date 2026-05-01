/**
 * BrandMark Full Stack AI Tutor Floating Widget
 * Drop into any page: <script src="fullstack-ai-tutor-widget.js"></script>
 * Shows a floating button → small chat window. No backend, 100% free.
 * Topics: MERN Stack, React, Node.js, MongoDB, JWT, GenAI Integration
 */
(function () {
  // ── Knowledge Base ─────────────────────────────────────────────────────────
  const KB = {
    en: {
      // JavaScript & Core Concepts
      'jsx': 'JSX (JavaScript XML) is a syntax extension for React that lets you write HTML-like code inside JavaScript. JSX gets compiled to React.createElement() calls. Example: const el = <h1>Hello</h1>; — this compiles to React.createElement("h1", null, "Hello").',
      'event loop': 'The Node.js Event Loop is a single-threaded, non-blocking mechanism. It processes asynchronous operations: Call Stack → Web APIs → Callback Queue → Microtask Queue. Promises go to the microtask queue (higher priority) while setTimeout goes to the callback queue.',
      'async': 'async/await is syntactic sugar over Promises. async marks a function as asynchronous; await pauses execution until the Promise resolves. Use try/catch for error handling. Example: const data = await fetch(url); const json = await data.json();',
      'promise': 'A Promise represents a future value. States: pending → fulfilled or rejected. Chain with .then() / .catch() / .finally(). Use Promise.all() to run multiple promises in parallel.',
      'closure': 'A closure is a function that retains access to its outer scope variables even after the outer function returns. Closures are heavily used in React hooks, event handlers, and module patterns.',
      'hoisting': 'Hoisting moves function declarations and var declarations to the top of their scope at compile time. let and const are hoisted but stay in the "temporal dead zone" until declared. Always use const/let over var.',
      
      // React
      'react': 'React is a JavaScript library for building UIs using a component-based architecture. Key concepts: JSX, Virtual DOM, Components, Props, State, Hooks. React re-renders efficiently using a diffing algorithm on the Virtual DOM.',
      'virtual dom': 'The Virtual DOM is a lightweight in-memory copy of the real DOM. React compares (diffs) the new virtual DOM with the previous one and updates only the changed parts in the real DOM — this is called reconciliation.',
      'component': 'React components are reusable UI pieces. Functional components: const MyComp = (props) => <div>{props.name}</div>. Always start component names with uppercase. Components receive props (data in) and manage state (data within).',
      'props': 'Props (properties) pass data from parent to child components — they are read-only. Destructure them: const Card = ({ title, desc }) => <div><h2>{title}</h2></div>. For dynamic lists, always add a unique key prop.',
      'usestate': 'useState is a React Hook for managing component state. const [count, setCount] = useState(0); — count is the value, setCount updates it. State updates trigger re-renders. Never mutate state directly — always use the setter function.',
      'useeffect': 'useEffect runs side effects (API calls, subscriptions, timers) after render. useEffect(() => { fetchData(); }, [dependency]) — the dependency array controls when it runs. Empty array [] = runs once on mount. Return a cleanup function to avoid memory leaks.',
      'usecontext': 'useContext shares global state without prop-drilling. Create context: const ThemeCtx = createContext(). Provide: <ThemeCtx.Provider value={theme}>. Consume: const theme = useContext(ThemeCtx). Use with useReducer for complex state.',
      'hooks': 'React Hooks let you use state and lifecycle features in functional components. Built-in: useState, useEffect, useContext, useReducer, useMemo, useCallback, useRef. Rule: only call hooks at the top level and inside React functions.',
      'custom hook': 'Custom Hooks are JavaScript functions starting with "use" that call other hooks. They extract reusable stateful logic. Example: useFetch(url) can handle loading, data, error state — reused across any component.',
      'react router': 'React Router v6 handles client-side navigation. Key: <BrowserRouter>, <Routes>, <Route path="/about" element={<About />} />. Use useNavigate() to redirect programmatically and useParams() to read URL parameters.',
      'redux': 'Redux Toolkit manages global application state. Core: store (single source of truth), reducers (pure functions updating state), actions, and dispatch. Use createSlice() for reducers and configureStore() to set up the store.',

      // Node.js & Express
      'node': 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine. It runs JavaScript server-side using non-blocking, event-driven I/O. Core modules: fs, http, path, os. Start a server: const http = require("http"); http.createServer(handler).listen(3000).',
      'express': 'Express.js is a minimal Node.js web framework. const app = express(); app.get("/api/users", (req, res) => res.json(users)); app.listen(5000). Use middleware with app.use(). Install: npm install express.',
      'middleware': 'Middleware functions have access to req, res, and next. They run in sequence before the route handler. Types: built-in (express.json()), third-party (cors, morgan), custom (auth guards). Call next() to pass to the next middleware.',
      'routing': 'Express routing: app.get(), app.post(), app.put(), app.delete(). Use Router for modular routes: const router = express.Router(); router.get("/", handler); app.use("/api/users", router). Use :id for URL params: req.params.id.',
      'rest': 'REST (Representational State Transfer) API principles: Stateless, Client-Server, Uniform Interface. HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (remove). Use proper status codes: 200, 201, 400, 401, 403, 404, 500.',
      'mvc': 'MVC (Model-View-Controller) separates concerns: Model = data/database logic (Mongoose schema), View = frontend (React), Controller = request handling logic. In Node/Express: routes call controllers which use models.',
      'cors': 'CORS (Cross-Origin Resource Sharing) allows/restricts web apps from requesting resources from a different origin. Install: npm install cors; app.use(cors({ origin: "https://yourfrontend.com" })). Never use cors() with wildcard * in production.',
      
      // Authentication & Security
      'jwt': 'JWT (JSON Web Token) is a compact token for authentication. Structure: header.payload.signature (Base64 encoded). Flow: Login → server signs JWT with secret → client stores in localStorage → sends in Authorization: Bearer <token> header with every request.',
      'bcrypt': 'bcrypt hashes passwords securely. Never store plain-text passwords! const hash = await bcrypt.hash(password, 10); // 10 = salt rounds. Verify: const match = await bcrypt.compare(password, hash). Use 10-12 salt rounds in production.',
      'authentication': 'Auth flow: 1) User registers → hash password → save to DB. 2) User logs in → compare hash → generate JWT. 3) Protected routes → middleware verifies JWT → attaches user to req.user. 4) Client stores token in localStorage or httpOnly cookie.',
      'authorization': 'Authorization checks what an authenticated user can do. After verifying JWT (authentication), check the user\'s role: if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" }). Always authorize after authenticating.',
      'security': 'OWASP Top 10 in Node.js: 1) Use helmet.js for HTTP headers. 2) Validate all inputs (express-validator). 3) Rate-limit APIs (express-rate-limit). 4) Hash passwords (bcrypt). 5) Parameterize queries (Mongoose prevents injection). 6) Use HTTPS. 7) Avoid eval().',

      // MongoDB & Mongoose
      'mongodb': 'MongoDB is a NoSQL document database. Data is stored as BSON (Binary JSON) documents in collections (like SQL tables). Key concepts: database → collection → document. Use MongoDB Atlas for free cloud hosting. Connect: mongoose.connect(process.env.MONGO_URI).',
      'mongoose': 'Mongoose provides schema-based modeling for MongoDB. Define a schema: const userSchema = new Schema({ name: String, email: { type: String, required: true, unique: true } }). Model: const User = mongoose.model("User", userSchema). Use async/await for all operations.',
      'schema': 'Mongoose Schema defines the shape of documents. Types: String, Number, Boolean, Date, ObjectId, Array. Add validation: required, unique, min, max, enum, match. Virtual fields, pre/post hooks (middleware) add powerful business logic.',
      'crud': 'MongoDB CRUD with Mongoose: Create: await User.create({ name }). Read: await User.find({ role: "admin" }) or User.findById(id). Update: await User.findByIdAndUpdate(id, { name }, { new: true }). Delete: await User.findByIdAndDelete(id).',
      'aggregation': 'MongoDB Aggregation pipeline processes documents through stages: $match (filter), $group (group by), $sort, $project (select fields), $lookup (join), $limit. Example: db.orders.aggregate([{ $match: { status: "paid" } }, { $group: { _id: "$userId", total: { $sum: "$amount" } } }]).',
      'indexing': 'MongoDB indexes speed up queries. Single field: userSchema.index({ email: 1 }). Compound: { email: 1, role: -1 }. Text: { name: "text" }. Always index fields used in .find() queries. Use explain() to analyze query performance.',
      
      // GenAI Integration
      'openai': 'OpenAI API integration: npm install openai. const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }). const response = await client.chat.completions.create({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }] }). Always store API keys server-side only.',
      'gemini': 'Google Gemini API: npm install @google/generative-ai. const genAI = new GoogleGenerativeAI(apiKey). const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }). const result = await model.generateContent(prompt). Free tier available.',
      'genai': 'GenAI Integration in MERN: Keep API keys in backend .env — NEVER expose to frontend. Frontend sends prompt to your Express API. Express calls OpenAI/Gemini. Returns response to frontend. This protects your API key and lets you add rate-limiting and caching.',
      'langchain': 'LangChain.js simplifies building AI apps with chains, agents, and tools. Install: npm install langchain @langchain/openai. Use for: RAG (Retrieval Augmented Generation), chatbots with memory, document Q&A, and structured outputs.',
      'rag': 'RAG (Retrieval Augmented Generation) adds your own data to AI responses. Steps: 1) Split documents into chunks. 2) Embed chunks as vectors. 3) Store in vector DB (Pinecone, pgvector). 4) On query, find similar chunks. 5) Send chunks + question to LLM for accurate answers.',
      
      // Deployment & DevOps
      'deployment': 'Full Stack deployment: Frontend (React) → Vercel or Netlify (free). Backend (Node/Express) → Render.com (free tier, auto-deploys from GitHub). Database → MongoDB Atlas (free 512MB). Set environment variables on each platform dashboard.',
      'vercel': 'Deploy React to Vercel: npm install -g vercel; vercel in project root. Or connect GitHub repo → auto-deploys on push. Set environment variables in Vercel dashboard. Build command: npm run build. Output: dist/ or build/.',
      'render': 'Deploy Node.js to Render: Connect GitHub, set Build Command: npm install, Start Command: node server.js. Add environment variables in dashboard. Free tier spins down after 15min inactivity — use a health check to keep it alive.',
      'git': 'Git workflow: git init → git add . → git commit -m "message" → git push. Branches: git checkout -b feature/auth. PRs: merge branch into main. .gitignore: always ignore node_modules/, .env, dist/. Commit messages: feat:, fix:, chore:, docs:.',
      'environment': 'Environment variables (.env) store secrets: MONGO_URI, JWT_SECRET, OPENAI_API_KEY. Install: npm install dotenv; require("dotenv").config() at top of server.js. Never commit .env to git — add to .gitignore. Use .env.example for documentation.',

      // General Help
      'hello': 'Hello! I\'m your BrandMark Full Stack AI Tutor 🤖 Ask me about React, Node.js, MongoDB, JWT, APIs, GenAI, or Deployment!',
      'hi': 'Hi there! 👋 I cover MERN Stack, React Hooks, Express Middleware, JWT Auth, MongoDB Schemas, and GenAI Integration. What do you want to learn?',
      'help': 'Topics I cover: JSX, React Hooks, Virtual DOM, Node.js Event Loop, Express Middleware, REST APIs, MVC, JWT Auth, bcrypt, MongoDB, Mongoose, CRUD, Aggregation, OpenAI API, Gemini API, RAG, Deployment (Render/Vercel), Git. Ask me anything!',
      'default': 'Great question! Try asking about: "What is JSX?", "How does useEffect work?", "What is middleware?", "Explain JWT authentication", "How to connect MongoDB?", or "How to integrate OpenAI API?".'
    },
    hi: {
      'jsx': 'JSX (JavaScript XML) React का syntax extension है जो HTML-जैसा code JavaScript में लिखने देता है। Babel इसे React.createElement() calls में compile करता है। Example: const el = <h1>Hello</h1>',
      'react': 'React एक JavaScript library है जो component-based architecture से UI बनाती है। मुख्य concepts: JSX, Virtual DOM, Components, Props, State, और Hooks।',
      'usestate': 'useState React Hook state manage करता है। const [count, setCount] = useState(0); — count value है, setCount उसे update करता है। State update करने पर component re-render होता है।',
      'useeffect': 'useEffect side effects (API calls, timers) handle करता है। useEffect(() => { fetchData(); }, []) — empty array से यह सिर्फ mount पर run होता है।',
      'node': 'Node.js एक JavaScript runtime है जो server-side code run करता है। Non-blocking I/O और Event Loop इसे fast बनाते हैं। Express.js से server बनाएं।',
      'express': 'Express.js minimal Node.js framework है। app.get("/api/users", handler) से routes define करें। Middleware जोड़ने के लिए app.use() use करें।',
      'middleware': 'Middleware functions req, res, और next access करते हैं। Authentication check, logging, और CORS के लिए use होते हैं। next() call करने से अगला middleware चलता है।',
      'jwt': 'JWT (JSON Web Token) authentication के लिए है। Login पर server token बनाता है। Client हर request में Authorization: Bearer <token> header भेजता है।',
      'mongodb': 'MongoDB NoSQL document database है। Data JSON-जैसे documents में store होता है। MongoDB Atlas free cloud hosting देता है। Mongoose से Node.js में use करें।',
      'mongoose': 'Mongoose MongoDB के लिए schema-based modeling देता है। Schema define करें, Model बनाएं, फिर CRUD operations करें। Async/await use करें।',
      'openai': 'OpenAI API server-side integrate करें — API key को frontend पर कभी expose न करें। Express API से call करें और result frontend को भेजें।',
      'hello': 'नमस्ते! मैं BrandMark Full Stack AI Tutor हूँ 🤖 React, Node.js, MongoDB, JWT, या GenAI के बारे में कुछ भी पूछें!',
      'hi': 'नमस्ते! 👋 MERN Stack, React Hooks, Express, JWT Auth, MongoDB के बारे में पूछें!',
      'default': 'अच्छा सवाल! पूछें: "JSX क्या है?", "useEffect कैसे काम करता है?", "JWT authentication explain करो", "MongoDB से connect कैसे करें?"'
    },
    ar: {
      'jsx': 'JSX هو امتداد لـ JavaScript يتيح كتابة HTML داخل JavaScript في React. يُحوّله Babel إلى React.createElement(). مثال: const el = <h1>مرحبا</h1>',
      'react': 'React مكتبة JavaScript لبناء واجهات المستخدم بالمكونات. المفاهيم الأساسية: JSX، Virtual DOM، Components، Props، State، Hooks.',
      'usestate': 'useState هو React Hook لإدارة الحالة. const [count, setCount] = useState(0); — count القيمة، setCount تحدّثها. التحديث يُعيد رسم المكوّن.',
      'useeffect': 'useEffect يُعالج التأثيرات الجانبية (طلبات API، مؤقتات). المصفوفة الفارغة [] تعني التشغيل مرة واحدة عند التحميل.',
      'node': 'Node.js بيئة تشغيل JavaScript من جانب الخادم. يعمل بنموذج I/O غير متزامن. استخدم Express.js لإنشاء خادم ويب.',
      'express': 'Express.js إطار Node.js خفيف. عرّف المسارات: app.get("/api/users", handler). أضف middleware باستخدام app.use().',
      'middleware': 'Middleware هي دوال تصل إلى req و res و next. تُستخدم للمصادقة والتسجيل وCORS. استدعِ next() للانتقال لـ middleware التالي.',
      'jwt': 'JWT (JSON Web Token) للمصادقة. عند تسجيل الدخول يُنشئ الخادم token. العميل يرسله في كل طلب بالترويسة: Authorization: Bearer <token>.',
      'mongodb': 'MongoDB قاعدة بيانات NoSQL تخزّن البيانات كمستندات JSON. MongoDB Atlas للاستضافة المجانية. استخدم Mongoose مع Node.js.',
      'openai': 'ادمج OpenAI API في الخادم فقط — لا تكشف مفتاح API للواجهة الأمامية. أرسل الطلبات عبر Express API وأعد النتيجة للواجهة.',
      'hello': 'مرحباً! أنا معلم Full Stack الذكي من BrandMark 🤖 اسألني عن React أو Node.js أو MongoDB أو JWT أو GenAI!',
      'hi': 'مرحباً! 👋 اسألني عن MERN Stack وReact Hooks وExpress وJWT وMongoDB!',
      'default': 'سؤال رائع! جرّب: "ما هو JSX؟" أو "كيف يعمل useEffect؟" أو "شرح JWT" أو "كيفية الاتصال بـ MongoDB".'
    }
  };

  function getAnswer(question, lang) {
    const q = question.toLowerCase();
    const kb = KB[lang] || KB.en;
    for (const [kw, ans] of Object.entries(kb)) {
      if (kw !== 'default' && q.includes(kw)) return ans;
    }
    return kb['default'];
  }

  // ── Inject Styles ───────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #bm-fs-fab {
      position: fixed; bottom: 28px; right: 28px; z-index: 9998;
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, #F26A21, #E65C17);
      color: #fff; border: none; cursor: pointer;
      font-size: 26px; box-shadow: 0 4px 20px rgba(242,106,33,0.5);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex; align-items: center; justify-content: center;
    }
    #bm-fs-fab:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(242,106,33,0.7); }
    #bm-fs-chat {
      position: fixed; bottom: 100px; right: 28px; z-index: 9999;
      width: 360px; max-height: 520px; border-radius: 16px;
      background: #fff; box-shadow: 0 8px 40px rgba(11,44,77,0.25);
      display: flex; flex-direction: column; overflow: hidden;
      font-family: 'Outfit', sans-serif; border: 2px solid #0B2C4D;
    }
    #bm-fs-header {
      background: linear-gradient(135deg, #0B2C4D, #081F36);
      color: #fff; padding: 12px 16px;
      display: flex; align-items: center; justify-content: space-between;
    }
    #bm-fs-header h4 { margin: 0; font-size: 14px; font-weight: 700; }
    #bm-fs-header span { font-size: 11px; color: #F26A21; }
    #bm-fs-close { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; padding: 0 4px; }
    #bm-fs-lang {
      background: #f8fafc; padding: 8px 12px;
      display: flex; gap: 6px; border-bottom: 1px solid #e5e7eb;
    }
    #bm-fs-lang button {
      padding: 4px 10px; border-radius: 20px; border: 2px solid #0B2C4D;
      font-size: 11px; font-weight: 600; cursor: pointer;
      background: #fff; color: #0B2C4D; transition: all 0.2s;
    }
    #bm-fs-lang button.bm-active { background: #F26A21; border-color: #F26A21; color: #fff; }
    #bm-fs-messages {
      flex: 1; overflow-y: auto; padding: 12px; display: flex;
      flex-direction: column; gap: 8px;
    }
    .bm-fs-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5; }
    .bm-fs-bot { background: #f0f4ff; color: #0B2C4D; align-self: flex-start; border-bottom-left-radius: 4px; border-left: 3px solid #F26A21; }
    .bm-fs-user { background: linear-gradient(135deg, #F26A21, #E65C17); color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
    .bm-fs-thinking { color: #6b7280; font-style: italic; font-size: 12px; align-self: flex-start; }
    #bm-fs-chips { padding: 6px 12px; display: flex; gap: 6px; flex-wrap: wrap; border-top: 1px solid #e5e7eb; background: #fafafa; }
    .bm-fs-chip {
      padding: 4px 10px; border-radius: 14px; font-size: 11px; font-weight: 600;
      background: #e8f0fe; color: #0B2C4D; border: 1px solid #c7d7f9;
      cursor: pointer; transition: all 0.2s;
    }
    .bm-fs-chip:hover { background: #0B2C4D; color: #fff; }
    #bm-fs-input-row {
      padding: 10px 12px; display: flex; gap: 8px;
      border-top: 1px solid #e5e7eb; background: #fff;
    }
    #bm-fs-input {
      flex: 1; padding: 9px 12px; border: 2px solid #e5e7eb;
      border-radius: 8px; font-size: 13px; outline: none;
      font-family: 'Outfit', sans-serif;
    }
    #bm-fs-input:focus { border-color: #F26A21; }
    #bm-fs-send, #bm-fs-voice {
      padding: 9px 12px; border-radius: 8px; border: none;
      cursor: pointer; font-size: 14px; transition: all 0.2s;
    }
    #bm-fs-send { background: #F26A21; color: #fff; }
    #bm-fs-send:hover { background: #E65C17; }
    #bm-fs-voice { background: #0B2C4D; color: #fff; }
    #bm-fs-voice:hover { background: #081F36; }
    #bm-fs-voice.bm-recording { background: #dc2626; animation: bm-fs-pulse 1s infinite; }
    @keyframes bm-fs-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @media(max-width:420px){ #bm-fs-chat{width:calc(100vw - 32px); right:16px; bottom:90px;} }
  `;
  document.head.appendChild(style);

  // ── Inject HTML ─────────────────────────────────────────────────────────────
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <button id="bm-fs-fab" title="Full Stack AI Tutor">⚡</button>
    <div id="bm-fs-chat" style="display:none">
      <div id="bm-fs-header">
        <div>
          <h4>⚡ Full Stack AI Tutor</h4>
          <span>MERN · React · Node · MongoDB · GenAI</span>
        </div>
        <button id="bm-fs-close">✕</button>
      </div>
      <div id="bm-fs-lang">
        <button class="bm-active" data-lang="en">EN 🇬🇧</button>
        <button data-lang="hi">HI 🇮🇳</button>
        <button data-lang="ar">AR 🇸🇦</button>
      </div>
      <div id="bm-fs-messages">
        <div class="bm-fs-msg bm-fs-bot">👋 Hi! I'm your Full Stack AI Tutor. Ask me about <strong>React, Node.js, MongoDB, JWT, REST APIs,</strong> or <strong>GenAI integration!</strong></div>
      </div>
      <div id="bm-fs-chips">
        <span class="bm-fs-chip" data-q="What is JSX?">JSX</span>
        <span class="bm-fs-chip" data-q="Explain useEffect hook">useEffect</span>
        <span class="bm-fs-chip" data-q="What is middleware?">Middleware</span>
        <span class="bm-fs-chip" data-q="How does JWT work?">JWT Auth</span>
        <span class="bm-fs-chip" data-q="How to use MongoDB?">MongoDB</span>
        <span class="bm-fs-chip" data-q="How to integrate OpenAI API?">OpenAI API</span>
      </div>
      <div id="bm-fs-input-row">
        <input id="bm-fs-input" type="text" placeholder="Ask about MERN stack..." />
        <button id="bm-fs-voice" title="Voice Input">🎤</button>
        <button id="bm-fs-send">➤</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  // ── State ───────────────────────────────────────────────────────────────────
  let lang = 'en';
  const fab   = document.getElementById('bm-fs-fab');
  const chat  = document.getElementById('bm-fs-chat');
  const close = document.getElementById('bm-fs-close');
  const msgs  = document.getElementById('bm-fs-messages');
  const input = document.getElementById('bm-fs-input');
  const send  = document.getElementById('bm-fs-send');
  const voiceBtn = document.getElementById('bm-fs-voice');

  // ── FAB Toggle ──────────────────────────────────────────────────────────────
  fab.addEventListener('click', () => {
    chat.style.display = chat.style.display === 'none' ? 'flex' : 'none';
    if (chat.style.display === 'flex') input.focus();
  });
  close.addEventListener('click', () => { chat.style.display = 'none'; });

  // ── Language Switcher ───────────────────────────────────────────────────────
  document.querySelectorAll('#bm-fs-lang button').forEach(btn => {
    btn.addEventListener('click', () => {
      lang = btn.dataset.lang;
      document.querySelectorAll('#bm-fs-lang button').forEach(b => b.classList.remove('bm-active'));
      btn.classList.add('bm-active');
      input.placeholder = lang === 'hi' ? 'MERN stack के बारे में पूछें...' : lang === 'ar' ? 'اسأل عن MERN Stack...' : 'Ask about MERN stack...';
    });
  });

  // ── Topic Chips ─────────────────────────────────────────────────────────────
  document.querySelectorAll('.bm-fs-chip').forEach(chip => {
    chip.addEventListener('click', () => sendMessage(chip.dataset.q));
  });

  // ── TTS ─────────────────────────────────────────────────────────────────────
  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'hi' ? 'hi-IN' : lang === 'ar' ? 'ar-SA' : 'en-US';
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }

  // ── Append Message ──────────────────────────────────────────────────────────
  function appendMsg(text, type) {
    const d = document.createElement('div');
    d.className = `bm-fs-msg bm-fs-${type}`;
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  // ── Send Message ─────────────────────────────────────────────────────────────
  function sendMessage(text) {
    const q = (text || input.value).trim();
    if (!q) return;
    input.value = '';
    appendMsg(q, 'user');
    const thinking = appendMsg('Thinking...', 'thinking');
    setTimeout(() => {
      msgs.removeChild(thinking);
      const answer = getAnswer(q, lang);
      appendMsg(answer, 'bot');
      speak(answer);
    }, 500);
  }

  send.addEventListener('click', () => sendMessage());
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

  // ── Voice Input ─────────────────────────────────────────────────────────────
  voiceBtn.addEventListener('click', () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input requires Chrome browser.'); return; }
    const r = new SR();
    r.lang = lang === 'hi' ? 'hi-IN' : lang === 'ar' ? 'ar-SA' : 'en-US';
    r.onstart = () => { voiceBtn.classList.add('bm-recording'); voiceBtn.textContent = '⏹'; };
    r.onend   = () => { voiceBtn.classList.remove('bm-recording'); voiceBtn.textContent = '🎤'; };
    r.onresult = e => { input.value = e.results[0][0].transcript; sendMessage(); };
    r.start();
  });

})();
