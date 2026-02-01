import { RoomCard } from '@/components/room-card';
import { createClient } from '../lib/supabase/server';

export default async function HomePage() {
  const supabase = createClient();
  const { data: rooms } = await supabase.from('rooms').select('*').eq('is_active', true).order('price_per_night', { ascending: true });

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Find Your Perfect Stay</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Discover our carefully curated collection of rooms designed for comfort</p>
        </div>

        {rooms && rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} id={room.id} name={room.name} pricePerNight={room.price_per_night} maxGuests={room.max_guests} bedRoom={room.bed_room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rooms available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}
