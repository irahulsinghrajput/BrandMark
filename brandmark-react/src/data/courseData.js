export const digitalMarketingModules = [
  {
    id: 1,
    title: "Module 1: Fundamentals & Funnels",
    duration: "45 mins",
    completed: true,
    content: `
      Welcome to the foundation of modern Digital Marketing. In this module, we dissect the anatomy of high-converting sales funnels and the psychology behind consumer behavior in the digital space.

      A funnel is not just a series of web pages; it is the strategic mapping of a customer's journey from total unawareness to brand advocacy. We break this down into the AIDA model: Attention, Interest, Desire, and Action.
      
      **Top of Funnel (TOFU):** This is where you generate brand awareness. Strategies here include SEO-optimized blog posts, viral TikToks, and broad-targeting Meta Ads. The goal is low-friction engagement.
      
      **Middle of Funnel (MOFU):** Here, you capture leads. You transition from giving away free value to requesting contact information via lead magnets (eBooks, webinars, free audits). Your primary tool here is a highly optimized landing page.
      
      **Bottom of Funnel (BOFU):** This is the conversion stage. Strategies include aggressive retargeting ads, personalized email sequences, and limited-time offers to drive the final sale.

      **Industry Best Practices:**
      1. Always build a 'Value Ladder'. Don't ask for a $1,000 sale on day one. Offer a $7 entry product first.
      2. Ensure your funnels are mobile-optimized. Over 70% of TOFU traffic will originate from mobile devices.
      
      **Recommended Tools:**
      - ClickFunnels or GoHighLevel (Funnel building)
      - Hotjar (Heatmaps & user behavior tracking)
    `
  },
  {
    id: 2,
    title: "Module 2: Advanced SEO (Technical & On-Page)",
    duration: "1 hr 15 mins",
    completed: true,
    content: `
      Search Engine Optimization (SEO) is the bedrock of sustainable, organic growth. In this module, we move past basic keyword stuffing and dive into technical architecture and semantic HTML.

      **On-Page SEO:** This involves optimizing individual web pages to rank higher.
      - **Title Tags & Meta Descriptions:** These are your organic ad copy. They must be compelling and include primary keywords.
      - **Header Hierarchy (H1, H2, H3):** Search engines use headers to understand the structure of your content. You should only ever have one H1 tag per page.
      - **Keyword Density vs. Semantic LSI:** Stop keyword stuffing. Use Latent Semantic Indexing (LSI) keywords—terms conceptually related to your main topic.

      **Technical SEO:** This is how you ensure search engine crawlers can actually index your site.
      - **Core Web Vitals:** Google heavily penalizes slow sites. You must optimize your LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift).
      - **XML Sitemaps & robots.txt:** Direct crawlers to your most important pages and block them from indexing admin panels or duplicate content.
      - **Canonicalization:** Prevent duplicate content issues by using canonical tags on similar pages.

      **Industry Best Practices:**
      1. Implement Schema Markup (JSON-LD) to get rich snippets in search results (e.g., star ratings, FAQ accordions).
      2. Compress all images using WebP format and lazy-load off-screen assets to drastically improve PageSpeed scores.

      **Recommended Tools:**
      - Ahrefs or SEMrush (Keyword research & backlink analysis)
      - Google Search Console (Index monitoring)
      - Screaming Frog (Technical site crawling)
    `
  },
  {
    id: 3,
    title: "Module 3: Content Marketing Strategy",
    duration: "1 hr",
    completed: false,
    content: `
      Content is king, but context is God. In this module, we explore how to create a content matrix that aligns with user intent across every stage of the buyer's journey.

      **The Hub and Spoke Model:**
      Instead of writing random blog posts, structure your content strategically. Create a massive 'Hub' page (e.g., "The Ultimate Guide to Digital Marketing in 2026"). Then, create smaller 'Spoke' articles (e.g., "How to run Meta Ads", "What is SEO?") that link back to the Hub. This passes link equity and establishes extreme topical authority in Google's eyes.

      **Content Formats:**
      - **Short-form Video (Reels/TikTok/Shorts):** Best for TOFU brand awareness and viral reach.
      - **Long-form Blogs/Whitepapers:** Best for MOFU authority building and SEO ranking.
      - **Case Studies/Testimonials:** Best for BOFU conversion and trust building.

      **Content Distribution:**
      Creating the content is only 20% of the job; distribution is 80%. If you write a blog post, you must atomize it: turn the key points into a Twitter thread, script a TikTok based on the intro, and send the summary to your email list.

      **Industry Best Practices:**
      1. Use the 'Skyscraper Technique'. Find the top-ranking piece of content for your keyword, analyze its weaknesses, and create something 10x better.
      2. Always include clear, contextual Calls to Action (CTAs) within your content. Don't leave the user guessing what to do next.

      **Recommended Tools:**
      - BuzzSumo (Content trend research)
      - Jasper AI or Copy.ai (Draft generation and ideation)
      - Buffer or Hootsuite (Social distribution scheduling)
    `
  },
  // Adding remaining 12 modules with comprehensive content to avoid placeholders
  {
    id: 4, title: "Module 4: Google Ads & PPC", duration: "1.5 hrs", completed: false,
    content: `Pay-Per-Click (PPC) advertising on Google captures high-intent users actively searching for your solution. 
    
    **Campaign Types:** We will cover Search Network (text ads), Display Network (banner ads), and Performance Max campaigns. 
    
    **Bidding Strategies:** Learn the difference between Manual CPC, Target CPA, and Target ROAS. The key to PPC is aggressive negative keyword management to prevent wasted ad spend on irrelevant searches.
    
    **Quality Score:** Google ranks ads not just on bid amount, but on Quality Score. You must optimize your Ad Relevance, Expected CTR, and Landing Page Experience to lower your CPC and outrank competitors who are bidding more than you.`
  },
  {
    id: 5, title: "Module 5: Meta Ads (Facebook/Instagram)", duration: "2 hrs", completed: false,
    content: `Meta Ads excel at interruption marketing and demographic targeting. 
    
    **The Pixel & Conversions API:** You must implement the Meta Pixel and CAPI to track user behavior across iOS 14+ updates. 
    
    **Campaign Structure:** We will build a standard CBO (Campaign Budget Optimization) structure with broad targeting for prospecting (TOFU) and dynamic product catalogs for retargeting (BOFU).
    
    **Creative Testing:** The algorithm is smart enough to find the audience; your job is to provide the creative. Learn the 'Dynamic Creative Testing' framework to systematically test hooks, bodies, and headlines to find winning combinations.`
  },
  {
    id: 6, title: "Module 6: Social Media Algorithms (TikTok/LinkedIn)", duration: "1 hr", completed: false,
    content: `Understanding algorithms allows you to hack organic reach. 
    
    **TikTok:** The algorithm prioritizes Watch Time and Completion Rate. We will cover the 'Hook-Retain-Reward' script structure necessary to go viral. 
    
    **LinkedIn:** The premier B2B platform. The algorithm favors native content (no external links in the original post) and high engagement within the first 60 minutes. We will cover how to write formatting-heavy text posts and utilize Carousel PDFs to maximize dwell time.`
  },
  {
    id: 7, title: "Module 7: Email Marketing Automation", duration: "1.5 hrs", completed: false,
    content: `Email remains the highest ROI channel because you own the list. 
    
    **Core Flows:** You will build out the 4 essential automated flows: The Welcome Series (indoctrination), Browse Abandonment, Cart Abandonment (revenue recovery), and Post-Purchase (upsell/review generation). 
    
    **Deliverability:** Learn how to warm up a domain, configure DKIM/DMARC/SPF records, and maintain list hygiene to ensure you avoid the spam folder.`
  },
  {
    id: 8, title: "Module 8: Conversion Rate Optimization (CRO)", duration: "1 hr", completed: false,
    content: `CRO is the science of turning more of your existing traffic into paying customers. 
    
    **A/B Testing:** We will cover how to formulate hypotheses and run statistical A/B tests on headlines, button colors, and pricing layouts. 
    
    **UX Psychology:** Learn the principles of urgency, scarcity, and social proof. We will analyze heatmaps and session recordings to identify rage-clicks and drop-off points in your funnels.`
  },
  {
    id: 9, title: "Module 9: Google Analytics 4 (GA4)", duration: "1.5 hrs", completed: false,
    content: `GA4 is event-based tracking, unlike Universal Analytics. 
    
    **Custom Events:** We will set up custom events via Google Tag Manager (GTM) to track specific button clicks, form submissions, and video views. 
    
    **Attribution Models:** Understand the difference between First-Click, Last-Click, and Data-Driven attribution to accurately measure which marketing channels are actually driving revenue.`
  },
  {
    id: 10, title: "Module 10: Influencer Marketing", duration: "1 hr", completed: false,
    content: `Leveraging borrowed trust is incredibly powerful. 
    
    **Micro vs. Macro:** Learn why micro-influencers (10k-50k followers) often yield a higher ROI than massive celebrities due to higher engagement rates and niche audiences. 
    
    **Negotiation & Contracts:** We will cover how to structure compensation (Flat fee vs. CPA/Affiliate) and draft contracts that ensure usage rights for Whitelisting (running ads through their handles).`
  },
  {
    id: 11, title: "Module 11: B2B Lead Gen", duration: "1.5 hrs", completed: false,
    content: `B2B marketing requires a longer sales cycle and multiple touchpoints. 
    
    **Cold Outreach:** Learn how to build highly targeted Apollo.io lists and write cold email sequences utilizing personalization at scale. 
    
    **Account-Based Marketing (ABM):** Instead of casting a wide net, ABM targets specific high-value companies with highly personalized campaigns across LinkedIn Ads, direct mail, and tailored landing pages.`
  },
  {
    id: 12, title: "Module 12: Affiliate Marketing", duration: "1 hr", completed: false,
    content: `Build an army of salespeople who only get paid when they make a sale. 
    
    **Platform Setup:** We will review platforms like ShareASale and Impact. 
    
    **Commission Structures:** Learn how to set competitive CPA rates, cookie durations, and provide creatives/swipe copy to ensure your affiliates are equipped to succeed.`
  },
  {
    id: 13, title: "Module 13: Reputation Management", duration: "45 mins", completed: false,
    content: `Your brand is what people say about you when you're not in the room. 
    
    **Review Generation:** Automate Trustpilot and Google My Business review requests post-purchase. 
    
    **Crisis Management:** Learn how to handle negative PR, address 1-star reviews constructively, and utilize SEO to suppress negative articles from page 1 of search results.`
  },
  {
    id: 14, title: "Module 14: E-commerce Marketing", duration: "1.5 hrs", completed: false,
    content: `Specific strategies for Shopify/WooCommerce stores. 
    
    **Merchandising:** Optimizing product pages (PDPs) with high-res imagery, UGC (User Generated Content) reviews, and clear shipping policies. 
    
    **Retention:** E-commerce dies on acquisition costs. We will cover LTV (Lifetime Value) maximization through subscription models and VIP loyalty programs.`
  },
  {
    id: 15, title: "Module 15: AI in Marketing", duration: "1.5 hrs", completed: false,
    content: `The marketing landscape is changing rapidly. 
    
    **Prompt Engineering:** Learn how to write advanced, multi-shot prompts for ChatGPT/Claude to generate blog posts, ad copy, and email sequences that sound human, not robotic. 
    
    **Automation:** Utilize tools like Zapier and n8n to connect your CRM to your ad platforms, creating autonomous workflows that score leads and trigger campaigns without human intervention.`
  }
];

export const fullStackModules = [
  {
    id: 1,
    title: "Module 1: JavaScript Mastery & Web Fundamentals",
    duration: "1 hr 30 mins",
    completed: true,
    content: `
      Welcome to Full Stack Engineering. Before we touch frameworks, we must master the language of the web: JavaScript (ES6+).

      **The Execution Context & Call Stack:**
      JavaScript is single-threaded. Understanding how the Call Stack handles execution contexts is critical for debugging. When a function is invoked, an execution context is pushed to the stack. When it returns, it is popped off.
      
      **Asynchronous Programming (The Event Loop):**
      This is the most important concept in JS. When you make an API call, it gets sent to the Web APIs environment, allowing the Call Stack to continue executing code. Once the API call finishes, the callback is pushed to the Task Queue, and the Event Loop pushes it back to the Call Stack when it's empty.

      \`\`\`javascript
      // Example of Async/Await handling Promises
      const fetchUserData = async (userId) => {
        try {
          const response = await fetch(\`/api/users/\${userId}\`);
          if (!response.ok) throw new Error('Network error');
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      };
      \`\`\`

      **Closures & Lexical Scoping:**
      A closure gives you access to an outer function's scope from an inner function. This is heavily used in React Hooks (like useState).

      **Industry Best Practices:**
      1. Avoid mutating state directly. Always use array methods like .map(), .filter(), and .reduce() to return new arrays.
      2. Use strict equality (===) to avoid type coercion bugs.
    `
  },
  {
    id: 2,
    title: "Module 2: React 18 & Component Architecture",
    duration: "2 hrs",
    completed: true,
    content: `
      React revolutionized frontend development by introducing a component-based architecture and the Virtual DOM.

      **The Virtual DOM (VDOM):**
      Instead of manipulating the heavy browser DOM directly, React updates a lightweight JavaScript representation (the VDOM). It then runs a "diffing" algorithm to figure out exactly what changed and only updates those specific nodes in the real DOM. This is why React is so fast.

      **Hooks (useState & useEffect):**
      Hooks allow functional components to hook into React state and lifecycle features.
      
      \`\`\`javascript
      import React, { useState, useEffect } from 'react';

      const UserProfile = ({ userId }) => {
        const [user, setUser] = useState(null);

        useEffect(() => {
          // This runs after mount, and whenever userId changes
          let isMounted = true;
          fetchUser(userId).then(data => {
            if(isMounted) setUser(data);
          });
          
          // Cleanup function runs on unmount
          return () => { isMounted = false; };
        }, [userId]); 

        if (!user) return <div className="spinner" />;
        return <h1>{user.name}</h1>;
      };
      \`\`\`

      **Component Architecture:**
      We will adopt the 'Container/Presentational' pattern. Presentational components are stateless and only render UI based on props. Container components handle the logic, data fetching, and state management, passing data down as props.

      **Industry Best Practices:**
      1. Keep your components small and focused on a single responsibility (SOLID principles).
      2. Always include a dependency array in your useEffect to prevent infinite rendering loops.
    `
  },
  {
    id: 3,
    title: "Module 3: Advanced State Management (Redux/Zustand)",
    duration: "1.5 hrs",
    completed: false,
    content: `
      Prop drilling (passing props down 5 levels deep) becomes unmanageable in large applications. We need global state management.

      **Redux Toolkit (RTK):**
      Redux enforces a unidirectional data flow. You dispatch 'Actions', which are processed by pure functions called 'Reducers', which then update a single, immutable 'Store'. RTK dramatically reduces the boilerplate required to set this up.

      \`\`\`javascript
      // Creating a slice in Zustand (Modern alternative to Redux)
      import { create } from 'zustand';

      export const useCartStore = create((set) => ({
        items: [],
        addItem: (item) => set((state) => ({ 
          items: [...state.items, item] 
        })),
        clearCart: () => set({ items: [] })
      }));
      \`\`\`

      **When to use Global State:**
      Do not put everything in Redux/Zustand! Form state, toggle switches, and local UI state should remain in local \`useState\`. Only use global state for data that multiple disconnected components need to access (e.g., User Authentication status, Shopping Cart data, Theme preferences).

      **Industry Best Practices:**
      1. We highly recommend Zustand for modern React apps due to its lack of boilerplate and Context-provider wrapping compared to Redux.
      2. For remote server state (caching API responses), use React Query or SWR instead of Redux.
    `
  },
  // Adding remaining 12 modules with comprehensive content to avoid placeholders
  {
    id: 4, title: "Module 4: Next.js App Router", duration: "2 hrs", completed: false,
    content: `Next.js is the industry standard framework for production React apps. 
    
    **Server Components (RSC):** By default, components in the App Router run on the server. This means zero JavaScript is shipped to the client for these components, drastically improving performance and SEO. 
    
    **Routing:** We will build deeply nested layouts and dynamic routes using the file-system based router. 
    
    **Data Fetching:** Learn how to fetch data securely on the server and pass it directly to components without needing useEffect or loading spinners.`
  },
  {
    id: 5, title: "Module 5: Node.js & Express Architecture", duration: "1.5 hrs", completed: false,
    content: `Transitioning to the backend. Node.js allows us to run JS outside the browser using the V8 engine. 
    
    **Express.js:** We will build a robust RESTful API. 
    
    **Middleware:** The core of Express. Learn how to write custom middleware for logging, error handling, and request validation before the request hits your controller. 
    
    **MVC Pattern:** We will structure our backend using the Model-View-Controller pattern, separating route definitions from business logic (controllers) and database schemas (models).`
  },
  {
    id: 6, title: "Module 6: MongoDB & Mongoose", duration: "2 hrs", completed: false,
    content: `MongoDB is a NoSQL database that stores data in flexible JSON-like documents. 
    
    **Mongoose ORM:** We will use Mongoose to define strict schemas, validations, and virtuals for our data. 
    
    **Aggregations:** Go beyond basic CRUD operations. Learn how to write complex Aggregation Pipelines to filter, group, and compute data directly in the database layer for maximum performance. 
    
    **Indexing:** We will cover how to add indexes to frequently searched fields to prevent slow queries as your database scales to millions of records.`
  },
  {
    id: 7, title: "Module 7: RESTful APIs & GraphQL", duration: "1.5 hrs", completed: false,
    content: `Designing APIs that frontends love to consume. 
    
    **REST Principles:** Statelessness, standard HTTP methods (GET, POST, PUT, DELETE), and proper status code usage (200, 201, 400, 404, 500). 
    
    **GraphQL:** We will introduce GraphQL to solve the 'over-fetching' problem of REST. Learn how to define Schemas, Types, and Resolvers so the frontend can query exactly the data it needs and nothing more.`
  },
  {
    id: 8, title: "Module 8: Authentication (JWT & OAuth)", duration: "2 hrs", completed: false,
    content: `Security is paramount. 
    
    **JSON Web Tokens (JWT):** We will build a stateless authentication system. When a user logs in, the server signs a JWT and sends it to the client. The client attaches this token to the Authorization header of subsequent requests. 
    
    **Cookies vs. LocalStorage:** We will discuss the security implications of XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery) and why HTTP-only cookies are generally preferred for storing tokens. 
    
    **OAuth 2.0:** Implementing "Login with Google" using Passport.js.`
  },
  {
    id: 9, title: "Module 9: Intro to LLMs & Gen AI", duration: "1 hr", completed: false,
    content: `Welcome to the AI era. 
    
    **Transformers Architecture:** A high-level overview of how Large Language Models work, including tokenization, embeddings, and the self-attention mechanism that allows models like GPT-4 to understand context. 
    
    **Limitations:** Understanding hallucinations, context window limits, and knowledge cutoffs so you can architect systems that mitigate these flaws.`
  },
  {
    id: 10, title: "Module 10: OpenAI API Integration", duration: "1.5 hrs", completed: false,
    content: `Connecting our Node.js backend to the brain. 
    
    **The Chat Completions API:** We will integrate the OpenAI SDK to generate text, format responses using system prompts, and stream responses back to the client using Server-Sent Events (SSE) for a ChatGPT-like typing effect. 
    
    **Function Calling:** Learn how to give the LLM tools. We will teach the model to recognize when it needs to fetch external data (like checking a database) and execute a Node.js function before replying to the user.`
  },
  {
    id: 11, title: "Module 11: Building RAG Applications", duration: "2 hrs", completed: false,
    content: `Retrieval-Augmented Generation (RAG) is how you let AI chat with your private data. 
    
    **Vector Databases:** We will set up Pinecone. 
    
    **Embeddings:** Learn how to chunk large documents (like PDFs or codebases), convert them into numerical vectors using OpenAI's embedding model, and store them. When a user asks a question, we will perform a semantic search to retrieve the most relevant chunks, inject them into the LLM prompt, and generate an accurate, grounded answer.`
  },
  {
    id: 12, title: "Module 12: Building AI Agents (LangChain)", duration: "1.5 hrs", completed: false,
    content: `Moving beyond simple chat interfaces to autonomous agents. 
    
    **LangChain Framework:** We will use LangChain.js to chain together prompts, LLMs, and external tools. 
    
    **Agentic Workflows:** We will build an agent that can be given a high-level goal, autonomously break it down into steps, search the web, execute code in a sandbox, and formulate a final answer without human intervention.`
  },
  {
    id: 13, title: "Module 13: Web Security Best Practices", duration: "1 hr", completed: false,
    content: `Securing your MERN stack application for production. 
    
    **Helmet & Cors:** Setting up secure HTTP headers and configuring Cross-Origin Resource Sharing. 
    
    **Sanitization:** Using tools like express-validator and DOMPurify to prevent SQL/NoSQL injection and XSS attacks. 
    
    **Rate Limiting:** Protecting your expensive OpenAI API routes from DDOS attacks and abuse by implementing IP-based rate limiting using Redis.`
  },
  {
    id: 14, title: "Module 14: CI/CD & Deployment", duration: "1.5 hrs", completed: false,
    content: `Shipping code reliably. 
    
    **Docker:** We will containerize our Node.js backend to ensure environment consistency across development and production. 
    
    **GitHub Actions:** We will build a CI/CD pipeline that automatically runs our Jest unit tests on every push, and if they pass, triggers a deployment. 
    
    **Hosting:** We will deploy our Next.js frontend to Vercel (for edge caching) and our Node.js backend to AWS EC2 or Render.`
  },
  {
    id: 15, title: "Module 15: Capstone AI SaaS Project", duration: "3 hrs", completed: false,
    content: `Putting it all together. 
    
    **The Project:** We will build a complete, production-ready AI SaaS application. This includes user authentication, Stripe integration for subscriptions, a Next.js frontend, a Node.js backend, and a RAG pipeline allowing users to upload documents and chat with them. 
    
    **Architecture Review:** We will map out the entire system architecture, handle edge cases, and review performance optimization techniques before launching it to the public.`
  }
];
