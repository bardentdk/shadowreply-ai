import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIGenerationInput, AIGenerationResponse } from '@/types/ai';
import { BaseAIProvider } from './base';
import { buildSystemPrompt, buildUserPrompt } from '../prompts';
import { parseAIResponse } from '../parser';
import { AIError } from '../types';

/**
 * Provider Google Gemini.
 *
 * Modèles recommandés :
 * - gemini-1.5-flash (rapide, gratuit jusqu'à 15 req/min)
 * - gemini-1.5-pro (qualité maximale)
 */
export class GeminiProvider extends BaseAIProvider {
  readonly name = 'gemini' as const;
  readonly defaultModel = 'gemini-1.5-flash';

  private client: GoogleGenerativeAI;

  constructor(config: { apiKey: string; model?: string }) {
    super({
      apiKey: config.apiKey,
      model: config.model || 'gemini-1.5-flash',
      temperature: 0.85,
      maxTokens: 2048,
    });
    this.validateConfig();
    this.client = new GoogleGenerativeAI(this.config.apiKey);
  }

  async generate(input: AIGenerationInput): Promise<AIGenerationResponse> {
    const language = input.userPreferences?.language || 'fr';
    const systemPrompt = buildSystemPrompt(language);
    const userPrompt = buildUserPrompt(input);

    try {
      const model = this.client.getGenerativeModel({
        model: this.getModel(),
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: this.config.temperature,
          maxOutputTokens: this.config.maxTokens,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(userPrompt);
      const raw = result.response.text();

      if (!raw) {
        throw new AIError(
          'Réponse vide de Gemini.',
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
          'Limite de débit Gemini atteinte.',
          'RATE_LIMIT',
          this.name,
          error
        );
      }

      throw new AIError(
        err.message || 'Erreur du provider Gemini.',
        'PROVIDER_ERROR',
        this.name,
        error
      );
    }
  }
}