-- Supabase Schema for Version 1.2 Phase 2: AI Agent Framework

-- Note: Ensure pgvector is enabled in the database for memory embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. AI Agents Catalog
CREATE TABLE IF NOT EXISTS public.ai_agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL,
    model TEXT DEFAULT 'gpt-4o',
    temperature NUMERIC(3,2) DEFAULT 0.7,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed 7 Core Agents
INSERT INTO public.ai_agents (name, role, description, system_prompt) VALUES
('Sales Agent', 'Sales Development', 'Qualifies leads and generates outreach emails.', 'You are the BM-OS Sales Agent...'),
('Marketing Agent', 'Marketing Orchestration', 'Generates campaigns, ads, and social media copy.', 'You are the BM-OS Marketing Agent...'),
('Finance Agent', 'Financial Operations', 'Tracks invoices, calculates ROI, and projects revenue.', 'You are the BM-OS Finance Agent...'),
('Project Manager Agent', 'Delivery Orchestration', 'Monitors project timelines and delegates tasks.', 'You are the BM-OS Project Manager Agent...'),
('Customer Support Agent', 'Client Relations', 'Drafts responses to client queries and resolves tickets.', 'You are the BM-OS Customer Support Agent...'),
('Knowledge Agent', 'Information Retrieval', 'Searches internal SOPs and documents using RAG.', 'You are the BM-OS Knowledge Agent...'),
('Executive Advisor Agent', 'Strategic Insights', 'Aggregates data to provide executive BI insights.', 'You are the BM-OS Executive Advisor Agent...')
ON CONFLICT (name) DO NOTHING;

-- 2. Agent Tools
CREATE TABLE IF NOT EXISTS public.agent_tools (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    integration_id UUID REFERENCES public.enterprise_integrations(id),
    schema JSONB,
    is_active BOOLEAN DEFAULT true
);

-- 3. Agent Sessions & Conversations
CREATE TABLE IF NOT EXISTS public.agent_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
    title TEXT,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agent_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
    content TEXT NOT NULL,
    tool_calls JSONB,
    tokens_used INT DEFAULT 0,
    latency_ms INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Agent Long-Term Memory (RAG / Vector)
CREATE TABLE IF NOT EXISTS public.agent_memory (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536), -- Standard OpenAI embedding dimension
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Agent Tasks & Executions (Delegation / Queueing)
CREATE TABLE IF NOT EXISTS public.agent_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES public.ai_agents(id),
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
    delegated_by_agent_id UUID REFERENCES public.ai_agents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.agent_executions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.agent_tasks(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES public.agent_tools(id),
    request_payload JSONB,
    response_payload JSONB,
    status TEXT CHECK (status IN ('success', 'failure')),
    execution_time_ms INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Usage & Feedback
CREATE TABLE IF NOT EXISTS public.agent_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    agent_id UUID NOT NULL REFERENCES public.ai_agents(id),
    date DATE DEFAULT CURRENT_DATE,
    total_requests INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    total_cost NUMERIC(10,4) DEFAULT 0,
    UNIQUE(agent_id, date)
);

CREATE TABLE IF NOT EXISTS public.agent_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.agent_messages(id) ON DELETE CASCADE,
    is_positive BOOLEAN NOT NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Views
CREATE OR REPLACE VIEW public.vw_agent_health AS
SELECT 
    a.name,
    a.role,
    a.is_active,
    (SELECT COUNT(*) FROM public.agent_tasks t WHERE t.agent_id = a.id AND t.status = 'failed' AND t.created_at > NOW() - INTERVAL '24 hours') AS recent_failures,
    (SELECT COUNT(*) FROM public.agent_tasks t WHERE t.agent_id = a.id AND t.status = 'queued') AS queued_tasks
FROM public.ai_agents a;

CREATE OR REPLACE VIEW public.vw_agent_usage AS
SELECT 
    a.name,
    SUM(u.total_requests) AS requests,
    SUM(u.total_tokens) AS tokens,
    SUM(u.total_cost) AS total_cost
FROM public.ai_agents a
LEFT JOIN public.agent_usage u ON a.id = u.agent_id
GROUP BY a.name;

CREATE OR REPLACE VIEW public.vw_agent_performance AS
SELECT 
    a.name,
    AVG(m.latency_ms) AS avg_latency_ms
FROM public.ai_agents a
LEFT JOIN public.agent_conversations c ON a.id = c.agent_id
LEFT JOIN public.agent_messages m ON c.id = m.conversation_id
WHERE m.role = 'assistant'
GROUP BY a.name;

-- RLS & Policies
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin All" ON public.ai_agents FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.agent_tools FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.agent_conversations FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.agent_messages FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.agent_memory FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.agent_tasks FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.agent_executions FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.agent_usage FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All" ON public.agent_feedback FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');

CREATE POLICY "Service Role All" ON public.ai_agents FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.agent_tools FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.agent_conversations FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.agent_messages FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.agent_memory FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.agent_tasks FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.agent_executions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.agent_usage FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role All" ON public.agent_feedback FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
