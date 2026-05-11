import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  Brain,
  ScanText,
  BookOpen,
  PenLine,
  BarChart2,
  Shield,
  Zap,
  Check,
  ChevronRight,
  MessageSquare,
  Star,
  Lock,
  Snowflake,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMMUNICATION_MODES } from '@/lib/constants';

export const metadata = {
  title: 'ShadowReply AI — Maîtrise chaque conversation',
  description:
    'Reçois 3 réponses stratégiques à chaque message. Détaché, charismatique, assertif. Analyse, reformule, et maîtrise tes conversations grâce à l\'IA.',
};

const FEATURES = [
  {
    icon: MessageSquare,
    title: '3 réponses stratégiques',
    description:
      'Pour chaque message reçu, l\'IA génère 3 angles de réponse : détaché, subtil/charismatique, direct. Tu choisis celui qui correspond à ta stratégie.',
  },
  {
    icon: ScanText,
    title: 'Analyse de message',
    description:
      'Décrypte le vrai sens d\'un message avant de répondre. Ton détecté, intention probable, niveau d\'intérêt — sans consommer de quota.',
  },
  {
    icon: PenLine,
    title: 'Reformulateur de brouillon',
    description:
      'Tu as déjà une idée mais les mots ne viennent pas ? L\'IA retravaille ton brouillon en 3 versions optimisées, avec un score d\'impact.',
  },
  {
    icon: BookOpen,
    title: '43 templates de scénarios',
    description:
      'Bibliothèque de situations préconçues : relance client, excuse sincère, message de séduction, négociation… Clique et le formulaire se pré-remplit.',
  },
  {
    icon: BarChart2,
    title: 'Statistiques détaillées',
    description:
      'Suis ta progression : générations par jour, modes préférés, historique complet. Visualise tes habitudes de communication.',
  },
  {
    icon: Shield,
    title: '100% privé & RGPD',
    description:
      'Tes messages ne sont jamais stockés. Chaque analyse est traitée en temps réel et immédiatement effacée. Hébergé en Europe.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Colle le message reçu',
    description: 'Copie-colle le SMS, email ou message que tu as reçu. Ajoute le contexte si besoin.',
  },
  {
    step: '02',
    title: 'Choisis ton mode',
    description: 'Sélectionne le contexte : Dating, Business, Conflit, Amical… L\'IA adapte sa stratégie.',
  },
  {
    step: '03',
    title: 'Reçois 3 réponses',
    description: 'En quelques secondes, 3 réponses calibrées apparaissent. Copie celle qui te convient.',
  },
];

const REPLY_DEMO = [
  {
    Icon: Snowflake,
    style: 'Détaché',
    text: 'Parfait, prenez le temps qu\'il vous faut. Je reste disponible si vous souhaitez affiner certains points.',
  },
  {
    Icon: Sparkles,
    style: 'Subtil',
    text: 'Je comprends. Juste pour info, notre offre inclut un accompagnement post-lancement que peu de prestataires proposent.',
  },
  {
    Icon: Target,
    style: 'Direct',
    text: 'Quels sont vos critères de décision ? Je peux ajuster notre proposition si nécessaire.',
  },
];

const TESTIMONIALS = [
  {
    content:
      'J\'utilise ShadowReply tous les jours pour mes relances clients. Mes taux de réponse ont augmenté de 40%. Le mode Négociation est incroyable.',
    author: 'Thomas R.',
    role: 'Consultant indépendant',
    stars: 5,
  },
  {
    content:
      'Enfin une IA qui comprend les nuances sociales. Le mode Dating m\'a sauvé la mise plus d\'une fois. L\'analyse de message est la feature que j\'attendais.',
    author: 'Mathieu D.',
    role: 'Utilisateur Pro',
    stars: 5,
  },
  {
    content:
      'Je gère des conflits RH au quotidien. Le mode Conflit + le reformulateur me font gagner 30 min par jour. L\'abonnement Pro vaut chaque centime.',
    author: 'Camille L.',
    role: 'DRH, PME Paris',
    stars: 5,
  },
];

export default function HomePage() {
  return (
    <div className="bg-mesh">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-32 text-center">

        {/* Grayscale background image — place <Image fill className="object-cover grayscale opacity-40" /> inside */}
        <div className="absolute inset-0 z-0 bg-neutral-950" />

        {/* Green gradient in foreground */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-accent-primary/30 via-background/65 to-background"
        />

        {/* Ambient glows */}
        <div aria-hidden className="bg-accent-primary/20 pointer-events-none absolute -top-20 left-1/4 z-20 h-96 w-96 rounded-full blur-3xl" />
        <div aria-hidden className="bg-accent-secondary/15 pointer-events-none absolute right-1/4 top-1/2 z-20 h-96 w-96 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-30 flex flex-col items-center">
          <div className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Propulsé par IA · 100% privé · RGPD conforme
          </div>

          <h1 className="animate-slide-up mb-6 max-w-4xl text-balance text-5xl font-bold leading-[1.1] sm:text-6xl md:text-7xl">
            Maîtrise chaque <br />
            <span className="gradient-text">conversation</span>
          </h1>

          <p className="text-foreground-muted animate-slide-up mb-10 max-w-2xl text-balance text-lg sm:text-xl">
            ShadowReply génère 3 réponses stratégiques pour chaque message.
            <br />
            Détaché, charismatique, ou direct — tu choisis ton angle d&apos;attaque.
          </p>

          <div className="animate-slide-up flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/register">
              <Button variant="primary" size="xl" className="min-w-[220px]">
                Essayer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" size="xl" className="min-w-[220px]">
                Voir les tarifs
              </Button>
            </Link>
          </div>

          <p className="text-foreground-subtle mt-6 text-sm">
            5 générations gratuites par jour · Aucune carte bancaire requise
          </p>

          {/* Demo card */}
          <div className="animate-fade-in glass-elevated border-border-accent mt-16 w-full max-w-2xl rounded-2xl border p-6 text-left">
            <p className="text-foreground-muted mb-3 text-xs font-medium uppercase tracking-wider">
              Exemple de génération — Mode Business
            </p>
            <div className="bg-background-elevated mb-4 rounded-xl p-3">
              <p className="text-foreground-muted text-xs font-medium">Message reçu :</p>
              <p className="text-foreground mt-1 text-sm italic">
                &ldquo;On a bien reçu votre proposition mais on a d&apos;autres offres sur la table. On reviendra vers vous.&rdquo;
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {REPLY_DEMO.map((r) => (
                <div key={r.style} className="bg-background rounded-xl p-3">
                  <div className="text-accent-primary mb-1.5 flex items-center gap-1.5 text-xs font-medium">
                    <r.Icon className="h-3.5 w-3.5" />
                    {r.style}
                  </div>
                  <p className="text-foreground text-xs leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="text-accent-primary mb-2 text-sm font-medium uppercase tracking-wider">Simple et rapide</p>
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">Comment ça marche ?</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="glass-elevated rounded-2xl p-6">
                <div className="text-accent-primary mb-4 text-4xl font-black opacity-30">{step.step}</div>
                <h3 className="text-foreground mb-2 text-base font-semibold">{step.title}</h3>
                <p className="text-foreground-muted text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMAGE SPOT — interface / screenshot ──────────────────────── */}
      <section className="px-6 pb-4">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl" style={{ aspectRatio: '16/7' }} />
      </section>

      {/* ── FONCTIONNALITÉS ──────────────────────────────────────────── */}
      <section id="features" className="scroll-mt-20 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-accent-primary mb-2 text-sm font-medium uppercase tracking-wider">Tout ce dont tu as besoin</p>
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">
              Une suite complète pour maîtriser tes échanges
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="glass-elevated rounded-2xl p-6">
                  <div className="bg-accent-primary/10 mb-4 inline-flex rounded-xl p-2.5">
                    <Icon className="text-accent-primary h-5 w-5" />
                  </div>
                  <h3 className="text-foreground mb-2 text-sm font-semibold">{feature.title}</h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MODES DE COMMUNICATION ───────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="text-accent-primary mb-2 text-sm font-medium uppercase tracking-wider">Adapté à chaque situation</p>
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">
              8 modes de communication
            </h2>
            <p className="text-foreground-muted mt-3 text-base">
              L&apos;IA adapte le ton, le vocabulaire et la stratégie selon le contexte.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COMMUNICATION_MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.id}
                  className="glass-elevated hover:border-accent-primary/30 rounded-2xl border border-transparent p-5 text-center transition-colors"
                >
                  <div className="bg-accent-primary/10 mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl">
                    <Icon className="text-accent-primary h-5 w-5" />
                  </div>
                  <p className="text-foreground mb-1 text-sm font-semibold">{mode.label}</p>
                  <p className="text-foreground-muted text-xs">{mode.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ──────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-accent-primary mb-2 text-sm font-medium uppercase tracking-wider">Ils l&apos;utilisent au quotidien</p>
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">Ce qu&apos;ils en pensent</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="glass-elevated rounded-2xl p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="text-warning h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-4 text-sm leading-relaxed italic">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div>
                  <p className="text-foreground text-xs font-semibold">{t.author}</p>
                  <p className="text-foreground-muted text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMAGE SPOT — résultats / app en contexte ─────────────────── */}
      <section className="px-6 pb-4">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl" style={{ aspectRatio: '21/8' }} />
      </section>

      {/* ── TARIFS RÉSUMÉ ────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-accent-primary mb-2 text-sm font-medium uppercase tracking-wider">Tarifs clairs</p>
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">Commence gratuitement</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Free */}
            <div className="glass-elevated rounded-2xl p-6">
              <p className="text-foreground mb-1 text-lg font-bold">Gratuit</p>
              <p className="text-accent-primary mb-4 text-3xl font-black">0€</p>
              <ul className="mb-6 space-y-2">
                {['5 générations / jour', '3 styles de réponses', '8 modes de communication', 'Analyse de message (basique)', 'Historique 30 jours'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="text-accent-primary h-4 w-4 shrink-0" />
                    <span className="text-foreground-muted">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="secondary" fullWidth>
                  Commencer gratuitement
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="from-accent-primary/10 to-accent-secondary/10 border-accent-primary/30 rounded-2xl border bg-gradient-to-br p-6">
              <div className="mb-1 flex items-center gap-2">
                <p className="text-foreground text-lg font-bold">Pro</p>
                <span className="bg-accent-primary rounded-full px-2 py-0.5 text-xs font-medium text-white">Recommandé</span>
              </div>
              <p className="text-accent-primary mb-4 text-3xl font-black">
                9,99€ <span className="text-foreground-muted text-base font-normal">/ mois</span>
              </p>
              <ul className="mb-6 space-y-2">
                {[
                  'Générations illimitées',
                  'Analyse complète (signaux, conseils)',
                  'Reformulateur de brouillon IA',
                  '43 templates de scénarios',
                  'Statistiques avancées',
                  'Historique illimité',
                  'Support prioritaire',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="text-accent-primary h-4 w-4 shrink-0" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="primary" fullWidth className="btn-premium">
                  <Sparkles className="h-4 w-4" />
                  Passer Pro
                </Button>
              </Link>
            </div>
          </div>

          <p className="text-foreground-subtle mt-6 text-center text-sm">
            Paiement sécurisé via Stripe · Annulation à tout moment · Sans engagement
          </p>
        </div>
      </section>

      {/* ── GARANTIES ────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Shield, title: '100% RGPD', desc: 'Aucun message stocké. Données hébergées en Europe.' },
              { icon: Zap, title: 'Réponse en 3s', desc: 'Génération ultra-rapide grâce à notre infrastructure IA.' },
              { icon: Lock, title: 'Chiffrement E2E', desc: 'Tes données sont chiffrées en transit et au repos.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="bg-accent-primary/10 rounded-xl p-2 shrink-0">
                    <Icon className="text-accent-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold">{item.title}</p>
                    <p className="text-foreground-muted text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div aria-hidden className="bg-accent-primary/15 pointer-events-none absolute -translate-x-1/2 h-64 w-64 rounded-full blur-3xl" />
          <h2 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
            Prêt à maîtriser tes conversations ?
          </h2>
          <p className="text-foreground-muted mb-8 text-base">
            Rejoins des milliers d&apos;utilisateurs qui répondent avec stratégie, pas avec impulsivité.
          </p>
          <Link href="/register">
            <Button variant="primary" size="xl" className="btn-premium min-w-[260px]">
              <Sparkles className="h-4 w-4" />
              Commencer gratuitement
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-foreground-subtle mt-4 text-sm">
            Sans carte bancaire · Actif en 30 secondes
          </p>
        </div>
      </section>
    </div>
  );
}
