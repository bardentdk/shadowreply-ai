import Link from 'next/link';
import { Check, X, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tarifs — ShadowReply AI',
  description:
    'Découvrez nos offres : plan gratuit avec 5 générations par jour, et plan Pro à 9,99€/mois pour des générations illimitées et toutes les fonctionnalités avancées.',
};

const COMPARISON = [
  { feature: 'Générations par jour', free: '5 / jour', pro: 'Illimitées' },
  { feature: 'Styles de réponse', free: '3 (Détaché, Subtil, Direct)', pro: '3 (Détaché, Subtil, Direct)' },
  { feature: '8 modes de communication', free: true, pro: true },
  { feature: 'Analyse de message', free: 'Basique', pro: 'Complète (signaux, dynamique, conseils)' },
  { feature: 'Reformulateur de brouillon', free: false, pro: true },
  { feature: 'Bibliothèque de templates', free: '8 templates', pro: '43 templates' },
  { feature: 'Statistiques', free: 'Basiques', pro: 'Avancées (graphes, modes)' },
  { feature: 'Historique des générations', free: '30 jours', pro: 'Illimité' },
  { feature: 'Support', free: 'Standard', pro: 'Prioritaire' },
  { feature: 'Accès aux futures fonctionnalités', free: false, pro: true },
];

const FAQ_PRICING = [
  {
    q: 'Puis-je annuler à tout moment ?',
    a: 'Oui, sans engagement. Tu peux annuler ton abonnement Pro à tout moment depuis tes paramètres. L\'accès Pro reste actif jusqu\'à la fin de la période déjà payée.',
  },
  {
    q: 'Comment fonctionne la limite de 5 générations/jour ?',
    a: 'Le compteur se réinitialise chaque jour à minuit (heure de Paris). L\'analyse de message et la navigation dans l\'historique ne consomment pas de quota.',
  },
  {
    q: 'Quels modes de paiement sont acceptés ?',
    a: 'Toutes les cartes bancaires (Visa, Mastercard, American Express) via Stripe. Le paiement est 100% sécurisé.',
  },
  {
    q: 'Y a-t-il une période d\'essai Pro ?',
    a: 'Le plan gratuit est déjà très complet pour tester l\'outil. Nous n\'offrons pas d\'essai Pro payant, mais tu peux commencer gratuitement sans carte bancaire.',
  },
  {
    q: 'Mes données sont-elles en sécurité ?',
    a: 'Absolument. Tes messages ne sont jamais stockés. Chaque génération est traitée en temps réel par l\'IA et immédiatement effacée. Seul l\'historique de tes générations passées (texte uniquement) est conservé.',
  },
];

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="text-success mx-auto h-5 w-5" />;
  if (value === false) return <X className="text-foreground-subtle mx-auto h-5 w-5" />;
  return <span className="text-foreground text-sm">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="bg-mesh min-h-screen pt-24">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-accent-primary mb-3 text-sm font-medium uppercase tracking-wider">Tarifs</p>
          <h1 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
            Simple et transparent
          </h1>
          <p className="text-foreground-muted mx-auto max-w-xl text-base">
            Commence gratuitement, passe Pro quand tu es prêt.
            Aucun engagement, annulation en 1 clic.
          </p>
        </div>

        {/* Plans cards */}
        <div className="mb-16 grid gap-6 sm:grid-cols-2">
          {/* Free */}
          <div className="glass-elevated rounded-2xl p-8">
            <p className="text-foreground mb-1 text-xl font-bold">Gratuit</p>
            <p className="text-foreground-muted mb-1 text-sm">Pour découvrir et tester</p>
            <div className="mb-6 flex items-end gap-1">
              <span className="text-accent-primary text-5xl font-black">0€</span>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                '5 générations par jour',
                '3 styles de réponse',
                '8 modes de communication',
                'Analyse de message basique',
                '8 templates de scénarios',
                'Historique 30 jours',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="text-accent-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span className="text-foreground-muted text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button variant="secondary" fullWidth size="lg">
                Commencer gratuitement
              </Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="from-accent-primary/10 to-accent-secondary/10 border-accent-primary/40 rounded-2xl border-2 bg-gradient-to-br p-8 relative">
            <div className="bg-accent-primary absolute -top-3 left-6 rounded-full px-3 py-0.5 text-xs font-semibold text-white">
              Le plus populaire
            </div>
            <p className="text-foreground mb-1 text-xl font-bold">Pro</p>
            <p className="text-foreground-muted mb-1 text-sm">Pour maîtriser chaque échange</p>
            <div className="mb-6 flex items-end gap-1">
              <span className="text-accent-primary text-5xl font-black">9,99€</span>
              <span className="text-foreground-muted mb-2 text-sm">/ mois</span>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                'Générations illimitées',
                'Analyse complète (dynamique, signaux, conseils)',
                'Reformulateur de brouillon IA',
                '43 templates de scénarios',
                'Statistiques avancées',
                'Historique illimité',
                'Support prioritaire',
                'Accès aux futures fonctionnalités',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="text-accent-primary mt-0.5 h-4 w-4 shrink-0" />
                  <span className="text-foreground text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button variant="primary" fullWidth size="lg" className="btn-premium">
                <Sparkles className="h-4 w-4" />
                Commencer avec Pro
              </Button>
            </Link>
            <p className="text-foreground-muted mt-3 text-center text-xs">
              Paiement sécurisé · Annulation à tout moment
            </p>
          </div>
        </div>

        {/* Tableau comparatif */}
        <div className="glass-elevated mb-16 overflow-hidden rounded-2xl">
          <div className="border-border-subtle border-b px-6 py-4">
            <h2 className="text-foreground text-base font-semibold">Comparaison détaillée</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border-subtle border-b">
                  <th className="text-foreground-muted px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Fonctionnalité
                  </th>
                  <th className="text-foreground-muted px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Gratuit
                  </th>
                  <th className="text-accent-primary px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border-subtle divide-y">
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="hover:bg-white/[0.02]">
                    <td className="text-foreground-muted px-6 py-3.5 text-sm">{row.feature}</td>
                    <td className="px-6 py-3.5 text-center">
                      <CellValue value={row.free} />
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <CellValue value={row.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <div className="mb-8 flex items-center gap-2">
            <HelpCircle className="text-accent-primary h-5 w-5" />
            <h2 className="text-foreground text-xl font-bold">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            {FAQ_PRICING.map((item) => (
              <div key={item.q} className="glass-elevated rounded-2xl p-5">
                <p className="text-foreground mb-2 text-sm font-semibold">{item.q}</p>
                <p className="text-foreground-muted text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-foreground-muted mb-4 text-sm">
            Une question ? <Link href="/contact" className="text-accent-primary hover:underline">Contacte-nous</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
