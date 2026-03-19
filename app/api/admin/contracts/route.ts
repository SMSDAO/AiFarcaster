// app/api/admin/contracts/route.ts
// POST /api/admin/contracts
// ADMIN-only route that records a deployed contract address in the DB.
// The actual on-chain deployment is done externally (e.g. Hardhat deploy
// script); this endpoint acts as the registry so the address is stored and
// auditable.
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { enforceRole, Role } from '@/lib/rbac';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { DeployContractSchema } from '@/lib/validation';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function handlePost(req: NextRequest): Promise<NextResponse> {
  // Rate limit (pro for admins)
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = await checkRateLimit(`admin:contracts:${user.id}`, 'pro');
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded.' },
      { status: 429 },
    );
  }

  // Validate input
  let body: { bytecode: string; label?: string };
  try {
    body = DeployContractSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.flatten() },
        { status: 422 },
      );
    }
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Derive a deterministic placeholder address from the bytecode hash so the
  // DB row is always valid. The hash is NOT an Ethereum CREATE/CREATE2 address
  // (which requires sender + nonce/salt). In a real workflow the deploy script
  // should POST the actual on-chain address returned by the deployment tx.
  // Callers can PATCH the record with the real address after deployment.
  const { createHash } = await import('crypto');
  const hash = createHash('sha256').update(body.bytecode).digest('hex');
  const address = `0x${hash.slice(0, 40)}`;

  // Upsert: if the same bytecode was already deployed, return existing record.
  const contract = await prisma.contract.upsert({
    where: { address },
    update: {},
    create: {
      address,
      deployedBy: user.id,
    },
  });

  return NextResponse.json(contract, { status: 201 });
}

export const POST = enforceRole([Role.ADMIN], handlePost);

// GET /api/admin/contracts — list all deployed contracts
async function handleGet(req: NextRequest): Promise<NextResponse> {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const contracts = await prisma.contract.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(contracts);
}

export const GET = enforceRole([Role.ADMIN], handleGet);
