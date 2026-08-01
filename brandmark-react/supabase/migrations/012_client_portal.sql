-- Supabase Schema for Module 12: Unified Client Portal

-- 1. Portal Preferences
CREATE TABLE IF NOT EXISTS public.portal_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_id)
);

-- 2. Client Sessions (For extra security logging)
CREATE TABLE IF NOT EXISTS public.client_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    logout_time TIMESTAMP WITH TIME ZONE
);

-- 3. Client Notifications
CREATE TABLE IF NOT EXISTS public.client_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('proposal_signed', 'invoice_issued', 'payment_received', 'task_completed', 'milestone_completed', 'files_uploaded', 'meeting_scheduled', 'general')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Client Activity
CREATE TABLE IF NOT EXISTS public.client_activity (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Client Messages (Internal messaging)
CREATE TABLE IF NOT EXISTS public.client_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'staff')),
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Client Support Tickets
CREATE TABLE IF NOT EXISTS public.client_support_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_on_client', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    department TEXT DEFAULT 'general' CHECK (department IN ('general', 'billing', 'technical', 'project')),
    assigned_to TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Client Files
CREATE TABLE IF NOT EXISTS public.client_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INT,
    uploaded_by_type TEXT CHECK (uploaded_by_type IN ('client', 'staff')),
    uploaded_by_id TEXT NOT NULL,
    is_scanned BOOLEAN DEFAULT false, -- Virus check flag
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Client Downloads (Audit trail for files)
CREATE TABLE IF NOT EXISTS public.client_downloads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    file_id UUID NOT NULL REFERENCES public.client_files(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    ip_address TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Client Meetings
CREATE TABLE IF NOT EXISTS public.client_meetings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    meeting_url TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT DEFAULT 30,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Client Feedback
CREATE TABLE IF NOT EXISTS public.client_feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    related_to_type TEXT CHECK (related_to_type IN ('project', 'milestone', 'support_ticket', 'general')),
    related_to_id UUID,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Client AI Sessions
CREATE TABLE IF NOT EXISTS public.client_ai_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    citations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Portal Audit Logs
CREATE TABLE IF NOT EXISTS public.portal_audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updated_At Triggers
CREATE TRIGGER update_portal_pref_modtime BEFORE UPDATE ON public.portal_preferences FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_client_msgs_modtime BEFORE UPDATE ON public.client_messages FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_support_modtime BEFORE UPDATE ON public.client_support_tickets FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Audit Log Trigger (Example for file uploads)
CREATE OR REPLACE FUNCTION log_client_file_upload()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.portal_audit_logs (client_id, action, table_name, record_id)
    VALUES (NEW.client_id, 'file_uploaded', 'client_files', NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER audit_client_files AFTER INSERT ON public.client_files FOR EACH ROW EXECUTE FUNCTION log_client_file_upload();

-- Indexes for performance
CREATE INDEX idx_client_notifications_client ON public.client_notifications(client_id);
CREATE INDEX idx_client_messages_client ON public.client_messages(client_id);
CREATE INDEX idx_client_support_client ON public.client_support_tickets(client_id);
CREATE INDEX idx_client_files_client ON public.client_files(client_id);
CREATE INDEX idx_client_meetings_client ON public.client_meetings(client_id);

-- Enable RLS on ALL tables
ALTER TABLE public.portal_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_audit_logs ENABLE ROW LEVEL SECURITY;

-- Service Role Policies (n8n automations)
CREATE POLICY "Service Role Full Access" ON public.client_notifications FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.client_activity FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.client_messages FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.client_support_tickets FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.client_files FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.client_meetings FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin Override (Full access to all client data)
CREATE POLICY "Admin Full Access" ON public.portal_preferences FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.client_notifications FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.client_activity FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.client_messages FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.client_support_tickets FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.client_files FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.client_meetings FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.client_ai_sessions FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.portal_audit_logs FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');

-- Authenticated Client Policies
-- Clients can ONLY read/write rows where client_id matches their JWT
CREATE POLICY "Client View Own Prefs" ON public.portal_preferences FOR SELECT USING (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client View Own Notifications" ON public.client_notifications FOR SELECT USING (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client View Own Activity" ON public.client_activity FOR SELECT USING (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client View Own Messages" ON public.client_messages FOR SELECT USING (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client Insert Own Messages" ON public.client_messages FOR INSERT WITH CHECK (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client View Own Support" ON public.client_support_tickets FOR SELECT USING (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client Insert Own Support" ON public.client_support_tickets FOR INSERT WITH CHECK (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client View Own Files" ON public.client_files FOR SELECT USING (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client Insert Own Files" ON public.client_files FOR INSERT WITH CHECK (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client View Own Meetings" ON public.client_meetings FOR SELECT USING (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client View Own Feedback" ON public.client_feedback FOR SELECT USING (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client Insert Own Feedback" ON public.client_feedback FOR INSERT WITH CHECK (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client View Own AI Sessions" ON public.client_ai_sessions FOR SELECT USING (client_id::TEXT = auth.jwt() ->> 'client_id');
CREATE POLICY "Client Insert Own AI Sessions" ON public.client_ai_sessions FOR INSERT WITH CHECK (client_id::TEXT = auth.jwt() ->> 'client_id');

-- Realtime Configuration (Needs Publication setup in prod)
-- alter publication supabase_realtime add table client_notifications, client_messages, client_activity, client_support_tickets;
