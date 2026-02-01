

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text DEFAULT 'guest' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price_per_night integer NOT NULL,
  max_guests integer NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  total_price integer NOT NULL,
  status text DEFAULT 'confirmed' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT check_dates CHECK (check_out > check_in)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Rooms RLS Policies
CREATE POLICY "Authenticated users can view active rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Bookings RLS Policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample rooms data
INSERT INTO rooms (name, price_per_night, max_guests, is_active) VALUES
  ('Deluxe Ocean View', 15000, 2, true),
  ('Family Suite', 25000, 4, true),
  ('Executive Room', 20000, 2, true),
  ('Penthouse Suite', 35000, 4, true),
  ('Standard Room', 10000, 2, true),
  ('Garden Villa', 30000, 6, true)
ON CONFLICT DO NOTHING;