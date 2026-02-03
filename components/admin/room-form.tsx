'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

import { Room } from '@/types/rooms';
import { createRoom, updateRoom } from '@/actions/rooms';

type RoomFormProps = {
  room?: Room;
  mode: 'create' | 'edit';
};

const bedroomTypes = ['Single', 'Double', 'Twin', 'Queen', 'King', 'Suite'];

export function RoomForm({ room, mode }: RoomFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: room?.name ?? '',
    description: room?.description ?? '',
    bed_room: room?.bed_room ?? 'Queen',
    price_per_night: room?.price_per_night ?? 0,
    max_guests: room?.max_guests ?? 2,
    is_active: room?.is_active ?? true,
  });

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Room name is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Room description is required');
      return false;
    }
    if (formData.price_per_night <= 0) {
      toast.error('Price must be greater than 0');
      return false;
    }
    if (formData.max_guests <= 0) {
      toast.error('Maximum guests must be at least 1');
      return false;
    }
    return true;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!validateForm()) throw new Error('Invalid form');

      const payload = {
        ...formData,
        price_per_night: Math.round(formData.price_per_night * 100),
      };

      return mode === 'create' ? createRoom(payload) : updateRoom({ id: room!.id, ...payload });
    },
    onSuccess: (result) => {
      if ('error' in result && result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(`Room ${mode === 'create' ? 'created' : 'updated'} successfully`);

      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      router.push('/admin/rooms');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Card className="mx-auto px-4 py-6">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Room Name <span className="text-red-500">*</span>
            </Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={mutation.isPending} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} disabled={mutation.isPending} />
          </div>

          {/* Bedroom + Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bedroom Type</Label>
              <Select value={formData.bed_room} onValueChange={(value) => setFormData({ ...formData, bed_room: value })} disabled={mutation.isPending}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bedroomTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Price per Night ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="1"
                value={formData.price_per_night}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_per_night: Number(e.target.value) || 0,
                  })
                }
                disabled={mutation.isPending}
              />
            </div>
          </div>

          {/* Max Guests */}
          <div className="space-y-2">
            <Label>Maximum Guests</Label>
            <Input
              type="number"
              min="1"
              value={formData.max_guests}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_guests: Number(e.target.value) || 0,
                })
              }
              disabled={mutation.isPending}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div>
              <Label className="text-base">Room Available</Label>
              <p className="text-sm text-muted-foreground">Make this room available for booking</p>
            </div>
            <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} disabled={mutation.isPending} />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create Room' : 'Update Room'}
            </Button>

            <Button type="button" variant="outline" onClick={() => router.back()} disabled={mutation.isPending}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
