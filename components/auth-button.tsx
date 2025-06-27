import Link from 'next/link';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from './logout-button';
import { headers } from 'next/headers'; // 1. Import the headers function

export async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Get the current path from the request headers
  const headerList = await headers();
  // The 'referer' header gives us the full URL of the page the user is on.
  const referer = headerList.get('referer');
  let redirectQuery = '';

  if (referer) {
    const refererUrl = new URL(referer);
    const pathname = refererUrl.pathname;

    // 3. Only add the redirect query if it's a meaningful path
    //    (i.e., not an auth page itself, to prevent loops)
    if (!pathname.startsWith('/auth')) {
      redirectQuery = `?redirect=${pathname}`;
    }
  }

  return user ? (
    <div className="flex items-center gap-4">
      <p className="hidden sm:block text-sm">Hey, {user.email}!</p>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={'outline'}>
        {/* 4. Append the redirect query to the href */}
        <Link href={`/auth/login${redirectQuery}`}>Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={'default'}>
        {/* Also add to sign-up for a consistent experience */}
        <Link href={`/auth/sign-up${redirectQuery}`}>Sign up</Link>
      </Button>
    </div>
  );
}
