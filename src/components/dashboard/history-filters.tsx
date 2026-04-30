'use client';

import { Filter, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { COMMUNICATION_MODES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { CommunicationMode } from '@/types/database';

interface HistoryFiltersProps {
  mode: CommunicationMode | undefined;
  favoritesOnly: boolean;
  onModeChange: (mode: CommunicationMode | undefined) => void;
  onFavoritesToggle: () => void;
  onReset: () => void;
  total?: number;
}

export function HistoryFilters({
  mode,
  favoritesOnly,
  onModeChange,
  onFavoritesToggle,
  onReset,
  total,
}: HistoryFiltersProps) {
  const hasActiveFilters = !!mode || favoritesOnly;

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="text-foreground-muted h-4 w-4" />
          <span className="text-foreground-muted text-sm font-medium">
            Filtres
          </span>
          {typeof total === 'number' && (
            <span className="text-foreground-subtle text-xs">
              · {total} résultat{total > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={mode || ''}
            onChange={(e) =>
              onModeChange(
                (e.target.value as CommunicationMode) || undefined
              )
            }
            className="!h-9 sm:max-w-[200px]"
            aria-label="Filtrer par mode"
          >
            <option value="">Tous les modes</option>
            {COMMUNICATION_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.icon} {m.label}
              </option>
            ))}
          </Select>

          <button
            type="button"
            onClick={onFavoritesToggle}
            className={cn(
              'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-medium transition-all',
              favoritesOnly
                ? 'border-warning/30 bg-warning/10 text-warning'
                : 'glass glass-hover text-foreground-muted'
            )}
            aria-pressed={favoritesOnly}
          >
            <Star
              className={cn('h-3.5 w-3.5', favoritesOnly && 'fill-current')}
            />
            Favoris
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}