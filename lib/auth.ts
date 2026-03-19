// lib/auth.ts
// Extracts and validates the authenticated user from a Next.js request.
// Uses the Bearer token stored in the Authorization header, which corresponds
// to a Session.token in the database.
import 'server-only';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import type { User } from '@prisma/client';

/**
 * Reads the Bearer token from the Authorization header and looks up the
 * associated Session + User in the database.
 * Returns null if the token is missing, invalid, or expired.
 */
export async function getUserFromRequest(
  req: NextRequest,
): Promise<User | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) return null;
    if (session.expiresAt < new Date()) {
      // Clean up expired session lazily
      await prisma.session.delete({ where: { id: session.id } }).catch(() => null);
      return null;
    }

    return session.user;
  } catch {
    return null;
  }
}
