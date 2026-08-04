-- Supabase Schema for Module 9: Project & Operations Delivery

-- Table: projects (Created initially in 003, ensuring consistency here)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL, -- references handled in 003
    proposal_id UUID,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('kickoff', 'backlog', 'planning', 'in_progress', 'review', 'blocked', 'completed')),
    health TEXT NOT NULL DEFAULT 'green' CHECK (health IN ('green', 'amber', 'red')),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    budget NUMERIC(12,2) DEFAULT 0.00,
    budget_used NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: project_members
CREATE TABLE IF NOT EXISTS public.project_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Admin or team member ID
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('manager', 'member', 'client')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: project_milestones
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: project_tasks
CREATE TABLE IF NOT EXISTS public.project_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES public.project_milestones(id) ON DELETE SET NULL,
    assigned_to TEXT, -- User ID
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'blocked', 'done')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    estimated_hours NUMERIC(5,2) DEFAULT 0.00,
    actual_hours NUMERIC(5,2) DEFAULT 0.00,
    client_visible BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: task_comments
CREATE TABLE IF NOT EXISTS public.task_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.project_tasks(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT true, -- If false, client can see it
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: task_activity
CREATE TABLE IF NOT EXISTS public.task_activity (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.project_tasks(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: project_time_logs
CREATE TABLE IF NOT EXISTS public.project_time_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.project_tasks(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    hours NUMERIC(5,2) NOT NULL,
    is_billable BOOLEAN DEFAULT true,
    description TEXT,
    log_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: project_files
CREATE TABLE IF NOT EXISTS public.project_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.project_tasks(id) ON DELETE SET NULL,
    uploaded_by TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    client_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: project_status_history
CREATE TABLE IF NOT EXISTS public.project_status_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    health TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: project_notifications
CREATE TABLE IF NOT EXISTS public.project_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Views
-- Health & Progress Calculation View
CREATE OR REPLACE VIEW public.vw_project_health AS
SELECT 
    p.id as project_id,
    p.name,
    p.budget,
    (SELECT COALESCE(SUM(hours * 150), 0) FROM public.project_time_logs WHERE project_id = p.id AND is_billable = true) as calculated_budget_used,
    (SELECT COUNT(*) FROM public.project_tasks WHERE project_id = p.id) as total_tasks,
    (SELECT COUNT(*) FROM public.project_tasks WHERE project_id = p.id AND status = 'done') as completed_tasks,
    CASE 
        WHEN (SELECT COUNT(*) FROM public.project_tasks WHERE project_id = p.id) = 0 THEN 0
        ELSE ROUND(((SELECT COUNT(*) FROM public.project_tasks WHERE project_id = p.id AND status = 'done')::NUMERIC / (SELECT COUNT(*) FROM public.project_tasks WHERE project_id = p.id)::NUMERIC) * 100, 2)
    END as progress_percentage,
    (SELECT COUNT(*) FROM public.project_tasks WHERE project_id = p.id AND due_date < CURRENT_DATE AND status != 'done') as overdue_tasks
FROM public.projects p;

-- Triggers for Health auto-calculation
-- (Simplification: In a full DB this would fire a function to update projects.health based on overdue tasks and budget)

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON public.project_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_time_project ON public.project_time_logs(project_id);

-- RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_notifications ENABLE ROW LEVEL SECURITY;

-- Service Role (n8n)
CREATE POLICY "Service Role Full Access" ON public.projects FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.project_members FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.project_tasks FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access" ON public.project_time_logs FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin (Full Access to everything)
CREATE POLICY "Admin Full Access" ON public.projects FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.project_members FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.project_tasks FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.task_comments FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.task_activity FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.project_milestones FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.project_time_logs FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.project_files FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.project_status_history FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access" ON public.project_notifications FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');

-- Client (Only where project_id matches their client_id)
-- For a strict production system, this would join project_members or check the client_id on the project.
CREATE POLICY "Client View Owned Projects" ON public.projects FOR SELECT USING (
    client_id::TEXT = auth.jwt() ->> 'client_id'
);
CREATE POLICY "Client View Owned Tasks" ON public.project_tasks FOR SELECT USING (
    client_visible = true AND project_id IN (SELECT id FROM public.projects WHERE client_id::TEXT = auth.jwt() ->> 'client_id')
);
