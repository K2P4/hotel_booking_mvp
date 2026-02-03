'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from './auth';
import { CreateRoomInput, UpdateRoomInput } from '@/types/rooms';
import { createClient } from '@/app/lib/supabase/server';
import { handleError } from '@/helper/helper';

export async function getAllRooms(isActive: boolean | null = null) {
  const supabase = await createClient();

  let query = supabase.from('rooms').select('*').order('created_at', { ascending: true });

  if (isActive !== null) {
    query = query.eq('is_active', isActive);
  }

  const { data, error } = await query;
  return handleError(data, error);
}

/** detail room */
export async function getDetailRoom(roomId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId).eq('is_active', true).single();

  return handleError(data, error);
}

/** create room */
export async function createRoom(formData: CreateRoomInput) {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase.from('rooms').insert(formData).select().single();

  if (error) return handleError(null, error);

  revalidatePath('/admin/rooms');
  return { success: true, data };
}

/** update room */
export async function updateRoom(formData: UpdateRoomInput) {
  await requireAdmin();
  const { id, ...updateData } = formData;
  const supabase = await createClient();
  const { data, error } = await supabase.from('rooms').update(updateData).eq('id', id).select().single();

  if (error) return handleError(null, error);

  revalidatePath('/admin/rooms');
  return { success: true, data };
}

/** delete room (checks active bookings first) */
export async function deleteRoom(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  const today = new Date().toISOString().slice(0, 10);
  const { count, error: bookingError } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('room_id', id).gte('check_out', today);

  if (bookingError) return { success: false, error: bookingError.message };
  if (count && count > 0) return { success: false, error: `Cannot delete room with ${count} active booking(s)` };

  const { error } = await supabase.from('rooms').delete().eq('id', id);
  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/rooms');
  return { success: true };
}

/** toogle room  */
export async function toggleRoomAvailability(id: string, is_active: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from('rooms').update({ is_active }).eq('id', id).select().single();

  if (error) return handleError(null, error);

  revalidatePath('/admin/rooms');
  return { success: true, data };
}
