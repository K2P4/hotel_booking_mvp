'use client';

import { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createBooking } from '@/actions/bookings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { formatPrice } from '@/utils/format';

interface BookingFormProps {
  roomId: string;
  pricePerNight: number;
}

const DAY_MS = 1000 * 60 * 60 * 24;

function getNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.ceil(diff / DAY_MS);
}

export function BookingForm({ roomId, pricePerNight }: BookingFormProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrow = useMemo(() => new Date(Date.now() + DAY_MS).toISOString().split('T')[0], []);

  const nights = getNights(checkIn, checkOut);
  const totalPrice = nights > 0 ? nights * pricePerNight : 0;

  function validateDates() {
    if (!checkIn || !checkOut) return 'Please select both dates';
    if (new Date(checkIn) >= new Date(checkOut)) {
      return 'Check-out must be after check-in';
    }
    return null;
  }

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (result) => {
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Booking confirmed 🎉');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Booking failed');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const error = validateDates();
    if (error) {
      toast.error(error);
      return;
    }

    mutation.mutate({
      roomId,
      checkIn,
      checkOut,
      totalPrice,
    });
  }

  const isDisabled = mutation.isPending || !checkIn || !checkOut || nights <= 0;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Book This Room</span>
        </CardTitle>
        <CardDescription>{formatPrice(pricePerNight)} per night</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="check_in">Check-In Date</Label>
            <Input id="check_in" type="date" min={today} value={checkIn} disabled={mutation.isPending} onChange={(e) => setCheckIn(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="check_out">Check-Out Date</Label>
            <Input id="check_out" type="date" min={checkIn || tomorrow} value={checkOut} disabled={mutation.isPending} onChange={(e) => setCheckOut(e.target.value)} />
          </div>

          {totalPrice > 0 && (
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {formatPrice(pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}
                </span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isDisabled}>
            {mutation.isPending ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
