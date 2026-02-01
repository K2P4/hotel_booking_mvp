# Hotel Booking MVP

A modern, full-stack hotel booking application built with Next.js 13+, Supabase, and shadcn/ui components.

## Features

- **Authentication**: Email/password registration and login with Supabase Auth
- **Room Browsing**: View available hotel rooms with pricing and capacity details
- **Room Booking**: Select dates and book rooms with automatic availability checking
- **Booking Management**: View all your bookings in one place
- **Protected Routes**: Secure routes with middleware-based authentication
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Admin Suite (New)** : Room CRUD: Create, Edit, and Delete rooms via an admin dashboard. User Management: View a complete list of registered users and their details. Inventory Control: Toggle room availability (is_active).

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **ORM**: Supabase JS Client

## Project Structure

```
├── actions/              # Server actions
│   ├── auth.ts          # Authentication actions
│   └── bookings.ts      # Booking management actions
├── app/                 # Next.js App Router pages
│   ├── admin/           # Added: Admin restricted route group
│   │   ├── dashboard/   # Management overview
│   │   ├── rooms/       # CRUD interface for rooms
│   │   └── users/       # User list view
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── rooms/[id]/     # Room detail & booking page
│   └── my-bookings/    # User bookings page
├── components/          # Reusable components
│   ├── admin/           
│   │   ├── room-form.tsx # Form for adding/editing rooms
│   │   └── user-list.tsx # Table display for user management
│   ├── navigation.tsx  # Header navigation
│   ├── room-card.tsx   # Room display card
│   └── booking-form.tsx # Booking form with date picker
├── lib/                 # Utilities
│   └── supabase/       # Supabase client configuration
└── middleware.ts        # Route protection middleware
├── types/          # declare types
│   ├── auth.ts


```

## Database Schema

### profiles
- `id` (uuid, PK) - References auth.users
- `full_name` (text) - User's full name
- `role` (text) - User role (default: 'guest')
- `created_at` (timestamp) - Creation timestamp

### rooms
- `id` (uuid, PK) - Room identifier
- `name` (text) - Room name
- `description` (longtext) - Room Description
- `bed_room` (enum or something) - Bedroom type
- `price_per_night` (integer) - Price in cents
- `max_guests` (integer) - Maximum occupancy
- `is_active` (boolean) - Availability status
- `created_at` (timestamp) - Creation timestamp

### bookings
- `id` (uuid, PK) - Booking identifier
- `user_id` (uuid, FK) - References auth.users
- `room_id` (uuid, FK) - References rooms
- `check_in` (date) - Check-in date
- `check_out` (date) - Check-out date
- `total_price` (integer) - Total price in cents
- `status` (text) - Booking status (default: 'confirmed')
- `created_at` (timestamp) - Creation timestamp

Admin Functionality
1. Room CRUD
Create: Add new rooms .
Update: Edit pricing or availability for existing rooms.

Delete: Remove rooms from the database (ensuring no active bookings exist).

2. User Management
List Users: View all registered users, their full names, and their roles.

Audit: Track when users joined the platform.

3. Permissions
Middleware: Automatically redirects non-admin users if they attempt to access /admin.

Supabase RLS: Policies are set so that only users with the admin role can perform INSERT, UPDATE, or DELETE on the rooms table.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. The database schema has already been applied to your Supabase instance with sample room data.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Users

1. **Register**: Create an account on the `/register` page
2. **Browse Rooms**: View available rooms on the homepage
3. **Book a Room**:
   - Click on a room to view details
   - Select check-in and check-out dates
   - Review the total price
   - Confirm your booking
4. **View Bookings**: Access your bookings from the "My Bookings" page

### Sample Rooms

The application comes with 6 pre-configured rooms:
- Deluxe Ocean View - $150/night (2 guests)
- Family Suite - $250/night (4 guests)
- Executive Room - $200/night (2 guests)
- Penthouse Suite - $350/night (4 guests)
- Standard Room - $100/night (2 guests)
- Garden Villa - $300/night (6 guests)

## Key Features Explained

### Authentication Flow
- New users register with email, password, and full name
- A profile is automatically created via database trigger
- Middleware protects authenticated routes
- Users are redirected to login if not authenticated

### Booking System
- Date validation ensures check-out is after check-in
- Automatic conflict detection prevents double-booking
- Price calculation based on number of nights
- Real-time availability checking

### Security
- Row Level Security (RLS) policies on all tables
- Users can only view/create their own bookings
- Authenticated users can view active rooms
- Server-side validation for all operations

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Supabase Configuration

Your Supabase instance is already configured with:
- Database schema
- RLS policies
- Sample room data
- Authentication settings

## Development Notes

- Server Components are used by default for better performance
- Client Components are used only where necessary (forms, interactive elements)
- All prices are stored as integers (cents) to avoid floating-point issues
- Date handling uses native HTML5 date inputs for simplicity

## Future Enhancements (Not in MVP)

- Payment integration
- Booking cancellation
- Review system
- Multi-hotel support
- Admin dashboard
- Email notifications
- Image uploads for rooms
- Advanced search and filtering

## License

MIT
