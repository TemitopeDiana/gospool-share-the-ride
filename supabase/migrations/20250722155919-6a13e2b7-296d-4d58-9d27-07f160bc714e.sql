
-- Add columns to track webhook and verification attempts
ALTER TABLE public.paystack_transactions 
ADD COLUMN IF NOT EXISTS webhook_received_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_verification_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS webhook_payload JSONB;

-- Create index for better performance when querying pending payments
CREATE INDEX IF NOT EXISTS idx_paystack_transactions_pending 
ON public.paystack_transactions(status, created_at) 
WHERE status = 'pending';

-- Create index for webhook lookups
CREATE INDEX IF NOT EXISTS idx_paystack_transactions_reference 
ON public.paystack_transactions(reference);
