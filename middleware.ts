// middleware.ts
// Protects all /admin routes except /admin/login.
// Does NOT affect /, /auth/*, /dashboard/* routes.

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow /admin/login without auth
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check for Supabase session via cookies or Authorization header
  const authHeader = request.headers.get('authorization');
  const bearerToken =
    authHeader && authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7)
      : undefined;

  const supabaseToken =
    request.cookies.get('sb-access-token')?.value ??
    request.cookies.get('supabase-auth-token')?.value ??
    bearerToken;

  if (!supabaseToken) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
