import Groq from 'groq-sdk';
import type { AIGenerationInput, AIGenerationResponse } from '@/types/ai';
import { BaseAIProvider } from './base';
import { buildSystemPrompt, buildUserPrompt } from '../prompts';
import { parseAIResponse } from '../parser';
import { AIError } from '../types';

/**
 * Provider Groq — priorité MVP.
 *
 * Avantages :
 * - Très rapide (LPU inference)
 * - Tier gratuit généreux
 * - Compatible OpenAI API (facile à migrer)
 *
 * Modèles recommandés :
 * - llama-3.3-70b-versatile (qualité)
 * - llama-3.1-8b-instant (rapidité)
 */
export class GroqProvider extends BaseAIProvider {
  readonly name = 'groq' as const;
  readonly defaultModel = 'llama-3.3-70b-versatile';

  private client: Groq;

  constructor(config: { apiKey: string; model?: string }) {
    super({
      apiKey: config.apiKey,
      model: config.model || 'llama-3.3-70b-versatile',
      temperature: 0.85,
      maxTokens: 2048,
    });
    this.validateConfig();
    this.client = new Groq({ apiKey: this.config.apiKey });
  }

  async generate(input: AIGenerationInput): Promise<AIGenerationResponse> {
    const language = input.userPreferences?.language || 'fr';
    const systemPrompt = buildSystemPrompt(language);
    const userPrompt = buildUserPrompt(input);

    try {
      const completion = await this.client.chat.completions.create({
        model: this.getModel(),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        // Force le format JSON quand le modèle le supporte
        response_format: { type: 'json_object' },
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw) {
        throw new AIError(
          'Réponse vide de Groq.',
          'PROVIDER_ERROR',
          this.name
        );
      }

      // Parsing robuste
      return parseAIResponse(raw);
    } catch (error) {
      // Erreur déjà typée
      if (error instanceof AIError) {
        throw error;
      }

      // Erreurs Groq SDK
      const err = error as { status?: number; message?: string };

      if (err.status === 429) {
        throw new AIError(
          'Limite de débit Groq atteinte. Réessaie dans quelques secondes.',
          'RATE_LIMIT',
          this.name,
          error
        );
      }

      throw new AIError(
        err.message || 'Erreur du provider Groq.',
        'PROVIDER_ERROR',
        this.name,
        error
      );
    }
  }
}