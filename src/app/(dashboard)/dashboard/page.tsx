'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Wand2 } from 'lucide-react';
import {
  GenerationForm,
  type GenerationFormData,
} from '@/components/dashboard/generation-form';
import { ResultDisplay } from '@/components/dashboard/result-display';
import { GenerationLoader } from '@/components/shared/loader';
import { EmptyState } from '@/components/shared/empty-state';
import { useGenerate } from '@/hooks/use-generate';
import { useUsageContext } from '@/hooks/use-usage-context';

export default function DashboardPage() {
  const { loading, result, error, errorCode, generate, reset } = useGenerate();
  const { usage, setOptimistic, refresh: refreshUsage } = useUsageContext();
  const [formKey, setFormKey] = useState(0);

  async function handleGenerate(data: GenerationFormData) {
    reset();
    const res = await generate(data);

    if (res) {
      // Met à jour le compteur en temps réel
      if (res.usage?.current_count !== undefined) {
        setOptimistic(res.usage.current_count);
      }
      // Notification
      if (res.response.flagged) {
        toast('Demande recadrée par notre filtre éthique.', { icon: '🛡️' });
      } else {
        toast.success('3 réponses générées !');
      }
      // Scroll doux vers les résultats sur mobile
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } else if (errorCode === 'QUOTA_EXCEEDED') {
      // Refresh pour afficher le bon nombre
      refreshUsage();
    }
  }

  function handleNewGeneration() {
    reset();
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const quotaExceeded = !!usage && !usage.can_generate && usage.plan === 'free';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-1 text-2xl font-bold md:text-3xl">
          Génère ta réponse stratégique
        </h1>
        <p className="text-foreground-muted text-sm">
          Colle un message reçu, ajoute un peu de contexte, et obtiens 3 angles
          différents.
        </p>
      </div>

      {/* Formulaire */}
      <GenerationForm
        key={formKey}
        onSubmit={handleGenerate}
        loading={loading}
        disabled={quotaExceeded}
        disabledReason={
          quotaExceeded
            ? `Tu as atteint ta limite de ${usage?.daily_limit ?? 5} générations aujourd'hui. Reviens demain ou passe Pro pour générer sans limite.`
            : undefined
        }
      />

      {/* Section résultats */}
      <section id="result-section" className="scroll-mt-20">
        {loading && <GenerationLoader />}

        {!loading && error && (
          <ErrorPanel
            errorCode={errorCode}
            error={error}
            onRetry={() => reset()}
          />
        )}

        {!loading && result && (
          <>
            <ResultDisplay response={result.response} />
            <div className="mt-6 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleNewGeneration}
                className="text-accent-primary hover:text-accent-glow text-sm font-medium transition-colors"
              >
                ← Faire une nouvelle génération
              </button>
              {result.metadata && (
                <p className="text-foreground-subtle text-[10px]">
                  Généré en {(result.metadata.duration_ms / 1000).toFixed(1)}s
                  · {result.metadata.provider} · {result.metadata.model}
                </p>
              )}
            </div>
          </>
        )}

        {!loading && !result && !error && (
          <EmptyState
            icon={<Wand2 className="text-accent-primary h-7 w-7" />}
            title="Tes réponses apparaîtront ici"
            description="Remplis le formulaire ci-dessus et l'IA générera 3 angles stratégiques différents pour ton message."
          />
        )}
      </section>
    </div>
  );
}

function ErrorPanel({
  errorCode,
  error,
  onRetry,
}: {
  errorCode: string | null;
  error: string;
  onRetry: () => void;
}) {
  const isQuota = errorCode === 'QUOTA_EXCEEDED';
  const isSafety = errorCode === 'SAFETY_BLOCKED';
  const isRateLimit = errorCode === 'RATE_LIMITED';

  return (
    <div className="border-danger/30 bg-danger/5 animate-fade-in rounded-2xl border p-6">
      <h3 className="text-danger mb-2 text-base font-semibold">
        {isQuota
          ? 'Quota quotidien atteint'
          : isSafety
            ? 'Demande recadrée'
            : isRateLimit
              ? 'Trop de requêtes'
              : 'Erreur'}
      </h3>
      <p className="text-foreground mb-4 text-sm leading-relaxed">{error}</p>
      {!isQuota && !isSafety && (
        <button
          type="button"
          onClick={onRetry}
          className="text-accent-primary hover:text-accent-glow text-sm font-medium transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}