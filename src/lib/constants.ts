/**
 * Constantes globales de l'application ShadowReply AI.
 */

import {
  Heart,
  Briefcase,
  Scale,
  Users,
  Snowflake,
  RefreshCw,
  HeartHandshake,
  Handshake,
  Waves,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';

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
export type CommunicationModeId =
  | 'dating'
  | 'business'
  | 'conflict'
  | 'friendly'
  | 'cold_polite'
  | 'follow_up'
  | 'apology'
  | 'negotiation';

export const COMMUNICATION_MODES: ReadonlyArray<{
  readonly id: CommunicationModeId;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: 'dating',
    label: 'Dating',
    description: 'Romance, séduction, rencontres',
    icon: Heart,
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Professionnel, négociation, clients',
    icon: Briefcase,
  },
  {
    id: 'conflict',
    label: 'Conflit',
    description: 'Désamorcer une tension',
    icon: Scale,
  },
  {
    id: 'friendly',
    label: 'Amical',
    description: 'Relations entre amis, famille',
    icon: Users,
  },
  {
    id: 'cold_polite',
    label: 'Froid mais poli',
    description: 'Distance respectueuse',
    icon: Snowflake,
  },
  {
    id: 'follow_up',
    label: 'Relance',
    description: 'Relancer sans paraître insistant',
    icon: RefreshCw,
  },
  {
    id: 'apology',
    label: 'Excuse',
    description: "S'excuser avec sincérité",
    icon: HeartHandshake,
  },
  {
    id: 'negotiation',
    label: 'Négociation',
    description: 'Obtenir un meilleur deal',
    icon: Handshake,
  },
];

/**
 * Styles des 3 réponses générées (toujours dans cet ordre).
 */
export const REPLY_STYLES: ReadonlyArray<{
  readonly id: string;
  label: string;
  description: string;
  color: string;
  icon: LucideIcon;
}> = [
  {
    id: 'detached',
    label: 'Détaché / Calme',
    description: 'Distance émotionnelle, contrôle',
    color: 'cyan',
    icon: Waves,
  },
  {
    id: 'subtle',
    label: 'Subtil / Charismatique',
    description: 'Influence douce, intelligence',
    color: 'purple',
    icon: Sparkles,
  },
  {
    id: 'direct',
    label: 'Direct / Assertif',
    description: 'Clarté, courage, fermeté',
    color: 'blue',
    icon: Target,
  },
];

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
      'Analyse de message complète (signaux, conseils)',
      'Reformulateur de brouillon IA',
      '43 templates de scénarios',
      'Statistiques avancées (activité, modes)',
      'Priorité support',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0,
    dailyGenerations: 999,
    features: [
      'Tout le plan Pro',
      'Accès équipe multi-utilisateurs',
      'Statistiques avancées',
      'Support dédié',
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
  analyze: '/analyze',
  reformulate: '/reformulate',
  templates: '/templates',
  history: '/history',
  stats: '/stats',
  settings: '/settings',
} as const;
