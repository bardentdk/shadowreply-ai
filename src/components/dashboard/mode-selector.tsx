'use client';

import { COMMUNICATION_MODES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { CommunicationMode } from '@/types/database';

interface ModeSelectorProps {
  value: CommunicationMode;
  onChange: (mode: CommunicationMode) => void;
  disabled?: boolean;
}

export function ModeSelector({ value, onChange, disabled }: ModeSelectorProps) {
  return (
    <div>
      <label className="text-foreground-muted mb-2 block text-sm font-medium">
        Mode de communication
      </label>
      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        role="radiogroup"
        aria-label="Mode de communication"
      >
        {COMMUNICATION_MODES.map((mode) => {
          const selected = value === mode.id;
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(mode.id)}
              className={cn(
                'group relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary',
                selected
                  ? 'border-accent-primary/50 bg-accent-primary/10 glow-primary'
                  : 'glass glass-hover border-white/10',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg',
                  selected ? 'bg-accent-primary/20' : 'bg-white/5'
                )}
                aria-hidden
              >
                <Icon
                  className={cn(
                    'h-4 w-4',
                    selected ? 'text-accent-primary' : 'text-foreground-muted'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  selected ? 'text-foreground' : 'text-foreground-muted'
                )}
              >
                {mode.label}
              </span>
              <span className="text-foreground-subtle text-[10px] leading-tight">
                {mode.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
