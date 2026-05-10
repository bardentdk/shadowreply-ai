import Groq from 'groq-sdk';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIError } from './types';
import { buildAnalyzeSystemPrompt, buildAnalyzeUserPrompt, type AnalyzeInput } from './analyze-prompts';
import type { CommunicationMode } from '@/types/database';

export interface AnalyzeResult {
  detected_tone: string;
  interest_level: 'low' | 'medium' | 'high' | 'unknown';
  probable_intention: string;
  power_dynamic: string;
  risks: string[];
  strategic_advice: string;
  suggested_mode: CommunicationMode;
  confidence: 'low' | 'medium' | 'high';
}

function parseAnalyzeResponse(raw: string): AnalyzeResult {
  let cleaned = raw.trim();
  const fence = cleaned.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/);
  if (fence) cleaned = fence[1].trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new AIError('Réponse analyse non parsable.', 'PARSING_ERROR');
  }

  const p = parsed as Record<string, unknown>;
  if (!p.detected_tone || !p.interest_level || !p.probable_intention) {
    throw new AIError('Structure analyse invalide.', 'VALIDATION_ERROR');
  }

  return {
    detected_tone: String(p.detected_tone),
    interest_level: (p.interest_level as AnalyzeResult['interest_level']) || 'unknown',
    probable_intention: String(p.probable_intention),
    power_dynamic: String(p.power_dynamic || ''),
    risks: Array.isArray(p.risks) ? (p.risks as string[]) : [],
    strategic_advice: String(p.strategic_advice || ''),
    suggested_mode: (p.suggested_mode as CommunicationMode) || 'friendly',
    confidence: (p.confidence as AnalyzeResult['confidence']) || 'medium',
  };
}

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
      temperature: 0.6,
      max_tokens: 1024,
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
      temperature: 0.6,
      max_tokens: 1024,
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
      max_tokens: 1024,
      temperature: 0.6,
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
 * Analyse un message reçu sans générer de réponses.
 * Disponible pour tous les utilisateurs.
 * Les utilisateurs Free reçoivent une analyse partielle (filtrée par la route).
 */
export async function analyzeMessage(input: AnalyzeInput): Promise<AnalyzeResult> {
  if (!input.message?.trim()) {
    throw new AIError('Le message est requis.', 'INVALID_INPUT');
  }

  const language = input.language || 'fr';
  const systemPrompt = buildAnalyzeSystemPrompt(language);
  const userPrompt = buildAnalyzeUserPrompt(input);

  let attempt = 0;
  let lastError: unknown;

  while (attempt < 2) {
    try {
      const raw = await callAI(systemPrompt, userPrompt);
      return parseAnalyzeResponse(raw);
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
