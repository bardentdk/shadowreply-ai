/**
 * Constantes globales de l'application ShadowReply AI.
 */

export const APP_CONFIG = {
  name: 'ShadowReply AI',
  description: 'Réponses stratégiques générées par IA',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supportEmail: 'support@shadowreply.ai',
} as const;

/**
 * Modes de communication disponibles.
 * Chaque mode adapte le ton, le vocabulaire et la stratégie de l'IA.
 */
export const COMMUNICATION_MODES = [
  {
    id: 'dating',
    label: 'Dating',
    description: 'Romance, séduction, rencontres',
    icon: '💘',
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Professionnel, négociation, clients',
    icon: '💼',
  },
  {
    id: 'conflict',
    label: 'Conflit',
    description: 'Désamorcer une tension',
    icon: '⚖️',
  },
  {
    id: 'friendly',
    label: 'Amical',
    description: 'Relations entre amis, famille',
    icon: '🤝',
  },
  {
    id: 'cold_polite',
    label: 'Froid mais poli',
    description: 'Distance respectueuse',
    icon: '❄️',
  },
  {
    id: 'follow_up',
    label: 'Relance',
    description: 'Relancer sans paraître insistant',
    icon: '🔄',
  },
  {
    id: 'apology',
    label: 'Excuse',
    description: "S'excuser avec sincérité",
    icon: '🙏',
  },
  {
    id: 'negotiation',
    label: 'Négociation',
    description: 'Obtenir un meilleur deal',
    icon: '💬',
  },
] as const;

export type CommunicationModeId = (typeof COMMUNICATION_MODES)[number]['id'];

/**
 * Styles des 3 réponses générées (toujours dans cet ordre).
 */
export const REPLY_STYLES = [
  {
    id: 'detached',
    label: 'Détaché / Calme',
    description: 'Distance émotionnelle, contrôle',
    color: 'cyan',
    icon: '🧊',
  },
  {
    id: 'subtle',
    label: 'Subtil / Charismatique',
    description: 'Influence douce, intelligence',
    color: 'purple',
    icon: '✨',
  },
  {
    id: 'direct',
    label: 'Direct / Assertif',
    description: 'Clarté, courage, fermeté',
    color: 'blue',
    icon: '🎯',
  },
] as const;

/**
 * Plans tarifaires.
 */
export const PLANS = {
  free: {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    dailyGenerations: parseInt(process.env.FREE_DAILY_GENERATIONS || '5', 10),
    features: [
      '5 générations par jour',
      '3 styles de réponses',
      'Tous les modes de communication',
      'Historique limité (30 jours)',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    dailyGenerations: parseInt(process.env.PRO_DAILY_GENERATIONS || '999', 10),
    features: [
      'Générations illimitées',
      'Historique illimité',
      'Styles personnalisés',
      'Templates favoris',
      'Export PDF',
      'Priorité support',
    ],
  },
} as const;

/**
 * Langues supportées.
 */
export const LANGUAGES = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
] as const;

/**
 * Routes principales.
 */
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  history: '/history',
  settings: '/settings',
} as const;