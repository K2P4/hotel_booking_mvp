'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { Room } from '@/types/rooms';
import { deleteRoom, toggleRoomAvailability } from '@/actions/rooms';
import { formatPrice } from '@/utils/format';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type RoomTableProps = {
  rooms: Room[];
};

export function RoomTable({ rooms }: RoomTableProps) {
  const queryClient = useQueryClient();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (roomId: string) => deleteRoom(roomId),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? 'Failed to delete room');
        return;
      }

      toast.success('Room deleted successfully');
      setDeleteDialogOpen(false);
      setRoomToDelete(null);

      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
    onError: () => {
      toast.error('Something went wrong while deleting the room');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ roomId, isActive }: { roomId: string; isActive: boolean }) => toggleRoomAvailability(roomId, isActive),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? 'Failed to update room availability');
        return;
      }

      toast.success('Room availability updated');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
    onError: () => {
      toast.error('Something went wrong while updating availability');
    },
  });

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!roomToDelete) return;
    deleteMutation.mutate(roomToDelete.id);
  };

  const handleToggleAvailability = (room: Room) => {
    toggleMutation.mutate({
      roomId: room.id,
      isActive: !room.is_active,
    });
  };

  const isRowLoading = (roomId: string) => (deleteMutation.isPending && deleteMutation.variables === roomId) || (toggleMutation.isPending && toggleMutation.variables?.roomId === roomId);

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Name</TableHead>
                  <TableHead>Bedroom Type</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead>Max Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No rooms found. Create your first room to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>

                      <TableCell>{room.bed_room}</TableCell>

                      <TableCell className="font-semibold">{formatPrice(room.price_per_night || 0)}</TableCell>

                      <TableCell>{room.max_guests}</TableCell>

                      <TableCell>
                        <Badge variant={room.is_active ? 'default' : 'secondary'}>{room.is_active ? 'Active' : 'Inactive'}</Badge>
                      </TableCell>

                      <TableCell>
                        <Switch checked={room.is_active} onCheckedChange={() => handleToggleAvailability(room)} disabled={isRowLoading(room.id)} />
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/rooms/${room.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
{/* 
                          <Button variant="outline" size="sm" onClick={() => handleDeleteClick(room)} disabled={isRowLoading(room.id)}>
                            {deleteMutation.isPending && deleteMutation.variables === room.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the room <strong>"{roomToDelete?.name}"</strong>.
              <br />
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Room'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
