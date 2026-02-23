// middleware.ts
// Protects all /admin routes except /admin/login.
// Does NOT affect /, /auth/*, /dashboard/* routes.
// Uses @supabase/ssr to validate the session from cookies and enforce
// the must_change_password redirect when required.

import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow /admin/login without auth
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // If Supabase is not configured, allow through (graceful degradation in dev)
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // Build a mutable response so @supabase/ssr can refresh auth cookies
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to change-password if the flag is set, unless already there
  const mustChange = user.user_metadata?.must_change_password === true;
  if (mustChange && pathname !== '/admin/settings/change-password') {
    const changeUrl = new URL('/admin/settings/change-password', request.url);
    return NextResponse.redirect(changeUrl);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
