// lib/rbac.ts
// Role-Based Access Control helpers for API routes.
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export { Role };

/**
 * Returns true if `userRole` is included in `allowedRoles`.
 */
export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Higher-order function that wraps a Next.js App-Router route handler and
 * rejects requests whose authenticated user does not hold one of `allowedRoles`.
 *
 * Usage:
 *   export const POST = enforceRole([Role.ADMIN], async (req) => { … });
 */
export function enforceRole(
  allowedRoles: Role[],
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest): Promise<NextResponse> => {
    const user = await getUserFromRequest(req);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasRole(user.role as Role, allowedRoles)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return handler(req);
  };
}
