// lib/api-errors.ts
// Centralised error types and helpers for API route handlers.
// All user-facing API errors should be created via this module
// so the response shape is consistent across every endpoint.

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNPROCESSABLE_ENTITY'
  | 'RATE_LIMITED'
  | 'PAYMENT_REQUIRED'
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE';

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}

/** HTTP status code that corresponds to each error code. */
export const ERROR_STATUS: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Constructs a serialisable API error body.
 *
 * @example
 * return NextResponse.json(
 *   apiError('NOT_FOUND', 'Frame not found'),
 *   { status: 404 },
 * );
 */
export function apiError(
  code: ApiErrorCode,
  message: string,
  details?: unknown,
): ApiErrorBody {
  return { error: { code, message, ...(details !== undefined ? { details } : {}) } };
}

/** Returns the HTTP status number for the given error code. */
export function statusFor(code: ApiErrorCode): number {
  return ERROR_STATUS[code];
}
