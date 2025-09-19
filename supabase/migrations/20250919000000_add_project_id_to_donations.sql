-- Add project_id column to donations table to link donations with specific projects
ALTER TABLE public.donations 
ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_donations_project_id ON public.donations(project_id);

-- Add some useful comments
COMMENT ON COLUMN public.donations.project_id IS 'Optional reference to a specific project this donation supports. NULL means general donation.';