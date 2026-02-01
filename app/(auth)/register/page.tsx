'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { signupClient } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Hotel } from 'lucide-react';
import { toast } from 'sonner';
import { SignupPayload } from '@/types/auth';

export default function RegisterPage() {
  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: async ({ email, password, fullName }: SignupPayload) => {
      const result = await signupClient(email, password, fullName);
      if (result?.error) {
        toast.error(result.error);
      }
      return result;
    },

    onSuccess: (data) => {
      if (data?.requiresEmailConfirm) {
        toast.success('Account created! Check your email to confirm.');
        return;
      }

      toast.success('Account created successfully 🎉');
      router.push('/');
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const fullName = formData.get('full_name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const password = formData.get('password')?.toString();
    const confirmPassword = formData.get('confirm_password')?.toString();

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    signupMutation.mutate({ fullName, email, password });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-slate-900 rounded-full">
              <Hotel className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Sign up to start booking</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input name="full_name" placeholder="Jhon Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwod">Password</Label>
              <Input name="password" type="password" placeholder="••••••••" required />
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input name="confirm_password" type="password required" required />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" disabled={signupMutation.isPending} className="w-full">
              {signupMutation.isPending ? 'Creating account…' : 'Sign Up'}
            </Button>

            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
