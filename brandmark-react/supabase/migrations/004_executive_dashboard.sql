-- Supabase Schema for Module 5: Executive Revenue Dashboard

-- Table: dashboard_metrics (Live key-value store for single-stat metrics)
CREATE TABLE IF NOT EXISTS public.dashboard_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    metric_key TEXT UNIQUE NOT NULL,
    metric_value NUMERIC NOT NULL,
    metric_category TEXT NOT NULL CHECK (metric_category IN ('sales', 'website', 'seo', 'gbp', 'ads', 'proposals', 'clients', 'revenue')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: dashboard_snapshots (Time-series data for charting)
CREATE TABLE IF NOT EXISTS public.dashboard_snapshots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    metric_key TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(snapshot_date, metric_key)
);

-- Table: executive_reports (AI Generated Summaries)
CREATE TABLE IF NOT EXISTS public.executive_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT DEFAULT 'Executive Report',
    frequency TEXT DEFAULT 'monthly' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    recipients TEXT[],
    is_active BOOLEAN DEFAULT true,
    report_date DATE UNIQUE DEFAULT CURRENT_DATE,
    ai_summary TEXT,
    growth_trends JSONB,
    revenue_risks JSONB,
    recommended_actions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Setup
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_reports ENABLE ROW LEVEL SECURITY;

-- Service Role (n8n) has full access
CREATE POLICY "Service Role Full Access on dashboard_metrics" ON public.dashboard_metrics FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on dashboard_snapshots" ON public.dashboard_snapshots FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on executive_reports" ON public.executive_reports FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin Only Access
-- Only users with the 'admin' role in their JWT can view the executive dashboard
CREATE POLICY "Admin Only View dashboard_metrics" ON public.dashboard_metrics FOR SELECT USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Only View dashboard_snapshots" ON public.dashboard_snapshots FOR SELECT USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Only View executive_reports" ON public.executive_reports FOR SELECT USING (auth.jwt() ->> 'user_role' = 'admin');
