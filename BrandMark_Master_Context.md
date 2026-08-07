# BrandMark Master Context

## 1. PROJECT OVERVIEW
**BrandMark Solutions** is a dual-purpose B2B SaaS and digital agency platform designed to help MSMEs (Micro, Small, and Medium Enterprises) scale. It solves the fragmentation of digital presence management by unifying brand identity, digital marketing, AI automation, and technical education into a single ecosystem. 

**Main Products:**
- Digital Agency Services (SEO, Branding, Marketing)
- Client Portals & Proposal Engines
- AI-Driven Workflow Automation Engine (BrandMark OS / BMOS)
- EdTech Platform (Courses, AI Tutor)

**Target Customers:** MSMEs, startups, and students learning digital skills.

**Overall Architecture:** 
The project is currently transitioning from a legacy MERN-stack architecture into a modern **Serverless Edge Architecture**. The frontend is a React SPA (Single Page Application) built with Vite. The backend logic is split between a legacy Node/Express server hosted on Render and a new, highly scalable Supabase backend utilizing PostgreSQL, Edge Functions, Row Level Security (RLS), and n8n for workflow orchestration.

---

## 2. TECH STACK

**Frontend:** React 19, Vite, TailwindCSS (v4), React Router DOM (v7), Recharts, Framer Motion, GSAP, Lenis (Smooth Scrolling).
**Backend:** Node.js, Express, Render, Supabase Edge Functions (Deno).
**Database:** Supabase PostgreSQL, Supabase Storage, Supabase Auth, Supabase Realtime, pgvector (for AI).
**Automation:** n8n.
**AI:** OpenAI, Anthropic, Vapi (Voice AI), Custom BrandMark GPT.
**Payments:** Razorpay (India/Global), Stripe (Legacy).
**CRM:** HubSpot Integration.
**Email:** Resend.
**Communication:** Slack, WhatsApp (Meta Webhooks), Twilio.
**Deployment:** GitHub, Render (Legacy Backend), Supabase (Database/Functions), Namecheap/Vercel (Frontend).

---

## 3. COMPLETE FOLDER STRUCTURE
```text
/
├── backend/                   # Legacy Node.js Express Backend
│   ├── controllers/           # Business logic (Audit, Meta webhooks)
│   ├── models/                # Database models
│   ├── routes/                # API routes (admin, chat, courses, social)
│   └── server.js              # Express entry point
├── brandmark-react/           # Modern React Frontend (Vite)
│   ├── public/                # Static assets, .htaccess, sitemaps
│   ├── src/
│   │   ├── components/        # Reusable UI (ChatBot, LeadCapture)
│   │   ├── data/              # Static JSON (Blogs, Industries, Courses)
│   │   ├── hooks/             # Custom React hooks (Realtime)
│   │   ├── lib/               # Utility libraries (Supabase client)
│   │   ├── pages/             # Route views (47+ pages)
│   │   └── main.jsx           # React DOM mounting
│   ├── vite.config.js         # Vite bundler configuration
│   └── package.json           # Frontend dependencies
├── supabase/                  # Supabase Configuration
│   ├── migrations/            # 21 SQL migration files (v1.0 to v1.2.1)
│   └── deploy_production.sql  # Compiled master SQL schema
└── DEPLOY_TO_NAMECHEAP.md     # Deployment instructions
```

---

## 4. ROUTES

| Route | Purpose |
|-------|---------|
| `/` | Main marketing landing page. |
| `/about` | Company history and mission. |
| `/services` | Directory of agency services. |
| `/portfolio` | Case studies and past client work (e.g., Hotel Republic). |
| `/courses` | EdTech catalog. |
| `/blog` | Content marketing and SEO articles. |
| `/contact` | Lead generation and contact form. |
| `/login` | Universal authentication portal. |
| `/dashboard` | Administrator control panel. |
| `/client-portal` | Secure area for clients to view projects/invoices. |
| `/student-dashboard` | EdTech learning management system. |
| `/brandmark-gpt` | Proprietary internal AI chat interface. |
| `/workflow-designer` | Visual builder for BMOS automation workflows. |
| `/system-admin` | Deep technical configuration (OAuth, Prompts, Webhooks). |
| `/marketing-automation`| AI-driven campaign generator. |
| `/executive-reporting` | High-level BI summaries for stakeholders. |

---

## 5. COMPONENTS

- **ChatBotWidget**: Global floating AI assistant. Calls `VITE_API_URL` or Supabase functions.
- **LeadCaptureForm**: Captures prospect data and triggers n8n via `VITE_N8N_WEBHOOK_URL`.
- **TalkToMarkVapi**: Voice AI assistant integration relying on `VITE_VAPI_PUBLIC_KEY`.
- **CheckoutButton**: Handles course/service payments via Razorpay Edge Function.
- **PageTransition**: Wraps routes in Framer Motion variants for smooth page loads.
- **AdminRoute / ClientRoute**: Higher Order Components enforcing Supabase Auth roles.

---

## 6. PAGES

- **SystemAdministration**: Deep configuration hub. Fetches from Supabase DB. Role: Super Admin.
- **AgentConversation**: Interface to run BMOS AI agents. Calls Supabase Edge Functions.
- **KnowledgeBaseAdmin**: Uploads files to RAG/Storage via `VITE_KB_UPLOAD_WEBHOOK`.
- **WorkflowQueue**: Monitors n8n/Supabase automated tasks. 
- **Portfolio**: Statically generated (React) list of successful projects, displaying ROI and services.

---

## 7. DATABASE

**Key Tables (PostgreSQL):**
- `users`, `projects`, `invoices` (Core CRM)
- `courses`, `enrollments`, `student_progress` (EdTech)
- `analytics_events`, `analytics_sessions` (Tracking)
- `workflows`, `workflow_executions` (BMOS Engine)
- `executive_reports`, `prediction_models` (Phase 4 BI)

**Key Views:**
- `vw_workflow_health`: Aggregates workflow success/failure rates.
- `vw_executive_reporting`: Aggregates active reports and exports.
- `vw_ai_performance`: Tracks AI latency, token usage, and cost estimates.

**Security:**
- Extensive Row Level Security (RLS) policies implemented on all tables ensuring clients only see their own `projects` and `invoices`. The `service_role` (n8n/Edge Functions) has bypass privileges.

---

## 8. SUPABASE

- **Authentication**: JWT-based auth via Email/Password. Roles are managed in public profiles.
- **Storage Buckets**: Used for Knowledge Base document parsing (PDF/TXT) and user avatars.
- **Realtime**: WebSockets monitor `workflow_executions` to update UI live.
- **Edge Functions**: Secure environments (Deno) for Razorpay checksums, OpenAI prompt generation, and OAuth handshakes.
- **Policies**: Strict PostgreSQL RLS.

---

## 9. EXPRESS BACKEND (Legacy)

- **Folder Structure**: standard MVC (`routes/`, `controllers/`, `models/`, `middleware/`).
- **Purpose**: Initially handled all logic before the migration to Supabase. Currently acts as a fallback for routes like `/api/courses`, `/api/chat`, and Meta/WhatsApp webhooks. 
- **Tech**: Node.js, Express, Mongoose (MongoDB legacy references), JWT middleware.

---

## 10. API ENDPOINTS (Current Hybrid)

| Method | Route | Purpose | Auth |
|---|---|---|---|
| POST | `/functions/v1/ai-tutor` | Supabase Edge Function for AI tutoring | Bearer JWT |
| POST | `/functions/v1/razorpay-checkout` | Generates payment intents | Bearer JWT |
| POST | `/functions/v1/generate-campaign` | AI Marketing Campaign builder | Bearer JWT |
| POST | `/webhook/brandmark-lead-capture` | n8n Webhook for Lead Routing | None |
| GET | `/api/courses` | Legacy Express route for course data | None |

---

## 11. ENVIRONMENT VARIABLES

*Required in Vercel/Frontend Host:*
- `VITE_SUPABASE_URL`: Supabase Project URL (Required).
- `VITE_SUPABASE_ANON_KEY`: Supabase Public Key (Required).
- `VITE_API_URL`: Custom Express backend URL (Required to override hardcoded legacy URLs).
- `VITE_N8N_WEBHOOK_URL`: n8n endpoint for CRM (Required).
- `VITE_VAPI_PUBLIC_KEY`: Vapi Voice AI Key (Required).
- `VITE_VAPI_ASSISTANT_ID`: Vapi routing ID (Required).
- `VITE_BMOS_GPT_API`: Webhook for internal BrandMark GPT (Required).
- `VITE_PROPOSAL_ACTION_URL`: Webhook for proposal signatures (Required).
- `VITE_KB_UPLOAD_WEBHOOK`: Webhook for file uploads to RAG (Required).
- `VITE_SENTRY_DSN`: Sentry crash reporting (Optional).

---

## 12. THIRD PARTY SERVICES

- **Supabase**: Primary Database, Auth, Storage, and Edge Compute.
- **n8n**: Orchestrates multi-step workflows (e.g., Lead -> HubSpot -> Slack -> Email).
- **Vapi**: Provides the Voice AI interface for "Talk to Mark" feature.
- **Razorpay**: Indian/Global payment gateway for course enrollments.
- **Resend**: Transactional email API for invoices and proposals.
- **HubSpot**: CRM sync for captured leads.

---

## 13. AI FEATURES

- **BrandMark GPT**: Internal LLM interface tuned on company data.
- **Knowledge Base (RAG)**: Document vectorization allowing AI to answer context-aware questions.
- **Voice AI**: Real-time voice interaction via Vapi.
- **Marketing AI**: Automated ad-copy and campaign strategy generation.
- **Prediction Engine**: Analyzes historical analytics to predict growth trends (Phase 4).

---

## 14. AUTOMATION WORKFLOWS (BMOS)

- **Lead Capture**: Form submission -> n8n -> Supabase Insert -> HubSpot Sync -> Slack Alert.
- **Client Onboarding**: Proposal Accepted -> Stripe/Razorpay Invoice Generated -> Welcome Email -> Client Portal Account Created.
- **Knowledge Base Ingestion**: PDF Upload -> Webhook -> Text Chunking -> pgvector Embedding -> Supabase Storage.

---

## 15. SECURITY

- **RLS**: Row Level Security ensures completely isolated multi-tenant architecture.
- **JWT**: Supabase standard authentication tokens.
- **DOMPurify**: Sanitizes all Markdown and HTML output in blog posts and AI responses to prevent XSS.
- **Secrets**: Supabase Vault used to store OpenAI and Razorpay private keys away from the frontend.

---

## 16. DEPLOYMENT

- **Frontend**: Vite compiles a static SPA to `/dist`. Served via Apache (Namecheap/cPanel) using `.htaccess` for React Router history fallback, or Vercel.
- **Backend (Legacy)**: Render.com hosting the Express server.
- **Database**: Supabase Cloud (PostgreSQL 15).
- **CI/CD**: GitHub Actions / Vercel integrations.

---

## 17. CURRENT STATUS

**Completed:** 
- Full 21-stage PostgreSQL schema consolidation (v1.2.1).
- Frontend UI/UX overhaul with GSAP and Tailwind.
- Removal of localhost webhook fallbacks.

**Pending / Known Issues:**
- `src/config.js` still contains a hardcoded fallback to `https://brandmark-backend.onrender.com/api` which needs to be safely removed or overridden via Vercel.
- The `.env.example` file is missing 6 key webhook variables.
- Legacy Express backend code (`/backend`) is orphaned but still referenced in older components.

---

## 18. ROADMAP

- **Phase 1 (Complete):** Core Website, UI, Auth, and Supabase Migration.
- **Phase 2 (Complete):** EdTech platform, Realtime Dashboards, basic AI integrations.
- **Phase 3 (Active):** BMOS Workflow Engine, n8n orchestration, Advanced RAG.
- **Phase 4 (Future):** Enterprise Analytics, Predictive AI models, Executive Reporting.

---

## 19. PROJECT METRICS

- **Pages:** 47+ React Routes
- **Database:** 25+ Tables, 4 Views, 21 Migration Files.
- **Environment Variables:** 10 Frontend (`VITE_`) variables.
- **Architecture:** 100% Serverless-ready.

---

## 20. FINAL CTO SUMMARY

**Executive Summary:**
BrandMark is currently at an architectural inflection point. The transition from a monolithic MERN stack to a modern **Supabase + n8n Event-Driven Architecture** is essentially complete on the database side (v1.2.1 migrations executed flawlessly). The frontend is a highly polished Vite/React SPA with premium GSAP animations.

**Architecture Strengths:**
- Heavy reliance on Supabase RLS and PostgREST completely eliminates the need for 90% of traditional CRUD backend code.
- n8n webhooks allow rapid prototyping of complex business logic without deploying code.

**Technical Debt & Blockers:**
- **The Split Brain:** The codebase still houses the legacy `backend/` Node.js folder, and `src/config.js` maintains a hardcoded link to a Render URL. The primary priority for a new CTO is to deprecate the Express backend entirely and move the remaining 10% of logic (like custom OAuth/Webhooks) into Supabase Edge Functions.
- **Environment Documentation:** The project relies heavily on 6+ external webhooks (n8n, Vapi) that are not formally documented in `.env.example`. This makes cold-start onboarding difficult for new developers.

**Scaling Recommendations:**
- Fully commit to Vercel for frontend hosting; Namecheap Apache routing (via `.htaccess`) is a bottleneck for modern SPAs.
- Move all remaining Node/Express controllers to Supabase Edge Functions.
- Implement strict TypeScript typing across the frontend to manage the massive data payloads returning from Supabase views.
