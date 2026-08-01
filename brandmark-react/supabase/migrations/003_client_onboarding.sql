-- Supabase Schema for Module 4: Client Onboarding Automation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: clients
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    crm_contact_id TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    primary_contact_name TEXT NOT NULL,
    primary_contact_email TEXT NOT NULL UNIQUE,
    industry TEXT,
    status TEXT NOT NULL DEFAULT 'onboarding' CHECK (status IN ('onboarding', 'active', 'paused', 'churned')),
    google_drive_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
    project_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'kickoff' CHECK (status IN ('kickoff', 'in_progress', 'review', 'completed')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: invoices
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL UNIQUE,
    amount NUMERIC NOT NULL,
    tax_amount NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('draft', 'unpaid', 'paid', 'overdue', 'cancelled')),
    due_date DATE NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: tasks (Internal & Client-facing)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'client_review', 'completed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    is_client_visible BOOLEAN DEFAULT false,
    due_date DATE,
    assigned_to TEXT, -- Email or ID of team member
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: documents
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('contract', 'questionnaire', 'report', 'asset', 'other')),
    file_url TEXT NOT NULL,
    uploaded_by TEXT NOT NULL, -- 'system', 'client', or team member ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Setup
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Service Role (n8n) has full access
CREATE POLICY "Service Role Full Access on clients" ON public.clients FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on projects" ON public.projects FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on invoices" ON public.invoices FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on tasks" ON public.tasks FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access on documents" ON public.documents FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Authenticated Client Access
-- Clients can only read their own data based on their authenticated email matching primary_contact_email
CREATE POLICY "Clients can view their own record" ON public.clients FOR SELECT USING (auth.jwt() ->> 'email' = primary_contact_email);
CREATE POLICY "Clients can view their own projects" ON public.projects FOR SELECT USING (client_id IN (SELECT id FROM public.clients WHERE primary_contact_email = auth.jwt() ->> 'email'));
CREATE POLICY "Clients can view their own invoices" ON public.invoices FOR SELECT USING (client_id IN (SELECT id FROM public.clients WHERE primary_contact_email = auth.jwt() ->> 'email'));
CREATE POLICY "Clients can view their client_visible tasks" ON public.tasks FOR SELECT USING (is_client_visible = true AND project_id IN (SELECT id FROM public.projects WHERE client_id IN (SELECT id FROM public.clients WHERE primary_contact_email = auth.jwt() ->> 'email')));
CREATE POLICY "Clients can view their own documents" ON public.documents FOR SELECT USING (client_id IN (SELECT id FROM public.clients WHERE primary_contact_email = auth.jwt() ->> 'email'));
