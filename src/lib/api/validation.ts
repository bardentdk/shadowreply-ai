import { z } from 'zod';

/**
 * Schémas Zod centralisés pour la validation des inputs API.
 */

export const communicationModeSchema = z.enum([
  'dating',
  'business',
  'conflict',
  'friendly',
  'cold_polite',
  'follow_up',
  'apology',
  'negotiation',
]);

export const tonePreferenceSchema = z.enum([
  'balanced',
  'detached',
  'subtle',
  'direct',
]);

export const languageSchema = z.enum(['fr', 'en', 'es']);

/**
 * Body de la route POST /api/generate
 */
export const generateInputSchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, 'Le message doit contenir au moins 2 caractères.')
    .max(5000, 'Le message ne peut pas dépasser 5000 caractères.'),
  context: z
    .string()
    .trim()
    .max(2000, 'Le contexte ne peut pas dépasser 2000 caractères.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  objective: z
    .string()
    .trim()
    .max(1000, 'L\'objectif ne peut pas dépasser 1000 caractères.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  mode: communicationModeSchema,
});

export type GenerateInput = z.infer<typeof generateInputSchema>;

/**
 * Query params de la route GET /api/history
 */
export const historyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  mode: communicationModeSchema.optional(),
  favorites_only: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
});

export type HistoryQuery = z.infer<typeof historyQuerySchema>;

/**
 * Body de la route PATCH /api/history/[id]
 */
export const updateGenerationSchema = z.object({
  is_favorite: z.boolean().optional(),
});

/**
 * Body de la route PATCH /api/me
 */
export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  preferred_tone: tonePreferenceSchema.optional(),
  language: languageSchema.optional(),
  onboarded: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;