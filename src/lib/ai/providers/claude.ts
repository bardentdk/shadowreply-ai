import Anthropic from '@anthropic-ai/sdk';
import type { AIGenerationInput, AIGenerationResponse } from '@/types/ai';
import { BaseAIProvider } from './base';
import { buildSystemPrompt, buildUserPrompt } from '../prompts';
import { parseAIResponse } from '../parser';
import { AIError } from '../types';

/**
 * Provider Anthropic Claude.
 *
 * Modèles recommandés :
 * - claude-3-5-sonnet-20241022 (qualité top-tier)
 * - claude-3-5-haiku-20241022 (plus rapide / moins cher)
 */
export class ClaudeProvider extends BaseAIProvider {
  readonly name = 'claude' as const;
  readonly defaultModel = 'claude-3-5-sonnet-20241022';

  private client: Anthropic;

  constructor(config: { apiKey: string; model?: string }) {
    super({
      apiKey: config.apiKey,
      model: config.model || 'claude-3-5-sonnet-20241022',
      temperature: 0.85,
      maxTokens: 2048,
    });
    this.validateConfig();
    this.client = new Anthropic({ apiKey: this.config.apiKey });
  }

  async generate(input: AIGenerationInput): Promise<AIGenerationResponse> {
    const language = input.userPreferences?.language || 'fr';
    const systemPrompt = buildSystemPrompt(language);
    const userPrompt = buildUserPrompt(input);

    try {
      const response = await this.client.messages.create({
        model: this.getModel(),
        max_tokens: this.config.maxTokens || 2048,
        temperature: this.config.temperature,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      // Claude retourne un array de content blocks
      const textBlock = response.content.find((b) => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        throw new AIError(
          'Réponse vide de Claude.',
          'PROVIDER_ERROR',
          this.name
        );
      }

      return parseAIResponse(textBlock.text);
    } catch (error) {
      if (error instanceof AIError) {
        throw error;
      }

      const err = error as { status?: number; message?: string };

      if (err.status === 429) {
        throw new AIError(
          'Limite de débit Anthropic atteinte.',
          'RATE_LIMIT',
          this.name,
          error
        );
      }

      throw new AIError(
        err.message || 'Erreur du provider Claude.',
        'PROVIDER_ERROR',
        this.name,
        error
      );
    }
  }
}