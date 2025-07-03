
-- Insert dummy projects data
INSERT INTO public.projects (title, description, status, location, budget, progress_percentage, start_date, end_date, image_url) VALUES
('Free Church Transportation Network', 'Connecting church communities across Nigeria with reliable and affordable transportation solutions. This project aims to bridge the gap between isolated communities and their places of worship.', 'active', 'Lagos, Nigeria', 500000, 75, '2024-01-15', '2024-12-31', '/lovable-uploads/7eae2d36-486c-4f8e-aa01-ca9414ab4528.png'),
('Community Outreach Programs', 'Expanding our reach to rural communities through mobile church services and community support programs. Bringing faith and hope to underserved areas.', 'active', 'Abuja, Nigeria', 300000, 60, '2024-03-01', '2024-11-30', '/lovable-uploads/bb40c7c8-e5f2-456f-93e1-67a40d9ff480.png'),
('Digital Faith Platform', 'Developing a comprehensive digital platform for churches to manage their congregations, events, and community outreach effectively.', 'active', 'Port Harcourt, Nigeria', 750000, 40, '2024-06-01', '2025-05-31', '/lovable-uploads/2ddb1688-61b9-4b51-b259-c1f342934418.png')
ON CONFLICT DO NOTHING;

-- Insert dummy news data
INSERT INTO public.news (title, content, excerpt, category, author_name, is_published, published_at, image_url) VALUES
('Gospool Launches Revolutionary Church Transportation Network', 'We are excited to announce the launch of Gospool, a groundbreaking initiative that connects church communities across Nigeria through reliable and affordable transportation solutions. This innovative platform bridges the gap between faith and accessibility, ensuring that distance is no longer a barrier to worship and community participation.', 'Gospool launches to connect church communities across Nigeria with reliable transportation solutions.', 'Launch', 'Gospool Team', true, NOW() - INTERVAL '5 days', '/lovable-uploads/7eae2d36-486c-4f8e-aa01-ca9414ab4528.png'),
('Partnership with Local Churches Grows Stronger', 'Our partnership network continues to expand as more churches recognize the value of connected communities. We have successfully onboarded over 50 churches across major Nigerian cities, creating a robust network of faith-based transportation solutions.', 'Over 50 churches join our growing network of connected communities.', 'Partnership', 'Community Relations Team', true, NOW() - INTERVAL '10 days', '/lovable-uploads/bb40c7c8-e5f2-456f-93e1-67a40d9ff480.png'),
('Community Impact Recognition Award', 'Gospool has been recognized by the Nigerian Community Development Initiative for our outstanding contribution to community connectivity and social impact. This award acknowledges our commitment to breaking down barriers and building bridges within faith communities.', 'Gospool receives recognition for outstanding community impact and connectivity.', 'Award', 'Impact Team', true, NOW() - INTERVAL '15 days', '/lovable-uploads/2ddb1688-61b9-4b51-b259-c1f342934418.png'),
('Technology Innovation in Faith-Based Services', 'Our innovative approach to combining technology with faith-based services has set new standards in the industry. By leveraging modern solutions, we are making church participation more accessible and community connections stronger than ever.', 'Innovation in technology brings faith communities closer together.', 'Technology', 'Tech Team', true, NOW() - INTERVAL '20 days', '/lovable-uploads/52524576-df42-4ff1-ae6b-916c64b5f607.png')
ON CONFLICT DO NOTHING;

-- Insert dummy team members data
INSERT INTO public.team_members (name, role, team_role, bio, email, linkedin_url, image_url, order_index, is_active) VALUES
('Coming Soon', 'Founder/Product Owner', 'Visionary Leader', 'Leading the mission to connect church communities across Nigeria and beyond.', 'founder@gospool.com', '#', '', 1, true),
('Coming Soon', 'Product Manager', 'Strategy Expert', 'Overseeing product development and strategic planning for community growth.', 'pm@gospool.com', '#', '', 2, true),
('Coming Soon', 'Full Stack Developer', 'Technical Lead', 'Building robust solutions for seamless church community connections.', 'dev1@gospool.com', '#', '', 3, true),
('Coming Soon', 'Full Stack Developer', 'Backend Specialist', 'Developing scalable backend systems for reliable service delivery.', 'dev2@gospool.com', '#', '', 4, true),
('Coming Soon', 'Full Stack Developer', 'Frontend Specialist', 'Creating intuitive user experiences for community engagement.', 'dev3@gospool.com', '#', '', 5, true),
('Coming Soon', 'Mobile Developer', 'iOS Specialist', 'Developing mobile solutions for iOS platform accessibility.', 'mobile1@gospool.com', '#', '', 6, true),
('Coming Soon', 'Mobile Developer', 'Android Specialist', 'Building Android applications for broader community reach.', 'mobile2@gospool.com', '#', '', 7, true),
('Coming Soon', 'UI/UX Designer', 'Design Lead', 'Crafting beautiful and functional interfaces for user engagement.', 'design@gospool.com', '#', '', 8, true)
ON CONFLICT DO NOTHING;

-- Insert dummy board advisors data
INSERT INTO public.board_advisors (name, title, company, bio, linkedin_url, image_url, order_index, is_active) VALUES
('Coming Soon', 'Board of Advisors', 'TBD', 'Strategic advisor bringing extensive experience in community development and faith-based initiatives.', '#', '', 1, true),
('Coming Soon', 'Board of Advisors', 'TBD', 'Experienced leader in technology and innovation, guiding our digital transformation journey.', '#', '', 2, true)
ON CONFLICT DO NOTHING;

-- Insert dummy impact sponsors data
INSERT INTO public.impact_sponsors (sponsor_name, sponsor_type, tier, contribution_amount, logo_url, website_url, is_active, order_index) VALUES
('Faith Community Partners', 'Corporate', 'platinum', 100000, '', '#', true, 1)
ON CONFLICT DO NOTHING;

-- Insert sample donation data (representing recent donors)
INSERT INTO public.donations (donor_name, donor_email, amount, currency, message, is_anonymous, status) VALUES
('John Doe', 'john@example.com', 50000, 'NGN', 'Supporting the great work you do in connecting communities', false, 'completed'),
('Jane Smith', 'jane@example.com', 25000, 'NGN', 'Keep up the excellent work!', false, 'completed'),
('Anonymous Donor', NULL, 100000, 'NGN', 'May God bless this initiative', true, 'completed'),
('Michael Johnson', 'michael@example.com', 75000, 'NGN', 'Proud to support church transportation', false, 'completed'),
('Sarah Wilson', 'sarah@example.com', 30000, 'NGN', 'Building bridges in our community', false, 'completed'),
('David Brown', 'david@example.com', 40000, 'NGN', 'Faith in action through transportation', false, 'completed')
ON CONFLICT DO NOTHING;

-- Create admin users management table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users management
CREATE POLICY "Admins can manage admin users" ON public.admin_users
  FOR ALL USING (public.is_admin());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- Insert current admin user if not exists
INSERT INTO public.admin_users (user_id, email, full_name, is_active)
SELECT ur.user_id, u.email, u.raw_user_meta_data->>'full_name', true
FROM public.user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE ur.role = 'admin'
ON CONFLICT (user_id) DO NOTHING;
