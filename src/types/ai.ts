import type { CommunicationMode, TonePreference } from './database';

/**
 * Style des 3 réponses générées (toujours dans cet ordre).
 */
export type ReplyStyle = 'detached' | 'subtle' | 'direct';

/**
 * Une réponse stratégique générée par l'IA.
 */
export interface StrategicReply {
  style: ReplyStyle;
  message: string;
  intention: string;
  expected_effect: string;
  risk: string;
  positioning_score: number; // 0-100
}

/**
 * Analyse globale du message reçu.
 */
export interface MessageAnalysis {
  detected_tone: string;
  interest_level: 'low' | 'medium' | 'high' | 'unknown';
  probable_intention: string;
  power_dynamic: string;
  risks: string[];
  strategic_advice: string;
}

/**
 * Réponse complète de l'IA (analyse + 3 réponses).
 */
export interface AIGenerationResponse {
  analysis: MessageAnalysis;
  replies: [StrategicReply, StrategicReply, StrategicReply];
  flagged?: boolean;
  flagged_reason?: string;
}

/**
 * Input pour la génération.
 */
export interface AIGenerationInput {
  message: string;
  context?: string;
  objective?: string;
  mode: CommunicationMode;
  userPreferences?: {
    preferred_tone?: TonePreference;
    language?: string;
  };
}

/**
 * Providers IA supportés.
 */
export type AIProvider = 'groq' | 'openai' | 'claude' | 'gemini';

/**
 * Interface qu'un provider IA doit implémenter.
 */
export interface IAIProvider {
  name: AIProvider;
  generate(input: AIGenerationInput): Promise<AIGenerationResponse>;
}