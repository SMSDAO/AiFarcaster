// lib/logger.ts
// Structured, levelled logger for server-side code.
// Writes JSON lines to stdout — compatible with Vercel log drain, Datadog,
// and any log aggregation platform that ingests newline-delimited JSON.
//
// Usage:
//   import { logger } from '@/lib/logger';
//   logger.info('payment.completed', { userId, amountUsd });
//   logger.warn('rate_limit.exceeded', { key });
//   logger.error('stripe.webhook.invalid_sig', { message: err.message });
import 'server-only';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  event: string;
  timestamp: string;
  env: string;
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV !== 'production';

function write(level: LogLevel, event: string, meta?: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    event,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV ?? 'unknown',
    version: process.env.APP_VERSION ?? 'unknown',
    ...meta,
  };

  if (isDev) {
    // Pretty-print in dev for readability
    const prefix = { debug: '🔍', info: 'ℹ️ ', warn: '⚠️ ', error: '❌' }[level];
    console[level === 'debug' ? 'log' : level](`${prefix} [${event}]`, meta ?? '');
  } else {
    // JSON lines in production
    process.stdout.write(JSON.stringify(entry) + '\n');
  }
}

export const logger = {
  debug(event: string, meta?: Record<string, unknown>): void {
    if (isDev) write('debug', event, meta);
  },
  info(event: string, meta?: Record<string, unknown>): void {
    write('info', event, meta);
  },
  warn(event: string, meta?: Record<string, unknown>): void {
    write('warn', event, meta);
  },
  error(event: string, meta?: Record<string, unknown>): void {
    write('error', event, meta);
  },
};
