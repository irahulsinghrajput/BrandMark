-- Supabase Schema for Version 1.2 Phase 4: Enterprise Analytics & Business Intelligence

-- 1. Core Analytics
CREATE TABLE IF NOT EXISTS public.analytics_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    device_info JSONB,
    location JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.analytics_sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_dimensions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dimension_name TEXT UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS public.analytics_facts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dimension_id UUID REFERENCES public.analytics_dimensions(id) ON DELETE CASCADE,
    metric_value NUMERIC(15, 4) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Business Intelligence (BI)
CREATE TABLE IF NOT EXISTS public.bi_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    author_id TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bi_queries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES public.bi_reports(id) ON DELETE CASCADE,
    sql_query TEXT,
    json_query JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bi_models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    schema_definition JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Executive Reporting (Schema unified with 004)
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

CREATE TABLE IF NOT EXISTS public.report_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    layout JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.report_exports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_id UUID REFERENCES public.executive_reports(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT DEFAULT 'pdf' CHECK (file_type IN ('pdf', 'excel', 'csv')),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Predictive Analytics
CREATE TABLE IF NOT EXISTS public.prediction_models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    target_metric TEXT NOT NULL,
    model_type TEXT NOT NULL,
    accuracy_score NUMERIC(5,4),
    last_trained_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.prediction_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    model_id UUID REFERENCES public.prediction_models(id) ON DELETE CASCADE,
    predicted_value NUMERIC(15, 4) NOT NULL,
    confidence_interval JSONB,
    target_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.forecast_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    prediction_id UUID REFERENCES public.prediction_results(id) ON DELETE CASCADE,
    actual_value NUMERIC(15, 4),
    variance NUMERIC(15, 4),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. KPI Management
CREATE TABLE IF NOT EXISTS public.kpi_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.kpis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES public.kpi_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    unit TEXT,
    is_higher_better BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kpi_targets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    kpi_id UUID REFERENCES public.kpis(id) ON DELETE CASCADE,
    target_value NUMERIC(15, 4) NOT NULL,
    warning_threshold NUMERIC(15, 4),
    critical_threshold NUMERIC(15, 4),
    period TEXT DEFAULT 'monthly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.kpi_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    kpi_id UUID REFERENCES public.kpis(id) ON DELETE CASCADE,
    actual_value NUMERIC(15, 4) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed KPI Categories
INSERT INTO public.kpi_categories (name) VALUES ('Financial'), ('Operational'), ('Marketing'), ('Sales') ON CONFLICT DO NOTHING;

-- 6. Custom Dashboards
CREATE TABLE IF NOT EXISTS public.dashboards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE,
    widget_type TEXT NOT NULL,
    title TEXT NOT NULL,
    layout JSONB NOT NULL,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. AI Insights
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT CHECK (category IN ('opportunity', 'risk', 'anomaly', 'summary')),
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    related_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    insight_id UUID REFERENCES public.ai_insights(id) ON DELETE CASCADE,
    action_text TEXT NOT NULL,
    estimated_impact TEXT,
    is_applied BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 8. Views
CREATE OR REPLACE VIEW public.vw_enterprise_metrics AS
SELECT 
    COUNT(s.id) AS total_sessions,
    COUNT(e.id) AS total_events
FROM public.analytics_sessions s
LEFT JOIN public.analytics_events e ON s.id = e.session_id;

CREATE OR REPLACE VIEW public.vw_bi_summary AS
SELECT 
    COUNT(r.id) AS total_reports,
    SUM(CASE WHEN r.is_public THEN 1 ELSE 0 END) AS public_reports
FROM public.bi_reports r;

CREATE OR REPLACE VIEW public.vw_executive_reporting AS
SELECT 
    COUNT(e.id) AS active_reports,
    (SELECT COUNT(*) FROM public.report_exports) AS total_exports
FROM public.executive_reports e
WHERE e.is_active = true;

CREATE OR REPLACE VIEW public.vw_predictions AS
SELECT 
    m.target_metric,
    r.predicted_value,
    r.target_date
FROM public.prediction_models m
JOIN public.prediction_results r ON m.id = r.model_id;

CREATE OR REPLACE VIEW public.vw_kpi_dashboard AS
SELECT 
    k.name AS kpi_name,
    c.name AS category_name,
    t.target_value,
    (SELECT h.actual_value FROM public.kpi_history h WHERE h.kpi_id = k.id ORDER BY h.recorded_at DESC LIMIT 1) AS latest_value
FROM public.kpis k
JOIN public.kpi_categories c ON k.category_id = c.id
LEFT JOIN public.kpi_targets t ON k.id = t.kpi_id;

CREATE OR REPLACE VIEW public.vw_ai_insights AS
SELECT 
    i.title,
    i.category,
    i.severity,
    i.created_at,
    (SELECT COUNT(*) FROM public.ai_recommendations r WHERE r.insight_id = i.id) AS recommendation_count
FROM public.ai_insights i;

-- RLS & Security (Admin / Service Role Only for Analytics)
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN (
            'analytics_sessions', 'analytics_events', 'analytics_dimensions', 'analytics_facts',
            'bi_reports', 'bi_queries', 'bi_models', 'executive_reports', 'report_templates', 'report_exports',
            'prediction_models', 'prediction_results', 'forecast_history', 'kpi_categories', 'kpis',
            'kpi_targets', 'kpi_history', 'dashboards', 'dashboard_widgets', 'ai_insights', 'ai_recommendations'
        )
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
        EXECUTE format('CREATE POLICY "Admin All" ON public.%I FOR ALL USING (auth.jwt() ->> ''user_role'' = ''admin'');', t);
        EXECUTE format('CREATE POLICY "Service Role All" ON public.%I FOR ALL USING (auth.jwt() ->> ''role'' = ''service_role'');', t);
    END LOOP;
END $$;
