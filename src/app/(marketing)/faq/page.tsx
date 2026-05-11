'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQ_SECTIONS = [
  {
    section: 'Utilisation',
    items: [
      {
        q: 'Comment fonctionne ShadowReply AI ?',
        a: 'Tu colles un message que tu as reçu, tu sélectionnes le mode de communication (Dating, Business, Conflit…), et l\'IA génère 3 réponses stratégiques en quelques secondes. Chaque réponse correspond à un style différent : Détaché, Subtil/Charismatique, Direct. Tu copies celle qui te convient.',
      },
      {
        q: 'Mes messages sont-ils enregistrés ?',
        a: 'Non. Les messages que tu analyses ou soumets ne sont jamais stockés sur nos serveurs. Seul le texte des réponses générées est sauvegardé dans ton historique si tu le souhaites. Tes messages d\'entrée sont traités en mémoire vive et immédiatement supprimés.',
      },
      {
        q: 'Quels types de messages puis-je analyser ?',
        a: 'Tout type : SMS, emails, messages WhatsApp/Telegram, DMs Instagram, messages professionnels, messages de dating… Tant que c\'est du texte, l\'IA peut l\'analyser.',
      },
      {
        q: 'L\'IA comprend-elle les messages en anglais ou en espagnol ?',
        a: 'Oui. ShadowReply supporte le français, l\'anglais et l\'espagnol. La langue est détectée automatiquement ou peut être sélectionnée manuellement dans tes paramètres.',
      },
      {
        q: 'Qu\'est-ce que le "contexte" dans le formulaire ?',
        a: 'Le contexte te permet d\'informer l\'IA de la situation globale : qui est cette personne, votre relation, ce qui s\'est passé avant ce message. Plus le contexte est riche, plus les réponses générées seront pertinentes et adaptées.',
      },
    ],
  },
  {
    section: 'Fonctionnalités',
    items: [
      {
        q: 'Quelle est la différence entre l\'analyse et la génération ?',
        a: 'La génération crée des réponses à envoyer (et consomme du quota). L\'analyse décrypte le message reçu sans générer de réponses et sans consommer de quota — elle te dit ce que le message signifie vraiment : ton, intention, niveau d\'intérêt, signaux d\'alerte (Pro).',
      },
      {
        q: 'Comment fonctionne le reformulateur ?',
        a: 'Tu as déjà une idée de ce que tu veux dire mais les mots ne viennent pas ? Écris un brouillon approximatif, l\'IA le retravaille en 3 versions optimisées : Poli & Impactant, Stratégique, Concis. Chaque version a un score d\'impact de 0 à 100.',
      },
      {
        q: 'À quoi servent les templates ?',
        a: 'La bibliothèque de templates propose des situations préconçues — relance professionnelle, excuse sincère, message de séduction, demande de remise… — qui pré-remplissent automatiquement le formulaire de génération. Un gain de temps considérable pour les situations récurrentes.',
      },
      {
        q: 'L\'historique est-il accessible sur tous mes appareils ?',
        a: 'Oui. Ton compte est synchronisé. Tu peux accéder à ton historique depuis n\'importe quel appareil connecté à ton compte ShadowReply.',
      },
    ],
  },
  {
    section: 'Abonnement & paiement',
    items: [
      {
        q: 'Comment passer au plan Pro ?',
        a: 'Depuis tes paramètres de compte, clique sur "Passer Pro". Tu seras redirigé vers une page de paiement sécurisée Stripe. L\'activation est instantanée après paiement.',
      },
      {
        q: 'Comment annuler mon abonnement Pro ?',
        a: 'Depuis tes paramètres, rubrique "Abonnement", clique sur "Gérer mon abonnement". Tu seras redirigé vers le portail Stripe où tu peux annuler en un clic. Ton accès Pro reste actif jusqu\'à la fin de la période déjà payée.',
      },
      {
        q: 'Y a-t-il un remboursement si je ne suis pas satisfait ?',
        a: 'Oui. Si tu n\'es pas satisfait dans les 7 jours suivant ton premier paiement Pro, contacte-nous à support@shadowreply.ai et nous procéderons au remboursement intégral.',
      },
      {
        q: 'Mes informations de paiement sont-elles sécurisées ?',
        a: 'Absolument. Nous n\'accédons jamais à tes informations de carte bancaire. Tous les paiements sont traités par Stripe, certifié PCI DSS niveau 1 — le standard de sécurité le plus élevé pour les paiements en ligne.',
      },
    ],
  },
  {
    section: 'Confidentialité & RGPD',
    items: [
      {
        q: 'Comment mes données personnelles sont-elles protégées ?',
        a: 'ShadowReply est conforme au RGPD (Règlement Général sur la Protection des Données). Tes données sont hébergées en Europe, chiffrées en transit (HTTPS/TLS) et au repos. Tu peux demander la suppression complète de ton compte et de toutes tes données à tout moment.',
      },
      {
        q: 'Les messages que je génère sont-ils utilisés pour entraîner l\'IA ?',
        a: 'Non. Tes messages ne sont jamais utilisés pour entraîner quoi que ce soit. Chaque requête est indépendante et confidentielle.',
      },
      {
        q: 'Comment supprimer mon compte ?',
        a: 'Tu peux demander la suppression de ton compte par email à support@shadowreply.ai. Nous supprimons toutes tes données (profil, historique, données de facturation) sous 30 jours, conformément au RGPD.',
      },
      {
        q: 'Quels cookies utilisez-vous ?',
        a: 'Uniquement des cookies essentiels au fonctionnement (session, authentification) et, avec ton consentement, des cookies analytiques anonymisés. Aucun cookie publicitaire sans ton accord explicite. Consulte notre Politique de cookies pour le détail.',
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-elevated rounded-2xl overflow-hidden">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 p-5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <p className="text-foreground text-sm font-semibold leading-snug">{q}</p>
        {open
          ? <ChevronUp className="text-accent-primary h-4 w-4 shrink-0 mt-0.5" />
          : <ChevronDown className="text-foreground-muted h-4 w-4 shrink-0 mt-0.5" />
        }
      </button>
      {open && (
        <div className="border-border-subtle border-t px-5 pb-5 pt-4">
          <p className="text-foreground-muted text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="bg-mesh min-h-screen pt-24">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="bg-accent-primary/10 border-accent-primary/30 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
            <HelpCircle className="text-accent-primary h-4 w-4" />
            <span className="text-accent-primary text-sm font-medium">FAQ</span>
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-bold">Questions fréquentes</h1>
          <p className="text-foreground-muted text-base">
            Tout ce que tu as besoin de savoir sur ShadowReply AI.
            <br />
            Tu ne trouves pas ta réponse ?{' '}
            <Link href="/contact" className="text-accent-primary hover:underline">
              Contacte-nous
            </Link>
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.section}>
              <h2 className="text-foreground mb-4 text-sm font-semibold uppercase tracking-wider">
                {section.section}
              </h2>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="glass-elevated mt-12 rounded-2xl p-6 text-center">
          <p className="text-foreground mb-1 text-sm font-semibold">Tu as d&apos;autres questions ?</p>
          <p className="text-foreground-muted mb-4 text-sm">
            Notre équipe répond généralement sous 24h.
          </p>
          <Link
            href="/contact"
            className="text-accent-primary hover:text-accent-glow text-sm font-medium transition-colors"
          >
            Nous contacter →
          </Link>
        </div>
      </div>
    </div>
  );
}
