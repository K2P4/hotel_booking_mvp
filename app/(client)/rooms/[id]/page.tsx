import Link from 'next/link';
import { BookingForm } from '@/components/booking-form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Users, Bed, AlertCircle } from 'lucide-react';
import { getDetailRoom } from '@/actions/rooms';

interface RoomPageProps {
  params: { id: string };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { room, error } = await getDetailRoom(params.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Link href="/">
          <Button variant="ghost" className="mb-6 flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Rooms</span>
          </Button>
        </Link>

        {room && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{room.name}</h1>

                <div className="flex items-center space-x-6 mb-8 text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Up to {room.max_guests} guests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bed className="w-5 h-5" />
                    <span>Luxury bedroom</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">About this room</h2>
                  <p className="text-muted-foreground leading-relaxed">Experience ultimate comfort in our {room.name}. This beautifully appointed room features modern amenities and elegant design.</p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {['Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Mini Bar', 'Room Service', 'Daily Housekeeping', 'Safe', 'Coffee Maker'].map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2 text-muted-foreground">
                        <div className="w-2 h-2 bg-slate-900 rounded-full" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <BookingForm roomId={room.id} pricePerNight={room.price_per_night} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
