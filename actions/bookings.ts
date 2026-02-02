'use server';
import { createClient } from '@/app/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBooking(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to book a room' };
  }

  const roomId = formData.get('room_id') as string;
  const checkIn = formData.get('check_in') as string;
  const checkOut = formData.get('check_out') as string;
  const totalPrice = parseInt(formData.get('total_price') as string);

  if (!checkIn || !checkOut) {
    return { error: 'Please select check-in and check-out dates' };
  }

  if (new Date(checkIn) >= new Date(checkOut)) {
    return { error: 'Check-out date must be after check-in date' };
  }

  const { data: overlappingBookings } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_id', roomId)
    .eq('status', 'confirmed')
    .or(`check_in.lte.${checkOut},check_out.gte.${checkIn}`)
    .not('check_in', 'gte', checkOut)
    .not('check_out', 'lte', checkIn);

  if (overlappingBookings && overlappingBookings.length > 0) {
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

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/my-bookings');
  redirect('/my-bookings');
}

export async function getUserBooking() {
  const supabase = await createClient();

  const {data: { user }} = await supabase.auth.getUser();

  if (!user) {
    return { bookings: [], error: 'Not authenticated' };
  }

  const { data, error } = await supabase.from('bookings').select(`*,rooms (  id,  name,  price_per_night`).eq('user_id', user.id).order('created_at', { ascending: false });

  if (error) {
    return { bookings: [], error: error.message };
  }

  return { bookings: data ?? [], error: null };
}

export async function checkAvailability(roomId: string, checkIn: string, checkOut: string) {
  const supabase = createClient();

  const { data: overlappingBookings } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_id', roomId)
    .eq('status', 'confirmed')
    .or(`check_in.lte.${checkOut},check_out.gte.${checkIn}`)
    .not('check_in', 'gte', checkOut)
    .not('check_out', 'lte', checkIn);

  return {
    available: !overlappingBookings || overlappingBookings.length === 0,
  };
}
