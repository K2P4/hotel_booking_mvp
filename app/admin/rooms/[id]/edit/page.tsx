import { createClient } from '@/app/lib/supabase/server';
import { RoomForm } from '@/components/admin/room-form';
import { toast } from 'sonner';

export default async function EditRoomPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: room, error } = await supabase.from('rooms').select('*').eq('id', params.id).single();

  if (error) toast.error(error);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Room</h1>
        <p className="text-muted-foreground mt-2">
          Update details for <strong>{room.name}</strong>
        </p>
      </div>

      <RoomForm mode="edit" room={room} />
    </div>
  );
}
