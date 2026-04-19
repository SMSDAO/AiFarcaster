// app/api/frames/[id]/route.ts
// GET    /api/frames/:id  – Get a single frame.
// PATCH  /api/frames/:id  – Update a frame.
// DELETE /api/frames/:id  – Delete a frame.
import 'server-only';
import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { checkProfileRateLimit } from '@/lib/rate-limit';
import { UpdateFrameSchema } from '@/lib/validation';
import { ok, unauthorized, notFound, forbidden, zodError, error, rateLimited } from '@/lib/api-response';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const frame = await prisma.frame.findUnique({ where: { id } });
  if (!frame) return notFound('Frame');
  if (frame.userId !== user.id) return forbidden();

  return ok(frame);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const rl = await checkProfileRateLimit(`frames:update:${user.id}`, 'write');
  if (!rl.success) return rateLimited(rl.remaining, rl.reset);

  const { id } = await params;
  const frame = await prisma.frame.findUnique({ where: { id } });
  if (!frame) return notFound('Frame');
  if (frame.userId !== user.id) return forbidden();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('BAD_REQUEST', 'Invalid JSON body');
  }

  let input;
  try {
    input = UpdateFrameSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    return error('BAD_REQUEST', 'Invalid request body');
  }

  const updated = await prisma.frame.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.config !== undefined ? { config: input.config as object } : {}),
    },
  });

  logger.info('frame.updated', { frameId: id, userId: user.id, changes: Object.keys(input) });

  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const user = await getUserFromRequest(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const frame = await prisma.frame.findUnique({ where: { id } });
  if (!frame) return notFound('Frame');
  if (frame.userId !== user.id) return forbidden();

  await prisma.frame.delete({ where: { id } });

  logger.info('frame.deleted', { frameId: id, userId: user.id });

  return ok({ deleted: true });
}
