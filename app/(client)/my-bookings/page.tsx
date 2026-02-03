import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, MapPin } from 'lucide-react';
import { formatDate, formatPrice } from '@/utils/format';
import { getUserBooking } from '@/actions/bookings';

export default async function MyBookingsPage() {
  const { data, error } = await getUserBooking();

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-12">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {data && data.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>All Reservations</CardTitle>
              <CardDescription>
                You have {data.length} {data.length === 1 ? 'booking' : 'bookings'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room</TableHead>
                      <TableHead>Check-In</TableHead>
                      <TableHead>Check-Out</TableHead>
                      <TableHead>Nights</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((booking: any) => {
                      const nights = Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{booking.rooms?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{formatDate(booking.check_in)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{formatDate(booking.check_out)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {nights} {nights === 1 ? 'night' : 'nights'}
                          </TableCell>
                          <TableCell className="font-semibold">{formatPrice(booking.total_price)}</TableCell>
                          <TableCell>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'destructive'}>{booking.status}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-6">Start exploring our rooms and make your first reservation</p>
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Browse Rooms
                </a>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
