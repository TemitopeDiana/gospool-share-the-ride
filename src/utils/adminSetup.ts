
import { supabase } from '@/integrations/supabase/client';

export const ensureAdminRole = async (userId: string) => {
  try {
    // Check if admin role already exists
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();

    if (existingRole) {
      console.log('Admin role already exists for user:', userId);
      return true;
    }

    // Insert admin role
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin'
      });

    if (error) {
      console.error('Error inserting admin role:', error);
      return false;
    }

    console.log('Admin role successfully created for user:', userId);
    return true;
  } catch (error) {
    console.error('Error in ensureAdminRole:', error);
    return false;
  }
};
