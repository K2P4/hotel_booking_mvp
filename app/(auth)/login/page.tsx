'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { loginClient } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/app/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await loginClient(email, password);
      if (result?.error) {
        toast.error(result.error);
      }
      return result;
    },

    onSuccess: async (result) => {
      if (result?.session) {
        const supabase = createClient();
        const sessionPromise = new Promise<void>((resolve) => {
          const {
            data: { subscription },
          } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && session)) {
              subscription?.unsubscribe();
              resolve();
            }
          });
          setTimeout(() => {
            subscription?.unsubscribe();
            resolve();
          }, 2000);
        });

        await sessionPromise;
        toast.success('Welcome from Our Thura Hotel 🎉');
        router.push('/');
      }
    },

    onError: (err: any) => {
      toast.error(err?.message);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    loginMutation.mutate({ email, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-slate-900 rounded-full">
              <Hotel className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue booking</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
