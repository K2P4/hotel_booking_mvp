import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck } from 'lucide-react';
import { formatDate } from '@/utils/format';
import { Booking } from '@/types/booking';

type BookingListProps = {
  bookings: Booking[];
};

export function BookingList({ bookings }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <CalendarCheck className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
        <p className="text-muted-foreground">Bookings will appear here once users make a reservation</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room Name</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.room.name}</TableCell>
              <TableCell>{booking.user.full_name}</TableCell>
              <TableCell>{formatDate(booking.check_in || '')}</TableCell>
              <TableCell>{formatDate(booking.check_out || '')}</TableCell>
              <TableCell>${booking.total_price?.toFixed(1) || '0'}</TableCell>
              <TableCell>
                <Badge variant={booking.status === 'confirmed' ? 'default' : 'destructive'}>{booking.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
