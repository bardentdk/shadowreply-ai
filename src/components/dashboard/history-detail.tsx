'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Dialog } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ResultDisplay } from './result-display';
import { COMMUNICATION_MODES } from '@/lib/constants';
import { formatRelativeDate } from '@/lib/utils';
import { apiFetch } from '@/hooks/use-fetcher';
import type { Generation } from '@/types/database';
import type { AIGenerationResponse } from '@/types/ai';

interface HistoryDetailProps {
  generationId: string | null;
  onClose: () => void;
}

export function HistoryDetail({ generationId, onClose }: HistoryDetailProps) {
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!generationId) {
      setGeneration(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    apiFetch<Generation>(`/api/history/${generationId}`)
      .then((data) => {
        if (!cancelled) setGeneration(data);
      })
      .catch(() => {
        if (!cancelled) {
          toast.error('Impossible de charger cette génération.');
          onClose();
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [generationId, onClose]);

  const mode = generation
    ? COMMUNICATION_MODES.find((m) => m.id === generation.mode)
    : null;

  return (
    <Dialog
      open={!!generationId}
      onClose={onClose}
      size="xl"
      title={mode ? `${mode.icon} Réponse en mode ${mode.label}` : 'Détails'}
      description={
        generation
          ? `Générée ${formatRelativeDate(generation.created_at).toLowerCase()}`
          : undefined
      }
    >
      <div className="p-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-accent-primary h-8 w-8 animate-spin" />
          </div>
        )}

        {!loading && generation && (
          <div className="space-y-6">
            {/* Message original */}
            <section>
              <h4 className="text-foreground-subtle mb-2 text-[11px] font-semibold uppercase tracking-wider">
                Message reçu
              </h4>
              <div className="bg-background-subtle border-border-subtle rounded-xl border p-4">
                <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                  {generation.input_message}
                </p>
              </div>
            </section>

            {/* Contexte */}
            {generation.context && (
              <section>
                <h4 className="text-foreground-subtle mb-2 text-[11px] font-semibold uppercase tracking-wider">
                  Contexte
                </h4>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  {generation.context}
                </p>
              </section>
            )}

            {/* Objectif */}
            {generation.objective && (
              <section>
                <h4 className="text-foreground-subtle mb-2 text-[11px] font-semibold uppercase tracking-wider">
                  Objectif
                </h4>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  {generation.objective}
                </p>
              </section>
            )}

            {/* Méta */}
            <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">
              {mode && (
                <Badge variant="primary">
                  <span aria-hidden>{mode.icon}</span>
                  {mode.label}
                </Badge>
              )}
              {generation.ai_provider && (
                <Badge variant="outline">{generation.ai_provider}</Badge>
              )}
              {generation.is_favorite && (
                <Badge variant="warning">★ Favori</Badge>
              )}
            </div>

            {/* Résultats IA */}
            <div className="border-t border-white/5 pt-6">
              <ResultDisplay
                response={
                  generation.ai_response as unknown as AIGenerationResponse
                }
              />
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}