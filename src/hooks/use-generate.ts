'use client';

import { useState, useCallback } from 'react';
import { apiFetch, ApiClientError } from './use-fetcher';
import type { AIGenerationResponse } from '@/types/ai';
import type { CommunicationMode } from '@/types/database';

export interface GenerateRequest {
  message: string;
  context?: string;
  objective?: string;
  mode: CommunicationMode;
}

export interface GenerateResponseData {
  generation_id: string | null;
  created_at?: string;
  response: AIGenerationResponse;
  metadata: {
    provider: string;
    model: string;
    duration_ms: number;
    tokens_used?: number;
  };
  usage: {
    current_count: number;
    daily_limit: number;
  };
  warning?: string;
}

interface UseGenerateState {
  loading: boolean;
  result: GenerateResponseData | null;
  error: string | null;
  errorCode: string | null;
  errorDetails: unknown;
}

export function useGenerate() {
  const [state, setState] = useState<UseGenerateState>({
    loading: false,
    result: null,
    error: null,
    errorCode: null,
    errorDetails: null,
  });

  const generate = useCallback(
    async (input: GenerateRequest): Promise<GenerateResponseData | null> => {
      setState({
        loading: true,
        result: null,
        error: null,
        errorCode: null,
        errorDetails: null,
      });

      try {
        const data = await apiFetch<GenerateResponseData>('/api/generate', {
          method: 'POST',
          body: JSON.stringify(input),
        });

        setState({
          loading: false,
          result: data,
          error: null,
          errorCode: null,
          errorDetails: null,
        });

        return data;
      } catch (err) {
        const apiErr =
          err instanceof ApiClientError
            ? err
            : new ApiClientError('UNKNOWN', 'Erreur inattendue.', 500);

        setState({
          loading: false,
          result: null,
          error: apiErr.message,
          errorCode: apiErr.code,
          errorDetails: apiErr.details,
        });

        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      loading: false,
      result: null,
      error: null,
      errorCode: null,
      errorDetails: null,
    });
  }, []);

  return {
    ...state,
    generate,
    reset,
  };
}