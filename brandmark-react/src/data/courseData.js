// BrandMark Academy — Advanced GenAI Course Curriculum
// Comprehensive 15-Module Masterclasses for Digital Marketing & Full Stack MERN + GenAI

export const digitalMarketingModules = [
  {
    id: 1,
    title: "Module 1: AI Marketing Architecture & Omnichannel Funnels",
    duration: "1 hr 15 mins",
    badge: "Funnel Strategy",
    completed: true,
    audioSummary: "Welcome to Module 1. In this lesson, we dissect modern omnichannel marketing funnels using the AIDA and Flywheel models, showing you how to orchestrate touchpoints from awareness to automated advocacy.",
    content: `### 📌 Overview & Modern Funnel Architecture

In modern growth marketing, traffic without intentional architecture is burned capital. A high-converting funnel maps the psychological trajectory of a prospect from complete unawareness to enthusiastic brand advocacy.

#### 1. The Modern AIDA + Flywheel Evolution
Traditional linear funnels end at the sale; modern AI-driven funnels loop back into an accelerating **Customer Flywheel**:
- **TOFU (Top of Funnel — Attention):** Low-friction discovery via viral short-form video (Reels, TikTok), SEO pillar guides, and broad-match Meta ads.
- **MOFU (Middle of Funnel — Interest & Trust):** Lead capture mechanisms utilizing high-perceived-value lead magnets (calculators, templates, masterclasses).
- **BOFU (Bottom of Funnel — Conversion):** Risk-reversal offers, customer social proof carousels, and time-sensitive retargeting.
- **Flywheel Expansion (Retention & Referral):** Automated post-purchase onboarding sequences, NPS surveys, and viral referral loops.

#### 2. The Value Ladder Principle
Never ask for a high-ticket transaction on cold traffic. Build progressive trust:
1. **Lead Magnet ($0):** Solves one acute, immediate problem.
2. **Tripwire / Micro-Offer ($7 – $27):** Converts a lead into a paying buyer, establishing customer identity.
3. **Core Offer ($99 – $499):** The primary solution delivering comprehensive transformation.
4. **Profit Multiplier ($999+):** Done-for-you services, mastermind access, or annual software licenses.

#### 🤖 AI Prompt Toolkit (Funnel Copy Architecture)
\`\`\`markdown
Act as a world-class Direct Response Copywriter. 
Analyze my target audience: [B2B SaaS Founders wanting more demo bookings].
1. Generate 3 high-converting Lead Magnet concepts addressing their #1 frustration.
2. Write a 5-step email welcome sequence utilizing the Soap Opera Sequence framework.
3. Include an irresistible micro-offer pitch on Day 3 with scarcity and risk reversal.
\`\`\`

#### ⚡ Pro Industry Tips
- Ensure your landing page loads in under 1.8 seconds on mobile devices; 53% of mobile visitors bounce if load time exceeds 3 seconds.
- Use 1-column layouts with sticky CTA buttons on mobile devices to lift conversion rates by up to 28%.`,
    assignment: "Map out a 4-tier Value Ladder for your chosen business niche, including the Lead Magnet, Tripwire Offer, Core Product, and High-Ticket Upsell.",
    quiz: [
      {
        question: "What is the primary objective of a 'Tripwire' offer in a sales funnel?",
        options: [
          "To generate the majority of annual corporate profit",
          "To convert a lead into a paying customer by lowering purchase friction",
          "To collect email addresses without charging any money",
          "To replace the need for customer support"
        ],
        correctIndex: 1,
        explanation: "A Tripwire offer is a low-priced product designed specifically to turn prospects into buyers, fundamentally shifting customer psychology."
      },
      {
        question: "In the Flywheel model, what happens after a customer completes a purchase?",
        options: [
          "The customer is removed from all future marketing lists",
          "The marketing team stops tracking metrics",
          "The customer experience feeds back into advocacy, retention, and referral loops",
          "The customer is immediately pitched an unrelated product"
        ],
        correctIndex: 2,
        explanation: "The Flywheel model turns satisfied customers into promoters who drive organic word-of-mouth and repeat purchases."
      },
      {
        question: "Which page load metric directly causes mobile visitor abandonment if above 3 seconds?",
        options: [
          "Largest Contentful Paint (LCP)",
          "Meta Description Length",
          "Header Tag Count",
          "Color Contrast Ratio"
        ],
        correctIndex: 0,
        explanation: "Slow page load speeds (high LCP) directly increase mobile bounce rates and reduce conversion efficiency."
      }
    ]
  },
  {
    id: 2,
    title: "Module 2: Semantic SEO, Entity Architecture & Google SGE",
    duration: "1 hr 30 mins",
    badge: "Organic Growth",
    completed: true,
    audioSummary: "Module 2 dives into Semantic SEO and Google Search Generative Experience. Learn how search engines prioritize entity relationships and topical clusters over outdated keyword stuffing.",
    content: `### 📌 The Paradigm Shift: From Keywords to Entities

Search engines now understand concepts, entities, and search intent rather than simple string matching. To rank on competitive SERPs and appear inside AI Overviews (SGE), you must demonstrate undisputed **Topical Authority**.

#### 1. The Hub & Spoke (Topic Cluster) Framework
Rather than publishing standalone blog posts, build interconnected semantic networks:
- **The Pillar Hub:** A comprehensive 3,500+ word definitive resource (e.g., "The Complete Guide to Performance Marketing").
- **Subtopic Spokes:** 8 to 12 dedicated satellite articles exploring specific sub-domains (e.g., "Meta CAPI Setup", "PMax Bidding Strategies", "ROAS Benchmarks").
- **Bidirectional Linking:** Every spoke links to the hub with descriptive anchor text, and the hub organizes and links to all spokes. This pools link equity and signals deep domain mastery.

#### 2. Technical SEO & Schema Markup (JSON-LD)
Schema structured data communicates directly with Google's Knowledge Graph.
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Digital Marketing Mastery with Gen AI",
  "description": "Master AI-driven content, SEO, and paid performance marketing.",
  "provider": {
    "@type": "Organization",
    "name": "BrandMark Academy",
    "sameAs": "https://brandmarksolutions.site"
  }
}
</script>
\`\`\`

#### 🤖 AI Prompt Toolkit (Topical Authority Map)
\`\`\`markdown
You are a Principal SEO Strategist. 
My primary seed niche is: [Commercial Solar Energy Installation].
Generate a complete Topic Cluster including:
1. One Definitive Pillar Page title and H2 structure.
2. Ten targeted Subtopic Spoke titles with primary search intent (Informational, Commercial, Transactional).
3. Strategic internal linking recommendations for maximum PageRank distribution.
\`\`\`

#### ⚡ Pro Industry Tips
- Answer search queries in the opening 50-75 words of an article using clear formatting to dramatically boost your odds of securing Google Featured Snippets and SGE citations.`,
    assignment: "Write a comprehensive JSON-LD Schema snippet for an organization or local business in your market and validate it using schema.org.",
    quiz: [
      {
        question: "What is the primary SEO benefit of the Hub and Spoke (Topic Cluster) architecture?",
        options: [
          "It confuses competing crawlers",
          "It builds concentrated topical authority and circulates link equity efficiently",
          "It hides meta tags from search engine indexers",
          "It eliminates the need for quality backlinks"
        ],
        correctIndex: 1,
        explanation: "Topic clusters establish comprehensive topical authority in Google's Knowledge Graph and pass internal link equity seamlessly."
      },
      {
        question: "Which format is recommended by Google for implementing Schema Structured Data?",
        options: ["Microdata inside span tags", "JSON-LD in a script block", "Plain text in the footer", "XML in robots.txt"],
        correctIndex: 1,
        explanation: "Google officially recommends JSON-LD for structured data because it is clean, easy to maintain, and does not alter the visible page HTML."
      },
      {
        question: "What does Google's SGE / AI Overviews favor when citing sources?",
        options: [
          "Websites with 50+ pop-up banners",
          "Concise, accurate answers in clear bullet points or definitions near the top of the content",
          "Pages with zero headings",
          "Sites without mobile compatibility"
        ],
        correctIndex: 1,
        explanation: "AI Overviews scrape direct, factual, well-structured answers that address user intent with high topical clarity."
      }
    ]
  },
  {
    id: 3,
    title: "Module 3: GenAI Copywriting & Multi-Modal Creative Production",
    duration: "1 hr 45 mins",
    badge: "Gen AI Studio",
    completed: false,
    audioSummary: "Module 3 teaches you how to leverage generative AI models like Claude, ChatGPT, and Midjourney to create high-converting ad copy, visual assets, and marketing collateral at 10x speed.",
    content: `### 📌 The AI-Accelerated Creative Engine

Creative fatigue is the number one reason ad performance degrades over time. By deploying generative AI workflows, marketing teams can produce 50+ variations of ad creative, headlines, and angles in hours.

#### 1. Proven Direct-Response Copywriting Frameworks
1. **AIDA:** Attention (The thumb-stopping Hook) ➔ Interest (Fascinating industry insight) ➔ Desire (Emotional transformation) ➔ Action (Direct Call to Action).
2. **PAS:** Problem (Painful bottleneck) ➔ Agitate (Consequences of inaction) ➔ Solution (Your product as the bridge).
3. **BAB:** Before (Current frustration) ➔ After (The ideal outcome) ➔ Bridge (How your system gets them there).

#### 2. Prompt Engineering for High-Converting Ad Copy
Avoid generic outputs like "write an ad for shoes." Feed the model constraints, context, and customer psychology:
\`\`\`markdown
Act as Dan Kennedy, direct-response copy legend.
Product: AI Marketing Automation Suite for Shopify Brands.
Target Persona: E-commerce founders generating $50k-$200k/mo who are overwhelmed by manual email campaigns.
Tone: Direct, punchy, contrarian, no corporate fluff.
Output: 3 Facebook ad copy variations using the PAS framework.
Include: One disruptive hook, bullet-pointed benefits with metrics, and a risk-free trial CTA.
\`\`\`

#### 3. Multi-Modal Visual Asset Generation (Midjourney / Flux)
Crafting commercial prompts for lifestyle and e-commerce visuals:
\`\`\`markdown
/imagine prompt: Commercial studio photograph of a luxury matte black skincare serum bottle, natural morning sunbeams refracting through glass, droplets of moisture, minimalist Scandinavian aesthetic, 8k resolution, shot on Hasselblad H6D-100c, clean lighting --ar 4:5 --v 6.0
\`\`\`

#### ⚡ Pro Industry Tips
- Always test at least 3 distinct Hooks for every 1 body copy variation. The hook determines up to 70% of ad CTR.`,
    assignment: "Use the PAS framework and GenAI prompt engineering to create 3 high-converting Instagram ad copies for an innovative eco-friendly tech gadget.",
    quiz: [
      {
        question: "In the PAS copywriting framework, what does 'Agitate' mean?",
        options: [
          "Insulting the customer to trigger anger",
          "Deepening the emotional and financial pain caused by leaving the problem unsolved",
          "Offering an immediate 90% discount",
          "Asking the user to refresh their browser"
        ],
        correctIndex: 1,
        explanation: "Agitation articulates the hidden costs, stress, and consequences of the problem to create emotional motivation for change."
      },
      {
        question: "What element of a social media ad is responsible for up to 70% of click-through performance?",
        options: ["The company legal terms in the footer", "The first 3-second hook and headline", "The URL domain extension", "The font family of the caption"],
        correctIndex: 1,
        explanation: "The hook stops the scroll and captures initial user attention, dictating whether the rest of the message is even seen."
      },
      {
        question: "Why should you avoid generic prompts like 'write a good marketing ad'?",
        options: [
          "AI models refuse to answer short prompts",
          "Generic prompts produce bland, clichéd copy lacking audience empathy and conversion triggers",
          "It incurs double the API token cost",
          "It reduces page search ranking automatically"
        ],
        correctIndex: 1,
        explanation: "High-converting copy requires specific constraints: audience persona, acute pain points, tone, and frameworks."
      }
    ]
  },
  {
    id: 4,
    title: "Module 4: High-ROAS Meta Ads & Advantage+ Scaling",
    duration: "2 hrs",
    badge: "Paid Acquisition",
    completed: false,
    audioSummary: "Module 4 covers Meta advertising in the post-iOS14 era. Master server-side tracking with Conversions API, Advantage+ shopping campaigns, and iterative creative testing matrices.",
    content: `### 📌 Mastering Paid Social on Meta (Facebook & Instagram)

Meta's advertising engine operates as an auction driven by machine learning. In the post-iOS14 world, winning advertisers feed Meta clean first-party conversion data and broad, high-resonance creative variations.

#### 1. Conversions API (CAPI) vs Browser Pixel
- **The Browser Pixel:** Blocked by ad-blockers, iOS tracking restrictions, and Safari ITP, losing up to 30% of conversion events.
- **Server-Side CAPI:** Events (Purchases, Leads, Add-to-Carts) are sent directly from your backend server to Meta's Graph API. This achieves 95%+ event match quality, unlocking lower CPMs and superior algorithmic targeting.

#### 2. The 3-Tier Campaign Structure
1. **Dynamic Creative Testing (DCT):** Launch 3 creatives x 2 primary texts x 2 headlines into a single sandbox ad set. Meta algorithmically combines them to find winning winners.
2. **Main Scaling Campaign (Advantage+ Shopping / Leads):** Feed only validated winning creatives into a unified Advantage+ campaign with minimal audience restrictions.
3. **Retargeting & MOFU Safety Net:** Retarget 30-day website visitors and social engagers with social proof, customer interviews, and founder stories.

#### 3. Key Financial Formulas
$$\\text{ROAS} = \\frac{\\text{Total Revenue Generated}}{\\text{Total Ad Spend}}$$
$$\\text{Break-Even ROAS} = \\frac{1}{\\text{Gross Profit Margin Percentage}}$$

#### ⚡ Pro Industry Tips
- Never turn off an ad based on 1 day of performance. Meta's attribution window requires at least 48 to 72 hours for conversion latency to settle.`,
    assignment: "Calculate the Break-Even ROAS for an e-commerce product selling for $120 with a cost of goods sold (COGS) of $40, and write an Advantage+ testing plan.",
    quiz: [
      {
        question: "What is the primary purpose of Meta Conversions API (CAPI)?",
        options: [
          "To design banner graphics automatically",
          "To transmit server-side conversion signals directly to Meta, bypassing browser tracking limitations",
          "To automatically refund dissatisfied customers",
          "To increase font sizes on mobile devices"
        ],
        correctIndex: 1,
        explanation: "CAPI sends server-to-server conversion events, recovering lost signals from browser tracking blocks and iOS privacy measures."
      },
      {
        question: "If a product sells for $100 with $50 profit margin (50%), what is the break-even ROAS?",
        options: ["1.0x", "2.0x", "5.0x", "0.5x"],
        correctIndex: 1,
        explanation: "Break-Even ROAS = 1 / 0.50 = 2.0x. You need $2 in revenue for every $1 spent on ads to cover production and ad costs."
      },
      {
        question: "In Meta Advantage+ campaigns, what should advertisers focus on most?",
        options: ["Micro-targeting 50 tiny interest groups", "Broad targeting combined with diverse, high-quality ad creative variations", "Running ads only between 2 AM and 4 AM", "Changing ad copy every 4 hours"],
        correctIndex: 1,
        explanation: "Meta's AI algorithm optimizes broad audiences best when provided with a diverse roster of creatives targeting distinct pain points."
      }
    ]
  },
  {
    id: 5,
    title: "Module 5: Google Ads, Performance Max & Intent Bidding",
    duration: "2 hrs",
    badge: "Search Marketing",
    completed: false,
    audioSummary: "Module 5 covers Google Ads, PPC strategies, and Performance Max campaigns. Learn how to capture high-intent buyers at the exact moment they search for your solution.",
    content: `### 📌 Capturing Active Buyer Intent on Google

While Meta excels at interruption marketing, Google Ads captures **active intent**. When a prospect searches "best enterprise CRM software" or "emergency plumber near me," they are already at the conversion threshold.

#### 1. Search Network vs Performance Max (PMax)
- **Search Campaigns:** Exact match, phrase match, and broad match with strict negative keyword lists. Provides 100% control over query placement.
- **Performance Max:** Google's unified AI campaign serving across Search, YouTube, Display, Discover, Gmail, and Maps. Leverages Asset Groups and Audience Signals.

#### 2. The Quality Score Formula
Your Cost Per Click (CPC) and ad rank are determined by:
$$\\text{Ad Rank} = \\text{Bid Amount} \\times \\text{Quality Score}$$
Quality Score (1 to 10) comprises:
1. **Expected CTR:** Historic performance of your ad copy.
2. **Ad Relevance:** How closely your headlines match user search terms.
3. **Landing Page Experience:** Speed, mobile usability, and topical relevance to the keyword.

#### 3. Negative Keyword Architecture
Negative keywords are the highest-leverage safeguard against wasted budget. Always exclude:
- *Job seekers:* jobs, hiring, career, resume, salary.
- *Free seekers:* free, torrent, crack, download, cheap.
- *Informational intent:* what is, definition, history of, tutorial.

#### ⚡ Pro Industry Tips
- When scaling Performance Max campaigns, always build a dedicated **Customer Acquisition Asset Group** excluding existing brand searches to avoid artificial inflation of ROAS.`,
    assignment: "Create a negative keyword list of at least 25 non-converting terms for a luxury B2B consulting agency running Google Search ads.",
    quiz: [
      {
        question: "What components determine Google's Quality Score?",
        options: [
          "Expected CTR, Ad Relevance, and Landing Page Experience",
          "Monthly ad spend amount only",
          "The age of the domain registration",
          "The number of social media followers"
        ],
        correctIndex: 0,
        explanation: "Quality Score evaluates expected click-through rate, ad relevance to search terms, and the post-click landing page experience."
      },
      {
        question: "Why are Negative Keywords essential in Google Search campaigns?",
        options: [
          "They prevent competitors from seeing your ads",
          "They block ads from appearing on irrelevant queries, stopping wasted budget",
          "They automatically translate copy to Spanish",
          "They increase the bid price artificially"
        ],
        correctIndex: 1,
        explanation: "Negative keywords prevent ads from serving on queries that indicate no purchase intent (e.g. 'free', 'jobs', 'salary')."
      },
      {
        question: "What is the key advantage of a high Quality Score?",
        options: [
          "You pay less per click (CPC) while achieving higher ad rank than competitors bidding more",
          "Google gives you free YouTube ads",
          "Your domain bypasses Google Search Console requirements",
          "You are immune to ad verification policies"
        ],
        correctIndex: 0,
        explanation: "Because Ad Rank = Bid x Quality Score, an advertiser with a QS of 10 can outrank a competitor bidding twice as much with a QS of 4."
      }
    ]
  },
  {
    id: 6,
    title: "Module 6: Viral Growth Engineering & Short-Form Video Algorithms",
    duration: "1 hr 30 mins",
    badge: "Viral Growth",
    completed: false,
    audioSummary: "Module 6 breaks down short-form video algorithms across TikTok, Instagram Reels, and YouTube Shorts. Discover retention editing, narrative pacing, and sound design that generates viral reach.",
    content: `### 📌 The Science of Short-Form Video Virality

Short-form video is the single most potent source of organic reach on the modern internet. Algorithms do not care about your follower count; they optimize for **Watch Time, Completion Rate, and Shares**.

#### 1. The 3 Pillars of Algorithmic Retention
- **The Visual Disruption Hook (0-2s):** Movement, text overlay with high contrast, or a controversial statement that stops scrolling thumb velocity.
- **Pacing & Micro-Re-engagement (2-15s):** Cut footage every 1.5 to 2.5 seconds. Incorporate B-roll, sound effects (whoosh, pop), and dynamic kinetic captions.
- **The Payoff / Loop Trigger (15-30s):** Satisfying resolution or seamless video loop that makes the viewer rewatch the opening without realizing it.

#### 2. The 3 Types of High-Converting Viral Content
1. **The Contrarian Stance:** Challenge an accepted industry belief ("Why 90% of SEO advice is actively killing your traffic").
2. **The Behind-the-Scenes Breakdown:** Show raw unvarnished operational reality, numbers, and mistakes.
3. **The Step-by-Step Blueprint:** High-density educational walkthrough providing tangible bookmarks and saves.`,
    assignment: "Script a 30-second TikTok / Reel video incorporating a visual disruption hook, 3 rapid value points, and a seamless loop transition.",
    quiz: [
      {
        question: "Which metric is most critical for short-form video algorithms to push content to broader audiences?",
        options: ["Video resolution size in megabytes", "Completion rate and average percentage watched", "Number of hashtags used", "Time of day posted"],
        correctIndex: 1,
        explanation: "Algorithms reward videos that retain viewers past 100% watch time and generate replays."
      },
      {
        question: "What is a 'Seamless Loop' in short-form video production?",
        options: [
          "A video that plays upside down",
          "Ending a video so its final sentence flows naturally into the very first sentence, encouraging re-watches",
          "Deleting a video and re-uploading it repeatedly",
          "A video that contains no spoken audio"
        ],
        correctIndex: 1,
        explanation: "A seamless loop links the conclusion to the introduction, driving viewer retention above 100% and triggering algorithm reach."
      },
      {
        question: "How often should visual cuts or zooms occur in modern high-retention short-form video?",
        options: ["Every 15-20 seconds", "Every 1.5 to 2.5 seconds", "Only once per minute", "Never change camera angles"],
        correctIndex: 1,
        explanation: "Frequent visual cuts, kinetic captions, and micro-zooms refresh viewer visual attention and counteract scroll fatigue."
      }
    ]
  },
  {
    id: 7,
    title: "Module 7: Email Marketing, Lifecycle Automation & Retention",
    duration: "1 hr 45 mins",
    badge: "Retention Engine",
    completed: false,
    audioSummary: "Module 7 focuses on customer lifetime value (LTV). Master automated email sequences, behavioral triggers, deliverability infrastructure, and AI-powered segmentation.",
    content: `### 📌 The Billion-Dollar Email Marketing Playbook

Email is the only digital distribution channel you truly own. While social platforms change algorithms at will, your email list is an uncensorable asset with an average ROI of $36 for every $1 spent.

#### 1. Core Automated Lifecycle Flows
1. **Welcome Sequence (4-5 Emails):** Set expectations, introduce founder story, establish authority, deliver lead magnet, pitch entry offer.
2. **Abandoned Checkout Sequence:** 3-part reminder with progressive urgency:
   - *1 Hour Post-Abandon:* Friendly customer service check ("Did you leave something behind?").
   - *12 Hours Post-Abandon:* Address common objections and showcase 5-star customer reviews.
   - *24 Hours Post-Abandon:* Time-limited discount code with a countdown timer.
3. **Post-Purchase Onboarding:** Reassure buyer decisions, minimize remorse, and provide implementation guides.
4. **Win-Back Campaign:** Automated reactivation for subscribers who haven't opened emails in 60-90 days.

#### 2. Deliverability & Technical Authentication
To keep emails out of the spam folder, you must authenticate:
- **SPF (Sender Policy Framework):** Specifies authorized sending mail servers.
- **DKIM (DomainKeys Identified Mail):** Cryptographic signature verifying sender identity.
- **DMARC:** Protocol instructing mailbox providers how to handle unauthenticated mail.`,
    assignment: "Write a 3-part abandoned cart recovery sequence for an online store, balancing helpful support, social proof, and ethical scarcity.",
    quiz: [
      {
        question: "What are the three essential technical DNS records required for high email inbox deliverability?",
        options: ["HTML, CSS, JS", "SPF, DKIM, DMARC", "ROAS, CPM, CPC", "AIDA, PAS, BAB"],
        correctIndex: 1,
        explanation: "SPF, DKIM, and DMARC authenticate your sending domain, preventing spoofing and securing placement in primary inboxes."
      },
      {
        question: "When should the first abandoned cart recovery email be triggered?",
        options: ["7 days later", "Within 1 to 2 hours of abandonment", "Immediately after 30 seconds", "Only once a month"],
        correctIndex: 1,
        explanation: "Reaching out within 1-2 hours catches the customer while purchase intent remains hot and top-of-mind."
      },
      {
        question: "What is the primary benefit of owning an email marketing list compared to social followers?",
        options: [
          "Social media companies can ban or throttle your reach, whereas your email database is a direct, owned asset",
          "Emails never have typos",
          "Email requires no copy preparation",
          "Email guarantees 100% open rates"
        ],
        correctIndex: 0,
        explanation: "An email database is an owned asset that cannot be de-platformed or restricted by third-party algorithmic shifts."
      }
    ]
  },
  {
    id: 8,
    title: "Module 8: Google Analytics 4 (GA4), Data Attribution & Unit Economics",
    duration: "2 hrs",
    badge: "Analytics & Data",
    completed: false,
    audioSummary: "Module 8 deep dives into GA4, custom event tracking, UTM taxonomy, attribution modeling, and customer acquisition unit economics.",
    content: `### 📌 Data-Driven Marketing: GA4 & Attribution Modeling

If you cannot measure it, you cannot scale it. GA4 replaces the legacy session-based universal analytics with an **Event-Driven Data Model**.

#### 1. UTM Tagging Taxonomy
Every paid and organic link must adhere to strict UTM parameters:
- \`utm_source\`: The platform (e.g., \`meta\`, \`google\`, \`linkedin\`, \`newsletter\`).
- \`utm_medium\`: The channel format (e.g., \`cpc\`, \`organic\`, \`email\`, \`influencer\`).
- \`utm_campaign\`: Specific initiative (e.g., \`spring_sale_2026\`, \`retargeting_v2\`).
- \`utm_content\`: Creative variation identifier (e.g., \`video_founder_hookA\`, \`carousel_feature\`).

#### 2. Attribution Models
- **Last-Click Attribution:** Awards 100% of revenue credit to the final touchpoint (heavily favors retargeting and brand search).
- **First-Click Attribution:** Awards 100% of credit to initial discovery (favors TOFU channels like Reels or SEO).
- **Data-Driven Attribution (DDA):** Google's machine learning evaluates incremental lift across all touchpoints in the conversion journey.`,
    assignment: "Construct a standardized UTM campaign tagging spreadsheet for a multi-channel launch spanning Meta Ads, Google PPC, and Email Newsletters.",
    quiz: [
      {
        question: "What makes GA4 fundamentally different from Universal Analytics?",
        options: [
          "GA4 operates on an event-driven model rather than pageview and session hierarchies",
          "GA4 only works on iPhone devices",
          "GA4 does not track websites",
          "GA4 requires no tracking tags"
        ],
        correctIndex: 0,
        explanation: "GA4 treats all interactions (scrolls, clicks, purchases, video plays) as flexible, discrete events with custom parameters."
      },
      {
        question: "Why is relying purely on Last-Click attribution dangerous for scaling marketing budgets?",
        options: [
          "It ignores top-of-funnel discovery channels that introduced the prospect in the first place, causing you to cut profitable awareness campaigns",
          "It makes your website crash",
          "It forces Google to charge higher taxes",
          "It automatically deletes historical logs"
        ],
        correctIndex: 0,
        explanation: "Last-click attribution starves top-of-funnel channels of credit, leading advertisers to incorrectly defund awareness campaigns."
      },
      {
        question: "Which UTM parameter specifies the specific creative variation being tested?",
        options: ["utm_creative", "utm_content", "utm_design", "utm_visual"],
        correctIndex: 1,
        explanation: "Standard Google UTM taxonomy uses 'utm_content' to distinguish between different ad creatives or button placements."
      }
    ]
  },
  {
    id: 9,
    title: "Module 9: Influencer Marketing & High-Converting Affiliate Systems",
    duration: "1 hr 30 mins",
    badge: "Partnerships",
    completed: false,
    audioSummary: "Module 9 teaches how to structure performance-based creator partnerships, commission structures, affiliate recruitment pipelines, and whitelisted ad campaigns.",
    content: `### 📌 Performance-Based Creator Partnerships

The era of paying flat upfront sponsorship fees for unverified influencer posts is over. Modern brands build scalable **Performance Creator Networks** using whitelisted ads and affiliate incentives.

#### 1. The 3 Tiers of Creators
- **Nano-Influencers (1k - 10k):** Extremely high engagement rates (5-10%), highly accessible, eager for product gifting.
- **Micro-Influencers (10k - 100k):** Niche authority, best balance of reach and cost-effective conversion.
- **Macro/Celebrity (100k+):** Brand awareness vehicles; best utilized when negotiating full digital usage and whitelisting rights.

#### 2. Creator Licensing (Meta Whitelisting / Partnership Ads)
Instead of relying on the creator's organic page reach, connect their Instagram page to your Meta Ads Manager. Run paid ads directly from their handle pointing to your optimized sales landing page. This combines creator trust with Meta's targeting algorithms.`,
    assignment: "Draft an outreach pitch message to recruit 5 niche micro-influencers into a performance-based affiliate commission program.",
    quiz: [
      {
        question: "What are 'Partnership Ads' (formerly Meta Whitelisting)?",
        options: [
          "Allowing advertisers to run paid campaigns directly from an influencer's handle to targeted audiences",
          "Signing contracts to put billboards in influencer homes",
          "Hacking influencer social passwords",
          "Trading product stock shares for tweets"
        ],
        correctIndex: 0,
        explanation: "Partnership ads grant advertisers permission to promote ads under the creator's identity, combining social proof with algorithmic scaling."
      },
      {
        question: "Why do micro-influencers often deliver superior conversion rates over celebrity influencers?",
        options: [
          "They post 100 times per day",
          "They possess tighter community trust and higher topical relevance with their audience",
          "They have more followers than celebrities",
          "Their accounts are verified by the government"
        ],
        correctIndex: 1,
        explanation: "Micro-influencers maintain closer personal relationships and niche relevance with their audience, resulting in higher trust and conversion."
      },
      {
        question: "What contract clause must you secure when collaborating with creators for ad creative?",
        options: ["Paid Advertising Usage Rights / Digital Whitelisting Rights", "Exclusive lifetime ownership of their likeness", "Free lifetime access to their personal email", "Permission to change their username"],
        correctIndex: 0,
        explanation: "Securing digital advertising usage rights allows you to leverage their content as high-performing paid ads across your ad channels."
      }
    ]
  },
  {
    id: 10,
    title: "Module 10: Autonomous Marketing AI Agents with n8n & Webhooks",
    duration: "2 hrs",
    badge: "Automation Engineering",
    completed: false,
    audioSummary: "Module 10 teaches you how to construct self-driving AI marketing workflows using n8n, webhooks, Claude, and Airtable to automate lead triage, copy generation, and CRM reporting.",
    content: `### 📌 Building Autonomous Marketing Infrastructure

Human marketers are bottlenecked by repetitive manual tasks. In this module, you will architect **autonomous event-driven marketing workflows** using n8n, webhooks, and LLM APIs.

#### 1. Architecture of an Autonomous Marketing Pipeline
1. **Trigger (Webhook):** Prospect submits an inquiry form on your website.
2. **Enrichment Node:** Workflow queries Clearbit / Apollo API to append company revenue, employee count, and LinkedIn URLs.
3. **AI Qualification Agent (LLM):** Model evaluates whether the lead matches the ideal customer profile (ICP).
4. **Conditional Routing:**
   - *If High-Value ICP:* Post instant notification to private Slack channel, generate personalized pitch briefing, and send calendar booking SMS.
   - *If Low-Value Lead:* Enroll in automated nurturing email drip sequence.
5. **CRM Persistence:** Record lead data into PostgreSQL / Supabase and update HubSpot pipeline status.`,
    assignment: "Design an n8n automated workflow diagram that triggers from a new form submission, enriches the lead data, and generates a personalized response.",
    quiz: [
      {
        question: "What is the primary role of a Webhook in automated marketing pipelines?",
        options: [
          "To send real-time event notifications and data payloads instantly from one system to another",
          "To display graphic banners on mobile screens",
          "To change website DNS servers",
          "To format CSS colors"
        ],
        correctIndex: 0,
        explanation: "Webhooks allow applications to communicate in real time, firing instant HTTP POST payloads whenever a specific event occurs."
      },
      {
        question: "In an automated lead triage agent, what is the role of an LLM node?",
        options: [
          "To analyze lead data, score fit against ICP criteria, and draft personalized communications",
          "To connect the power cables to servers",
          "To reboot the user's computer",
          "To write invoice checks manually"
        ],
        correctIndex: 0,
        explanation: "The LLM acts as an intelligent reasoning agent, categorizing incoming data and generating personalized outputs dynamically."
      },
      {
        question: "Why are self-hosted automation platforms like n8n preferred over simple SaaS tools?",
        options: [
          "They offer full data privacy, unlimited workflow execution, and custom code node flexibility without per-task cost penalties",
          "They require no internet connection",
          "They only run on Windows 98",
          "They delete customer data every 24 hours"
        ],
        correctIndex: 0,
        explanation: "n8n provides enterprise-level data ownership, custom API integration, and massive cost savings at scale."
      }
    ]
  },
  {
    id: 11,
    title: "Module 11: E-Commerce Growth Hacking & CRO Mastery",
    duration: "1 hr 45 mins",
    badge: "E-Commerce CRO",
    completed: false,
    audioSummary: "Module 11 explores Conversion Rate Optimization for e-commerce. Master product page psychological triggers, bundle strategies, checkout friction removal, and A/B testing.",
    content: `### 📌 E-Commerce Optimization: Doubling Revenue Without Increasing Traffic

Increasing conversion rate (CVR) from 1.5% to 3.0% **doubles your business revenue** without spending a single additional dollar on paid advertising.

#### 1. High-Converting Product Detail Page (PDP) Architecture
- **Above the Fold:** High-resolution product gallery (images + short video), clear title, review star badge with count, bold pricing with savings callout, and a prominent sticky "Add to Cart" button.
- **Trust Elements:** Free shipping progress bar, secure payment icons, money-back guarantee badge.
- **Objection Handlers:** Collapsible accordions addressing shipping timelines, sizing guides, ingredients, and FAQ.

#### 2. Increasing Average Order Value (AOV)
- **Pre-Purchase In-Cart Upsells:** "Add a travel-sized bottle for only $9."
- **Volume Tier Discounting:** "Buy 2 Get 1 Free (Save 33%)."
- **Post-Purchase 1-Click Upsells:** Pitch complementary products immediately after payment confirmation without requiring re-entry of card details.`,
    assignment: "Conduct a UX and CRO audit on any existing e-commerce product page, identifying 5 clear friction points and proposing solutions.",
    quiz: [
      {
        question: "If your e-commerce site gets 100,000 visitors at a 1.5% CVR with a $50 AOV, what happens if you lift CVR to 3%?",
        options: [
          "Revenue doubles from $75,000 to $150,000 without needing more traffic",
          "Traffic decreases by 50%",
          "Ad costs quadruple",
          "Profit drops to zero"
        ],
        correctIndex: 0,
        explanation: "Doubling your conversion rate directly doubles total transactions and top-line revenue from the same visitor base."
      },
      {
        question: "What is a 1-Click Post-Purchase Upsell?",
        options: [
          "An offer presented right after checkout that charges the stored payment token with one click without re-entering card info",
          "A pop-up that appears before the user enters the site",
          "A survey asking for customer birthdays",
          "An email sent 30 days later"
        ],
        correctIndex: 0,
        explanation: "Post-purchase upsells leverage high buyer momentum immediately following a transaction, dramatically boosting AOV."
      },
      {
        question: "Where should the primary Call to Action (Add to Cart) sit on mobile PDPs?",
        options: ["Hidden in a dropdown menu", "Above the fold and anchored as a sticky bar at the bottom of the viewport", "At the very bottom of the footer", "Only on the home page"],
        correctIndex: 1,
        explanation: "A sticky Add to Cart button keeps the primary conversion action visible at all times regardless of how far the customer scrolls."
      }
    ]
  },
  {
    id: 12,
    title: "Module 12: B2B Lead Generation & Account-Based Marketing (ABM)",
    duration: "1 hr 45 mins",
    badge: "B2B Pipeline",
    completed: false,
    audioSummary: "Module 12 covers B2B demand generation, Account-Based Marketing (ABM), LinkedIn ad campaign optimization, and cold outreach infrastructure.",
    content: `### 📌 Enterprise B2B Lead Generation & Account-Based Marketing

B2B marketing requires long-term consensus building across multi-stakeholder buying committees. Winning B2B pipelines combine targeted paid acquisition with surgical account-based personalization.

#### 1. The Account-Based Marketing (ABM) Playbook
1. **Tier 1 Accounts (Top 50 Prospects):** Hyper-personalized outreach, custom landing pages, bespoke video teardowns, and targeted 1-to-1 LinkedIn Sponsored Content.
2. **Tier 2 Accounts (Next 250 Prospects):** Industry-specific case studies, gated benchmark reports, and programmatic LinkedIn ad air cover.
3. **Tier 3 Accounts (Broad ICP):** Organic thought leadership, webinars, and automated email nurturing.

#### 2. Cold Outreach Infrastructure
Never send cold outbound emails from your primary corporate domain. Setup secondary domains (e.g. \`getbrandmark.com\`, \`brandmarkhq.com\`), warm up inboxes over 14 days, and limit sends to 30 emails per inbox per day with staggered delays.`,
    assignment: "Identify 10 high-value target B2B accounts in your industry and write a personalized Tier-1 outreach strategy for their VP of Operations.",
    quiz: [
      {
        question: "Why should cold B2B outreach never be sent from your primary business domain?",
        options: [
          "Because secondary domains are faster",
          "To protect your primary corporate domain's sender reputation from spam penalties and blacklisting",
          "Because Google prohibits cold emails entirely",
          "It lowers monthly hosting bills"
        ],
        correctIndex: 1,
        explanation: "Using secondary sending domains insulates your primary business email and domain reputation from potential deliverability issues."
      },
      {
        question: "What characterizes an Account-Based Marketing (ABM) strategy?",
        options: [
          "Treating individual high-value target accounts as individual, customized markets with tailored messaging",
          "Spamming millions of random consumer addresses",
          "Running TV commercials during sports games",
          "Setting up affiliate coupons"
        ],
        correctIndex: 0,
        explanation: "ABM focuses sales and marketing resources on a defined set of high-value enterprise accounts with bespoke personalization."
      },
      {
        question: "What is 'Air Cover' in B2B marketing?",
        options: [
          "Targeted paid display and LinkedIn ads served to employees of target accounts before and during sales outreach",
          "Installing air conditioning in offices",
          "Dropping flyers from helicopters",
          "Encrypting corporate emails with VPNs"
        ],
        correctIndex: 0,
        explanation: "Paid air cover ensures key decision-makers recognize your brand before an Account Executive ever initiates an outbound call."
      }
    ]
  },
  {
    id: 13,
    title: "Module 13: Brand Positioning & Consumer Psychology",
    duration: "1 hr 15 mins",
    badge: "Brand Strategy",
    completed: false,
    audioSummary: "Module 13 delves into cognitive biases, consumer behavioral economics, and how to position your brand to command premium pricing in crowded markets.",
    content: `### 📌 Brand Positioning: How to Escape the Commodity Trap

Features and commodities compete on price; **differentiated brands command pricing power**. To scale profitably, your brand must occupy a distinct, memorable mental territory in your customer's mind.

#### 1. Core Cognitive Biases in Consumer Decision-Making
- **Loss Aversion:** Humans fear losing $100 twice as much as they desire gaining $100. Frame offers in terms of what prospects stand to lose by staying with their current bottleneck.
- **Social Proof & Informational Cascade:** Testimonials, client logos, review star ratings, and real-time purchase counters eliminate perceived risk.
- **Decoy Effect:** Introducing an intentionally structured third option makes your target premium tier appear significantly more economical.
- **The IKEA Effect:** When customers participate in customizing or configuring their solution, their perceived valuation increases dramatically.`,
    assignment: "Identify 3 cognitive biases leveraged by top consumer brands (e.g. Apple, Amazon, Nike) and explain how to apply them to your own offer.",
    quiz: [
      {
        question: "What does the psychological principle of Loss Aversion state?",
        options: [
          "People are motivated more by avoiding loss than by acquiring equivalent gains",
          "People prefer losing money over time",
          "Price increases always lower conversion rates",
          "Customers never read marketing copy"
        ],
        correctIndex: 0,
        explanation: "Behavioral psychology confirms that the pain of losing is psychologically twice as impactful as the pleasure of gaining."
      },
      {
        question: "What is the primary objective of Brand Positioning?",
        options: [
          "To design colorful logo files",
          "To occupy a distinct, credible, and value-differentiated position in the prospect's mind",
          "To be everything to everyone at the lowest price",
          "To avoid advertising"
        ],
        correctIndex: 1,
        explanation: "Positioning defines how you differ from competitors and why your solution is uniquely qualified to solve the customer's problem."
      },
      {
        question: "How does the 'Decoy Effect' influence pricing selection?",
        options: [
          "By introducing an asymmetrical pricing tier that makes the higher-margin target tier the most obvious, attractive choice",
          "By tricking customers into buying items they cannot see",
          "By hiding the prices until checkout",
          "By giving products away for free"
        ],
        correctIndex: 0,
        explanation: "A strategically priced decoy shifts perception, nudging customers toward the more profitable target tier."
      }
    ]
  },
  {
    id: 14,
    title: "Module 14: International Marketing & Multi-Market Localization",
    duration: "1 hr 30 mins",
    badge: "Global Growth",
    completed: false,
    audioSummary: "Module 14 examines global expansion. Learn how to adapt marketing strategies for multi-currency checkouts, cultural nuances, and localized international campaigns.",
    content: `### 📌 Global Scale: Localization & Multi-Currency Expansion

Expanding internationally is the fastest avenue to multiply total addressable market (TAM). However, direct translation without cultural localization leads to wasted ad spend.

#### 1. Localization vs Translation
- **Translation:** Changing English words into Spanish or Arabic words verbatim.
- **Localization:** Adapting imagery, humor, payment methods (e.g. Pix in Brazil, UPI in India, Klarna in Europe), date formats, and regulatory requirements (GDPR in the EU).

#### 2. Multi-Currency Checkout Optimization
Allowing customers to view prices and pay in their local currency increases checkout conversion by up to 33%. Pair local currencies with geo-targeted shipping estimates and localized customer support availability.`,
    assignment: "Create a market entry checklist for launching an established US/UK e-commerce brand into either the Middle East (GCC) or Indian market.",
    quiz: [
      {
        question: "What is the difference between Translation and Localization?",
        options: [
          "Translation only alters vocabulary; localization adapts cultural nuances, imagery, local payment methods, and regulations",
          "They are identical concepts with no difference",
          "Localization only applies to computer hardware",
          "Translation is illegal in the European Union"
        ],
        correctIndex: 0,
        explanation: "Localization encompasses cultural context, preferred local payment gateways, currencies, and customer expectations."
      },
      {
        question: "What payment gateway dominates digital transactions in India?",
        options: ["Cheque payments", "UPI (Unified Payments Interface)", "Bitcoin only", "Money orders"],
        correctIndex: 1,
        explanation: "UPI accounts for the vast majority of digital retail and e-commerce payments across the Indian ecosystem."
      },
      {
        question: "What conversion lift is commonly observed when offering native local currency checkouts?",
        options: ["Up to 33% increase in checkout completion", "Zero change", "Conversion rates drop by 50%", "All visitors bounce"],
        correctIndex: 0,
        explanation: "Removing currency conversion uncertainty builds trust and eliminates foreign exchange surprises at the bank statement level."
      }
    ]
  },
  {
    id: 15,
    title: "Module 15: Capstone Project: Launching an Autonomous 7-Figure Marketing Machine",
    duration: "2 hrs 30 mins",
    badge: "Final Capstone",
    completed: false,
    audioSummary: "Module 15 is your master capstone. Synthesize everything you have learned to architect, build, and deploy an automated, end-to-end multi-channel marketing engine.",
    content: `### 🏆 The Master Capstone: Engineering Your Autonomous Growth Engine

Congratulations on reaching the final module. In this capstone, you will integrate every framework into a unified, high-performance marketing machine.

#### The 5 Pillars of Your Capstone Deliverable
1. **Pillar 1: Audience & Offer Synthesis:** Define your Dream Customer Persona, acute problem statement, and 4-tier Value Ladder.
2. **Pillar 2: Creative & Copy Asset Suite:** 3 GenAI-assisted ad copy variations (AIDA, PAS, BAB) with matching multi-modal visual prompts.
3. **Pillar 3: Conversion Landing Page:** High-converting wireframe with sticky mobile CTA, social proof placement, and Schema markup.
4. **Pillar 4: Automated Lifecycle Infrastructure:** Complete 5-part Welcome Sequence and 3-part Abandoned Cart sequence with technical SPF/DKIM authentication.
5. **Pillar 5: Measurement & Optimization Dashboard:** GA4 custom event tracking schema, UTM naming standard, and weekly ROAS/CAC review scorecard.

Upon successful review and completion of your mock certification test, your official **Mastery Certification** will be unlocked!`,
    assignment: "Submit your comprehensive Capstone Architecture document integrating your Value Ladder, 3 Ad Creatives, Email Flows, and GA4 Tracking Schema.",
    quiz: [
      {
        question: "What is the ultimate goal of combining SEO, Paid Ads, Email Automation, and GenAI into one system?",
        options: [
          "To create an interconnected, predictable, and scalable revenue engine that lowers customer acquisition cost over time",
          "To impress other digital marketers on social media",
          "To maximize the number of open browser tabs",
          "To replace all human employees with chat bots"
        ],
        correctIndex: 0,
        explanation: "An integrated omnichannel marketing machine compounds growth, reducing blended CAC and accelerating business value."
      },
      {
        question: "What should you review on a weekly rhythm to ensure marketing health?",
        options: ["Only total website visitors", "CAC, LTV:CAC ratio, ROAS, and email open/conversion benchmarks", "Number of words typed in blogs", "Desktop wallpaper aesthetics"],
        correctIndex: 1,
        explanation: "Healthy businesses track unit economics: Customer Acquisition Cost, Return on Ad Spend, and lifetime value."
      },
      {
        question: "What unlocks upon completing all course modules and the final certification test?",
        options: ["An official verified Certificate of Completion with your verified credential ID", "A free laptop", "A stock option grant", "A physical trophy sent by mail"],
        correctIndex: 0,
        explanation: "Finishing the masterclass unlocks your verified BrandMark Academy digital certificate with a verifiable credential ID."
      }
    ]
  }
];

export const fullStackModules = [
  {
    id: 1,
    title: "Module 1: JavaScript Mastery, V8 Internals & Async Mechanics",
    duration: "1 hr 45 mins",
    badge: "Core JavaScript",
    completed: true,
    audioSummary: "Welcome to Module 1 of Full Stack Web Development. In this foundational module, we dive under the hood of JavaScript, exploring the V8 engine, call stack, event loop, and asynchronous concurrency.",
    content: `### 📌 Mastering JavaScript: The Engine of the Web

To write enterprise-grade Full Stack applications, you must master how JavaScript operates under the hood inside Google's V8 engine and the Node.js runtime.

#### 1. The Call Stack, Memory Heap & The Event Loop
JavaScript is single-threaded. Understanding the concurrency model is paramount:
- **Call Stack:** Executes synchronous functions in a Last-In, First-Out (LIFO) order.
- **Memory Heap:** Allocates dynamic memory for objects, closures, and arrays.
- **Microtask Queue (High Priority):** Handles \`Promise.then()\`, \`async/await\`, and \`queueMicrotask()\`. Microtasks execute immediately after the current script turn and before any Macrotasks.
- **Macrotask Queue (Task Queue):** Handles \`setTimeout\`, \`setInterval\`, and I/O callbacks.

\`\`\`javascript
console.log('1 - Sync');

setTimeout(() => {
  console.log('4 - Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3 - Microtask (Promise)');
});

console.log('2 - Sync');
// Output: 1 -> 2 -> 3 -> 4
\`\`\`

#### 2. Closures & Lexical Scope in Production
A closure retains access to variables from its outer lexical scope even after the parent function has terminated. This enables data privacy and encapsulation:
\`\`\`javascript
export function createCounter(initialValue = 0) {
  let count = initialValue; // Private state
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}
const counter = createCounter(10);
counter.increment(); // 11
\`\`\`

#### ⚡ Pro Industry Tips
- Never block the Event Loop with heavy synchronous calculations. Offload CPU-bound tasks to Node.js Worker Threads or background job queues.`,
    assignment: "Implement a custom Promise-based concurrency limiter that executes an array of async tasks with a maximum of N concurrent executions.",
    quiz: [
      {
        question: "In the JavaScript Event Loop, which queue takes execution priority?",
        options: ["Macrotask Queue (setTimeout)", "Microtask Queue (Promises / async-await)", "Rendering Paint Queue", "Garbage Collection Queue"],
        correctIndex: 1,
        explanation: "Microtasks (resolved Promises) always drain completely before the event loop processes the next Macrotask."
      },
      {
        question: "What defines a JavaScript Closure?",
        options: [
          "A function bundled together with references to its surrounding lexical state",
          "Closing a browser tab",
          "Terminating a while loop with a break statement",
          "Minifying JavaScript code for production"
        ],
        correctIndex: 0,
        explanation: "Closures allow an inner function to retain access to an outer enclosing function's variables across lifecycles."
      },
      {
        question: "Why does \`0.1 + 0.2 !== 0.3\` evaluate to true in JavaScript?",
        options: [
          "JavaScript uses IEEE 754 double-precision floating-point numbers, leading to binary rounding imprecision",
          "It is a bug in modern browsers",
          "JavaScript integers are capped at 100",
          "The equality operator is deprecated"
        ],
        correctIndex: 0,
        explanation: "Binary floating-point arithmetic cannot represent certain decimal fractions precisely, resulting in 0.30000000000000004."
      }
    ]
  },
  {
    id: 2,
    title: "Module 2: React 18/19 Architecture, Hooks & Concurrency",
    duration: "2 hrs",
    badge: "Frontend Architecture",
    completed: true,
    audioSummary: "Module 2 covers React 18 and 19 component architecture. Master the Virtual DOM diffing reconciliation, custom hook composition, and concurrent rendering features.",
    content: `### 📌 Enterprise React Component Architecture

React treats user interfaces as a mathematical function of application state: \`UI = f(state)\`.

#### 1. Reconciliation & The Fiber Architecture
The Fiber reconciliation algorithm breaks component tree updates into interruptible units of work:
- **Render Phase:** React computes the diff between previous and current virtual DOM representations (pure, side-effect free).
- **Commit Phase:** React applies the calculated mutations to the actual browser DOM (synchronous).

#### 2. Mastering Custom Hooks
Compose reusable stateful logic into isolated hooks:
\`\`\`javascript
import { useState, useEffect } from 'react';

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { ...options, signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP error: \${res.status}\`);
        return res.json();
      })
      .then(json => {
        setData(json);
        setError(null);
      })
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort(); // Automatic cleanup
  }, [url]);

  return { data, loading, error };
}
\`\`\`

#### ⚡ Pro Industry Tips
- Always supply an \`AbortController\` in \`useEffect\` fetch handlers to prevent race conditions and memory leaks when components unmount rapidly.`,
    assignment: "Build a production-grade `useLocalStorage` custom hook that synchronizes state with browser storage and handles window storage events.",
    quiz: [
      {
        question: "What is the purpose of React's AbortController cleanup in useEffect?",
        options: [
          "To format CSS classes",
          "To cancel ongoing HTTP requests when the component unmounts or dependencies change, preventing memory leaks",
          "To delete the user's cookies",
          "To force a hard browser refresh"
        ],
        correctIndex: 1,
        explanation: "Cleaning up with AbortController prevents state updates on unmounted components and cancels obsolete network requests."
      },
      {
        question: "When should `useCallback` be used in React?",
        options: [
          "Wrapped around every function in your codebase without exception",
          "To memoize a callback reference passed to a memoized child component (React.memo) to prevent unnecessary re-renders",
          "Only in backend Node.js files",
          "To replace standard JavaScript promises"
        ],
        correctIndex: 1,
        explanation: "useCallback stabilizes function references across renders, which is useful when passing callbacks to optimized memoized children."
      },
      {
        question: "What does the `useTransition` hook introduced in React 18 accomplish?",
        options: [
          "It marks non-urgent state updates as transitions, keeping the user interface responsive during heavy render workloads",
          "It translates your code into Python",
          "It animates 3D canvas models",
          "It restarts the web server"
        ],
        correctIndex: 0,
        explanation: "useTransition prioritizes immediate input (like typing in a text field) while deferring heavier background re-renders."
      }
    ]
  },
  {
    id: 3,
    title: "Module 3: Advanced State Management (Zustand, Context & Redux)",
    duration: "2 hrs",
    badge: "State Management",
    completed: false,
    audioSummary: "Module 3 explores global state management. Learn when to use React Context versus lightweight stores like Zustand or enterprise solutions like Redux Toolkit.",
    content: `### 📌 Architecting Scalable Frontend State

State management complexity grows exponentially with application scale. Choosing the appropriate state abstraction prevents unnecessary re-render cascades.

#### 1. Why Zustand Outperforms Context for Frequent Updates
React Context re-renders **every single consumer component** whenever any value inside the context object updates. Zustand uses selective subscriptions:
\`\`\`javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (userData, token) => set({ user: userData, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false })
    }),
    { name: 'auth-storage' }
  )
);
\`\`\`

#### 2. Server State vs Client State
Stop storing remote server data in local Redux stores. Separate:
- **Server Cache (TanStack Query / SWR):** Automatic background refetching, caching, deduplication, and optimistic mutations.
- **Client State (Zustand):** UI modals, active theme, sidebar toggles, and multi-step wizard state.`,
    assignment: "Migrate an existing prop-drilled shopping cart feature into a type-safe Zustand store with local storage persistence and subtotal calculation.",
    quiz: [
      {
        question: "Why can React Context lead to performance bottlenecks in high-frequency applications?",
        options: [
          "It disables CSS animations",
          "Every component consuming the context re-renders whenever any property in the context value changes",
          "It uses too much internet bandwidth",
          "It only supports strings and numbers"
        ],
        correctIndex: 1,
        explanation: "React Context lacks selector-level granular subscriptions, causing all consumers to re-render on any context change."
      },
      {
        question: "What is the best practice separation between Server State and Client State?",
        options: [
          "Store everything in one massive global variable",
          "Use tools like React Query/SWR for cached server data, and lightweight stores like Zustand for pure UI client state",
          "Never cache API data",
          "Store all database records in the browser URL"
        ],
        correctIndex: 1,
        explanation: "Separating server caching (with automatic invalidation) from UI state prevents synchronization bugs and bloated client stores."
      },
      {
        question: "How does Zustand achieve granular re-renders?",
        options: [
          "Through selective subscriber hooks that only trigger when the specific selected slice of state mutates",
          "By restarting React after each action",
          "By converting state to HTML strings",
          "By disabling component unmounting"
        ],
        correctIndex: 0,
        explanation: "Zustand uses subscription selectors: 'useStore(state => state.user)' only re-renders when 'state.user' specifically updates."
      }
    ]
  },
  {
    id: 4,
    title: "Module 4: Modern CSS Systems, TailwindCSS & Component Tokens",
    duration: "1 hr 30 mins",
    badge: "Design Systems",
    completed: false,
    audioSummary: "Module 4 covers modern CSS architecture. Master CSS custom property design tokens, responsive fluid typography, and building scalable component libraries with utility-first frameworks.",
    content: `### 📌 Engineering Production Design Systems

A professional frontend architecture relies on strict **Design Tokens** (colors, typography scales, spacing units, and elevations) to maintain aesthetic harmony and dark mode flexibility.

#### 1. CSS Custom Properties as Design Tokens
\`\`\`css
:root {
  --color-primary: #f26a21;
  --color-navy: #0b1f3a;
  --color-surface: #ffffff;
  --font-sans: 'Inter', system-ui, sans-serif;
  --radius-lg: 1rem;
  --shadow-elevation: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
  --color-surface: #0a1120;
  --color-text: #f8fafc;
}
\`\`\`

#### 2. Performance & Layout Stability
- Avoid layout shifts: Always declare explicit \`aspect-ratio\` or \`width\`/\`height\` attributes on media elements to achieve **Cumulative Layout Shift (CLS) = 0**.
- Utilize \`contain: layout paint;\` on heavy dynamic cards to isolate browser recalculations.`,
    assignment: "Create a responsive, accessible Dark/Light mode theme switch using CSS custom properties and custom React theme context.",
    quiz: [
      {
        question: "What is the primary architectural benefit of CSS Custom Properties for theme systems?",
        options: [
          "They can be updated dynamically at runtime via JavaScript or CSS class switches without compiling new stylesheets",
          "They run faster than HTML",
          "They replace the need for media queries",
          "They compress image files automatically"
        ],
        correctIndex: 0,
        explanation: "CSS variables cascade through the DOM and allow instant real-time theme switches with zero build-step overhead."
      },
      {
        question: "How do you prevent Cumulative Layout Shift (CLS) when loading images dynamically?",
        options: [
          "By declaring explicit aspect-ratio or width and height dimensions to reserve space in the layout before the image downloads",
          "By hiding all images with display: none",
          "By only using black and white images",
          "By deleting responsive styles"
        ],
        correctIndex: 0,
        explanation: "Explicit dimensions enable the browser to reserve the exact layout space required, preventing page jumps as images load."
      },
      {
        question: "What does the utility-first CSS approach (e.g. TailwindCSS) prevent in large codebases?",
        options: [
          "CSS stylesheet bloat where dead, unmaintained CSS rules accumulate indefinitely over time",
          "Browser JavaScript execution",
          "Server database connections",
          "User interactions"
        ],
        correctIndex: 0,
        explanation: "Utility-first frameworks reuse a fixed set of classes, capping stylesheet size regardless of how many pages or components are added."
      }
    ]
  },
  {
    id: 5,
    title: "Module 5: Node.js Core, Streams & Asynchronous I/O",
    duration: "2 hrs",
    badge: "Backend Engineering",
    completed: false,
    audioSummary: "Module 5 explores Node.js server internals. Master the Libuv thread pool, streams, buffers, event emitters, and non-blocking I/O.",
    content: `### 📌 Deep Dive: Node.js Core Architecture

Node.js executes JavaScript on top of the Google V8 engine, utilizing the **Libuv C library** to manage non-blocking I/O operations and thread pooling.

#### 1. Streams & Memory Management
Never buffer massive files directly into server RAM with \`fs.readFile()\`. A 2GB file will exhaust the V8 memory heap and crash the server. Always process using **Node.js Streams**:
\`\`\`javascript
const fs = require('fs');
const zlib = require('zlib');

// Stream piping: Memory footprint remains under 30MB regardless of file size
fs.createReadStream('./large-server-logs.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('./large-server-logs.txt.gz'))
  .on('finish', () => console.log('File compressed efficiently via stream!'));
\`\`\`

#### 2. EventEmitters for Decoupled Architectures
Build event-driven sub-systems using Node's native \`EventEmitter\`:
\`\`\`javascript
const EventEmitter = require('events');
class StudentEnrollmentEmitter extends EventEmitter {}

const enrollmentEvents = new StudentEnrollmentEmitter();

// Decoupled listeners
enrollmentEvents.on('student:enrolled', async (student) => {
  await sendWelcomeEmail(student.email);
});
enrollmentEvents.on('student:enrolled', async (student) => {
  await generateAccessCredentials(student._id);
});
\`\`\``,
    assignment: "Build a Node.js streaming utility that reads a large CSV dataset, parses each row, and writes clean JSON objects without exceeding 50MB of memory.",
    quiz: [
      {
        question: "Why should you use Node.js Streams instead of fs.readFile when handling large files?",
        options: [
          "Streams process data in small chunks (buffers), keeping memory usage low and constant regardless of file size",
          "Streams encrypt files automatically",
          "Streams only work on text files",
          "fs.readFile is deprecated in Node.js"
        ],
        correctIndex: 0,
        explanation: "Streams process data piecewise, preventing Out-Of-Memory (OOM) fatal crashes when handling large payloads."
      },
      {
        question: "What C library powers Node.js asynchronous non-blocking I/O and thread pooling?",
        options: ["Libuv", "React Native", "Bcrypt", "Webpack"],
        correctIndex: 0,
        explanation: "Libuv provides Node.js with the cross-platform asynchronous I/O event loop and background thread pool."
      },
      {
        question: "What is an EventEmitter in Node.js?",
        options: [
          "A core class that enables publishing and subscribing to custom named events, decoupling business modules",
          "A device that connects Bluetooth headphones",
          "A tool for creating CSS animations",
          "A database query language"
        ],
        correctIndex: 0,
        explanation: "EventEmitters facilitate pub/sub patterns, allowing decoupled modules to react to lifecycle events independently."
      }
    ]
  },
  {
    id: 6,
    title: "Module 6: Production Express.js, Middleware Pipelines & Security",
    duration: "2 hrs",
    badge: "Backend API",
    completed: false,
    audioSummary: "Module 6 teaches production Express.js engineering. Build robust middleware pipelines, input validation, rate limiting, and centralized error handling.",
    content: `### 📌 Hardening Express.js for Production

A production Express server is an orderly pipeline of middleware intercepting, validating, authenticating, and handling requests.

#### 1. Security Middleware Hardening
\`\`\`javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Security HTTP headers
app.use(helmet());

// NoSQL Injection prevention
app.use(mongoSanitize());

// Rate Limiting (Brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5, // Max 5 login attempts per window
  message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' }
});
app.use('/api/students/login', authLimiter);
\`\`\`

#### 2. Centralized Error Handling Architecture
Never scatter try/catch blocks that return custom error structures. Use an \`AppError\` class and a single global error middleware:
\`\`\`javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = \`\${statusCode}\`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}

// Global error handling middleware (must have 4 arguments)
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
\`\`\``,
    assignment: "Implement an Express authentication middleware that extracts a Bearer JWT, verifies the signature, and attaches the authenticated user to `req.user`.",
    quiz: [
      {
        question: "How does Express differentiate a standard middleware from an Error-Handling middleware?",
        options: [
          "Error-handling middleware takes exactly 4 arguments: (err, req, res, next)",
          "Error middleware must be written in TypeScript",
          "Error middleware must return HTML",
          "By registering it with app.error() instead of app.use()"
        ],
        correctIndex: 0,
        explanation: "Express checks function.length; an error-handling middleware must explicitly accept all 4 parameters: (err, req, res, next)."
      },
      {
        question: "What vulnerability does 'express-mongo-sanitize' prevent?",
        options: [
          "NoSQL query injection attacks that inject operators like '$gt' or '$ne' into request bodies",
          "Cross-Site Scripting (XSS)",
          "SQL injection in PostgreSQL",
          "DDoS bandwidth saturation"
        ],
        correctIndex: 0,
        explanation: "express-mongo-sanitize strips leading '$' characters and dots from req.body and req.params, neutralizing NoSQL operator injections."
      },
      {
        question: "What is the purpose of the Helmet middleware in Express?",
        options: [
          "Sets crucial HTTP security headers like X-Content-Type-Options, Content-Security-Policy, and Strict-Transport-Security",
          "Encrypts all database collections automatically",
          "Compresses video streams",
          "Minifies backend JavaScript"
        ],
        correctIndex: 0,
        explanation: "Helmet configures essential HTTP response headers to defend against clickjacking, MIME-sniffing, and cross-site scripting."
      }
    ]
  },
  {
    id: 7,
    title: "Module 7: MongoDB & Mongoose: Indexing, Aggregations & Transactions",
    duration: "2 hrs 15 mins",
    badge: "Database Mastery",
    completed: false,
    audioSummary: "Module 7 covers MongoDB and Mongoose database engineering. Master compound indexing, aggregation pipelines, multi-document ACID transactions, and schema optimization.",
    content: `### 📌 High-Performance MongoDB Engineering

MongoDB powers modern web backends with schema flexibility and horizontal scale. However, without proper indexing and aggregation architecture, queries will slow down as collections grow to millions of records.

#### 1. Indexing & Query Execution Plans (\`explain()\`)
Without an index, MongoDB performs a **COLLSCAN** (full collection scan), checking every document on disk.
\`\`\`javascript
// Compound index with sort order
studentSchema.index({ email: 1, isActive: -1 });

// Ensure unique index for identity
studentSchema.index({ email: 1 }, { unique: true });
\`\`\`
Always verify queries in MongoDB Compass or shell using \`.explain("executionStats")\` to ensure **nReturned === totalDocsExamined** (IXSCAN).

#### 2. Advanced Aggregation Pipelines
Aggregation pipelines process data through multiple stages (\`$match\`, \`$group\`, \`$lookup\`, \`$project\`):
\`\`\`javascript
// Calculate total revenue and student count per course
const courseStats = await Student.aggregate([
  { $unwind: "$enrolledCourses" },
  {
    $group: {
      _id: "$enrolledCourses.courseId",
      totalStudents: { $sum: 1 },
      courseTitle: { $first: "$enrolledCourses.courseTitle" }
    }
  },
  { $sort: { totalStudents: -1 } }
]);
\`\`\`

#### 3. ACID Transactions in Mongoose
When transferring credits or creating orders across multiple collections, wrap operations in a session transaction:
\`\`\`javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Student.updateOne({ _id: studentId }, { $inc: { credits: -10 } }, { session });
  await Order.create([{ studentId, amount: 10 }], { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
\`\`\``,
    assignment: "Write a Mongoose aggregation pipeline that groups student enrollments by month, calculates monthly cohort retention, and outputs summary statistics.",
    quiz: [
      {
        question: "What is the difference between a COLLSCAN and an IXSCAN in MongoDB query execution stats?",
        options: [
          "COLLSCAN scans every document in the collection; IXSCAN uses an index to locate matching documents in milliseconds",
          "COLLSCAN is faster than IXSCAN",
          "IXSCAN is only used for image files",
          "There is no difference"
        ],
        correctIndex: 0,
        explanation: "COLLSCAN examines all documents sequentially; IXSCAN traverses a B-tree index, drastically reducing disk I/O and query latency."
      },
      {
        question: "What aggregation pipeline stage is used to perform a left outer join between two collections?",
        options: ["$join", "$lookup", "$merge", "$connect"],
        correctIndex: 1,
        explanation: "The '$lookup' stage performs an equality match between a local field and a foreign collection field, pulling in related documents."
      },
      {
        question: "Why are MongoDB Transactions essential when executing multi-document financial operations?",
        options: [
          "They ensure all database mutations either succeed together or rollback completely, preserving data consistency",
          "They convert MongoDB into PostgreSQL",
          "They eliminate the need for schema definitions",
          "They double server bandwidth"
        ],
        correctIndex: 0,
        explanation: "ACID transactions guarantee atomicity: if any step fails, all intermediate mutations are rolled back cleanly."
      }
    ]
  },
  {
    id: 8,
    title: "Module 8: RESTful API Architecture, JWT Authentication & RBAC",
    duration: "2 hrs",
    badge: "API Architecture",
    completed: false,
    audioSummary: "Module 8 covers secure RESTful API design. Learn how to implement stateless JWT authentication, HTTP-only cookie storage, role-based access control, and API versioning.",
    content: `### 📌 Secure REST API Design & Role-Based Access Control (RBAC)

A clean REST API is intuitive, stateless, and rigorously secured using modern token authentication and authorization layers.

#### 1. Stateless Authentication: Access Tokens + Refresh Tokens
- **Access Token (Short-lived, e.g., 15 mins):** Signed with \`JWT_SECRET\`. Contains non-sensitive claims (user ID, role). Transmitted in the \`Authorization: Bearer <token>\` header.
- **Refresh Token (Long-lived, e.g., 7 days):** Stored securely inside an \`httpOnly\`, \`Secure\`, \`SameSite=Strict\` cookie, invulnerable to cross-site scripting (XSS) theft. Used to request a new access token without logging the user out.

#### 2. Declarative Role-Based Access Control (RBAC)
\`\`\`javascript
// Role authorization middleware factory
export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};

// Route protection usage:
router.delete('/courses/:id', authMiddleware, restrictTo('admin', 'superadmin'), deleteCourseHandler);
\`\`\``,
    assignment: "Build a complete Authentication Controller featuring registration, password hashing with bcrypt, JWT signing, login, and an RBAC middleware.",
    quiz: [
      {
        question: "Why should Refresh Tokens be stored in httpOnly cookies rather than localStorage?",
        options: [
          "httpOnly cookies cannot be read or stolen by malicious client-side JavaScript executing during an XSS attack",
          "Cookies hold larger data payloads than localStorage",
          "localStorage is deprecated in modern browsers",
          "Cookies only work on secure HTTPS servers"
        ],
        correctIndex: 0,
        explanation: "Storing sensitive authentication tokens in httpOnly cookies prevents token exfiltration via Cross-Site Scripting (XSS) vulnerabilities."
      },
      {
        question: "What is the difference between Authentication (401) and Authorization (403)?",
        options: [
          "Authentication verifies WHO you are; Authorization verifies WHAT permissions you possess",
          "They are identical HTTP terms",
          "401 means server offline; 403 means server rebooting",
          "Authorization is only used in banking software"
        ],
        correctIndex: 0,
        explanation: "Authentication validates identity (credentials check); authorization verifies whether that identified user has permission for a specific resource."
      },
      {
        question: "What is contained within a JWT payload?",
        options: [
          "Base64URL-encoded JSON claims that can be read by anyone, meaning passwords must NEVER be placed inside it",
          "Encrypted military secrets that cannot be read",
          "The complete user database table",
          "The compiled backend server code"
        ],
        correctIndex: 0,
        explanation: "JWT payloads are encoded, not encrypted. Anyone can decode and view the claims, so passwords and secrets must never be included."
      }
    ]
  },
  {
    id: 9,
    title: "Module 9: Real-Time WebSockets & Event-Driven Systems with Socket.io",
    duration: "1 hr 45 mins",
    badge: "Real-Time Systems",
    completed: false,
    audioSummary: "Module 9 teaches bidirectional real-time communications. Build low-latency live features with WebSockets, Socket.io rooms, online presence tracking, and heartbeat connections.",
    content: `### 📌 Real-Time Web: WebSockets vs HTTP Polling

Standard HTTP requests operate on a request-response cycle: the client asks, the server answers, and the TCP connection closes. WebSockets establish an **open, persistent, bi-directional TCP socket** between client and server.

#### 1. Setting Up Socket.io in Express
\`\`\`javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'https://brandmarksolutions.site' }
});

io.on('connection', (socket) => {
  console.log('Student connected to real-time tutor socket:', socket.id);

  // Join a specific course study room
  socket.on('join_course_room', (courseId) => {
    socket.join(courseId);
    socket.to(courseId).emit('user_joined', { userId: socket.id });
  });

  // Handle live message broadcast
  socket.on('send_question', ({ courseId, message }) => {
    io.to(courseId).emit('new_message', { sender: socket.id, message, timestamp: new Date() });
  });

  socket.on('disconnect', () => {
    console.log('Student disconnected:', socket.id);
  });
});
\`\`\``,
    assignment: "Build a real-time student study room with Socket.io where users can join a room, see an active member counter, and exchange live messages.",
    quiz: [
      {
        question: "What is the primary operational advantage of WebSockets over HTTP Long-Polling?",
        options: [
          "WebSockets maintain a single persistent bi-directional connection, eliminating repetitive HTTP header overhead and latency",
          "WebSockets require no server software",
          "WebSockets make databases run twice as fast",
          "WebSockets only work on mobile devices"
        ],
        correctIndex: 0,
        explanation: "WebSockets eliminate the overhead of repeated TCP handshakes and HTTP headers, achieving sub-10ms bidirectional messaging."
      },
      {
        question: "In Socket.io, what is a 'Room'?",
        options: [
          "An arbitrary server-side channel that sockets can join and leave, allowing targeted multicasting of events to subsets of clients",
          "A physical conference room in an office",
          "A MongoDB collection type",
          "A CSS layout grid"
        ],
        correctIndex: 0,
        explanation: "Socket.io rooms are virtual groupings that enable broadcasting messages only to clients subscribed to that specific identifier."
      },
      {
        question: "How does Socket.io detect when a client loses internet connection unexpectedly?",
        options: [
          "Using periodic Heartbeat (ping/pong) packets between client and server",
          "By waiting 48 hours",
          "By calling the user's phone",
          "Through browser cookies"
        ],
        correctIndex: 0,
        explanation: "Socket.io continuously exchanges ping/pong heartbeats; if a client fails to reply within the timeout window, the socket disconnects."
      }
    ]
  },
  {
    id: 10,
    title: "Module 10: GenAI Engineering: LLM APIs, Structured Outputs & Streaming",
    duration: "2 hrs 15 mins",
    badge: "Gen AI Integration",
    completed: false,
    audioSummary: "Module 10 dives into GenAI software engineering. Learn how to integrate OpenAI and Gemini APIs, implement server-sent event (SSE) streaming responses, and enforce structured JSON schemas.",
    content: `### 📌 Engineering Generative AI into Full Stack Applications

Integrating LLMs into production software requires far more than basic text prompts. You must master **Server-Sent Events (SSE) streaming**, **Token optimization**, and **Deterministic Structured Outputs (JSON Schema)**.

#### 1. Real-Time Streaming with Server-Sent Events (SSE)
Never force users to stare at a spinner for 15 seconds while an LLM generates a 500-word response. Stream tokens into the UI in real time:
\`\`\`javascript
// Backend Express Streaming Route
app.post('/api/ai/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: req.body.prompt }],
    stream: true
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || '';
    res.write(\`data: \${JSON.stringify({ token })}\\n\\n\`);
  }

  res.write('data: [DONE]\\n\\n');
  res.end();
});
\`\`\`

#### 2. Guaranteed JSON Structured Outputs
When building AI features, the output must be programmatically parseable. Use function calling or structured JSON schemas to prevent syntax errors:
\`\`\`javascript
const response = await openai.chat.completions.create({
  model: 'gpt-4o-2024-08-06',
  messages: [{ role: 'user', content: 'Extract student details' }],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'StudentSchema',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          skills: { type: 'array', items: { type: 'string' } },
          experienceYears: { type: 'number' }
        },
        required: ['name', 'skills', 'experienceYears'],
        additionalProperties: false
      }
    }
  }
});
\`\`\``,
    assignment: "Build a Full-Stack AI feature where a React frontend streams an LLM response word-by-word from an Express SSE endpoint.",
    quiz: [
      {
        question: "What is the primary UX advantage of streaming LLM responses via Server-Sent Events (SSE)?",
        options: [
          "It lowers Time To First Token (TTFT), showing the user immediate results within milliseconds rather than waiting for full generation",
          "It uses zero tokens",
          "It works without an internet connection",
          "It encrypts the browser screen"
        ],
        correctIndex: 0,
        explanation: "Streaming tokens allows users to read output as it generates, making the application feel instantaneous and responsive."
      },
      {
        question: "Why should you use Structured JSON Outputs instead of standard text generation when building AI workflows?",
        options: [
          "Because standard text generation often returns conversational filler or invalid JSON that breaks backend parsing",
          "Because JSON uses less memory than plain English",
          "Because databases refuse to save strings",
          "It reduces server hardware costs by 90%"
        ],
        correctIndex: 0,
        explanation: "Structured outputs strictly enforce schema validation at the model level, guaranteeing reliable programmatic consumption."
      },
      {
        question: "What header is required for an Express endpoint to stream Server-Sent Events (SSE)?",
        options: ["Content-Type: text/event-stream", "Content-Type: application/pdf", "Content-Type: image/png", "Content-Type: audio/mp3"],
        correctIndex: 0,
        explanation: "The 'text/event-stream' MIME type instructs the client browser to maintain an open HTTP stream and process incoming chunks."
      }
    ]
  },
  {
    id: 11,
    title: "Module 11: Enterprise RAG Architecture & Vector Databases",
    duration: "2 hrs 30 mins",
    badge: "Vector Search & RAG",
    completed: false,
    audioSummary: "Module 11 teaches Retrieval-Augmented Generation (RAG). Learn document chunking strategies, vector embeddings, semantic search with Pinecone and pgvector, and hallucination reduction.",
    content: `### 📌 Enterprise RAG (Retrieval-Augmented Generation)

LLMs suffer from context window limitations and training data cutoff dates. RAG connects enterprise databases, documentation, and proprietary knowledge directly to the LLM's reasoning engine without fine-tuning.

#### 1. The RAG Ingestion Pipeline
1. **Document Ingestion:** Extract raw text from PDFs, Notion docs, or databases.
2. **Semantic Chunking:** Split text into chunks (e.g. 500 tokens with 50-token overlap) to preserve contextual boundaries.
3. **Embedding Generation:** Transform each text chunk into a high-dimensional mathematical vector (e.g. 1536-dimension float array via OpenAI \`text-embedding-3-small\`).
4. **Vector Database Indexing:** Store vectors and text metadata into Pinecone, Weaviate, or pgvector (PostgreSQL).

#### 2. Querying & Synthesis Pipeline
When a user asks: *"How do I reset my account password?"*
1. Embed the query into a vector.
2. Compute **Cosine Similarity** to retrieve top-k matching document chunks.
3. Inject matching chunks into the system prompt:
\`\`\`markdown
You are the BrandMark Academy Support AI.
Answer the student's question using ONLY the provided verified context.
If the context does not contain the answer, say "I don't know based on the provided material."

[VERIFIED CONTEXT]:
\${retrievedChunks.map(c => c.text).join('\\n\\n')}

[STUDENT QUESTION]:
\${userQuery}
\`\`\``,
    assignment: "Build an end-to-end RAG script in Node.js that embeds 3 knowledge articles, stores them in memory, and answers user queries using cosine similarity.",
    quiz: [
      {
        question: "What is a Vector Embedding in AI engineering?",
        options: [
          "A high-dimensional array of numbers that captures the semantic meaning and conceptual relationships of a text passage",
          "A 3D CAD graphic model",
          "A type of CSS animation",
          "A database primary key string"
        ],
        correctIndex: 0,
        explanation: "Embeddings represent text concepts as coordinates in mathematical space where conceptually similar ideas sit close together."
      },
      {
        question: "Why is 'Chunk Overlap' recommended when splitting documents for RAG?",
        options: [
          "To ensure that sentences or ideas spanning the boundary between two chunks are not severed and lost in translation",
          "To duplicate database size intentionally",
          "To slow down the embedding model",
          "To encrypt the documents twice"
        ],
        correctIndex: 0,
        explanation: "Chunk overlap preserves continuity and semantic context across boundaries, preventing vital context from being split in half."
      },
      {
        question: "How does RAG prevent LLM Hallucinations?",
        options: [
          "By grounding the LLM's generation strictly within verified, retrieved enterprise source documents",
          "By turning off the model's neural network",
          "By running the code on a quantum computer",
          "By limiting answers to 3 words"
        ],
        correctIndex: 0,
        explanation: "Grounding the model with authoritative retrieved context forces it to synthesize facts rather than invent fabricated details."
      }
    ]
  },
  {
    id: 12,
    title: "Module 12: Autonomous AI Coding Agents & Multi-Agent Orchestration",
    duration: "2 hrs",
    badge: "AI Agents",
    completed: false,
    audioSummary: "Module 12 explores autonomous AI agents. Learn how to implement tool calling, ReAct reasoning loops, and multi-agent coordination using LangChain and LangGraph.",
    content: `### 📌 Autonomous AI Agents: Reasoning & Tool Use

An AI Agent differs from a chatbot in one fundamental way: **it can execute actions in the external world**. An agent observes its environment, reasons about goals, selects tools, and loops until the objective is accomplished.

#### 1. The ReAct (Reasoning + Acting) Framework
The agent operates in a continuous cognitive loop:
- **Thought:** The model analyzes the current state and decides what information is missing.
- **Action:** The model calls an external tool (e.g., query database, check weather, send email).
- **Observation:** The model inspects the tool's execution result.
- **Final Answer:** Once all steps are resolved, the agent formulates its final deliverable.

#### 2. Building a Custom Tool Calling Agent in Node.js
\`\`\`javascript
const tools = [
  {
    type: 'function',
    function: {
      name: 'enrollStudentInCourse',
      description: 'Enrolls a student in a specific course in the database',
      parameters: {
        type: 'object',
        properties: {
          studentEmail: { type: 'string' },
          courseId: { type: 'string' }
        },
        required: ['studentEmail', 'courseId']
      }
    }
  }
];
\`\`\``,
    assignment: "Implement an autonomous Node.js agent loop with 2 executable tools (Calculator tool and Database Query tool) using LLM function calling.",
    quiz: [
      {
        question: "What differentiates an Autonomous AI Agent from a traditional conversational chatbot?",
        options: [
          "An agent has access to external tools, API execution capabilities, and a reasoning loop to accomplish multi-step objectives autonomously",
          "Agents are written in HTML",
          "Agents don't use Large Language Models",
          "Chatbots can only speak Spanish"
        ],
        correctIndex: 0,
        explanation: "Agents possess agency: they decide which tools to call, inspect outcomes, and iterate through plans dynamically."
      },
      {
        question: "What does the 'ReAct' framework in agentic AI stand for?",
        options: ["Reasoning and Acting", "React.js Framework", "Reactive Programming", "Recursive Actions"],
        correctIndex: 0,
        explanation: "ReAct combines verbal reasoning traces ('Thought') with task-specific actions ('Action') to produce grounded decisions."
      },
      {
        question: "What happens when an LLM decides to call a Tool?",
        options: [
          "The model outputs a structured payload specifying the tool name and arguments; your backend code executes the function and feeds the output back",
          "The LLM secretly logs into your computer directly",
          "The model shuts down the database",
          "The user is disconnected immediately"
        ],
        correctIndex: 0,
        explanation: "The LLM generates structured tool parameters; your application executes the corresponding function securely and returns the result."
      }
    ]
  },
  {
    id: 13,
    title: "Module 13: Enterprise Testing & CI/CD Pipelines (Jest, Supertest & Playwright)",
    duration: "1 hr 45 mins",
    badge: "Quality Assurance",
    completed: false,
    audioSummary: "Module 13 covers professional software testing. Master unit testing with Jest, API integration tests with Supertest, end-to-end browser automation with Playwright, and GitHub Actions CI/CD.",
    content: `### 📌 Enterprise Testing & Continuous Delivery (CI/CD)

Untested software is broken by definition. A professional engineering team deploys code with high confidence using a robust **Testing Pyramid**:
1. **Unit Tests (Jest / Vitest):** Fast, isolated tests for pure functions, utilities, and custom hooks.
2. **Integration Tests (Supertest):** Test Express API endpoints against an in-memory database, verifying status codes, headers, and database mutations.
3. **End-to-End Tests (Playwright / Cypress):** Real browser automation validating full user journeys (Signup ➔ Payment ➔ Dashboard).

#### 1. Testing Express Endpoints with Supertest
\`\`\`javascript
const request = require('supertest');
const app = require('../server');

describe('POST /api/students/register', () => {
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/students/register')
      .send({ email: 'incomplete@example.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
\`\`\`

#### 2. GitHub Actions Automated Pipeline (\`.github/workflows/deploy.yml\`)
Automate linting, unit tests, and deployments on every push to \`main\`.`,
    assignment: "Write 3 unit tests and 2 Supertest integration tests for a student login endpoint, verifying successful login and invalid password handling.",
    quiz: [
      {
        question: "What is the primary role of Supertest in Node.js backend testing?",
        options: [
          "Allows making simulated HTTP requests to Express applications without binding to a physical network port",
          "Tests CSS color contrast",
          "Benchmarks server CPU temperature",
          "Installs npm packages"
        ],
        correctIndex: 0,
        explanation: "Supertest tests HTTP endpoints programmatically, validating route status codes, response headers, and payloads with ease."
      },
      {
        question: "In the Testing Pyramid, which tier should comprise the highest quantity of tests?",
        options: ["Manual exploratory tests", "Fast, deterministic Unit Tests", "Heavy End-to-End browser tests", "Load stress tests"],
        correctIndex: 1,
        explanation: "Unit tests are fast, cheap, and isolated, forming the wide, solid foundation of the testing pyramid."
      },
      {
        question: "What is the objective of a Continuous Integration (CI) pipeline?",
        options: [
          "Automatically building, linting, and running all tests on every code commit to catch bugs before merging into production",
          "Deleting old database records daily",
          "Rewriting legacy code into Python",
          "Sending promotional emails to customers"
        ],
        correctIndex: 0,
        explanation: "CI pipelines run automated test suites on every pull request, safeguarding code quality and preventing regressions."
      }
    ]
  },
  {
    id: 14,
    title: "Module 14: Docker Containerization, Cloud Deployment & Kubernetes",
    duration: "2 hrs",
    badge: "DevOps & Cloud",
    completed: false,
    audioSummary: "Module 14 examines cloud DevOps. Learn how to containerize Full Stack applications with Docker, multi-stage production builds, environment secrets management, and cloud deployments.",
    content: `### 📌 Cloud Architecture & Docker Containerization

"It works on my machine" is not an acceptable engineering excuse. **Docker containers** bundle an application with its exact OS dependencies, libraries, and Node runtime, guaranteeing identical behavior across development and production.

#### 1. Multi-Stage Production Dockerfile
\`\`\`dockerfile
# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Stage 2: Minimal Production Image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./
EXPOSE 5000
USER node
CMD ["node", "server.js"]
\`\`\`

#### 2. Twelve-Factor App Principles
- **Config:** Store all secrets, database credentials, and API keys strictly in environment variables.
- **Stateless Processes:** Treat backend server instances as disposable; persist state into external databases (MongoDB) or caches (Redis).`,
    assignment: "Write a multi-stage Dockerfile and a docker-compose.yml file that launches both an Express backend and a MongoDB database container.",
    quiz: [
      {
        question: "What is the primary benefit of a Multi-Stage Dockerfile?",
        options: [
          "It discards build tools, compiler caches, and devDependencies from the final image, resulting in lightweight, secure production containers",
          "It allows running Windows inside Linux",
          "It bypasses all cloud hosting fees",
          "It automatically updates node version"
        ],
        correctIndex: 0,
        explanation: "Multi-stage builds separate compilation tools from the runtime image, drastically reducing container size and attack surface."
      },
      {
        question: "Why should Docker containers run under a non-root user (USER node)?",
        options: [
          "To enforce the principle of least privilege and defend against container breakout vulnerabilities",
          "Because root users cannot connect to the internet",
          "It makes the image build 10x faster",
          "It is required by CSS stylesheets"
        ],
        correctIndex: 0,
        explanation: "Running as non-root ensures that an attacker who compromises the application cannot gain root access to the host machine."
      },
      {
        question: "According to the Twelve-Factor App methodology, where should application configuration and secrets reside?",
        options: ["Hardcoded in Git repository source code", "Strictly in Environment Variables injected at runtime", "Inside public HTML comments", "In text files on the desktop"],
        correctIndex: 1,
        explanation: "Twelve-factor architecture mandates injecting credentials via environment variables, decoupling code from deployment environments."
      }
    ]
  },
  {
    id: 15,
    title: "Module 15: Capstone: Building & Deploying an Enterprise AI SaaS Platform",
    duration: "3 hrs",
    badge: "Final Capstone",
    completed: false,
    audioSummary: "Module 15 is your final engineering capstone. Integrate your full stack skills to architect, build, and deploy a complete AI-powered SaaS product with auth, database, streaming, and billing.",
    content: `### 🏆 The Engineering Capstone: Launching an AI SaaS Platform

Congratulations on completing the Full Stack + GenAI curriculum. In this capstone, you will architect, develop, test, and deploy a complete, production-ready AI SaaS platform.

#### The 5 Pillars of Your Full-Stack SaaS Deliverable
1. **Pillar 1: System Architecture & Data Schema:** Robust Mongoose schemas with indexing, user authentication, and subscription tier models.
2. **Pillar 2: Secure API & Business Logic:** RESTful endpoints protected by JWT authentication, RBAC, and rate limiting.
3. **Pillar 3: GenAI Streaming & RAG Integration:** Server-Sent Events (SSE) streaming with OpenAI or Gemini, coupled with vector document retrieval.
4. **Pillar 4: Modern React 18/19 Frontend:** Sleek, responsive user dashboard with dark mode, Zustand state management, and real-time WebSocket notifications.
5. **Pillar 5: Production Deployment & CI/CD:** Automated Docker build, cloud deployment on Vercel/Render, and a passing automated test suite.

Completing this capstone demonstrates verified readiness for senior full-stack engineering and AI integration roles. Upon completion of the mock test, your official **Mastery Certification** will unlock!`,
    assignment: "Submit the GitHub repository URL and live deployed URL of your completed Full Stack + GenAI SaaS Capstone project.",
    quiz: [
      {
        question: "What are the core technical components of a modern AI SaaS application?",
        options: [
          "A secure auth system, database persistence, streaming LLM API integration, responsive stateful frontend, and subscription billing",
          "Only an HTML file with basic text",
          "A static WordPress blog without a database",
          "A command line script that prints text"
        ],
        correctIndex: 0,
        explanation: "Enterprise AI SaaS products unify identity, database persistence, streaming AI models, modern UI, and recurring monetization."
      },
      {
        question: "How do you ensure your production SaaS remains resilient during traffic spikes?",
        options: [
          "Stateless server architecture, database indexing, rate limiting, connection pooling, and CDN caching",
          "Rebooting servers every hour",
          "Disabling database transactions",
          "Removing all CSS styles"
        ],
        correctIndex: 0,
        explanation: "Stateless architectures paired with database pooling, indexing, and CDN edge caching handle scaling gracefully."
      },
      {
        question: "What verifies your official graduation from the BrandMark Full Stack + GenAI Masterclass?",
        options: [
          "Passing all module quizzes, completing the final mock test, and receiving your cryptographically verifiable Certificate of Mastery",
          "Sending an email to customer support",
          "Visiting the course page twice",
          "Leaving a review on Google"
        ],
        correctIndex: 0,
        explanation: "Finishing the comprehensive curriculum unlocks your verified BrandMark Academy digital certificate with a verifiable credential ID."
      }
    ]
  }
];
