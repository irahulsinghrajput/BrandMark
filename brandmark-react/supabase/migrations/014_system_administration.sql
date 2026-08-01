-- Supabase Schema for Module 14: AI Administration & System Configuration

-- 1. System Settings (Global Configs)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key_name TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. AI Models (Catalog of available models)
CREATE TABLE IF NOT EXISTS public.ai_models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google', 'local')),
    model_id TEXT NOT NULL UNIQUE,
    model_type TEXT NOT NULL CHECK (model_type IN ('chat', 'embedding', 'image', 'audio')),
    is_active BOOLEAN DEFAULT true,
    max_tokens INT,
    default_temperature NUMERIC(3,2) DEFAULT 0.7,
    cost_per_1k_prompt NUMERIC(10,6),
    cost_per_1k_completion NUMERIC(10,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AI Prompts (Master list of system prompts)
CREATE TABLE IF NOT EXISTS public.ai_prompts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_name TEXT NOT NULL,
    prompt_name TEXT NOT NULL UNIQUE,
    current_version_id UUID, -- Will map to ai_prompt_versions
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. AI Prompt Versions (Version control for prompts)
CREATE TABLE IF NOT EXISTS public.ai_prompt_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    prompt_id UUID NOT NULL REFERENCES public.ai_prompts(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    system_message TEXT NOT NULL,
    user_message_template TEXT,
    temperature NUMERIC(3,2) DEFAULT 0.7,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(prompt_id, version_number)
);

-- 5. Integrations (Third-party app connections)
CREATE TABLE IF NOT EXISTS public.integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    app_name TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
    credentials JSONB, -- In production, use Supabase Vault for this
    last_synced_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. API Keys (BM-OS generated keys for external access)
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    api_key_hash TEXT NOT NULL UNIQUE,
    created_by TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Feature Flags (Toggle functionality)
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    flag_key TEXT NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT false,
    description TEXT,
    rollout_percentage INT DEFAULT 100 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    updated_by TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Notification Settings (Global routing rules)
CREATE TABLE IF NOT EXISTS public.notification_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type TEXT NOT NULL UNIQUE,
    slack_channel TEXT,
    email_recipients JSONB,
    in_app_roles JSONB,
    is_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Environment Variables (Non-sensitive env overrides)
CREATE TABLE IF NOT EXISTS public.environment_variables (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    env_key TEXT NOT NULL UNIQUE,
    env_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Role Permissions (RBAC definitions)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role_name TEXT NOT NULL UNIQUE,
    permissions JSONB NOT NULL, -- Array of allowed actions/modules
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. System Backups (Log of backup events)
CREATE TABLE IF NOT EXISTS public.system_backups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    backup_type TEXT NOT NULL CHECK (backup_type IN ('full', 'config', 'database')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    file_url TEXT,
    file_size_bytes BIGINT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_log TEXT
);

-- 12. Admin Activity Logs (Audit trail for settings changes)
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id TEXT NOT NULL,
    action TEXT NOT NULL,
    table_affected TEXT NOT NULL,
    record_id TEXT,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updated_At Triggers
CREATE TRIGGER update_system_settings_modtime BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_ai_prompts_modtime BEFORE UPDATE ON public.ai_prompts FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_integrations_modtime BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_feature_flags_modtime BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Views for Admin Dashboard
CREATE OR REPLACE VIEW public.vw_active_integrations AS
SELECT app_name, status, last_synced_at 
FROM public.integrations 
WHERE status != 'disconnected';

CREATE OR REPLACE VIEW public.vw_ai_models AS
SELECT provider, model_id, model_type, is_active 
FROM public.ai_models;

CREATE OR REPLACE VIEW public.vw_feature_flags AS
SELECT flag_key, is_enabled, rollout_percentage 
FROM public.feature_flags;

CREATE OR REPLACE VIEW public.vw_admin_activity AS
SELECT admin_id, action, table_affected, created_at 
FROM public.admin_activity_logs 
ORDER BY created_at DESC LIMIT 50;

CREATE OR REPLACE VIEW public.vw_system_configuration AS
SELECT 'integrations' as config_type, COUNT(*) as active_count FROM public.integrations WHERE status = 'connected'
UNION ALL
SELECT 'ai_models', COUNT(*) FROM public.ai_models WHERE is_active = true
UNION ALL
SELECT 'feature_flags', COUNT(*) FROM public.feature_flags WHERE is_enabled = true;

-- Enable RLS (Strict Admin/Service Role Only)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environment_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Service Role Policies (n8n automations)
CREATE POLICY "Service Role Access" ON public.system_settings FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.ai_models FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.ai_prompts FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.ai_prompt_versions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.integrations FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.api_keys FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.feature_flags FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.notification_settings FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.environment_variables FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.role_permissions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.system_backups FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Access" ON public.admin_activity_logs FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin Policies
CREATE POLICY "Admin Access" ON public.system_settings FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.ai_models FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.ai_prompts FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.ai_prompt_versions FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.integrations FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.api_keys FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.feature_flags FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.notification_settings FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.environment_variables FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.role_permissions FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.system_backups FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Access" ON public.admin_activity_logs FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
