import OpenAI from 'openai';
import type { AIGenerationInput, AIGenerationResponse } from '@/types/ai';
import { BaseAIProvider } from './base';
import { buildSystemPrompt, buildUserPrompt } from '../prompts';
import { parseAIResponse } from '../parser';
import { AIError } from '../types';

/**
 * Provider OpenAI.
 *
 * Modèles recommandés :
 * - gpt-4o-mini (rapport qualité/prix excellent)
 * - gpt-4o (qualité maximale)
 */
export class OpenAIProvider extends BaseAIProvider {
  readonly name = 'openai' as const;
  readonly defaultModel = 'gpt-4o-mini';

  private client: OpenAI;

  constructor(config: { apiKey: string; model?: string }) {
    super({
      apiKey: config.apiKey,
      model: config.model || 'gpt-4o-mini',
      temperature: 0.85,
      maxTokens: 2048,
    });
    this.validateConfig();
    this.client = new OpenAI({ apiKey: this.config.apiKey });
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
        response_format: { type: 'json_object' },
      });

      const raw = completion.choices[0]?.message?.content;
      if (!raw) {
        throw new AIError(
          'Réponse vide d\'OpenAI.',
          'PROVIDER_ERROR',
          this.name
        );
      }

      return parseAIResponse(raw);
    } catch (error) {
      if (error instanceof AIError) {
        throw error;
      }

      const err = error as { status?: number; message?: string };

      if (err.status === 429) {
        throw new AIError(
          'Limite de débit OpenAI atteinte.',
          'RATE_LIMIT',
          this.name,
          error
        );
      }

      throw new AIError(
        err.message || 'Erreur du provider OpenAI.',
        'PROVIDER_ERROR',
        this.name,
        error
      );
    }
  }
}