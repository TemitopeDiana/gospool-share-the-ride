
-- Create a table to store Paystack transaction references and details
CREATE TABLE public.paystack_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donation_id UUID REFERENCES public.donations(id),
  reference TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  status TEXT NOT NULL DEFAULT 'pending',
  paystack_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.paystack_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage all transactions
CREATE POLICY "Admins can manage paystack transactions" 
  ON public.paystack_transactions 
  FOR ALL 
  USING (is_admin());

-- Create policy for users to view their own transactions
CREATE POLICY "Users can view own paystack transactions" 
  ON public.paystack_transactions 
  FOR SELECT 
  USING (
    donation_id IN (
      SELECT id FROM public.donations WHERE user_id = auth.uid()
    )
  );
