import { z } from 'zod';
import type { AIGenerationResponse } from '@/types/ai';
import { AIError } from './types';

/**
 * Schéma Zod pour valider la réponse IA.
 * Toute réponse non conforme est rejetée.
 */
const replyStyleSchema = z.enum(['detached', 'subtle', 'direct']);

const interestLevelSchema = z.enum(['low', 'medium', 'high', 'unknown']);

const strategicReplySchema = z.object({
  style: replyStyleSchema,
  message: z.string().min(1).max(2000),
  intention: z.string().min(1).max(500),
  expected_effect: z.string().min(1).max(500),
  risk: z.string().min(1).max(500),
  positioning_score: z.number().min(0).max(100),
});

const messageAnalysisSchema = z.object({
  detected_tone: z.string().min(1).max(200),
  interest_level: interestLevelSchema,
  probable_intention: z.string().min(1).max(500),
  power_dynamic: z.string().min(1).max(300),
  risks: z.array(z.string()).min(0).max(10),
  strategic_advice: z.string().min(1).max(500),
});

const aiGenerationResponseSchema = z.object({
  analysis: messageAnalysisSchema,
  replies: z
    .array(strategicReplySchema)
    .length(3)
    .or(z.array(strategicReplySchema).length(0)),
  flagged: z.boolean().optional(),
  flagged_reason: z.string().optional(),
});

/**
 * Extrait un JSON valide d'une chaîne potentiellement bruitée.
 * Gère les cas suivants :
 * - JSON pur (cas idéal)
 * - JSON entouré de ```json ... ``` (markdown)
 * - JSON entouré de ``` ... ```
 * - JSON avec préambule/postambule textuel
 *
 * Retourne null si aucun JSON parsable n'est trouvé.
 */
function extractJson(raw: string): string | null {
  if (!raw) return null;

  let text = raw.trim();

  // Cas 1 : déjà un JSON pur
  if (text.startsWith('{') && text.endsWith('}')) {
    return text;
  }

  // Cas 2 : markdown ```json ... ```
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    text = jsonBlockMatch[1].trim();
    if (text.startsWith('{') && text.endsWith('}')) {
      return text;
    }
  }

  // Cas 3 : extraction du premier { au dernier } (best effort)
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }

  return null;
}

/**
 * Tente de parser le JSON brut renvoyé par un LLM.
 * Lève une AIError détaillée en cas d'échec.
 */
export function parseAIResponse(raw: string): AIGenerationResponse {
  // 1. Extraction du JSON
  const jsonText = extractJson(raw);
  if (!jsonText) {
    throw new AIError(
      'Aucun JSON détectable dans la réponse de l\'IA.',
      'PARSING_ERROR',
      undefined,
      { raw: raw.slice(0, 500) }
    );
  }

  // 2. Parsing JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new AIError(
      'Le JSON renvoyé par l\'IA est mal formé.',
      'PARSING_ERROR',
      undefined,
      { error: String(err), jsonText: jsonText.slice(0, 500) }
    );
  }

  // 3. Validation du schéma
  const result = aiGenerationResponseSchema.safeParse(parsed);
  if (!result.success) {
    throw new AIError(
      'La structure du JSON ne correspond pas au format attendu.',
      'VALIDATION_ERROR',
      undefined,
      { issues: result.error.issues, parsed }
    );
  }

  // 4. Validation supplémentaire métier
  const data = result.data;

  // Si flagged, replies doit être vide
  if (data.flagged && data.replies.length !== 0) {
    throw new AIError(
      'Réponse marquée comme flagged mais contient des replies.',
      'VALIDATION_ERROR'
    );
  }

  // Si pas flagged, on doit avoir exactement 3 replies dans le bon ordre
  if (!data.flagged) {
    if (data.replies.length !== 3) {
      throw new AIError(
        'L\'IA doit générer exactement 3 réponses.',
        'VALIDATION_ERROR'
      );
    }

    const expectedOrder = ['detached', 'subtle', 'direct'] as const;
    for (let i = 0; i < 3; i++) {
      if (data.replies[i].style !== expectedOrder[i]) {
        throw new AIError(
          `Ordre des réponses incorrect : attendu "${expectedOrder[i]}" en position ${i}, reçu "${data.replies[i].style}".`,
          'VALIDATION_ERROR'
        );
      }
    }
  }

  return data as AIGenerationResponse;
}