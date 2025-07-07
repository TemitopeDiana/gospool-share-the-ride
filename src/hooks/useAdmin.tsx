
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Session } from '@supabase/supabase-js';

export const useAdmin = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ['user-roles', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      console.log('Checking user roles for user:', session.user.id);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error('User roles check error:', error);
        return [];
      }
      
      console.log('User roles result:', data);
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session?.user?.email);
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of the admin panel.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an issue signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if user has admin or super_admin role using string comparison to avoid type issues
  const isAdmin = userRoles?.some(role => {
    const roleString = String(role.role);
    return roleString === 'admin' || roleString === 'super_admin';
  }) || false;
  
  // Check if user has super_admin role specifically using string comparison
  const isSuperAdmin = userRoles?.some(role => {
    const roleString = String(role.role);
    return roleString === 'super_admin';
  }) || false;

  return {
    session,
    isAdmin,
    isSuperAdmin,
    isLoading: isLoading || rolesLoading,
    signOut,
  };
};
