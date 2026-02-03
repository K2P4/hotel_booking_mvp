import { createClient } from '@/app/lib/supabase/server';
import {requireAdmin } from './auth';

export async function getDashboardStats() {

  await requireAdmin();
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [totalRooms, activeRooms, totalUsers, totalBookings, upcomingBookings, recentBookings] = await Promise.all([
    supabase.from('rooms').select('*', { count: 'exact', head: true }),
    supabase.from('rooms').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('check_in', today),
    supabase.from('bookings').select(`  id,  check_in,  check_out,  total_price,  status,  created_at,  rooms (name),  profiles (full_name)`).order('created_at', { ascending: false }).limit(3),
  ]);

  return {
    stats: {
      totalRooms: totalRooms.count ?? 0,
      activeRooms: activeRooms.count ?? 0,
      totalUsers: totalUsers.count ?? 0,
      totalBookings: totalBookings.count ?? 0,
      upcomingBookings: upcomingBookings.count ?? 0,
      recentBookings: recentBookings.data ?? [],
    },
    error: null,
  };
}
