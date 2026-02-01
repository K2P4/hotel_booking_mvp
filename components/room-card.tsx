import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bed, Users } from 'lucide-react';
import { formatPrice } from '@/utils/format';

interface RoomCardProps {
  id: string;
  name: string;
  pricePerNight: number;
  maxGuests: number;
  bedRoom: number;
}

export function RoomCard({ id, name, pricePerNight, maxGuests,bedRoom }: RoomCardProps) {

  return (
    <Card className="h-full flex flex-col rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="space-y-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>Up to {maxGuests} guests</span>
          </div>

          <div className="flex items-center space-x-1">
            <Bed className="w-4 h-4" />
            <span>{bedRoom}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-3xl font-bold text-slate-900">
          {formatPrice(pricePerNight)}
          <span className="text-sm font-normal text-muted-foreground ml-1">/ night</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/rooms/${id}`} className="w-full">
          <Button className="w-full gap-2 ">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
