// lib/db.ts
// Singleton Prisma client for use across server-side code.
// Uses the @prisma/adapter-pg driver adapter required by Prisma 7.
// Initialization is lazy: the client is created on first access so that the
// module can be imported at build time even when DATABASE_URL is not set.
import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      '[Prisma] DATABASE_URL environment variable is not set. ' +
        'Set it to a valid PostgreSQL connection string.',
    );
  }
  const adapter = new PrismaPg({
    connectionString,
    // Production connection pool settings.
    // Tune max to match your database plan (e.g. Neon free = 5 connections).
    max: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 10,
  });
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

/**
 * Returns the singleton PrismaClient, creating it on first access.
 * Throws if DATABASE_URL is not set.
 */
function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Proxy that delegates every property access to the lazily-created client.
 * This lets the module be imported at build time without DATABASE_URL set;
 * the error is only thrown when an actual query is made at runtime.
 */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
