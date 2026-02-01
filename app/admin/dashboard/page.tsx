import { getDashboardStats } from '@/actions/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/utils/format';
import { Users, Bed, Calendar, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default async function AdminDashboard() {
  const { stats, error } = await getDashboardStats();
  if (error) toast.error(error);

  const statCards = [
    {
      title: 'Total Rooms',
      value: stats?.totalRooms,
      description: `${stats?.activeRooms} active`,
      icon: Bed,
      color: 'text-blue-600',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers,
      description: 'Registered users',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings,
      description: `${stats?.upcomingBookings} upcoming`,
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Active Rooms',
      value: stats?.activeRooms,
      description: 'Available for booking',
      icon: CheckCircle,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your hotel management system</p>
      </div>

      {/* Stats Card  */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Bookings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest bookings in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p className="text-muted-foreground">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats?.recentBookings.map((booking: any) => {
                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium">{booking.profiles?.full_name || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground">{booking.rooms?.name || 'Unknown Room'}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">${(booking.total_price / 100).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground capitalize">{booking.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <a href="/admin/rooms/create" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Bed className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <p className="font-medium">Add New Room</p>
              <p className="text-xs text-muted-foreground mt-1">Create a new room listing</p>
            </a>
            <a href="/admin/rooms" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <p className="font-medium">Manage Rooms</p>
              <p className="text-xs text-muted-foreground mt-1">View and edit all rooms</p>
            </a>
            <a href="/admin/users" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Users className="mx-auto h-8 w-8 text-purple-600 mb-2" />
              <p className="font-medium">View Users</p>
              <p className="text-xs text-muted-foreground mt-1">See all registered users</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
