'use client';

/**
 * Réponse standardisée de notre API.
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Wrapper fetch typé qui gère le format standard {success, data, error}.
 * Lève une APIError en cas d'échec.
 */
export class ApiClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export async function apiFetch<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  let json: ApiResponse<T>;
  try {
    json = await res.json();
  } catch {
    throw new ApiClientError(
      'INVALID_RESPONSE',
      'Réponse serveur invalide.',
      res.status
    );
  }

  if (!res.ok || !json.success) {
    throw new ApiClientError(
      json.error?.code || 'UNKNOWN_ERROR',
      json.error?.message || 'Une erreur est survenue.',
      res.status,
      json.error?.details
    );
  }

  return json.data as T;
}