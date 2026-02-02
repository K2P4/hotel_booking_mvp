'use server'

import { revalidatePath } from 'next/cache';
import { checkAdminAccess } from './auth';
import { CreateRoomInput, UpdateRoomInput } from '@/types/rooms';
import { createClient } from '@/app/lib/supabase/server';

export async function getAllRooms() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('rooms').select('*').order('created_at', { ascending: false });

  if (error) {
    return { rooms: null, error: error.message };
  }

  return { rooms: data, error: null };
}


export async function getDetailRoom(roomId:string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('rooms').select('*').eq('id', roomId).eq('is_active', true).single();

  if (error) {
    return { room: null, error: error.message };
  }

  return { room: data, error: null };
}



export async function createRoom(formData: CreateRoomInput) {
  const { isAdmin } = await checkAdminAccess();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('rooms').insert(formData).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/rooms');

  return { success: true, data };
}

export async function updateRoom(formData: UpdateRoomInput) {
  const { isAdmin } = await checkAdminAccess();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  const { id, ...updateData } = formData;

  const supabase = await createClient();

  const { data, error } = await supabase.from('rooms').update(updateData).eq('id', id).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/rooms');

  return { success: true, data };
}

export async function deleteRoom(id: string) {
  const { isAdmin } = await checkAdminAccess();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { count, error: bookingError } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('room_id', id).gte('check_out', today);

  if (bookingError) {
    return { success: false, error: bookingError.message };
  }

  if (count && count > 0) {
    return {
      success: false,
      error: `Cannot delete room with ${count} active booking(s)`,
    };
  }

  const { error } = await supabase.from('rooms').delete().eq('id', id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/rooms');
  return { success: true };
}

export async function toggleRoomAvailability(id: string, is_active: boolean) {
  const { isAdmin } = await checkAdminAccess();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized: Admin access required' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.from('rooms').update({ is_active }).eq('id', id).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/rooms');
  return { success: true, data };
}
