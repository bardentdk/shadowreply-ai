import type { AIGenerationInput, AIProvider } from '@/types/ai';
import { BaseAIProvider } from './providers/base';
import { GroqProvider } from './providers/groq';
import { OpenAIProvider } from './providers/openai';
import { ClaudeProvider } from './providers/claude';
import { GeminiProvider } from './providers/gemini';
import { checkSafety, buildBlockedResponse } from './safety';
import { AIError, type AIGenerationResult } from './types';

/**
 * Cache de l'instance provider courante (singleton).
 * Évite de réinstancier le client à chaque requête.
 */
let cachedProvider: BaseAIProvider | null = null;
let cachedProviderName: AIProvider | null = null;

/**
 * Construit l'instance du provider à partir des variables d'environnement.
 */
function buildProvider(): BaseAIProvider {
  const providerName = (process.env.AI_PROVIDER || 'groq') as AIProvider;

  // Réutilise le cache si même provider
  if (cachedProvider && cachedProviderName === providerName) {
    return cachedProvider;
  }

  let provider: BaseAIProvider;

  switch (providerName) {
    case 'groq': {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new AIError(
          'GROQ_API_KEY manquante dans les variables d\'environnement.',
          'CONFIG_ERROR'
        );
      }
      provider = new GroqProvider({
        apiKey,
        model: process.env.GROQ_MODEL,
      });
      break;
    }

    case 'openai': {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new AIError(
          'OPENAI_API_KEY manquante.',
          'CONFIG_ERROR'
        );
      }
      provider = new OpenAIProvider({
        apiKey,
        model: process.env.OPENAI_MODEL,
      });
      break;
    }

    case 'claude': {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new AIError(
          'ANTHROPIC_API_KEY manquante.',
          'CONFIG_ERROR'
        );
      }
      provider = new ClaudeProvider({
        apiKey,
        model: process.env.ANTHROPIC_MODEL,
      });
      break;
    }

    case 'gemini': {
      const apiKey = process.env.GOOGLE_AI_API_KEY;
      if (!apiKey) {
        throw new AIError(
          'GOOGLE_AI_API_KEY manquante.',
          'CONFIG_ERROR'
        );
      }
      provider = new GeminiProvider({
        apiKey,
        model: process.env.GEMINI_MODEL,
      });
      break;
    }

    default:
      throw new AIError(
        `Provider IA inconnu : "${providerName}". Valeurs acceptées : groq, openai, claude, gemini.`,
        'CONFIG_ERROR'
      );
  }

  cachedProvider = provider;
  cachedProviderName = providerName;
  return provider;
}

/**
 * Sanitize les inputs (trim, suppression de caractères de contrôle).
 */
function sanitizeInput(input: AIGenerationInput): AIGenerationInput {
  const clean = (s: string | undefined) =>
    s ? s.trim().replace(/[\u0000-\u001F\u007F]/g, '') : s;

  return {
    message: clean(input.message) || '',
    context: clean(input.context),
    objective: clean(input.objective),
    mode: input.mode,
    userPreferences: input.userPreferences,
  };
}

/**
 * 🎯 FONCTION PRINCIPALE EXPOSÉE AU RESTE DE L'APP.
 *
 * Génère 3 réponses stratégiques pour un message reçu.
 *
 * Flow complet :
 *  1. Sanitize les inputs
 *  2. Safety check pré-envoi (filtrage éthique)
 *  3. Sélection du provider via env var
 *  4. Appel au provider avec retry (1 retry max sur PARSING_ERROR)
 *  5. Retour avec métadonnées (provider, model, durée)
 *
 * @example
 * const result = await generateStrategicReplies({
 *   message: "Je sais pas si on se voit ce week-end finalement...",
 *   mode: "dating",
 *   context: "On devait se voir samedi",
 *   userPreferences: { preferred_tone: "balanced", language: "fr" }
 * });
 */
export async function generateStrategicReplies(
  rawInput: AIGenerationInput
): Promise<AIGenerationResult> {
  const startedAt = Date.now();
  const input = sanitizeInput(rawInput);

  // 1. Validation basique
  if (!input.message) {
    throw new AIError('Le message est requis.', 'INVALID_INPUT');
  }
  if (!input.mode) {
    throw new AIError('Le mode de communication est requis.', 'INVALID_INPUT');
  }

  // 2. Safety check
  const safety = checkSafety(input);
  if (!safety.safe) {
    const provider = buildProvider();
    return {
      response: buildBlockedResponse(safety),
      metadata: {
        provider: provider.name,
        model: provider.getModel(),
        duration_ms: Date.now() - startedAt,
      },
    };
  }

  // 3. Provider
  const provider = buildProvider();

  // 4. Génération avec retry sur erreur de parsing (1 seule retry)
  let attempt = 0;
  let lastError: unknown;

  while (attempt < 2) {
    try {
      const response = await provider.generate(input);
      return {
        response,
        metadata: {
          provider: provider.name,
          model: provider.getModel(),
          duration_ms: Date.now() - startedAt,
        },
      };
    } catch (error) {
      lastError = error;
      // On retry uniquement sur PARSING_ERROR ou VALIDATION_ERROR (LLM hallucine)
      if (
        error instanceof AIError &&
        (error.code === 'PARSING_ERROR' || error.code === 'VALIDATION_ERROR') &&
        attempt === 0
      ) {
        attempt++;
        continue;
      }
      throw error;
    }
  }

  // Sécurité : on ne devrait jamais arriver ici mais TS aime ce filet.
  throw lastError;
}

/**
 * Retourne le nom du provider actuellement configuré (utile pour debug/monitoring).
 */
export function getCurrentProviderName(): AIProvider {
  return (process.env.AI_PROVIDER || 'groq') as AIProvider;
}

/**
 * Reset du cache (utile pour les tests).
 */
export function resetProviderCache(): void {
  cachedProvider = null;
  cachedProviderName = null;
}

// Re-export des types pour usage externe
export { AIError } from './types';
export type { AIGenerationInput, AIGenerationResponse, AIProvider } from '@/types/ai';