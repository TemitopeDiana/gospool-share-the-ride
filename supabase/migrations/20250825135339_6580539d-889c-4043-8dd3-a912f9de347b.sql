-- Assign admin role to joelpaul345@gmail.com to fix login redirect issue
INSERT INTO public.user_roles (user_id, role) 
VALUES ('75da0827-a9e6-4870-a52f-8983c1daa061', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;