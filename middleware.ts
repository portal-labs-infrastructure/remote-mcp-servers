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

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings']; // Add your protected routes

  if (!session && protectedRoutes.some((route) => pathname.startsWith(route))) {
    // User is not authenticated and trying to access a protected route
    const redirectUrl = new URL('/auth/login', req.url); // Your login page URL
    redirectUrl.searchParams.set('redirect', pathname + req.nextUrl.search); // Add current path and query as redirect
    return NextResponse.redirect(redirectUrl);
  }

  // If user is logged in and tries to access login/signup, redirect to dashboard
  if (session && (pathname === '/auth/login' || pathname === '/auth/sign-up')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
