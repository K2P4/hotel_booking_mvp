import { createClient } from '@/app/lib/supabase/server';
import { checkAdminAccess } from './auth';

export async function getAllUsers() {
  const { isAdmin } = await checkAdminAccess();
  if (!isAdmin) {
    return { users: null, error: 'Unauthorized: Admin access required' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from('profiles').select('id, full_name, role, created_at').order('created_at', { ascending: false });

  if (error) {
    return { users: null, error: error.message };
  }

  return { users: data, error: null };
}
