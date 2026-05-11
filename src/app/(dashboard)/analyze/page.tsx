'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ScanText, Brain, Sparkles, TrendingUp, AlertTriangle, Lightbulb, HelpCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { GenerationLoader } from '@/components/shared/loader';
import { useUser } from '@/hooks/use-user';
import { COMMUNICATION_MODES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { AnalyzeResult } from '@/lib/ai/analyze';

function ExtensionParamReader({ onMessage }: { onMessage: (msg: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const msg = searchParams.get('msg');
    if (msg?.trim()) onMessage(msg.trim());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

type PartialAnalyzeResult = Partial<AnalyzeResult> & {
  detected_tone?: string;
  interest_level?: string;
  probable_intention?: string;
  suggested_mode?: string;
  confidence?: string;
  power_dynamic?: string | null;
  risks?: string[] | null;
  strategic_advice?: string | null;
};

const INTEREST_CONFIG = {
  high: { label: 'Élevé', color: 'text-success', bar: 'bg-success', width: 'w-full' },
  medium: { label: 'Moyen', color: 'text-warning', bar: 'bg-warning', width: 'w-2/3' },
  low: { label: 'Faible', color: 'text-danger', bar: 'bg-danger', width: 'w-1/3' },
  unknown: { label: 'Indéterminé', color: 'text-foreground-muted', bar: 'bg-border-accent', width: 'w-1/4' },
};

function AnalysisResult({ result, isPro }: { result: PartialAnalyzeResult; isPro: boolean }) {
  const interest = INTEREST_CONFIG[result.interest_level as keyof typeof INTEREST_CONFIG] ?? INTEREST_CONFIG.unknown;
  const modeInfo = COMMUNICATION_MODES.find((m) => m.id === result.suggested_mode);

  return (
    <div className="animate-fade-in space-y-4">
      {/* Ligne 1 : tone + interest */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-elevated rounded-2xl p-5">
          <p className="text-foreground-muted mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
            <Brain className="h-3.5 w-3.5" />
            Ton détecté
          </p>
          <p className="text-foreground text-base font-semibold">{result.detected_tone}</p>
        </div>

        <div className="glass-elevated rounded-2xl p-5">
          <p className="text-foreground-muted mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5" />
            Niveau d&apos;intérêt
          </p>
          <div className="flex items-center gap-3">
            <span className={cn('text-base font-semibold', interest.color)}>{interest.label}</span>
            <div className="bg-background-elevated h-2 flex-1 overflow-hidden rounded-full">
              <div className={cn('h-full rounded-full transition-all duration-700', interest.bar, interest.width)} />
            </div>
          </div>
        </div>
      </div>

      {/* Intention probable */}
      <div className="glass-elevated rounded-2xl p-5">
        <p className="text-foreground-muted mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5" />
          Intention probable
        </p>
        <p className="text-foreground text-sm leading-relaxed">{result.probable_intention}</p>
      </div>

      {/* Mode suggéré */}
      {modeInfo && (
        <div className="glass-elevated rounded-2xl p-5">
          <p className="text-foreground-muted mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
            <ArrowRight className="h-3.5 w-3.5" />
            Mode de réponse conseillé
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{modeInfo.icon}</span>
            <div>
              <p className="text-foreground text-sm font-semibold">{modeInfo.label}</p>
              <p className="text-foreground-muted text-xs">{modeInfo.description}</p>
            </div>
          </div>
          <Link
            href={`/dashboard?tpl_mode=${modeInfo.id}`}
            className="text-accent-primary hover:text-accent-glow mt-3 block text-xs font-medium transition-colors"
          >
            Générer des réponses avec ce mode →
          </Link>
        </div>
      )}

      {/* Champs Pro */}
      {isPro ? (
        <>
          {result.power_dynamic && (
            <div className="glass-elevated rounded-2xl p-5">
              <p className="text-foreground-muted mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                <TrendingUp className="h-3.5 w-3.5" />
                Dynamique de pouvoir
              </p>
              <p className="text-foreground text-sm leading-relaxed">{result.power_dynamic}</p>
            </div>
          )}

          {result.risks && result.risks.length > 0 && (
            <div className="glass-elevated border-warning/20 rounded-2xl border p-5">
              <p className="text-warning mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                <AlertTriangle className="h-3.5 w-3.5" />
                Signaux d&apos;alerte
              </p>
              <ul className="space-y-2">
                {result.risks.map((risk, i) => (
                  <li key={i} className="text-foreground-muted flex items-start gap-2 text-sm">
                    <span className="text-warning mt-0.5 shrink-0">·</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.strategic_advice && (
            <div className="from-accent-primary/10 to-accent-secondary/10 border-accent-primary/20 rounded-2xl border bg-gradient-to-br p-5">
              <p className="text-accent-primary mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                <Lightbulb className="h-3.5 w-3.5" />
                Conseil stratégique
              </p>
              <p className="text-foreground text-sm font-medium leading-relaxed">{result.strategic_advice}</p>
            </div>
          )}
        </>
      ) : (
        /* Gate Pro pour les champs avancés */
        <div className="border-accent-primary/20 bg-accent-primary/5 rounded-2xl border p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="text-accent-primary h-4 w-4" />
            <p className="text-foreground text-sm font-semibold">Analyse complète — Pro</p>
          </div>
          <p className="text-foreground-muted mb-4 text-xs leading-relaxed">
            Les utilisateurs Pro voient aussi : la dynamique de pouvoir, les signaux d&apos;alerte dans le message,
            et un conseil stratégique personnalisé sur comment répondre.
          </p>
          <Link
            href="/settings"
            className="btn-premium inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium text-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Passer Pro pour voir l&apos;analyse complète
          </Link>
        </div>
      )}
    </div>
  );
}

export default function AnalyzePage() {
  const { profile, loading: profileLoading } = useUser();
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');

  // Pre-fill from extension URL param (wrapped in Suspense below)
  const handleExtensionParam = useCallback((msg: string) => {
    setMessage(msg);
  }, []);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PartialAnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!message.trim() || loading) return;
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), context: context.trim() || undefined }),
      });

      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message || 'Erreur d\'analyse.');
        toast.error(json.error?.message || 'Erreur.');
        return;
      }

      setResult(json.data.result);
      setIsPro(json.data.is_pro);

      setTimeout(() => {
        document.getElementById('analyze-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Erreur réseau. Vérifie ta connexion.');
      toast.error('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  }, [message, context, loading]);

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  const userIsPro = profile?.plan === 'pro' || profile?.plan === 'enterprise';

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <ExtensionParamReader onMessage={handleExtensionParam} />
      </Suspense>
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-1 flex items-center gap-2 text-2xl font-bold md:text-3xl">
          <ScanText className="text-accent-primary h-7 w-7" />
          Analyser un message
        </h1>
        <p className="text-foreground-muted text-sm">
          Comprends le vrai sens d&apos;un message avant de répondre — sans consommer de génération.
          {!userIsPro && (
            <span className="text-foreground-muted"> Analyse de base gratuite · </span>
          )}
          {!userIsPro && (
            <Link href="/settings" className="text-accent-primary hover:underline text-sm">
              Passer Pro pour l&apos;analyse complète →
            </Link>
          )}
        </p>
      </div>

      {/* Formulaire */}
      <div className="glass-elevated space-y-5 rounded-2xl p-6 md:p-8">
        <Textarea
          label="Message à analyser"
          placeholder="Colle ici le message que tu veux comprendre..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          maxLength={5000}
          showCounter
          disabled={loading}
          autoFocus
        />

        <Input
          label="Contexte (optionnel)"
          placeholder="Qui est cette personne, quel est votre relation, ce qui s'est passé avant..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          maxLength={2000}
          disabled={loading}
        />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleAnalyze}
          disabled={message.trim().length < 2 || loading}
          loading={loading}
          loadingText="Analyse en cours..."
        >
          <Brain className="h-4 w-4" />
          Analyser ce message
        </Button>
      </div>

      {/* Résultats */}
      <section id="analyze-result" className="scroll-mt-20">
        {loading && <GenerationLoader />}

        {!loading && error && (
          <div className="border-danger/30 bg-danger/5 animate-fade-in rounded-2xl border p-6">
            <p className="text-foreground text-sm">{error}</p>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-accent-primary hover:text-accent-glow mt-2 text-sm font-medium"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && result && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-foreground text-base font-semibold">Résultat de l&apos;analyse</h2>
              <span className="text-foreground-subtle text-xs">
                Confiance : {result.confidence === 'high' ? '🟢 Élevée' : result.confidence === 'medium' ? '🟡 Moyenne' : '🔴 Faible'}
              </span>
            </div>
            <AnalysisResult result={result} isPro={isPro} />
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => { setResult(null); setMessage(''); setContext(''); }}
                className="text-accent-primary hover:text-accent-glow text-sm font-medium transition-colors"
              >
                ← Analyser un autre message
              </button>
            </div>
          </>
        )}

        {!loading && !result && !error && (
          <EmptyState
            icon={<ScanText className="text-accent-primary h-7 w-7" />}
            title="L'analyse apparaîtra ici"
            description="Colle n'importe quel message — SMS, email, message pro — et l'IA décrypte l'intention, le ton et te conseille sur l'approche à adopter."
          />
        )}
      </section>
    </div>
  );
}
