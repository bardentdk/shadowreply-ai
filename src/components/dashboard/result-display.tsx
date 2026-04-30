'use client';

import { ShieldAlert } from 'lucide-react';
import { AnalysisPanel } from './analysis-panel';
import { ReplyCard } from './reply-card';
import type { AIGenerationResponse } from '@/types/ai';

interface ResultDisplayProps {
  response: AIGenerationResponse;
}

export function ResultDisplay({ response }: ResultDisplayProps) {
  // Cas safety : pas de réponses, juste un message d'avertissement
  if (response.flagged) {
    return (
      <div className="border-warning/30 bg-warning/10 animate-fade-in rounded-2xl border p-6">
        <div className="mb-3 flex items-center gap-2">
          <ShieldAlert className="text-warning h-5 w-5" />
          <h3 className="text-warning text-base font-semibold">
            Demande recadrée
          </h3>
        </div>
        <p className="text-foreground mb-3 text-sm leading-relaxed">
          {response.flagged_reason ||
            'Ta demande contient des éléments que je ne peux pas traiter.'}
        </p>
        {response.analysis?.strategic_advice && (
          <div className="border-warning/20 bg-background-subtle/50 mt-4 rounded-xl border p-4">
            <p className="text-foreground-subtle mb-1 text-[11px] font-semibold uppercase tracking-wider">
              Suggestion alternative
            </p>
            <p className="text-foreground text-sm leading-relaxed">
              {response.analysis.strategic_advice}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalysisPanel analysis={response.analysis} />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">
            3 angles de réponse
          </h2>
          <span className="text-foreground-subtle text-xs">
            Choisis celui qui te ressemble
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {response.replies.map((reply, i) => (
            <ReplyCard key={i} reply={reply} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}