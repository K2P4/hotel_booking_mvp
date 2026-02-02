# Hotel Booking MVP
A modern, full-stack hotel booking application built with Next.js 14+, Supabase, and shadcn/ui components.

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


## License

MIT
