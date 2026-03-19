// app/api/ai/optimize/route.ts
// POST /api/ai/optimize
// Accepts { input: string }, optimizes the prompt using the AI pipeline,
// persists both versions to the Prompt table, and returns the result.
// Requires a valid Bearer session token. Rate-limited per user.
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { getUserFromRequest } from '@/lib/auth';
import { optimizePrompt } from '@/lib/ai/optimizer';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { CreatePromptSchema } from '@/lib/validation';
import { broadcastPromptCreated } from '@/lib/realtime/firebase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Authenticate
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Rate limit (tier derived from role – ADMIN/DEVELOPER get pro limits)
  const tier =
    user.role === 'ADMIN' || user.role === 'DEVELOPER' ? 'pro' : 'free';
  const rl = await checkRateLimit(`ai:optimize:${user.id}`, tier);
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please slow down.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': String(rl.remaining),
          'X-RateLimit-Reset': String(rl.reset),
        },
      },
    );
  }

  // 3. Validate input
  let body: { input: string };
  try {
    body = CreatePromptSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.flatten() },
        { status: 422 },
      );
    }
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // 4. Optimize prompt
  const result = await optimizePrompt(body.input);

  // 5. Persist to database
  const prompt = await prisma.prompt.create({
    data: {
      userId: user.id,
      input: body.input,
      optimized: result.optimized,
      version: 1,
      shared: false,
    },
  });

  // Track token usage. This is an approximation (1 token ≈ 4 chars for English
  // text). For precise billing, replace with a proper tokenizer such as
  // `tiktoken` (js-tiktoken on npm). The approximation is acceptable for
  // internal quota tracking where exact counts are not required.
  const tokensUsed = Math.ceil(
    (body.input.length + result.optimized.length) / 4,
  );
  await prisma.usage.create({
    data: { userId: user.id, tokensUsed },
  });

  // 7. Broadcast realtime event (fire-and-forget)
  broadcastPromptCreated({
    id: prompt.id,
    userId: prompt.userId,
    input: prompt.input,
    optimized: prompt.optimized,
    version: prompt.version,
    shared: prompt.shared,
    createdAt: prompt.createdAt.toISOString(),
  }).catch(() => null);

  return NextResponse.json(
    {
      id: prompt.id,
      input: prompt.input,
      optimized: prompt.optimized,
      model: result.model,
      fallback: result.fallback,
    },
    { status: 201 },
  );
}
