// lib/api-response.ts
// NextResponse helpers for consistent API responses.
import { NextResponse } from 'next/server';
import { apiError, statusFor, type ApiErrorCode } from './api-errors';
import type { ZodError } from 'zod';

/** Wrap any data payload in a `{ data }` envelope with the given status. */
export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

/** Convenience: 201 Created with a `{ data }` envelope. */
export function created<T>(data: T): NextResponse {
  return ok(data, 201);
}

/** Return a structured API error response. */
export function error(
  code: ApiErrorCode,
  message: string,
  details?: unknown,
): NextResponse {
  return NextResponse.json(apiError(code, message, details), {
    status: statusFor(code),
  });
}

/** Convert a ZodError into a 422 Unprocessable Entity response. */
export function zodError(err: ZodError): NextResponse {
  return error('UNPROCESSABLE_ENTITY', 'Validation failed', err.flatten());
}

/** 401 Unauthorized */
export function unauthorized(message = 'Unauthorized'): NextResponse {
  return error('UNAUTHORIZED', message);
}

/** 403 Forbidden */
export function forbidden(message = 'Forbidden'): NextResponse {
  return error('FORBIDDEN', message);
}

/** 404 Not Found */
export function notFound(resource = 'Resource'): NextResponse {
  return error('NOT_FOUND', `${resource} not found`);
}

/** 402 Payment Required */
export function paymentRequired(message = 'A paid subscription or purchase is required'): NextResponse {
  return error('PAYMENT_REQUIRED', message);
}

/** 429 Rate Limited */
export function rateLimited(remaining: number, reset: number): NextResponse {
  return NextResponse.json(
    apiError('RATE_LIMITED', 'Too many requests. Please slow down.'),
    {
      status: 429,
      headers: {
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(reset),
        'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
      },
    },
  );
}

/** 500 Internal Server Error */
export function internalError(message = 'Internal server error'): NextResponse {
  return error('INTERNAL_ERROR', message);
}
