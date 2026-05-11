'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Cookie, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { cn } from '@/lib/utils';

export function CookieBanner() {
  const { consent, acceptAll, rejectAll, saveCustom } = useCookieConsent();
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (consent.decided) return null;

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      aria-modal="false"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:bottom-4 md:left-auto md:right-4 md:max-w-md"
    >
      <div className="glass-elevated border-border-accent rounded-2xl border p-5 shadow-2xl">
        {/* Header */}
        <div className="mb-3 flex items-start gap-3">
          <div className="bg-accent-primary/10 rounded-xl p-2 shrink-0">
            <Cookie className="text-accent-primary h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-foreground text-sm font-semibold">Gestion des cookies</p>
            <p className="text-foreground-muted mt-0.5 text-xs leading-relaxed">
              Nous utilisons des cookies pour améliorer votre expérience. Les cookies essentiels sont
              toujours actifs.{' '}
              <Link href="/legal/cookies" className="text-accent-primary hover:underline">
                En savoir plus
              </Link>
            </p>
          </div>
        </div>

        {/* Paramétrage avancé */}
        {expanded && (
          <div className="border-border-subtle mb-4 space-y-3 border-t pt-4">
            <ToggleRow
              label="Essentiels"
              description="Authentification, sécurité, préférences. Toujours actifs."
              checked
              disabled
            />
            <ToggleRow
              label="Analytiques"
              description="Mesure d'audience anonymisée pour améliorer le service."
              checked={analytics}
              onChange={setAnalytics}
            />
            <ToggleRow
              label="Marketing"
              description="Personnalisation des contenus et publicités éventuelles."
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={acceptAll}
              className="btn-premium flex-1 rounded-xl py-2 text-sm font-medium text-white"
            >
              Tout accepter
            </button>
            <button
              type="button"
              onClick={rejectAll}
              className="border-border-accent text-foreground-muted hover:text-foreground flex-1 rounded-xl border py-2 text-sm font-medium transition-colors"
            >
              Tout refuser
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-foreground-muted hover:text-foreground flex items-center gap-1 text-xs transition-colors"
            >
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              Personnaliser
            </button>

            {expanded && (
              <button
                type="button"
                onClick={() => saveCustom(analytics, marketing)}
                className="text-accent-primary hover:text-accent-glow flex items-center gap-1 text-xs font-medium transition-colors"
              >
                <Check className="h-3 w-3" />
                Enregistrer mes choix
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <p className="text-foreground text-xs font-medium">{label}</p>
        <p className="text-foreground-muted text-xs leading-snug">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors',
          checked ? 'bg-accent-primary' : 'bg-border-accent',
          disabled && 'cursor-not-allowed opacity-60'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}
