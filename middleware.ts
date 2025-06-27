// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './lib/supabase/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { pathname } = req.nextUrl;

  // Define which routes are for authentication (and should be public)
  const authRoutes = ['/auth/login', '/auth/sign-up'];

  // --- Logic for LOGGED-IN users ---
  // If a logged-in user tries to visit an auth page, redirect them to the dashboard.
  if (session && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // --- Logic for LOGGED-OUT users ---
  // If a user is not logged in AND is trying to access a route that is NOT an auth route,
  // it must be a protected route. Redirect them to login.
  if (!session && !authRoutes.includes(pathname)) {
    const redirectUrl = new URL('/auth/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If none of the above conditions are met, let the request proceed.
  // (e.g., a logged-in user accessing /dashboard, or a logged-out user accessing /auth/login)
  return res;
}

export const config = {
  // The middleware will run on these specific paths.
  // Public pages like '/', '/about', '/servers' are correctly ignored.
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/auth/login',
    '/auth/sign-up',
  ],
};
