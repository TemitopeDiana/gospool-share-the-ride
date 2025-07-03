
-- Create enum for application status
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for donation status  
CREATE TYPE donation_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  status donation_status DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  donor_name TEXT,
  donor_email TEXT,
  donor_phone TEXT,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sponsorship applications table
CREATE TABLE public.sponsorship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sponsor_type TEXT NOT NULL,
  organization_name TEXT,
  contact_person TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  sponsor_amount DECIMAL(12,2),
  sponsor_duration TEXT,
  motivation TEXT,
  profile_picture_url TEXT,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create impact report requests table
CREATE TABLE public.impact_reports_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_email TEXT NOT NULL,
  requester_name TEXT,
  organization TEXT,
  report_type TEXT,
  purpose TEXT,
  status application_status DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  location TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create news table
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  author_name TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team members table
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create board advisors table
CREATE TABLE public.board_advisors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT,
  bio TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create impact sponsors table
CREATE TABLE public.impact_sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.sponsorship_applications(id),
  sponsor_name TEXT NOT NULL,
  sponsor_type TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  contribution_amount DECIMAL(12,2),
  tier TEXT DEFAULT 'bronze',
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create team applications table
CREATE TABLE public.team_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  position_applied TEXT NOT NULL,
  experience TEXT,
  motivation TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsorship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_reports_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Create RLS policies for admin access
CREATE POLICY "Admins can manage donations" ON public.donations
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage sponsorship applications" ON public.sponsorship_applications
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage impact report requests" ON public.impact_reports_requests
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view published projects" ON public.projects
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage news" ON public.news
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view published news" ON public.news
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins can manage team members" ON public.team_members
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view active team members" ON public.team_members
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage board advisors" ON public.board_advisors
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view active board advisors" ON public.board_advisors
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage impact sponsors" ON public.impact_sponsors
  FOR ALL USING (public.is_admin());

CREATE POLICY "Public can view active impact sponsors" ON public.impact_sponsors
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage team applications" ON public.team_applications
  FOR ALL USING (public.is_admin());

CREATE POLICY "Users can manage own applications" ON public.team_applications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage user roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_donations_user_id ON public.donations(user_id);
CREATE INDEX idx_donations_status ON public.donations(status);
CREATE INDEX idx_donations_created_at ON public.donations(created_at);

CREATE INDEX idx_sponsorship_applications_status ON public.sponsorship_applications(status);
CREATE INDEX idx_sponsorship_applications_created_at ON public.sponsorship_applications(created_at);

CREATE INDEX idx_impact_reports_status ON public.impact_reports_requests(status);
CREATE INDEX idx_news_published ON public.news(is_published, published_at);
CREATE INDEX idx_team_members_active ON public.team_members(is_active, order_index);
CREATE INDEX idx_board_advisors_active ON public.board_advisors(is_active, order_index);
CREATE INDEX idx_impact_sponsors_active ON public.impact_sponsors(is_active, order_index);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
