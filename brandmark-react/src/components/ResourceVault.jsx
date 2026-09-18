import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export const ResourceVault = ({ courseData }) => {
  const isFullStack = courseData === 'full-stack' || courseData === 'fullstack-mern-001' || courseData === 'full-stack-dev';
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Marketing ROAS Calculator state
  const [adSpend, setAdSpend] = useState(50000);
  const [avgOrderVal, setAvgOrderVal] = useState(2500);
  const [expectedCpa, setExpectedCpa] = useState(500);

  const projectedOrders = expectedCpa > 0 ? Math.floor(adSpend / expectedCpa) : 0;
  const projectedRevenue = projectedOrders * avgOrderVal;
  const projectedRoas = adSpend > 0 ? (projectedRevenue / adSpend).toFixed(2) : 0;

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Monthly Ad Spend (INR),${adSpend}\n`
      + `Target CPA (INR),${expectedCpa}\n`
      + `Average Order Value (INR),${avgOrderVal}\n`
      + `Projected Orders,${projectedOrders}\n`
      + `Projected Revenue (INR),${projectedRevenue}\n`
      + `Target ROAS,${projectedRoas}x\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "BrandMark_Ad_Spend_ROAS_Plan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('ROAS Budget Sheet downloaded!');
  };

  const marketingResources = [
    {
      id: 'dm-prompts-1',
      category: 'prompts',
      title: 'High-Converting Meta Ad Hook Generator Prompt',
      tag: 'GenAI Prompt',
      content: `Act as a world-class direct-response copywriter who has spent over $10M on Meta Ads. I am marketing [PRODUCT/SERVICE] to [TARGET AUDIENCE]. Their single biggest daily pain point is [PAIN POINT]. 

Generate 5 distinct ad hooks:
1. Contrarian/Myth-Buster Hook
2. Proof & Statistics Hook
3. Direct Question Pain-Agitation Hook
4. Curiosity Gap Hook
5. Case Study "Before vs After" Hook

For each hook, explain the psychological trigger used.`
    },
    {
      id: 'dm-prompts-2',
      category: 'prompts',
      title: 'SEO Semantic Topic Cluster & Pillar Architect',
      tag: 'GenAI Prompt',
      content: `Act as an enterprise SEO Director. My core business domain is [TOPIC]. 

Develop a full semantic topic cluster:
1. One comprehensive Pillar Page Title and H1-H3 structural outline.
2. 8 Supporting Cluster Article Titles that target long-tail informational intent keywords.
3. Internal linking strategy explaining how to pass PageRank between cluster nodes and the pillar page.
4. Schema markup recommendations (Article, FAQPage, HowTo).`
    },
    {
      id: 'dm-sop-1',
      category: 'sops',
      title: 'Agency Client Onboarding & Audit SOP',
      tag: 'Standard Operating Procedure',
      content: `# Client Onboarding Checklist
1. Access Delegation:
   - Request Meta Business Manager Partner Access (Partner ID).
   - Request Google Analytics 4 (Administrator / Editor access).
   - Verify Meta Pixel and CAPI event deduplication.
2. Technical Baseline Audit:
   - Check Core Web Vitals (LCP < 2.5s, CLS < 0.1).
   - Check Mobile Viewport rendering and checkout drop-off rate.
3. Creative Asset Intake:
   - High-res product images (PNG transparent, 1080x1080 & 1080x1920).
   - Video UGC testimonials and customer proof points.
4. 30-Day Growth Roadmap Submission.`
    },
    {
      id: 'dm-email-1',
      category: 'templates',
      title: '7-Figure Automated Email Welcome Drip Sequence',
      tag: 'Email Blueprint',
      content: `Email 1 (Immediate): The Immediate Value Delivery + High-Resonance Introduction.
Email 2 (Day 1): The Origin Story & Why Common Solutions Fail.
Email 3 (Day 2): Case Study Breakthrough (How [Customer] solved [Problem]).
Email 4 (Day 3): The Contrarian Shift (The hidden mistake 90% of people make).
Email 5 (Day 4): Overcoming Objections (FAQ + Risk Reversal Guarantee).
Email 6 (Day 5): The Irresistible Offer Deadline / Cohort Close.`
    }
  ];

  const fullStackResources = [
    {
      id: 'fs-docker-1',
      category: 'devops',
      title: 'Production Dockerfile & Docker-Compose (Node + Mongo + Redis)',
      tag: 'DevOps Template',
      content: `# Production Multi-Stage Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm ci --only=production
EXPOSE 5000
USER node
CMD ["node", "dist/server.js"]`
    },
    {
      id: 'fs-github-1',
      category: 'devops',
      title: 'GitHub Actions CI/CD Pipeline (.github/workflows/deploy.yml)',
      tag: 'CI/CD Automation',
      content: `name: Production CI/CD
on:
  push:
    branches: [main]
jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm test
      - run: npm run build`
    },
    {
      id: 'fs-security-1',
      category: 'security',
      title: 'OWASP Full-Stack Security & JWT Hardening Checklist',
      tag: 'Security SOP',
      content: `# OWASP Top 10 API Security Checklist
1. Storage: Store JWT strictly in HttpOnly, Secure, SameSite=Strict cookies. Never in localStorage.
2. Input Sanitization: Use express-mongo-sanitize to scrub $ and . operators.
3. Rate Limiting: Apply express-rate-limit to auth endpoints (max 10 attempts per 15 min).
4. Security Headers: Enforce Helmet.js with strict Content-Security-Policy (CSP).
5. Schema Validation: Enforce Zod or Joi on req.body, req.query, and req.params.`
    },
    {
      id: 'fs-rag-1',
      category: 'ai-code',
      title: 'LangChain + OpenAI Vector Search RAG Starter Code',
      tag: 'AI Code Blueprint',
      content: `import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOpenAI } from "@langchain/openai";

export async function runRagPipeline(query, documents) {
  const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPENAI_API_KEY });
  const vectorStore = await MemoryVectorStore.fromTexts(
    documents.map(d => d.pageContent),
    documents.map(d => d.metadata),
    embeddings
  );

  const relevantDocs = await vectorStore.similaritySearch(query, 3);
  const context = relevantDocs.map(d => d.pageContent).join("\\n");

  const model = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.2 });
  const response = await model.invoke(\`Context:\\n\${context}\\n\\nQuestion: \${query}\`);
  return response.content;
}`
    }
  ];

  const resources = isFullStack ? fullStackResources : marketingResources;
  const filtered = activeCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-brand-border-light">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-brand-navy/10 text-brand-navy text-xs font-black uppercase tracking-wider rounded-md">
              Exclusive Resource Vault
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-navy mt-1">
              {isFullStack ? 'Engineering Boilerplates & Architecture SOPs' : 'Growth Marketing Templates & Prompt Library'}
            </h2>
            <p className="text-sm text-brand-text-muted mt-1">
              Production-ready templates, cheat sheets, and checklists you can copy or download directly for your projects.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool: Meta Ads Budget & ROAS Calculator (For Digital Marketing) */}
      {!isFullStack && (
        <div className="bg-gradient-to-br from-brand-navy to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-brand-orange/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-brand-orange text-xs font-bold uppercase tracking-wider">Interactive Growth Tool</span>
              <h3 className="text-xl md:text-2xl font-black mt-0.5">Meta Ads Budget & ROAS Forecaster</h3>
              <p className="text-xs text-white/70 mt-1">Calculate projected acquisition volume, revenue, and ROAS before spending ad spend.</p>
            </div>
            <button
              onClick={handleDownloadCsv}
              className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <span>📥</span> Download Budget CSV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <label className="block text-xs font-bold text-gray-300 mb-1">Monthly Ad Spend (₹)</label>
              <input 
                type="number" 
                value={adSpend} 
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full bg-white/20 border border-white/25 rounded-xl px-3 py-2 text-white font-bold text-base focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <label className="block text-xs font-bold text-gray-300 mb-1">Target CPA / Cost per Lead (₹)</label>
              <input 
                type="number" 
                value={expectedCpa} 
                onChange={(e) => setExpectedCpa(Number(e.target.value))}
                className="w-full bg-white/20 border border-white/25 rounded-xl px-3 py-2 text-white font-bold text-base focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
              <label className="block text-xs font-bold text-gray-300 mb-1">Average Order / Deal Value (₹)</label>
              <input 
                type="number" 
                value={avgOrderVal} 
                onChange={(e) => setAvgOrderVal(Number(e.target.value))}
                className="w-full bg-white/20 border border-white/25 rounded-xl px-3 py-2 text-white font-bold text-base focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>

          {/* Metric Outputs */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15 text-center">
            <div>
              <span className="text-[11px] text-white/60 uppercase font-bold block">Projected Orders</span>
              <span className="text-xl md:text-2xl font-black text-emerald-400">{projectedOrders.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[11px] text-white/60 uppercase font-bold block">Projected Revenue</span>
              <span className="text-xl md:text-2xl font-black text-white">₹{projectedRevenue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[11px] text-white/60 uppercase font-bold block">Target ROAS</span>
              <span className="text-xl md:text-2xl font-black text-brand-orange">{projectedRoas}x</span>
            </div>
          </div>
        </div>
      )}

      {/* Resource Cards Grid */}
      <div className="space-y-6">
        {filtered.map((item) => {
          const isCopied = copiedId === item.id;

          return (
            <div key={item.id} className="bg-white rounded-3xl p-6 md:p-7 shadow-sm border border-brand-border-light hover:shadow-md transition-all">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-brand-orange/10 text-brand-orange text-[10px] font-extrabold uppercase rounded-md">
                    {item.tag}
                  </span>
                  <h3 className="font-extrabold text-base md:text-lg text-brand-navy">
                    {item.title}
                  </h3>
                </div>
                <button
                  onClick={() => handleCopy(item.id, item.content)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isCopied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-brand-navy hover:bg-brand-orange text-white'
                  }`}
                >
                  <span>{isCopied ? '✓' : '📋'}</span>
                  <span>{isCopied ? 'Copied!' : 'Copy Code/Prompt'}</span>
                </button>
              </div>

              {/* Snippet Preview */}
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl text-xs font-mono overflow-x-auto max-h-60 leading-relaxed border border-slate-800">
                <code>{item.content}</code>
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};
