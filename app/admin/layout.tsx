import Link from 'next/link';
import { LayoutDashboard, Bed, Users } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Statistics',
    },
    {
      href: '/admin/rooms',
      label: 'Rooms',
      icon: Bed,
      description: 'Manage Rooms',
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: Users,
      description: 'View All Users',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="bg-white border-b sticky px-6 top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Hotel Booking Management</p>
            </div>
            <Link href="/" className=" text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to Main Site →
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 ">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 shrink-0">
            <div className="sticky top-24">
              <nav className="space-y-1 bg-white rounded-lg border p-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors group">
                      <Icon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Stats Card */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-blue-900">Admin Access</p>
                </div>
                <p className="text-xs text-blue-700">You have full access to all management features</p>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
