'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';
import { TemplateCard } from '@/components/dashboard/template-card';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import { TEMPLATES, type Template } from '@/lib/templates';
import { COMMUNICATION_MODES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { CommunicationMode } from '@/types/database';

const ALL_MODES = [
  { id: null, label: 'Tous', icon: '✨' },
  ...COMMUNICATION_MODES.map((m) => ({ id: m.id as CommunicationMode | null, label: m.label, icon: m.icon })),
];

export default function TemplatesPage() {
  const { profile, loading } = useUser();
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<CommunicationMode | null>(null);

  const isPro = profile?.plan === 'pro' || profile?.plan === 'enterprise';

  const filtered = activeMode
    ? TEMPLATES.filter((t) => t.mode === activeMode)
    : TEMPLATES;

  const freeCount = filtered.filter((t) => !t.isPro).length;
  const proCount = filtered.filter((t) => t.isPro).length;

  function handleTemplateClick(template: Template) {
    const params = new URLSearchParams();
    params.set('tpl_msg', template.message);
    if (template.context) params.set('tpl_ctx', template.context);
    if (template.objective) params.set('tpl_obj', template.objective);
    params.set('tpl_mode', template.mode);
    router.push(`/dashboard?${params.toString()}`);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-foreground mb-1 flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <BookOpen className="text-accent-primary h-7 w-7" />
            Templates
          </h1>
          <p className="text-foreground-muted text-sm">
            {TEMPLATES.length} scénarios prêts à l&apos;emploi. Clique pour pré-remplir le formulaire.
          </p>
        </div>

        {!isPro && (
          <div className="border-accent-primary/20 bg-accent-primary/5 flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5">
            <Lock className="text-accent-primary h-4 w-4" />
            <div className="text-xs">
              <span className="text-foreground font-medium">{proCount} templates Pro</span>
              <span className="text-foreground-muted"> non disponibles</span>
              <Link href="/settings" className="text-accent-primary ml-1 font-semibold hover:underline">
                Passer Pro →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Filtre par mode */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {ALL_MODES.map((m) => (
          <button
            key={String(m.id)}
            type="button"
            onClick={() => setActiveMode(m.id as CommunicationMode | null)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all',
              activeMode === m.id
                ? 'border-accent-primary/40 bg-accent-primary/10 text-foreground'
                : 'border-border-subtle text-foreground-muted hover:border-border-accent hover:text-foreground'
            )}
          >
            <span>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="text-foreground-subtle flex items-center gap-3 text-xs">
        <span>{filtered.length} scénarios</span>
        <span>·</span>
        <span>{freeCount} gratuits</span>
        {proCount > 0 && (
          <>
            <span>·</span>
            <span className="text-accent-primary">{proCount} Pro</span>
          </>
        )}
      </div>

      {/* Grille */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isPro={isPro}
            onClick={handleTemplateClick}
          />
        ))}
      </div>

      {/* CTA Pro en bas si Free */}
      {!isPro && (
        <div className="glass-elevated border-accent-primary/20 rounded-2xl border p-6 text-center">
          <Sparkles className="text-accent-primary mx-auto mb-3 h-8 w-8" />
          <h3 className="text-foreground mb-1 text-base font-bold">
            Débloquer les {TEMPLATES.filter((t) => t.isPro).length} templates Pro
          </h3>
          <p className="text-foreground-muted mb-4 text-sm">
            Accède à tous les scénarios — dating avancé, négociation, business, conflict management et plus.
          </p>
          <Link
            href="/settings"
            className="btn-premium inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white"
          >
            <Sparkles className="h-4 w-4" />
            Passer Pro — 9,99 € / mois
          </Link>
        </div>
      )}
    </div>
  );
}
