import { getAllBookings } from '@/actions/bookings';
import { BookingList } from '@/components/admin/booking-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default async function BookingPage() {
  const { data, error } = await getAllBookings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <p className="text-muted-foreground mt-2">View all users hotel rooms bookings </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data?.length == 0 ? (
        <div className="text-center py-12 border rounded-lg bg-white">
          <p className="text-muted-foreground">No data found</p>
        </div>
      ) : (
        <BookingList bookings={data || []} />
      )}
    </div>
  );
}
