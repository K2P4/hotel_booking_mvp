'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hotel, Calendar, LogOut, LayoutDashboardIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';
import { checkAdminAccess, logoutClient } from '@/actions/auth';
import { createClient } from '../lib/supabase/client';

const supabase = createClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle auth state
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      setUser(data.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    checkAdminAccess().then(({ isAdmin }) => {
      setIsAdmin(isAdmin);
    });
  }, [user]);

  const handleLogout = async () => {
    await logoutClient();
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <div className="rounded-lg bg-slate-900 p-2">
              <Hotel className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">HotelBooking</span>
          </Link>

          {!isLoading && user && (
            <nav className="flex items-center space-x-2 sm:space-x-4">
              {isAdmin && (
                <Link href="/admin/dashboard">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <LayoutDashboardIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </Button>
                </Link>
              )}

              <Link href="/my-bookings">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">My Bookings</span>
                </Button>
              </Link>

              <Button variant="destructive" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto px-5 py-6">{children}</main>
    </>
  );
}
