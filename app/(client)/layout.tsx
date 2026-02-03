'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Hotel, Calendar, LogOut, LayoutDashboardIcon, Twitter, Mail, Facebook } from 'lucide-react';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';
import { checkAdminAccess, logoutClient } from '@/actions/auth';
import { createClient } from '../lib/supabase/client';

const supabase = createClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      setUser(data.user ?? null);
    });

    const {data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <div className="rounded-lg bg-slate-900 p-2">
              <Hotel className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">HotelBooking</span>
          </Link>

          {user && (
            <nav className="flex items-center space-x-2 sm:space-x-4">
              {isAdmin && (
                <Link href="/admin/dashboard">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <LayoutDashboardIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
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

      <main className="container mx-auto flex-1 px-5 py-8">{children}</main>

      {/* - Footer */}
      <footer className="relative border-t bg-gradient-to-b from-slate-50 to-white text-slate-600">
        <div className="container mx-auto px-5 py-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-5">
                <div className="rounded-xl bg-slate-900 p-2 shadow-sm">
                  <Hotel className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">HotelBooking</span>
              </div>

              <p className="max-w-md text-sm leading-6 text-slate-600">
                Experience world-class hospitality. Discover, book, and manage your stays with a fast, reliable, and beautifully simple booking experience.
              </p>
            </div>

            {/*  Links */}
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-900">Links</h3>

              <ul className="space-y-3 text-sm">
                {[
                  { href: '/hotels', label: 'Find Hotels' },
                  { href: '/my-bookings', label: 'My Bookings' },
                  { href: '/contact', label: 'Support Center' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="group inline-flex items-center gap-1 transition-colors hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-sm">
                      {link.label}
                      <span className="h-[1px] w-0 bg-slate-900 transition-all group-hover:w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-900">Connect</h3>

              <div className="flex items-center gap-3">
                <Link href="#" className="rounded-lg   p-2  hover:-translate-y-0.5 hover:text-slate-900 transition-all duration-300 ">
                  <Facebook className="h-5 w-5" />
                </Link>

                <Link href="#" className="rounded-lg   p-2  hover:-translate-y-0.5 hover:text-slate-900 transition-all duration-300 ">
                  <Twitter className="h-5 w-5" />
                </Link>

                <Link href="#" className="rounded-lg   p-2  hover:-translate-y-0.5 hover:text-slate-900 transition-all duration-300 ">
                  <Mail className="h-5 w-5" />
                </Link>
              </div>

              {/* mini contact */}
              <p className="mt-5 text-xs text-slate-500">support@hotelbooking.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t bg-white/70 backdrop-blur">
          <p className=" text-center gap-3 px-5 py-4 text-xs text-slate-500 ">© HotelBooking Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
