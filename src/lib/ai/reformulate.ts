import Groq from 'groq-sdk';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIError } from './types';
import {
  buildReformulateSystemPrompt,
  buildReformulateUserPrompt,
} from './reformulate-prompts';
import type { ReformulateInput, ReformulateResult } from '@/types/ai';

function parseReformulateResponse(raw: string): ReformulateResult {
  let cleaned = raw.trim();

  // Supprime les éventuels backticks markdown
  const fence = cleaned.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/);
  if (fence) cleaned = fence[1].trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new AIError('Réponse reformulation non parsable.', 'PARSING_ERROR');
  }

  const p = parsed as Record<string, unknown>;

  if (!p.original_feedback || !Array.isArray(p.versions) || p.versions.length < 3) {
    throw new AIError('Structure reformulation invalide.', 'VALIDATION_ERROR');
  }

  return parsed as ReformulateResult;
}

/**
 * Appelle le provider IA actif avec des prompts personnalisés.
 * Retourne le texte brut de la réponse pour parsing.
 */
async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const providerName = (process.env.AI_PROVIDER || 'groq') as string;

  if (providerName === 'groq') {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new AIError('GROQ_API_KEY manquante.', 'CONFIG_ERROR');
    const client = new Groq({ apiKey });
    const res = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.75,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });
    return res.choices[0]?.message?.content || '';
  }

  if (providerName === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new AIError('OPENAI_API_KEY manquante.', 'CONFIG_ERROR');
    const client = new OpenAI({ apiKey });
    const res = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.75,
      max_tokens: 2048,
      response_format: { type: 'json_object' },
    });
    return res.choices[0]?.message?.content || '';
  }

  if (providerName === 'claude') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new AIError('ANTHROPIC_API_KEY manquante.', 'CONFIG_ERROR');
    const client = new Anthropic({ apiKey });
    const res = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
      max_tokens: 2048,
      temperature: 0.75,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });
    const block = res.content[0];
    return block?.type === 'text' ? block.text : '';
  }

  if (providerName === 'gemini') {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new AIError('GOOGLE_AI_API_KEY manquante.', 'CONFIG_ERROR');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });
    const res = await model.generateContent(userPrompt);
    return res.response.text();
  }

  throw new AIError(`Provider inconnu : "${providerName}".`, 'CONFIG_ERROR');
}

/**
 * Reformule un brouillon de message en 3 versions distinctes.
 * Fonction Pro uniquement — la vérification du plan est faite dans la route.
 */
export async function reformulateDraft(input: ReformulateInput): Promise<ReformulateResult> {
  if (!input.draft?.trim()) {
    throw new AIError('Le brouillon est requis.', 'INVALID_INPUT');
  }

  const language = input.language || 'fr';
  const systemPrompt = buildReformulateSystemPrompt(language);
  const userPrompt = buildReformulateUserPrompt(input);

  let attempt = 0;
  let lastError: unknown;

  while (attempt < 2) {
    try {
      const raw = await callAI(systemPrompt, userPrompt);
      return parseReformulateResponse(raw);
    } catch (error) {
      lastError = error;
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

  throw lastError;
}
