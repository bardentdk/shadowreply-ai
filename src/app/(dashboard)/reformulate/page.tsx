'use client';

import { useState, useCallback } from 'react';
import { Wand2, Sparkles, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  ReformulateForm,
  type ReformulateFormData,
} from '@/components/dashboard/reformulate-form';
import { ReformulateResultDisplay } from '@/components/dashboard/reformulate-result';
import { GenerationLoader } from '@/components/shared/loader';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/use-user';
import type { ReformulateResult } from '@/types/ai';

export default function ReformulatePage() {
  const { profile, loading: profileLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReformulateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const handleReformulate = useCallback(async (data: ReformulateFormData) => {
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/reformulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error?.message || 'Une erreur est survenue.');
        if (json.error?.code !== 'RATE_LIMITED') {
          toast.error(json.error?.message || 'Erreur de reformulation.');
        }
        return;
      }

      setResult(json.data.result);
      toast.success('3 reformulations générées !');

      setTimeout(() => {
        document.getElementById('reformulate-result')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch {
      setError('Erreur réseau. Vérifie ta connexion.');
      toast.error('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  }, []);

  function handleReset() {
    setResult(null);
    setError(null);
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Skeleton pendant le chargement du profil
  if (profileLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const isPro = profile?.plan === 'pro' || profile?.plan === 'enterprise';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-1 flex items-center gap-2 text-2xl font-bold md:text-3xl">
          Reformulateur
          <span className="from-accent-primary to-accent-secondary rounded-lg bg-gradient-to-r px-2 py-0.5 text-xs font-semibold text-white">
            Pro
          </span>
        </h1>
        <p className="text-foreground-muted text-sm">
          Tu as déjà rédigé un message ? Colle-le ici et l&apos;IA le reformule en 3 versions
          plus percutantes.
        </p>
      </div>

      {/* Gate Pro */}
      {!isPro ? (
        <div className="glass-elevated border-accent-primary/20 rounded-2xl border p-8 text-center">
          <div className="from-accent-primary/20 to-accent-secondary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br">
            <Lock className="text-accent-primary h-8 w-8" />
          </div>
          <h2 className="text-foreground mb-2 text-xl font-bold">
            Fonctionnalité Pro
          </h2>
          <p className="text-foreground-muted mx-auto mb-6 max-w-md text-sm">
            Le reformulateur est exclusivement disponible pour les abonnés Pro.
            Passe Pro pour améliorer tes messages avec l&apos;IA en un clic.
          </p>
          <div className="mb-6 flex flex-wrap justify-center gap-3 text-sm">
            {[
              'Reformulation en 3 styles',
              'Analyse de ton brouillon',
              'Générations illimitées',
              'Historique illimité',
            ].map((f) => (
              <span
                key={f}
                className="border-accent-primary/20 bg-accent-primary/10 text-accent-primary rounded-full border px-3 py-1 text-xs"
              >
                ✓ {f}
              </span>
            ))}
          </div>
          <Link
            href="/settings"
            className="btn-premium inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-medium text-white shadow-lg shadow-accent-primary/20"
          >
            <Sparkles className="h-4 w-4" />
            Passer Pro — 9,99 € / mois
          </Link>
        </div>
      ) : (
        <>
          {/* Formulaire */}
          <ReformulateForm
            key={formKey}
            onSubmit={handleReformulate}
            loading={loading}
          />

          {/* Résultats */}
          <section id="reformulate-result" className="scroll-mt-20">
            {loading && <GenerationLoader />}

            {!loading && error && (
              <div className="border-danger/30 bg-danger/5 animate-fade-in rounded-2xl border p-6">
                <h3 className="text-danger mb-2 text-base font-semibold">Erreur</h3>
                <p className="text-foreground text-sm leading-relaxed">{error}</p>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-accent-primary hover:text-accent-glow mt-3 text-sm font-medium transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {!loading && result && (
              <>
                <ReformulateResultDisplay result={result} />
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-accent-primary hover:text-accent-glow text-sm font-medium transition-colors"
                  >
                    ← Reformuler un autre message
                  </button>
                </div>
              </>
            )}

            {!loading && !result && !error && (
              <EmptyState
                icon={<Wand2 className="text-accent-primary h-7 w-7" />}
                title="Tes reformulations apparaîtront ici"
                description="Colle ton brouillon ci-dessus et l'IA le retravaille en 3 versions distinctes avec une analyse de ton message d'origine."
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}
