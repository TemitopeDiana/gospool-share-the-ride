
-- Add organization-specific fields to the donations table
ALTER TABLE public.donations 
ADD COLUMN donor_type TEXT DEFAULT 'individual' CHECK (donor_type IN ('individual', 'organization')),
ADD COLUMN organization_name TEXT,
ADD COLUMN contact_person TEXT,
ADD COLUMN organization_type TEXT;

-- Update existing donations to have donor_type as 'individual'
UPDATE public.donations SET donor_type = 'individual' WHERE donor_type IS NULL;
