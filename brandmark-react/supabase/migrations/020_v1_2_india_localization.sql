-- Migration 020: India Localization (GST & Payments)
-- Enables full support for Indian enterprise requirements

-- Add GST and TDS columns to invoices
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS gst_rate numeric(5,2) DEFAULT 18.00,
ADD COLUMN IF NOT EXISTS cgst_amount numeric(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sgst_amount numeric(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS igst_amount numeric(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tds_rate numeric(5,2) DEFAULT 10.00,
ADD COLUMN IF NOT EXISTS tds_amount numeric(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_tax_amount numeric(12,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'INR';

-- Add GSTIN and localization to clients
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS gstin text,
ADD COLUMN IF NOT EXISTS place_of_supply text,
ADD COLUMN IF NOT EXISTS is_sez boolean DEFAULT false;

-- Add Razorpay integration fields to payments
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
ADD COLUMN IF NOT EXISTS razorpay_order_id text,
ADD COLUMN IF NOT EXISTS razorpay_signature text,
ADD COLUMN IF NOT EXISTS upi_id text;

-- Create GST validation function
CREATE OR REPLACE FUNCTION validate_gstin()
RETURNS TRIGGER AS $$
BEGIN
  -- Basic regex for 15 char GSTIN format
  IF NEW.gstin IS NOT NULL AND NEW.gstin !~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$' THEN
    RAISE EXCEPTION 'Invalid GSTIN format';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_gstin_format ON public.clients;
CREATE TRIGGER check_gstin_format
BEFORE INSERT OR UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION validate_gstin();

-- Create HSN/SAC table for services
CREATE TABLE IF NOT EXISTS public.hsn_sac_codes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    code text NOT NULL,
    description text NOT NULL,
    default_gst_rate numeric(5,2) NOT NULL,
    type text NOT NULL CHECK (type IN ('HSN', 'SAC')),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.hsn_sac_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read HSN" ON public.hsn_sac_codes FOR SELECT USING (true);
CREATE POLICY "Admin All HSN" ON public.hsn_sac_codes FOR ALL USING (auth.jwt() ->> 'user_role' = 'admin');

-- Add Prediction Result Constraints
ALTER TABLE public.prediction_results
DROP CONSTRAINT IF EXISTS unique_prediction_date;
ALTER TABLE public.prediction_results
ADD CONSTRAINT unique_prediction_date UNIQUE (model_id, target_date);
