// lib/db.ts
// Singleton Prisma client for use across server-side code.
// Uses the @prisma/adapter-pg driver adapter required by Prisma 7.
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

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
