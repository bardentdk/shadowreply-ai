'use client';

import { useCookieConsent } from '@/hooks/use-cookie-consent';

const COOKIES_TABLE = [
  {
    name: 'sb-*-auth-token',
    category: 'Essentiel',
    purpose: 'Session d\'authentification Supabase',
    duration: 'Session / 7 jours',
    provider: 'Supabase',
  },
  {
    name: 'sr_cookie_consent',
    category: 'Essentiel',
    purpose: 'Mémorisation de tes préférences de cookies',
    duration: '1 an',
    provider: 'ShadowReply AI',
  },
  {
    name: '__stripe_mid, __stripe_sid',
    category: 'Essentiel',
    purpose: 'Sécurité des paiements Stripe, prévention de la fraude',
    duration: '1 an / Session',
    provider: 'Stripe',
  },
  {
    name: '_plausible',
    category: 'Analytique',
    purpose: 'Mesure d\'audience anonymisée (sans données personnelles)',
    duration: '1 an',
    provider: 'Plausible Analytics',
  },
];

export default function CookiesPage() {
  const { consent, acceptAll, rejectAll, saveCustom, reset } = useCookieConsent();

  return (
    <article className="prose-legal">
      <h1>Politique de cookies</h1>
      <p className="text-foreground-muted text-sm">Dernière mise à jour : mai 2026</p>

      <p>
        Cette politique explique ce que sont les cookies, lesquels nous utilisons sur shadowreply.ai,
        pourquoi, et comment vous pouvez les gérer. Nous nous engageons à n'utiliser que le strict
        nécessaire sans votre consentement préalable.
      </p>

      <h2>1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
      <p>
        Un cookie est un petit fichier texte déposé sur votre appareil lorsque vous visitez un site
        web. Il permet au site de mémoriser des informations vous concernant (session de connexion,
        préférences...) lors de vos visites ultérieures.
      </p>

      <h2>2. Cookies que nous utilisons</h2>
      <div className="not-prose overflow-x-auto rounded-2xl border border-border-subtle mb-8">
        <table className="w-full text-sm">
          <thead className="bg-background-elevated">
            <tr>
              <th className="text-foreground-muted px-4 py-3 text-left text-xs font-medium uppercase">Cookie</th>
              <th className="text-foreground-muted px-4 py-3 text-left text-xs font-medium uppercase">Catégorie</th>
              <th className="text-foreground-muted px-4 py-3 text-left text-xs font-medium uppercase hidden md:table-cell">Finalité</th>
              <th className="text-foreground-muted px-4 py-3 text-left text-xs font-medium uppercase hidden lg:table-cell">Durée</th>
              <th className="text-foreground-muted px-4 py-3 text-left text-xs font-medium uppercase hidden lg:table-cell">Émetteur</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {COOKIES_TABLE.map((cookie) => (
              <tr key={cookie.name}>
                <td className="px-4 py-3 font-mono text-xs text-foreground">{cookie.name}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cookie.category === 'Essentiel' ? 'bg-accent-primary/10 text-accent-primary' : 'bg-warning/10 text-warning'}`}>
                    {cookie.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground-muted hidden md:table-cell text-xs">{cookie.purpose}</td>
                <td className="px-4 py-3 text-foreground-muted hidden lg:table-cell text-xs">{cookie.duration}</td>
                <td className="px-4 py-3 text-foreground-muted hidden lg:table-cell text-xs">{cookie.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>3. Cookies essentiels</h2>
      <p>
        Les cookies essentiels sont indispensables au fonctionnement du site. Ils permettent votre
        authentification sécurisée et mémorisent vos préférences de cookies. Ils ne peuvent pas être
        désactivés sans affecter le bon fonctionnement du service.
      </p>

      <h2>4. Cookies analytiques</h2>
      <p>
        Nous utilisons Plausible Analytics, un outil d'analyse d'audience respectueux de la vie
        privée, qui ne collecte aucune donnée personnelle identifiable et ne dépose pas de cookie
        de traçage inter-sites. Les données sont agrégées et anonymisées.
      </p>
      <p>
        Ces cookies ne sont déposés qu'avec votre consentement explicite.
      </p>

      <h2>5. Cookies marketing</h2>
      <p>
        Actuellement, ShadowReply AI n'utilise aucun cookie marketing ou publicitaire. Si cela
        venait à changer, cette politique sera mise à jour et votre consentement sera de nouveau
        sollicité.
      </p>

      <h2>6. Gérer vos préférences</h2>
      <p>
        Vous pouvez modifier vos préférences à tout moment. Vos choix sont mémorisés localement
        sur votre appareil via le cookie <code>sr_cookie_consent</code>.
      </p>

      <div className="not-prose glass-elevated rounded-2xl p-5 my-6">
        <p className="text-foreground text-sm font-semibold mb-3">Votre consentement actuel</p>
        <div className="space-y-2 mb-4 text-sm">
          <p className="text-foreground-muted">
            Essentiels : <span className="text-success font-medium">Toujours actifs</span>
          </p>
          <p className="text-foreground-muted">
            Analytiques :{' '}
            <span className={consent.analytics ? 'text-success font-medium' : 'text-foreground-muted'}>
              {consent.analytics ? 'Acceptés' : 'Refusés'}
            </span>
          </p>
          <p className="text-foreground-muted">
            Marketing :{' '}
            <span className={consent.marketing ? 'text-success font-medium' : 'text-foreground-muted'}>
              {consent.marketing ? 'Acceptés' : 'Refusés'}
            </span>
          </p>
          {!consent.decided && (
            <p className="text-warning text-xs">Aucun choix effectué — bandeau actif</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={acceptAll}
            className="btn-premium rounded-xl px-4 py-1.5 text-xs font-medium text-white"
          >
            Tout accepter
          </button>
          <button
            type="button"
            onClick={rejectAll}
            className="border-border-accent text-foreground-muted hover:text-foreground rounded-xl border px-4 py-1.5 text-xs font-medium transition-colors"
          >
            Tout refuser
          </button>
          <button
            type="button"
            onClick={reset}
            className="text-accent-primary hover:text-accent-glow text-xs font-medium transition-colors"
          >
            Réinitialiser mes choix
          </button>
        </div>
      </div>

      <h2>7. Cookies tiers et navigateur</h2>
      <p>
        Vous pouvez également gérer les cookies directement depuis les paramètres de votre
        navigateur. Notez que la désactivation de tous les cookies peut perturber le fonctionnement
        du site (notamment la connexion à votre compte).
      </p>
      <ul>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
        <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
      </ul>

      <h2>8. Contact</h2>
      <p>
        Pour toute question concernant notre utilisation des cookies :{' '}
        <a href="mailto:dpo@shadowreply.ai">dpo@shadowreply.ai</a>
      </p>
    </article>
  );
}
