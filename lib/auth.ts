// lib/auth.ts
// Extracts and validates the authenticated user from a Next.js request.
// Supports two auth mechanisms (tried in order):
//   1. Bearer token in the Authorization header → looked up in Session table.
//   2. Supabase session cookie → used by the admin UI which is already
//      protected by the Supabase-based middleware.
import 'server-only';
import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/db';
import type { User } from '@prisma/client';

/**
 * Reads the Bearer token from the Authorization header and looks up the
 * associated Session + User in the database.
 * Returns null if the token is missing, invalid, or expired.
 */
async function getUserFromBearerToken(req: NextRequest): Promise<User | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => null);
      return null;
    }

    return session.user;
  } catch {
    return null;
  }
}

/**
 * Checks the Supabase session stored in cookies (set by the browser when the
 * admin logs in via Supabase Auth).  When a valid session is found, ensures a
 * corresponding Prisma User row exists (upserting if necessary) with ADMIN role,
 * so that the RBAC layer can make authorization decisions.
 *
 * This bridges the Supabase-cookie auth used by the admin UI with the Prisma
 * DB-backed auth used by API routes.
 */
async function getUserFromSupabaseCookies(req: NextRequest): Promise<User | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll() {
          // Read-only context – we don't need to refresh cookies here.
        },
      },
    });

    const {
      data: { user: sbUser },
    } = await supabase.auth.getUser();
    if (!sbUser) return null;

    // Upsert a Prisma User keyed on the Supabase user UUID. We use a
    // "supabase:" prefix in the wallet field so these auth-bridge records are
    // clearly distinguishable from real on-chain wallet addresses (which start
    // with "0x") and cannot accidentally collide with them.
    const prismaUser = await prisma.user.upsert({
      where: { wallet: `supabase:${sbUser.id}` },
      create: { wallet: `supabase:${sbUser.id}`, role: 'ADMIN' },
      update: {},
    });

    return prismaUser;
  } catch {
    return null;
  }
}

/**
 * Resolves the authenticated user from the request, trying Bearer token first
 * and Supabase session cookies as a fallback.
 * Returns null if neither mechanism yields a valid user.
 */
export async function getUserFromRequest(
  req: NextRequest,
): Promise<User | null> {
  return (
    (await getUserFromBearerToken(req)) ??
    (await getUserFromSupabaseCookies(req))
  );
}
