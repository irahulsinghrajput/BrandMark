-- Supabase Schema for Module 10: AI Knowledge Base (RAG Platform)
-- Requires pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Table: collections
-- e.g., 'SOPs', 'Case Studies', 'Pricing', 'Sales Playbooks'
CREATE TABLE IF NOT EXISTS public.knowledge_collections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: knowledge_documents
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    collection_id UUID REFERENCES public.knowledge_collections(id) ON DELETE SET NULL,
    author TEXT,
    source TEXT, -- e.g., 'Google Drive', 'Manual Upload', 'CRM'
    tags TEXT[],
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'active', 'failed', 'archived')),
    embedding_version TEXT NOT NULL DEFAULT 'text-embedding-3-large',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: document_versions
-- Stores the original raw content before chunking
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    raw_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: knowledge_chunks
-- Stores the chunked text and its vector representation
-- OpenAI text-embedding-3-large produces 3072 dimensions by default
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    document_id UUID NOT NULL REFERENCES public.knowledge_documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(3072),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: search_logs
-- Tracks RAG queries to optimize context window performance
CREATE TABLE IF NOT EXISTS public.search_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    query_text TEXT NOT NULL,
    user_id TEXT, -- which AI agent or human searched
    results_returned INTEGER,
    execution_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: chat_history
-- For memory persistence across chat sessions (e.g. BrandMark GPT)
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HNSW Index for fast vector similarity search (L2 distance)
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx ON public.knowledge_chunks USING hnsw (embedding vector_l2_ops);

-- Hybrid Search Function (Vector + Metadata filtering)
-- Used by n8n or direct API to fetch relevant context before asking GPT-4o
CREATE OR REPLACE FUNCTION match_knowledge_documents (
  query_embedding VECTOR(3072),
  match_threshold FLOAT,
  match_count INT,
  filter_collection_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  document_title TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.document_id,
    d.title as document_title,
    c.content,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_chunks c
  JOIN public.knowledge_documents d ON c.document_id = d.id
  WHERE 1 - (c.embedding <=> query_embedding) > match_threshold
    AND d.status = 'active'
    AND (filter_collection_id IS NULL OR d.collection_id = filter_collection_id)
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Row Level Security (RLS)
ALTER TABLE public.knowledge_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Service Role (n8n) Full Access
CREATE POLICY "Service Role Full Access on collections" ON public.knowledge_collections FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on knowledge_documents" ON public.knowledge_documents FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on document_versions" ON public.document_versions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on knowledge_chunks" ON public.knowledge_chunks FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on search_logs" ON public.search_logs FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on chat_history" ON public.chat_history FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin Only Access
CREATE POLICY "Admin Only View collections" ON public.knowledge_collections FOR SELECT USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Only View knowledge_documents" ON public.knowledge_documents FOR SELECT USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Only View knowledge_chunks" ON public.knowledge_chunks FOR SELECT USING (auth.jwt() ->> 'user_role' = 'admin');
