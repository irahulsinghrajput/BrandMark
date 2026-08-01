-- Supabase Schema for Module 7: AI Marketing Automation Engine

-- Table: campaigns
-- High-level representation of a marketing push
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    objective TEXT NOT NULL, -- e.g., 'Lead Gen', 'Brand Awareness', 'SEO'
    target_audience TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'pending_approval', 'scheduled', 'active', 'completed', 'paused', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: campaign_assets
-- Individual generated pieces of content (email, blog, social)
CREATE TABLE IF NOT EXISTS public.campaign_assets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('email', 'blog', 'linkedin', 'facebook', 'instagram', 'twitter', 'google_ads', 'meta_ads')),
    content TEXT NOT NULL,
    media_url TEXT, -- optional image/video link
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: campaign_approvals
-- Audit trail for manual approvals (Nothing publishes without approval)
CREATE TABLE IF NOT EXISTS public.campaign_approvals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    approver_id TEXT NOT NULL, -- Admin User ID
    status TEXT NOT NULL CHECK (status IN ('approved', 'rejected')),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: campaign_schedule
-- Controls exactly when approved assets fire
CREATE TABLE IF NOT EXISTS public.campaign_schedule (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    asset_id UUID NOT NULL REFERENCES public.campaign_assets(id) ON DELETE CASCADE,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    publish_status TEXT NOT NULL DEFAULT 'scheduled' CHECK (publish_status IN ('scheduled', 'published', 'failed')),
    platform_post_id TEXT, -- e.g., LinkedIn Urn, Tweet ID
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: campaign_metrics
-- Analytics tracking per asset
CREATE TABLE IF NOT EXISTS public.campaign_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    asset_id UUID NOT NULL REFERENCES public.campaign_assets(id) ON DELETE CASCADE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    engagement_rate NUMERIC DEFAULT 0.0,
    cost_per_click NUMERIC DEFAULT 0.0, -- for ads
    revenue_attributed NUMERIC DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: campaign_logs
-- System logs for n8n automation visibility
CREATE TABLE IF NOT EXISTS public.campaign_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- e.g., 'generation_started', 'published_to_linkedin'
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_logs ENABLE ROW LEVEL SECURITY;

-- Service Role (n8n) Full Access
CREATE POLICY "Service Role Full Access on campaigns" ON public.campaigns FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on campaign_assets" ON public.campaign_assets FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on campaign_approvals" ON public.campaign_approvals FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on campaign_schedule" ON public.campaign_schedule FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on campaign_metrics" ON public.campaign_metrics FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on campaign_logs" ON public.campaign_logs FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin Only Access
CREATE POLICY "Admin All Access campaigns" ON public.campaigns FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All Access campaign_assets" ON public.campaign_assets FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All Access campaign_approvals" ON public.campaign_approvals FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All Access campaign_schedule" ON public.campaign_schedule FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All Access campaign_metrics" ON public.campaign_metrics FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All Access campaign_logs" ON public.campaign_logs FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
