-- Supabase Schema for Module 11: Team Collaboration Hub

-- 1. Team Channels
CREATE TABLE IF NOT EXISTS public.team_channels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Channel Members
CREATE TABLE IF NOT EXISTS public.channel_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    channel_id UUID NOT NULL REFERENCES public.team_channels(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(channel_id, user_id)
);

-- 3. Team Messages
CREATE TABLE IF NOT EXISTS public.team_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    channel_id UUID NOT NULL REFERENCES public.team_channels(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.team_messages(id) ON DELETE CASCADE, -- For threads
    is_edited BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Message Reactions
CREATE TABLE IF NOT EXISTS public.message_reactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.team_messages(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

-- 5. Message Attachments
CREATE TABLE IF NOT EXISTS public.message_attachments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.team_messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('mention', 'task_assignment', 'proposal_accepted', 'invoice_paid', 'marketing_approval', 'system_alert')),
    title TEXT NOT NULL,
    message TEXT,
    link_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Mentions
CREATE TABLE IF NOT EXISTS public.mentions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.team_messages(id) ON DELETE CASCADE,
    mentioned_user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Wiki Pages
CREATE TABLE IF NOT EXISTS public.wiki_pages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL, -- Markdown
    category TEXT DEFAULT 'general',
    author_id TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Wiki Versions
CREATE TABLE IF NOT EXISTS public.wiki_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    page_id UUID NOT NULL REFERENCES public.wiki_pages(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Activity Feed (Unified Timeline)
CREATE TABLE IF NOT EXISTS public.activity_feed (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type TEXT NOT NULL CHECK (event_type IN ('crm', 'proposal', 'onboarding', 'marketing', 'finance', 'project', 'ai_activity')),
    description TEXT NOT NULL,
    actor_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. User Presence
CREATE TABLE IF NOT EXISTS public.user_presence (
    user_id TEXT PRIMARY KEY,
    status TEXT DEFAULT 'online' CHECK (status IN ('online', 'away', 'busy', 'offline')),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Functions & Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_team_channels_modtime BEFORE UPDATE ON public.team_channels FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_team_messages_modtime BEFORE UPDATE ON public.team_messages FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_wiki_pages_modtime BEFORE UPDATE ON public.wiki_pages FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Indexes for performance
CREATE INDEX idx_team_messages_channel ON public.team_messages(channel_id);
CREATE INDEX idx_activity_feed_type ON public.activity_feed(event_type);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_wiki_pages_category ON public.wiki_pages(category);

-- Enable RLS
ALTER TABLE public.team_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Admin Policies (Full access to all tables)
-- For brevity, utilizing a generic snippet pattern that would apply to all
CREATE POLICY "Admin Full Access" ON public.team_channels FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.channel_members FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.team_messages FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.message_reactions FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.message_attachments FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.notifications FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.mentions FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.wiki_pages FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.wiki_versions FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.activity_feed FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.announcements FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.user_presence FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');

-- Service Role (n8n Automations)
CREATE POLICY "Service Role Full Access" ON public.activity_feed FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.notifications FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.announcements FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.wiki_versions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.team_messages FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Supabase Realtime Replications
-- Automatically broadcast changes for these tables without manual setup via external providers
-- Requires Publication setup in production:
-- alter publication supabase_realtime add table team_messages, notifications, activity_feed, user_presence, message_reactions;
