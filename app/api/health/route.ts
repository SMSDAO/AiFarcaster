import 'server-only';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

type ServiceStatus = 'operational' | 'degraded' | 'down';

interface ServiceCheck {
  status: ServiceStatus;
  latencyMs?: number;
  message?: string;
}

async function checkDatabase(): Promise<ServiceCheck> {
  const start = Date.now();
  try {
    const { prisma } = await import('@/lib/db');
    // Lightweight connectivity check
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'operational', latencyMs: Date.now() - start };
  } catch (e) {
    logger.warn('health.db.failed', { error: e instanceof Error ? e.message : String(e) });
    return { status: 'down', latencyMs: Date.now() - start, message: 'Database unreachable' };
  }
}

async function checkRedis(): Promise<ServiceCheck> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return { status: 'degraded', message: 'Redis not configured' };
  }
  const start = Date.now();
  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({ url, token });
    await redis.ping();
    return { status: 'operational', latencyMs: Date.now() - start };
  } catch (e) {
    logger.warn('health.redis.failed', { error: e instanceof Error ? e.message : String(e) });
    return { status: 'degraded', latencyMs: Date.now() - start, message: 'Redis unreachable' };
  }
}

function checkStripe(): ServiceCheck {
  const configured = Boolean(process.env.STRIPE_SECRET_KEY);
  return configured
    ? { status: 'operational' }
    : { status: 'degraded', message: 'Stripe not configured' };
}

function checkOpenAI(): ServiceCheck {
  const configured = Boolean(process.env.OPENAI_API_KEY);
  return configured
    ? { status: 'operational' }
    : { status: 'degraded', message: 'OpenAI not configured' };
}

function overallStatus(checks: Record<string, ServiceCheck>): 'ok' | 'degraded' | 'down' {
  const statuses = Object.values(checks).map((c) => c.status);
  if (statuses.includes('down')) return 'down';
  if (statuses.includes('degraded')) return 'degraded';
  return 'ok';
}

export async function GET() {
  const [db, redis] = await Promise.all([checkDatabase(), checkRedis()]);

  const services = {
    api: { status: 'operational' as ServiceStatus },
    database: db,
    redis,
    stripe: checkStripe(),
    openai: checkOpenAI(),
  };

  const status = overallStatus(services);
  const httpStatus = status === 'down' ? 503 : 200;

  return NextResponse.json(
    {
      status,
      version: process.env.APP_VERSION ?? 'unknown',
      timestamp: new Date().toISOString(),
      services,
    },
    { status: httpStatus },
  );
}
