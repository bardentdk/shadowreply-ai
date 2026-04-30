import { NextResponse } from 'next/server';

/**
 * Réponse API standardisée pour le succès.
 */
export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Codes d'erreur standardisés.
 */
export type ApiErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'QUOTA_EXCEEDED'
  | 'SAFETY_BLOCKED'
  | 'RATE_LIMITED'
  | 'AI_PROVIDER_ERROR'
  | 'INTERNAL_ERROR';

/**
 * Mapping code → status HTTP.
 */
const STATUS_MAP: Record<ApiErrorCode, number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  QUOTA_EXCEEDED: 429,
  SAFETY_BLOCKED: 451, // Unavailable For Legal Reasons (sémantique parfaite)
  RATE_LIMITED: 429,
  AI_PROVIDER_ERROR: 502,
  INTERNAL_ERROR: 500,
};

/**
 * Réponse API standardisée pour l'erreur.
 */
export function apiError(
  code: ApiErrorCode,
  message: string,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined && { details }),
      },
    },
    { status: STATUS_MAP[code] }
  );
}