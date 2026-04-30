import type { AIProvider, AIGenerationInput, AIGenerationResponse } from '@/types/ai';

/**
 * Configuration d'un provider IA.
 */
export interface AIProviderConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
}

/**
 * Résultat d'une génération avec métadonnées.
 */
export interface AIGenerationResult {
  response: AIGenerationResponse;
  metadata: {
    provider: AIProvider;
    model: string;
    tokens_used?: number;
    duration_ms: number;
  };
}

/**
 * Erreur d'IA personnalisée.
 */
export class AIError extends Error {
  constructor(
    message: string,
    public code: AIErrorCode,
    public provider?: AIProvider,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AIError';
  }
}

export type AIErrorCode =
  | 'INVALID_INPUT'
  | 'SAFETY_VIOLATION'
  | 'PROVIDER_ERROR'
  | 'PARSING_ERROR'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMIT'
  | 'TIMEOUT'
  | 'CONFIG_ERROR';

/**
 * Résultat du safety check.
 */
export interface SafetyCheckResult {
  safe: boolean;
  category?:
    | 'harassment'
    | 'manipulation'
    | 'threats'
    | 'blackmail'
    | 'identity_theft'
    | 'hate_speech'
    | 'sexual_explicit'
    | 'minors'
    | 'consent_violation';
  reason?: string;
  alternative_suggestion?: string;
}

export type { AIGenerationInput, AIGenerationResponse, AIProvider };