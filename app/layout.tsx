import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import QueryProvider from './QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HotelBooking - Find Your Perfect Stay',
  description: 'Book luxury hotel rooms with ease. Discover comfort and elegance at competitive prices.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Toaster richColors closeButton position="top-center" />

          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
