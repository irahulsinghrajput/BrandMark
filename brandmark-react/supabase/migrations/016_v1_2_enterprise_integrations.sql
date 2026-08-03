-- Supabase Schema for Version 1.2 Phase 1: Enterprise Integration Layer

-- 1. Enterprise Integrations Catalog
-- A global catalog of all supported enterprise applications
CREATE TABLE IF NOT EXISTS public.enterprise_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- CRM, Marketing, Ads, Finance, Communication, Productivity
    auth_type TEXT NOT NULL CHECK (auth_type IN ('oauth2', 'api_key', 'basic')),
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed the 20 integrations
INSERT INTO public.enterprise_integrations (name, category, auth_type) VALUES 
('HubSpot CRM', 'CRM', 'oauth2'),
('Google Analytics 4', 'Analytics', 'oauth2'),
('Google Search Console', 'Analytics', 'oauth2'),
('Meta Ads', 'Ads', 'oauth2'),
('Google Ads', 'Ads', 'oauth2'),
('LinkedIn Ads', 'Ads', 'oauth2'),
('Stripe', 'Finance', 'api_key'),
('Razorpay', 'Finance', 'api_key'),
('Slack', 'Communication', 'oauth2'),
('Microsoft Teams', 'Communication', 'oauth2'),
('Gmail', 'Productivity', 'oauth2'),
('Outlook', 'Productivity', 'oauth2'),
('Twilio', 'Communication', 'api_key'),
('WhatsApp Business API', 'Communication', 'api_key'),
('Calendly', 'Productivity', 'oauth2'),
('Zoom', 'Productivity', 'oauth2'),
('Google Meet', 'Productivity', 'oauth2'),
('Google Drive', 'Productivity', 'oauth2'),
('Dropbox', 'Productivity', 'oauth2'),
('OneDrive', 'Productivity', 'oauth2')
ON CONFLICT (name) DO NOTHING;

-- 2. Integration Connections
-- Securely stores the active connection state for the tenant/system
CREATE TABLE IF NOT EXISTS public.integration_connections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    integration_id UUID NOT NULL REFERENCES public.enterprise_integrations(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'pending')),
    access_token TEXT, -- In production, map to Supabase Vault
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    scopes TEXT[],
    health_score INT DEFAULT 100 CHECK (health_score >= 0 AND health_score <= 100),
    last_synced_at TIMESTAMP WITH TIME ZONE,
    connected_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(integration_id)
);

-- 3. Integration Logs
-- Observability for retry logic, token refreshes, and sync events
CREATE TABLE IF NOT EXISTS public.integration_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    connection_id UUID NOT NULL REFERENCES public.integration_connections(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('sync', 'token_refresh', 'error', 'retry', 'connect', 'disconnect')),
    status TEXT NOT NULL CHECK (status IN ('success', 'failure')),
    message TEXT,
    response_payload JSONB,
    latency_ms INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updated_At Trigger
CREATE TRIGGER update_integration_connections_modtime BEFORE UPDATE ON public.integration_connections FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 4. View: Integration Health Dashboard
CREATE OR REPLACE VIEW public.vw_integration_health AS
SELECT 
    ei.name AS integration_name,
    ei.category,
    ic.status,
    ic.health_score,
    ic.last_synced_at,
    (SELECT COUNT(*) FROM public.integration_logs il WHERE il.connection_id = ic.id AND il.status = 'failure' AND il.created_at > NOW() - INTERVAL '24 hours') AS errors_last_24h
FROM public.enterprise_integrations ei
LEFT JOIN public.integration_connections ic ON ei.id = ic.integration_id;

-- Enable RLS
ALTER TABLE public.enterprise_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

-- Service Role Policies (n8n automations)
CREATE POLICY "Service Role Access" ON public.enterprise_integrations FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.integration_connections FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.integration_logs FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin Policies
CREATE POLICY "Admin Access" ON public.enterprise_integrations FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.integration_connections FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.integration_logs FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
