export interface Booking {
  id: string;
  check_in?: string;
  check_out?: string;
  total_price?: number;
  status: string;
  room: {name: string;}[];
  user: {full_name: string;}[];
}

export interface CreateBookingInput {
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}
