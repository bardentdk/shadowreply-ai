'use client';

import { Lock, ArrowRight, MessageSquare } from 'lucide-react';
import { COMMUNICATION_MODES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Template } from '@/lib/templates';

interface TemplateCardProps {
  template: Template;
  isPro: boolean;
  onClick: (template: Template) => void;
}

export function TemplateCard({ template, isPro, onClick }: TemplateCardProps) {
  const isLocked = template.isPro && !isPro;
  const modeEntry = COMMUNICATION_MODES.find((m) => m.id === template.mode);
  const modeLabel = modeEntry?.label ?? template.mode;
  const ModeIcon = modeEntry?.icon ?? MessageSquare;
  const TemplateIcon = template.icon;

  return (
    <button
      type="button"
      onClick={() => !isLocked && onClick(template)}
      className={cn(
        'glass glass-hover group relative flex w-full flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all',
        isLocked
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer hover:border-accent-primary/30'
      )}
      title={isLocked ? 'Fonctionnalité Pro' : template.title}
    >
      {/* Badge Pro */}
      {template.isPro && (
        <span className="from-accent-primary to-accent-secondary absolute right-3 top-3 rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-semibold text-white">
          Pro
        </span>
      )}

      {/* Icon + mode */}
      <div className="flex items-center gap-2.5">
        <div className="bg-accent-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <TemplateIcon className="text-accent-primary h-4 w-4" />
        </div>
        <span className="text-foreground-subtle flex items-center gap-1 text-xs">
          <ModeIcon className="h-3 w-3" />
          {modeLabel}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-foreground mb-1 text-sm font-semibold">{template.title}</h3>
        <p className="text-foreground-muted text-xs leading-relaxed">{template.description}</p>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1">
        {isLocked ? (
          <span className="text-foreground-subtle flex items-center gap-1 text-xs">
            <Lock className="h-3 w-3" />
            Pro uniquement
          </span>
        ) : (
          <span className="text-accent-primary flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
            Utiliser ce scénario
            <ArrowRight className="h-3 w-3" />
          </span>
        )}
      </div>
    </button>
  );
}
