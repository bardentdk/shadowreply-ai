'use client';

import { Snowflake, Sparkles, Target, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TonePreference } from '@/types/database';

const TONES: Array<{
  id: TonePreference;
  label: string;
  description: string;
  icon: typeof Scale;
  color: string;
}> = [
  {
    id: 'balanced',
    label: 'Équilibré',
    description: 'Les 3 styles à parts égales',
    icon: Scale,
    color: 'text-foreground',
  },
  {
    id: 'detached',
    label: 'Détaché',
    description: 'Privilégie le calme et la distance',
    icon: Snowflake,
    color: 'text-accent-tertiary',
  },
  {
    id: 'subtle',
    label: 'Subtil',
    description: 'Privilégie le charisme et la nuance',
    icon: Sparkles,
    color: 'text-accent-primary',
  },
  {
    id: 'direct',
    label: 'Direct',
    description: 'Privilégie la franchise et la clarté',
    icon: Target,
    color: 'text-accent-secondary',
  },
];

interface ToneSelectorProps {
  value: TonePreference;
  onChange: (tone: TonePreference) => void;
  disabled?: boolean;
}

export function ToneSelector({ value, onChange, disabled }: ToneSelectorProps) {
  return (
    <div
      className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      role="radiogroup"
      aria-label="Ton préféré"
    >
      {TONES.map((tone) => {
        const Icon = tone.icon;
        const selected = value === tone.id;
        return (
          <button
            key={tone.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(tone.id)}
            className={cn(
              'flex items-start gap-3 rounded-xl border p-4 text-left transition-all',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary',
              selected
                ? 'border-accent-primary/50 bg-accent-primary/10 glow-primary'
                : 'glass glass-hover border-white/10',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                selected
                  ? 'bg-accent-primary/15'
                  : 'bg-background-elevated'
              )}
            >
              <Icon className={cn('h-4 w-4', tone.color)} />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'text-sm font-medium',
                  selected ? 'text-foreground' : 'text-foreground-muted'
                )}
              >
                {tone.label}
              </p>
              <p className="text-foreground-subtle mt-0.5 text-xs leading-relaxed">
                {tone.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}