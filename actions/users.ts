import { createClient } from '@/app/lib/supabase/server';
import { requireAdmin } from './auth';
import { handleError } from '@/helper/helper';

export async function getAllUsers() {
  const supabase = await createClient();
  await requireAdmin();

  const { data, error } = await supabase.from('profiles').select('id, full_name, role, created_at').order('created_at', { ascending: false });
  return handleError(data, error);
}
