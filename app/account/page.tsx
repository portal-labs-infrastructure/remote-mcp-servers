import AccountForm from '@/components/account/account-form';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?message=Please log in to access your account page.');
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-md">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Your Account</h1>
      <AccountForm user={user} />
    </div>
  );
}
