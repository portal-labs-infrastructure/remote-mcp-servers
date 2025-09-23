'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-8', className)} {...props}>
      {success ? (
        <Card className="shadow-2xl border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <div className="h-8 w-8 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-center text-base">
                Password reset instructions have been sent
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                If you registered using your email and password, you will
                receive a password reset email shortly. Please check your inbox
                and follow the instructions.
              </p>
            </div>
            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-2xl border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Reset Your Password
              </CardTitle>
              <CardDescription className="text-center text-base">
                Enter your email and we&apos;ll send you a reset link
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="h-12 border-border/50 bg-background/50 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
                />
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Reset Email'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-lg border border-border/50 bg-background/50 hover:bg-muted/50 px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105">
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
