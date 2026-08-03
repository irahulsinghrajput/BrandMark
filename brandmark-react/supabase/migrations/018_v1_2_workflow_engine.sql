-- Supabase Schema for Version 1.2 Phase 3: Advanced Workflow Engine

-- 1. Core Workflow Definitions
CREATE TABLE IF NOT EXISTS public.workflows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workflow_id, version_number)
);

CREATE TABLE IF NOT EXISTS public.workflow_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT,
    nodes JSONB NOT NULL,
    edges JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed basic templates
INSERT INTO public.workflow_templates (name, description, category, nodes, edges) VALUES
('New Client Onboarding', 'Standard sequence for welcoming a new client.', 'Operations', '[]'::jsonb, '[]'::jsonb),
('Invoice Reminder', 'Sends automated reminders for overdue invoices.', 'Finance', '[]'::jsonb, '[]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 2. Execution Telemetry
CREATE TABLE IF NOT EXISTS public.workflow_executions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    version_id UUID NOT NULL REFERENCES public.workflow_versions(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed', 'cancelled', 'timeout')),
    trigger_type TEXT DEFAULT 'manual' CHECK (trigger_type IN ('manual', 'schedule', 'webhook', 'event')),
    trigger_data JSONB,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_steps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    execution_id UUID NOT NULL REFERENCES public.workflow_executions(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed', 'skipped')),
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Queuing System (Awaiting Backend Worker)
CREATE TABLE IF NOT EXISTS public.workflow_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES public.workflows(id),
    payload JSONB,
    priority INT DEFAULT 0,
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'processing')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_retry_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    execution_id UUID NOT NULL REFERENCES public.workflow_executions(id),
    node_id TEXT NOT NULL,
    retry_count INT DEFAULT 0,
    next_retry_at TIMESTAMP WITH TIME ZONE NOT NULL,
    error_context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_dead_letters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    execution_id UUID REFERENCES public.workflow_executions(id),
    payload JSONB,
    error_message TEXT,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Environment & Schedules
CREATE TABLE IF NOT EXISTS public.workflow_schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    cron_expression TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_variables (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key_name TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL, -- Plain text or encrypted by Supabase Vault in prod
    is_secret BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_webhooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    endpoint_path TEXT NOT NULL UNIQUE,
    method TEXT DEFAULT 'POST',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    allowed_roles TEXT[] DEFAULT '{admin}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    execution_id UUID REFERENCES public.workflow_executions(id) ON DELETE CASCADE,
    log_level TEXT DEFAULT 'info' CHECK (log_level IN ('info', 'warn', 'error', 'debug')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 5. Views
CREATE OR REPLACE VIEW public.vw_workflow_health AS
SELECT 
    (SELECT COUNT(*) FROM public.workflows WHERE is_active = true) AS total_active_workflows,
    (SELECT COUNT(*) FROM public.workflow_schedules WHERE is_active = true) AS active_schedules,
    (SELECT COUNT(*) FROM public.workflow_queue) AS queued_items,
    (SELECT COUNT(*) FROM public.workflow_dead_letters WHERE resolved = false) AS unresolved_dead_letters;

CREATE OR REPLACE VIEW public.vw_workflow_usage AS
SELECT 
    w.name,
    COUNT(e.id) AS total_executions,
    SUM(CASE WHEN e.status = 'success' THEN 1 ELSE 0 END) AS success_count,
    SUM(CASE WHEN e.status = 'failed' THEN 1 ELSE 0 END) AS failure_count
FROM public.workflows w
LEFT JOIN public.workflow_executions e ON w.id = e.workflow_id
GROUP BY w.name;

CREATE OR REPLACE VIEW public.vw_workflow_queue AS
SELECT 
    q.id,
    w.name AS workflow_name,
    q.priority,
    q.status,
    q.created_at
FROM public.workflow_queue q
JOIN public.workflows w ON q.workflow_id = w.id;

CREATE OR REPLACE VIEW public.vw_workflow_failures AS
SELECT 
    e.id AS execution_id,
    w.name AS workflow_name,
    e.status,
    e.started_at,
    (SELECT s.error_message FROM public.workflow_steps s WHERE s.execution_id = e.id AND s.status = 'failed' LIMIT 1) AS root_cause
FROM public.workflow_executions e
JOIN public.workflows w ON e.workflow_id = w.id
WHERE e.status = 'failed';

CREATE OR REPLACE VIEW public.vw_workflow_performance AS
SELECT 
    w.name,
    AVG(EXTRACT(EPOCH FROM (e.completed_at - e.started_at))) AS avg_runtime_seconds
FROM public.workflows w
JOIN public.workflow_executions e ON w.id = e.workflow_id
WHERE e.status = 'success' AND e.completed_at IS NOT NULL AND e.started_at IS NOT NULL
GROUP BY w.name;


-- Enable RLS
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_retry_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_dead_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_logs ENABLE ROW LEVEL SECURITY;

-- Admin Access
CREATE POLICY "Admin All" ON public.workflows FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_versions FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_templates FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_executions FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_steps FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_queue FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_retry_queue FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_dead_letters FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_schedules FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_variables FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_webhooks FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_permissions FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.workflow_logs FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');

-- Service Role (For Edge Functions / n8n)
CREATE POLICY "Service Role All" ON public.workflows FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_versions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_templates FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_executions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_steps FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_queue FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_retry_queue FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_dead_letters FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_schedules FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_variables FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_webhooks FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_permissions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.workflow_logs FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
