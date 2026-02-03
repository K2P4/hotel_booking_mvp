import { getAllRooms } from '@/actions/rooms';
import { RoomList } from '@/components/admin/room-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function AdminUsersPage() {
  const { data, error } = await getAllRooms();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Rooms Management</h1>
          <p className="text-muted-foreground mt-2">View all registered users and their details</p>
        </div>

        <Link className="flex items-center" href={`/admin/rooms/create`}>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> Create Room
          </Button>
        </Link>
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
          <p className="text-muted-foreground">No rooms found</p>
        </div>
      ) : (
        <RoomList rooms={data || []} />
      )}
    </div>
  );
}
