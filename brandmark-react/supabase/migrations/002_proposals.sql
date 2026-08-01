-- Supabase Schema for Module 3: AI Proposal Generator
-- Ensure UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: proposals
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crm_lead_id TEXT NOT NULL, -- Links back to HubSpot
    client_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'revision_requested')),
    proposal_value NUMERIC NOT NULL,
    secure_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'), -- For client portal access
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: proposal_versions
-- Stores the actual HTML and PDF URLs, supporting revision history
CREATE TABLE IF NOT EXISTS public.proposal_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    html_content TEXT NOT NULL,
    pdf_storage_url TEXT, -- URL to Supabase Storage bucket
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: proposal_views
-- Analytics tracking: When did they open it? How long did they look?
CREATE TABLE IF NOT EXISTS public.proposal_views (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    time_spent_seconds INTEGER DEFAULT 0,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: proposal_events
-- Audit log (Sent, Revision Requested, Accepted)
CREATE TABLE IF NOT EXISTS public.proposal_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: proposal_signatures
-- Prepares architecture for DocuSign / SignWell
CREATE TABLE IF NOT EXISTS public.proposal_signatures (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('docusign', 'dropbox_sign', 'signwell', 'internal')),
    external_signature_id TEXT,
    signed_by_name TEXT,
    signed_by_email TEXT,
    signed_by_ip TEXT,
    signed_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed', 'voided'))
);

-- Supabase Storage Bucket setup for PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('proposals', 'proposals', false) -- Private bucket, accessed via signed URLs
ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS) Setup
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_signatures ENABLE ROW LEVEL SECURITY;

-- Service Role (n8n) has full access
CREATE POLICY "Service Role Full Access on proposals" ON public.proposals FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on proposal_versions" ON public.proposal_versions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on proposal_views" ON public.proposal_views FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on proposal_events" ON public.proposal_events FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on proposal_signatures" ON public.proposal_signatures FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Client Portal Access via Secure Token
-- Clients can SELECT their proposal if they have the UUID and the secure token (handled in application logic)
-- E.g., /proposal/1234-abcd?token=xyz987
