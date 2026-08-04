-- Supabase Schema for Phase 4: AI & Workflow Hardening
-- Adds tables and views for AI observability and Workflow Retries

-- Table: workflow_retries
CREATE TABLE IF NOT EXISTS public.workflow_retries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workflow_id TEXT NOT NULL,
    execution_id TEXT NOT NULL,
    retry_count INTEGER DEFAULT 1,
    last_error TEXT,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed_permanent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: prompt_tests
CREATE TABLE IF NOT EXISTS public.prompt_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    prompt_id UUID REFERENCES public.ai_prompts(id) ON DELETE CASCADE,
    prompt_version_id UUID REFERENCES public.ai_prompt_versions(id) ON DELETE CASCADE,
    input_variables JSONB,
    generated_output TEXT,
    latency_ms INTEGER,
    tokens_used INTEGER,
    success BOOLEAN DEFAULT true,
    tester_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- View: vw_ai_performance
CREATE OR REPLACE VIEW public.vw_ai_performance AS
SELECT 
    DATE_TRUNC('hour', created_at) as time_bucket,
    COUNT(id) as total_requests,
    0 as total_failures, -- Set to 0 since ai_usage tracks standard usage
    AVG(latency_ms) as avg_latency_ms,
    SUM(total_tokens) as total_tokens_used,
    SUM(cost_estimate) as total_cost_usd
FROM public.ai_usage
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY time_bucket DESC;

-- View: vw_rag_effectiveness
CREATE OR REPLACE VIEW public.vw_rag_effectiveness AS
SELECT 
    DATE_TRUNC('day', created_at) as date_bucket,
    COUNT(id) as total_searches,
    AVG(results_returned) as avg_results_returned,
    AVG(execution_time_ms) as avg_execution_time_ms
FROM public.search_logs
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date_bucket DESC;

-- RLS
ALTER TABLE public.workflow_retries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_tests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admin Only Access workflow_retries" ON public.workflow_retries FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Service Role Access workflow_retries" ON public.workflow_retries FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Admin Only Access prompt_tests" ON public.prompt_tests FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Service Role Access prompt_tests" ON public.prompt_tests FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
