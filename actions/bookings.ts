'use server';
import { createClient } from '@/app/lib/supabase/server';
import { handleError } from '@/helper/helper';
import { CreateBookingInput } from '@/types/booking';
import { revalidatePath } from 'next/cache';

function overlapQuery(supabase: any, roomId: string, checkIn: string, checkOut: string) {
  return supabase
    .from('bookings')
    .select('id')
    .eq('room_id', roomId)
    .eq('status', 'confirmed')
    .or(`check_in.lte.${checkOut},check_out.gte.${checkIn}`)
    .not('check_in', 'gte', checkOut)
    .not('check_out', 'lte', checkIn);
}

export async function createBooking(input: CreateBookingInput) {
  const { roomId, checkIn, checkOut, totalPrice } = input;
  const supabase = createClient();
  const {data: { user }} = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in to book a room' };

  if (!checkIn || !checkOut) {
    return { error: 'Please select check-in and check-out dates' };
  }

  if (new Date(checkIn) >= new Date(checkOut)) {
    return { error: 'Check-out date must be after check-in date' };
  }

  const { data: overlapping } = await overlapQuery(supabase, roomId, checkIn, checkOut);

  if (overlapping?.length) {
    return { error: 'This room is not available for the selected dates' };
  }

  const { error } = await supabase.from('bookings').insert({
    user_id: user.id,
    room_id: roomId,
    check_in: checkIn,
    check_out: checkOut,
    total_price: totalPrice,
    status: 'confirmed',
  });

  if (error) return { error: error.message };

  revalidatePath('/my-bookings');
  return { success: true };
}

export async function getAllBookings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('bookings').select(` id,  check_in,  check_out,  total_price,  status,  user:user_id (full_name), room: room_id (name)  `).order('created_at', { ascending: true });

  return handleError(data, error);
}

export async function getUserBooking() {
  const supabase = await createClient();
  const {data: { user }} = await supabase.auth.getUser();

  if (!user) {
    return handleError(null, { message: 'Not authenticated' });
  }
  
  const { data, error } = await supabase.from('bookings').select(`*,rooms (id,  name,  price_per_night)`).eq('user_id', user.id).order('created_at', { ascending: false });
  return handleError(data, error);
}

export async function checkAvailability(roomId: string, checkIn: string, checkOut: string) {
  const supabase = createClient();
  const { data } = await overlapQuery(supabase, roomId, checkIn, checkOut);
  return { available: !data?.length };
}
