import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
};

export function Loader({ className, size = 'md', label }: LoaderProps) {
  return (
    <div
      className={cn('inline-flex flex-col items-center gap-3', className)}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          'border-accent-primary/20 border-t-accent-primary rounded-full animate-spin',
          SIZES[size]
        )}
        aria-hidden
      />
      {label && (
        <span className="text-foreground-muted text-sm">{label}</span>
      )}
      <span className="sr-only">{label || 'Chargement...'}</span>
    </div>
  );
}

/**
 * Loader plein écran avec messages animés.
 * Affiche un message qui change toutes les 2s pour rendre l'attente vivante.
 */
const LOADING_MESSAGES = [
  'Analyse du message reçu...',
  'Décodage de la dynamique...',
  'Évaluation des angles stratégiques...',
  'Génération de la réponse détachée...',
  'Génération de la réponse subtile...',
  'Génération de la réponse directe...',
  'Calibration du positionnement...',
  'Finalisation...',
];

import { useEffect, useState } from 'react';

export function GenerationLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="glass-elevated animate-fade-in flex flex-col items-center gap-6 rounded-2xl p-12"
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div className="bg-accent-primary/20 absolute inset-0 animate-pulse rounded-full blur-2xl" />
        <div className="border-accent-primary/20 border-t-accent-primary relative h-14 w-14 animate-spin rounded-full border-[3px]" />
      </div>
      <div className="text-center">
        <p className="text-foreground mb-1 text-base font-medium">
          {LOADING_MESSAGES[messageIndex]}
        </p>
        <p className="text-foreground-subtle text-xs">
          L&apos;IA réfléchit à 3 angles différents
        </p>
      </div>
    </div>
  );
}