-- Supabase Schema for Public Blogs

CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT,
    primary_keyword TEXT,
    search_intent TEXT,
    author TEXT DEFAULT 'BrandMark Team',
    schema_type TEXT DEFAULT 'Article',
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    date_published TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial blogs from previous static JSON
INSERT INTO public.blogs (title, slug, category, primary_keyword, search_intent, author, schema_type, content)
VALUES
('The Ultimate Guide to Digital Marketing in Patna', 'digital-marketing-patna-guide', 'Local SEO', 'digital marketing Patna', 'Informational & Commercial', 'Rahul Singh Rajput', 'Article', '
# The Ultimate Guide to Digital Marketing in Patna (2026 Edition)

[Introduction: Hook the reader. Explain why Patna is rapidly digitizing and why traditional marketing (billboards/flyers) is no longer enough. Establish BrandMark Solutions as the leading authority in this transition.]

## 1. Why Patna Businesses Need a Digital-First Strategy
[Explain the macro-economic shift. Discuss smartphone penetration in Bihar, changing consumer habits, and why local businesses are losing market share to digitally native competitors.]

## 2. Core Pillars of a Successful Digital Campaign
[Break down the technical components.]

### A. Local SEO & Google Business Profiles
[Explain what the Local Map Pack is. Give actionable tips on how a restaurant or clinic in Patna can optimize their GBP profile (reviews, accurate NAP data, local citations).]

### B. High-Converting Web Design (Core Web Vitals)
[Explain that a website is a 24/7 salesperson. Discuss why speed matters (LCP/INP) and why responsive, mobile-first design is critical for the North Indian market.]

### C. Performance Marketing (Meta & Google Ads)
[Discuss the difference between intent-based search (Google) and interruption-based social ads (Meta). When should a Patna real estate developer use Google vs Facebook?]

## 3. Top Digital Marketing Mistakes Local Businesses Make
[Build trust by showing you understand their pain points.]
- **Mistake 1:** Buying fake Instagram followers instead of generating actual leads.
- **Mistake 2:** Ignoring website load speed (losing 50% of traffic before the page loads).
- **Mistake 3:** Failing to track ROI and Cost-Per-Acquisition (CPA).

## 4. Case Studies: Success Stories from Bihar
[Link directly to 2-3 specific case studies demonstrating real results.]
- *See how we scaled a [Local Clinic''s] patient inquiries by 300%.*
- *Read our breakdown on generating 500+ leads for a [Patna Developer].*

## 5. How to Choose the Right Agency
[Set the buying criteria in your favor. Emphasize transparency, technical expertise, and measurable ROI over vanity metrics.]

## 6. Conclusion & Next Steps
[Summarize the value. Push towards the primary CTA.]
The digital landscape in Bihar is evolving fast. Don''t let your competitors capture your market share.

**Ready to dominate your local market?**
[**Book a Free Strategy Audit with BrandMark Solutions**](/contact)

---
*Related Topics:*
- [Link to Cluster Article: Local SEO Checklist]
- [Link to Cluster Article: Meta Ads Strategy]
- [Link to Industry Page: Real Estate Marketing]
'),
('Why Real Estate Developers in Bihar Need a 3D Walkthrough Website', 'real-estate-3d-walkthrough-websites-bihar', 'Web Development', '3D walkthrough website real estate', 'Commercial Investigation', 'Rajeshree Shekhar', 'BlogPosting', '
# Why Real Estate Developers in Bihar Need a 3D Walkthrough Website

[Introduction: Introduce the specific pain point. High-ticket buyers are busy. Site visits are dropping. How do you sell a premium property in Patna without forcing a physical visit immediately?]

## The Shift in Real Estate Consumer Behavior
[Provide data/statistics. Explain how 80%+ of home buyers start their journey online. If your website just has flat 2D floor plans, you are losing conversions to developers who offer immersive digital experiences.]

## What is a 3D Walkthrough Integration?
[Explain the technical side simply. Distinguish between a cheap video tour and a fully interactive, WebGL-based virtual environment embedded directly into the React/Vite frontend.]

## 3 Core Benefits of 3D Web Design for Developers

### 1. Massive Increase in Time-on-Site (SEO Signal)
[Explain that when users interact with a 3D model, they stay on the page for 3-5 minutes. Google''s algorithm rewards this high dwell time by pushing the site higher in search rankings.]

### 2. Higher Quality Lead Qualification
[Explain that someone who spends 5 minutes virtually walking through a flat is a significantly warmer lead than someone who just scrolled past an Instagram ad. Your sales team wastes less time.]

### 3. Pre-Selling Under-Construction Projects
[Explain how 3D web design allows you to sell the vision before the brick is even laid, accelerating cash flow.]

## How BrandMark Solutions Builds Real Estate Engines
[Detail our specific expertise in UI/UX and React development. Mention that our sites load blazingly fast (Core Web Vitals) even with heavy 3D assets because of advanced lazy-loading and code-splitting.]

## Conclusion
A website is no longer just a digital brochure; it is your primary sales engine. Upgrading to an immersive experience is the fastest way to out-position legacy developers in Bihar.

**Want to see a live demo of a high-converting real estate platform?**
[**Talk to Mark Today**](/contact)

---
*Back to Pillar:* [The Ultimate Guide to Digital Marketing in Patna]
*Related Industry:* [Real Estate Marketing Services]
') ON CONFLICT (slug) DO NOTHING;

-- Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published blogs
CREATE POLICY "Public Read Access Published Blogs" ON public.blogs 
FOR SELECT USING (status = 'published');

-- Allow Service Role full access (for automated n8n publishing)
CREATE POLICY "Service Role Full Access on blogs" ON public.blogs 
FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Allow Admin full access
CREATE POLICY "Admin All Access on blogs" ON public.blogs 
FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
