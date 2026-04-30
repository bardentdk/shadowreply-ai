import type { AIGenerationInput } from '@/types/ai';
import type { SafetyCheckResult } from './types';

/**
 * Patterns de mots-clés dangereux à détecter.
 * Liste non exhaustive — l'IA fait également un second filtrage en sortie.
 *
 * Multi-langues : français + anglais (les 2 langues principales du MVP).
 */
const DANGER_PATTERNS: Record<NonNullable<SafetyCheckResult['category']>, RegExp[]> = {
  harassment: [
    /\b(harceler|harcèlement|stalker|traquer|persécuter)\b/i,
    /\b(harass|stalk|persecute|intimidate)\b/i,
    /\b(le\/la\s+forcer|forcer\s+(à|de)\s+)/i,
  ],
  manipulation: [
    /\b(manipuler|culpabiliser|gaslighting|gaslight)\b/i,
    /\b(manipulate|gaslight|guilt[\s-]?trip)\b/i,
    /\b(faire\s+culpabiliser|jouer\s+(la|le)\s+victime)\b/i,
  ],
  threats: [
    /\b(menacer|menace|tuer|frapper|nuire)\b/i,
    /\b(threaten|kill|hurt|harm|attack)\b/i,
    /\b(je\s+vais\s+te\s+(faire|détruire))\b/i,
  ],
  blackmail: [
    /\b(chantage|faire\s+chanter|extorquer)\b/i,
    /\b(blackmail|extort|coerce)\b/i,
    /\b(si\s+tu\s+ne.+je\s+(vais|publie|révèle))\b/i,
  ],
  identity_theft: [
    /\b(usurper\s+(l'?identité|le\s+compte))\b/i,
    /\b(impersonate|identity\s+theft|fake\s+account)\b/i,
    /\b(me\s+faire\s+passer\s+pour)\b/i,
  ],
  hate_speech: [
    /\b(sale\s+(juif|arabe|noir|blanc|musulman))\b/i,
    /\b(nigger|kike|faggot|tranny)\b/i,
    // On reste mesurés ici — la modération fine est gérée par l'IA elle-même.
  ],
  sexual_explicit: [
    /\b(sexto|nude\s+pic|sext\b|envoie\s+(moi\s+)?(des\s+)?(photos?\s+)?nu)/i,
    /\b(send\s+nudes|sexting|explicit\s+photo)\b/i,
  ],
  minors: [
    /\b(mineur(e)?|enfant|gamin(e)?|ado(lescent(e)?)?)\b.*\b(sex|drague|séduire|romantique)/i,
    /\b(child|minor|teen|underage)\b.*\b(sex|seduce|romantic|date)/i,
  ],
  consent_violation: [
    /\b(sans\s+(son\s+)?consentement|forcer\s+(à|de))\b/i,
    /\b(without\s+consent|force\s+(her|him|them)\s+to)\b/i,
    /\b(elle\s+a\s+dit\s+non.+mais\s+je\s+veux)\b/i,
  ],
};

/**
 * Suggestions d'alternatives saines pour chaque catégorie.
 */
const ALTERNATIVES: Record<NonNullable<SafetyCheckResult['category']>, string> = {
  harassment:
    'Si une personne ne souhaite plus communiquer, le mieux est de respecter cette distance. Veux-tu une réponse pour conclure poliment cette conversation ?',
  manipulation:
    'La communication saine repose sur l\'honnêteté. Veux-tu plutôt formuler ton vrai besoin de manière directe ?',
  threats:
    'Je ne peux pas t\'aider à formuler des menaces. Si tu ressens beaucoup de colère, prendre du recul avant de répondre est souvent la meilleure stratégie.',
  blackmail:
    'Le chantage abîme toute relation. Veux-tu plutôt exprimer clairement ton désaccord ou tes limites ?',
  identity_theft:
    'Je ne peux pas t\'aider à usurper une identité. Si tu as un message à faire passer, faisons-le en ton nom.',
  hate_speech:
    'Je ne génère pas de contenu haineux ou discriminant. Reformulons ton message dans le respect.',
  sexual_explicit:
    'Je ne génère pas de contenu sexuel explicite. Pour du dating, restons sur des messages charismatiques et respectueux.',
  minors:
    'Je ne génère aucun contenu de séduction impliquant des mineurs. Cette demande est refusée.',
  consent_violation:
    'Le consentement est non négociable. Si une personne refuse, le respect de son choix est la seule réponse acceptable.',
};

/**
 * Vérifie si une entrée utilisateur est sûre à envoyer à l'IA.
 *
 * Cette fonction fait un PRÉ-FILTRAGE rapide côté serveur.
 * Le prompt système de l'IA contient également des règles éthiques
 * pour les cas plus subtils.
 */
export function checkSafety(input: AIGenerationInput): SafetyCheckResult {
  const fullText = [input.message, input.context, input.objective]
    .filter(Boolean)
    .join('\n')
    .toLowerCase();

  // Vérifie chaque catégorie
  for (const [category, patterns] of Object.entries(DANGER_PATTERNS) as [
    NonNullable<SafetyCheckResult['category']>,
    RegExp[],
  ][]) {
    for (const pattern of patterns) {
      if (pattern.test(fullText)) {
        return {
          safe: false,
          category,
          reason: `Contenu détecté comme problématique (catégorie: ${category})`,
          alternative_suggestion: ALTERNATIVES[category],
        };
      }
    }
  }

  // Validation basique de longueur
  if (input.message.trim().length < 2) {
    return {
      safe: false,
      reason: 'Le message est trop court pour être analysé.',
    };
  }

  if (input.message.length > 5000) {
    return {
      safe: false,
      reason: 'Le message est trop long (max 5000 caractères).',
    };
  }

  return { safe: true };
}

/**
 * Construit une réponse "blocked" cohérente avec le format AIGenerationResponse.
 * Utilisée quand le safety check échoue, pour renvoyer une réponse propre
 * à l'utilisateur sans appeler l'IA.
 */
export function buildBlockedResponse(check: SafetyCheckResult) {
  return {
    flagged: true as const,
    flagged_reason: check.reason,
    analysis: {
      detected_tone: 'non analysé',
      interest_level: 'unknown' as const,
      probable_intention: 'Non analysé pour des raisons éthiques',
      power_dynamic: 'Non analysé',
      risks: ['Cette demande contient des éléments problématiques.'],
      strategic_advice:
        check.alternative_suggestion ||
        'Reformule ta demande dans un cadre respectueux et constructif.',
    },
    replies: [] as never,
  };
}