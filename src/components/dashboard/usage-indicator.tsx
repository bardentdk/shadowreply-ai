'use client';

import { Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { UsageData } from '@/hooks/use-usage';

interface UsageIndicatorProps {
  usage: UsageData | null;
  loading?: boolean;
}

export function UsageIndicator({ usage, loading }: UsageIndicatorProps) {
  if (loading) {
    return (
      <div className="glass rounded-xl p-4">
        <div className="skeleton mb-2 h-3 w-20 rounded" />
        <div className="skeleton h-2 w-full rounded-full" />
      </div>
    );
  }

  if (!usage) return null;

  const isPro = usage.plan === 'pro' || usage.plan === 'enterprise';
  const percent = isPro
    ? 0
    : Math.min(100, (usage.current_count / usage.daily_limit) * 100);
  const isLow = !isPro && usage.remaining <= 2;
  const isZero = !isPro && usage.remaining === 0;

  return (
    <div
      className={cn(
        'glass rounded-xl p-4 transition-all',
        isLow && 'border-warning/30',
        isZero && 'border-danger/40'
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isPro ? (
            <Sparkles className="text-accent-primary h-3.5 w-3.5" />
          ) : (
            <Zap className="text-foreground-muted h-3.5 w-3.5" />
          )}
          <span className="text-foreground-muted text-xs font-medium">
            {isPro ? 'Plan Pro' : 'Quota du jour'}
          </span>
        </div>
        {!isPro && (
          <span
            className={cn(
              'text-xs font-semibold tabular-nums',
              isLow && 'text-warning',
              isZero && 'text-danger',
              !isLow && !isZero && 'text-foreground'
            )}
          >
            {usage.remaining}/{usage.daily_limit}
          </span>
        )}
      </div>

      {!isPro && (
        <>
          <div className="bg-background-elevated h-1.5 w-full overflow-hidden rounded-full">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isZero
                  ? 'bg-danger'
                  : isLow
                    ? 'bg-warning'
                    : 'from-accent-primary to-accent-secondary bg-gradient-to-r'
              )}
              style={{ width: `${percent}%` }}
              aria-label={`${usage.remaining} générations restantes sur ${usage.daily_limit}`}
            />
          </div>

          {(isLow || isZero) && (
            <Link
              href="/settings"
              className="text-accent-primary hover:text-accent-glow mt-3 block text-xs font-medium transition-colors"
            >
              Passer Pro pour générer sans limite →
            </Link>
          )}
        </>
      )}

      {isPro && (
        <p className="text-foreground-subtle text-xs">Générations illimitées</p>
      )}
    </div>
  );
}