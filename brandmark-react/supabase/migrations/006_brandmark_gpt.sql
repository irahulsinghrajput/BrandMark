-- Supabase Schema for Module 6: BrandMark GPT (Internal AI OS)

-- Table: ai_conversations
-- Groups chat messages into persistent threads
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    user_id TEXT NOT NULL, -- e.g., Admin ID or email
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: ai_messages
-- Stores the actual chat messages (user questions, GPT responses, and citations)
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    citations JSONB, -- Array of document metadata (title, collection, similarity score)
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: ai_feedback
-- Captures thumbs up/down and optional text feedback on specific responses
CREATE TABLE IF NOT EXISTS public.ai_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.ai_messages(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    rating TEXT NOT NULL CHECK (rating IN ('positive', 'negative')),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: ai_prompt_logs
-- Analytics on how the AI is being used and system prompt variations
CREATE TABLE IF NOT EXISTS public.ai_prompt_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID REFERENCES public.ai_messages(id) ON DELETE SET NULL,
    system_prompt_version TEXT NOT NULL,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prompt_logs ENABLE ROW LEVEL SECURITY;

-- Service Role (n8n) Full Access
CREATE POLICY "Service Role Full Access on ai_conversations" ON public.ai_conversations FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on ai_messages" ON public.ai_messages FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on ai_feedback" ON public.ai_feedback FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on ai_prompt_logs" ON public.ai_prompt_logs FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin Only Access
-- Ensures only users with the 'admin' role can read/write their conversations
CREATE POLICY "Admin All Access ai_conversations" ON public.ai_conversations FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All Access ai_messages" ON public.ai_messages FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin All Access ai_feedback" ON public.ai_feedback FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Read Only ai_prompt_logs" ON public.ai_prompt_logs FOR SELECT USING (auth.jwt() ->> 'user_role' = 'admin');
