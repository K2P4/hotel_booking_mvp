export interface Room {
  id: string;
  name: string;
  description?: string;
  bed_room?: string;
  price_per_night?: number;
  max_guests?: number;
  is_active?: boolean;
}

export type CreateRoomInput = Omit<Room, 'id'>;

/** Used when updating a room */
export type UpdateRoomInput = Partial<Omit<Room, 'id'>> & {
  id: string;
};
