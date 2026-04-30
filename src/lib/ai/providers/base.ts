import type { AIGenerationInput, AIGenerationResponse, AIProvider } from '@/types/ai';
import type { AIProviderConfig } from '../types';

/**
 * Classe abstraite que chaque provider IA doit implémenter.
 *
 * Garantit une interface uniforme et permet de switcher de provider
 * sans modifier le reste de l'application.
 */
export abstract class BaseAIProvider {
  abstract readonly name: AIProvider;
  abstract readonly defaultModel: string;

  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = {
      maxTokens: 2048,
      temperature: 0.85,
      timeout: 30000,
      ...config,
    };
  }

  /**
   * Génère une réponse IA. Méthode à implémenter par chaque provider.
   */
  abstract generate(input: AIGenerationInput): Promise<AIGenerationResponse>;

  /**
   * Retourne le modèle utilisé.
   */
  getModel(): string {
    return this.config.model || this.defaultModel;
  }

  /**
   * Validation basique de la config.
   */
  protected validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error(`API key manquante pour le provider ${this.name}.`);
    }
  }
}