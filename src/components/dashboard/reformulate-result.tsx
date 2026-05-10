'use client';

import { useState, type ReactNode } from 'react';
import { Copy, Check, TrendingUp, Lightbulb, AlertCircle, CheckCircle2, Zap, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import type { ReformulateResult, ReformulateVersion } from '@/types/ai';

interface ReformulateResultProps {
  result: ReformulateResult;
}

const STYLE_CONFIG: Record<string, { icon: ReactNode; color: string }> = {
  polished: {
    icon: <Lightbulb className="h-4 w-4" />,
    color: 'text-accent-tertiary border-accent-tertiary/30 bg-accent-tertiary/5',
  },
  impactful: {
    icon: <Zap className="h-4 w-4" />,
    color: 'text-accent-primary border-accent-primary/30 bg-accent-primary/5',
  },
  concise: {
    icon: <AlignLeft className="h-4 w-4" />,
    color: 'text-accent-secondary border-accent-secondary/30 bg-accent-secondary/5',
  },
};

function VersionCard({ version }: { version: ReformulateVersion }) {
  const [copied, setCopied] = useState(false);
  const config = STYLE_CONFIG[version.style] ?? STYLE_CONFIG.polished;

  async function handleCopy() {
    await navigator.clipboard.writeText(version.message);
    setCopied(true);
    toast.success('Copié !');
    setTimeout(() => setCopied(false), 2000);
  }

  const scoreColor =
    version.impact_score >= 80
      ? 'text-success'
      : version.impact_score >= 60
        ? 'text-warning'
        : 'text-foreground-muted';

  return (
    <div className={cn('glass rounded-2xl border p-5 transition-all', config.color)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn('flex items-center gap-1.5 text-sm font-semibold', config.color.split(' ')[0])}>
            {config.icon}
            {version.label}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <TrendingUp className={cn('h-3.5 w-3.5', scoreColor)} />
            <span className={cn('text-xs font-bold tabular-nums', scoreColor)}>
              {version.impact_score}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-foreground-muted hover:text-foreground flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium transition-all hover:border-white/10 hover:bg-white/5"
            title="Copier"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? 'Copié' : 'Copier'}
          </button>
        </div>
      </div>

      {/* Message */}
      <p className="text-foreground mb-4 whitespace-pre-wrap text-sm leading-relaxed">
        {version.message}
      </p>

      {/* Change summary */}
      <p className="text-foreground-subtle text-xs italic">
        {version.change_summary}
      </p>
    </div>
  );
}

export function ReformulateResultDisplay({ result }: ReformulateResultProps) {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Feedback sur l'original */}
      <div className="glass-elevated rounded-2xl p-5">
        <h3 className="text-foreground mb-4 flex items-center gap-2 text-sm font-semibold">
          <AlertCircle className="text-accent-primary h-4 w-4" />
          Analyse de ton brouillon
        </h3>

        <p className="text-foreground-muted mb-4 text-sm italic">
          {result.original_feedback.overall_assessment}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {result.original_feedback.strengths.length > 0 && (
            <div>
              <p className="text-success mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Points forts
              </p>
              <ul className="space-y-1">
                {result.original_feedback.strengths.map((s, i) => (
                  <li key={i} className="text-foreground-muted text-sm">
                    · {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.original_feedback.weaknesses.length > 0 && (
            <div>
              <p className="text-warning mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider">
                <AlertCircle className="h-3.5 w-3.5" />
                À améliorer
              </p>
              <ul className="space-y-1">
                {result.original_feedback.weaknesses.map((w, i) => (
                  <li key={i} className="text-foreground-muted text-sm">
                    · {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 3 versions */}
      <div>
        <h3 className="text-foreground mb-4 text-sm font-semibold">
          3 reformulations
        </h3>
        <div className="space-y-4">
          {result.versions.map((version) => (
            <VersionCard key={version.style} version={version} />
          ))}
        </div>
      </div>
    </div>
  );
}
