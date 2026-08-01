-- Supabase Schema for Module 8: Finance & Operations Automation

-- Table: customers
-- Centralized customer billing records
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    billing_address TEXT,
    tax_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: expense_categories
CREATE TABLE IF NOT EXISTS public.expense_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: expenses
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES public.expense_categories(id) ON DELETE SET NULL,
    vendor TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_url TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'void')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: recurring_invoices
CREATE TABLE IF NOT EXISTS public.recurring_invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    description TEXT,
    interval TEXT NOT NULL CHECK (interval IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    next_issue_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: payments (Acts as invoices/payments ledger)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    description TEXT,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'void')),
    paid_date DATE,
    stripe_invoice_id TEXT,
    recurring_id UUID REFERENCES public.recurring_invoices(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: payment_logs
-- Audit trail for email reminders and payment events
CREATE TABLE IF NOT EXISTS public.payment_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- e.g., 'invoice_sent', 'reminder_sent', 'overdue_notice', 'payment_received'
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: cashflow_snapshots
-- Daily/Weekly calculated snapshots for charting
CREATE TABLE IF NOT EXISTS public.cashflow_snapshots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    snapshot_date DATE NOT NULL UNIQUE,
    total_revenue NUMERIC(12,2) DEFAULT 0.00,
    total_expenses NUMERIC(12,2) DEFAULT 0.00,
    net_profit NUMERIC(12,2) GENERATED ALWAYS AS (total_revenue - total_expenses) STORED,
    outstanding_invoices NUMERIC(12,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: financial_reports
-- Monthly GPT-4o executive summaries
CREATE TABLE IF NOT EXISTS public.financial_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_month DATE NOT NULL UNIQUE,
    revenue_insights TEXT,
    expense_insights TEXT,
    cashflow_risks TEXT,
    cost_saving_recommendations TEXT,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON public.payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_cashflow_date ON public.cashflow_snapshots(snapshot_date);

-- Helper View for Dashboard
CREATE OR REPLACE VIEW public.finance_dashboard_metrics AS
SELECT
    (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'paid' AND EXTRACT(MONTH FROM paid_date) = EXTRACT(MONTH FROM CURRENT_DATE)) as monthly_revenue,
    (SELECT COALESCE(SUM(amount), 0) FROM public.expenses WHERE status = 'paid' AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)) as monthly_expenses,
    (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status IN ('sent', 'overdue')) as total_outstanding,
    (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'overdue') as total_overdue;

-- RLS Configuration
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashflow_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;

-- Service Role Access (n8n automation)
CREATE POLICY "Service Role Full Access customers" ON public.customers FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access expense_categories" ON public.expense_categories FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access expenses" ON public.expenses FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access recurring_invoices" ON public.recurring_invoices FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access payments" ON public.payments FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access payment_logs" ON public.payment_logs FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access cashflow_snapshots" ON public.cashflow_snapshots FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service Role Full Access financial_reports" ON public.financial_reports FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin Access
CREATE POLICY "Admin Full Access customers" ON public.customers FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access expense_categories" ON public.expense_categories FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access expenses" ON public.expenses FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access recurring_invoices" ON public.recurring_invoices FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access payments" ON public.payments FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access payment_logs" ON public.payment_logs FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access cashflow_snapshots" ON public.cashflow_snapshots FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
CREATE POLICY "Admin Full Access financial_reports" ON public.financial_reports FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');
