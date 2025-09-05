-- Update RLS policy for impact_sponsors to restrict delete operations to super admins only
DROP POLICY IF EXISTS "Admins can manage impact sponsors" ON public.impact_sponsors;

-- Create separate policies for different operations
CREATE POLICY "Admins can view all impact sponsors" ON public.impact_sponsors
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert impact sponsors" ON public.impact_sponsors
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update impact sponsors" ON public.impact_sponsors
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only super admins can delete impact sponsors" ON public.impact_sponsors
  FOR DELETE USING (public.is_super_admin());
