import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Hotel, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Hotel className="h-8 w-8 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">We can’t find this stay</h1>
          <p className="text-muted-foreground">The page you’re looking for may have been removed or the link is no longer available.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/">
              <Search className="mr-2 h-4 w-4" />
              Search hotels
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
