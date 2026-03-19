// app/api/admin/contracts/route.ts
// ADMIN-only routes for the contract registry.
//
// POST   – Register a new deployment.  Derives a deterministic placeholder
//          address from the bytecode hash (NOT a real Ethereum CREATE/CREATE2
//          address). Use PATCH to update the record with the actual on-chain
//          address once the deployment transaction is confirmed.
// GET    – List all registered contracts.
// PATCH  – Update the address (and optionally the label) of an existing
//          contract record after the real deployment tx is confirmed.
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import type { User } from '@prisma/client';
import { enforceRole, Role } from '@/lib/rbac';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';
import { DeployContractSchema, UpdateContractSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

async function handlePost(req: NextRequest, user: User): Promise<NextResponse> {
  const rl = await checkRateLimit(`admin:contracts:${user.id}`, 'pro');
  if (!rl.success) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

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

  // Derive a deterministic placeholder address from the bytecode hash.
  // This is NOT an Ethereum CREATE/CREATE2 address (which requires sender +
  // nonce/salt); use PATCH to replace it with the real on-chain address after
  // deployment is confirmed.
  const { createHash } = await import('crypto');
  const hash = createHash('sha256').update(body.bytecode).digest('hex');
  const address = `0x${hash.slice(0, 40)}`;

  const contract = await prisma.contract.upsert({
    where: { address },
    update: {},
    create: {
      address,
      label: body.label,
      deployedById: user.id,
    },
  });

  return NextResponse.json(contract, { status: 201 });
}

export const POST = enforceRole([Role.ADMIN], handlePost);

async function handleGet(_req: NextRequest, _user: User): Promise<NextResponse> {
  const contracts = await prisma.contract.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(contracts);
}

export const GET = enforceRole([Role.ADMIN], handleGet);

async function handlePatch(req: NextRequest, _user: User): Promise<NextResponse> {
  let body: { id: string; address: string; label?: string };
  try {
    body = UpdateContractSchema.parse(await req.json());
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.flatten() },
        { status: 422 },
      );
    }
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const existing = await prisma.contract.findUnique({ where: { id: body.id } });
  if (!existing) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
  }

  const updated = await prisma.contract.update({
    where: { id: body.id },
    data: {
      address: body.address,
      ...(body.label !== undefined ? { label: body.label } : {}),
    },
  });

  return NextResponse.json(updated);
}

export const PATCH = enforceRole([Role.ADMIN], handlePatch);

