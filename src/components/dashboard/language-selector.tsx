'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]['code'];

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: LanguageCode) => void;
  disabled?: boolean;
}

export function LanguageSelector({
  value,
  onChange,
  disabled,
}: LanguageSelectorProps) {
  return (
    <div
      className="grid grid-cols-1 gap-2 sm:grid-cols-3"
      role="radiogroup"
      aria-label="Langue"
    >
      {LANGUAGES.map((lang) => {
        const selected = value === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(lang.code)}
            className={cn(
              'flex items-center gap-3 rounded-xl border p-3 transition-all',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary',
              selected
                ? 'border-accent-primary/50 bg-accent-primary/10'
                : 'glass glass-hover border-white/10',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <span className="text-2xl" aria-hidden>
              {lang.flag}
            </span>
            <span
              className={cn(
                'flex-1 text-left text-sm font-medium',
                selected ? 'text-foreground' : 'text-foreground-muted'
              )}
            >
              {lang.label}
            </span>
            {selected && (
              <Check className="text-accent-primary h-4 w-4" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}