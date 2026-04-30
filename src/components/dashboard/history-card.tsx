'use client';

import { useState } from 'react';
import { Star, Trash2, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { COMMUNICATION_MODES } from '@/lib/constants';
import { cn, formatRelativeDate, truncate } from '@/lib/utils';
import type { Generation } from '@/types/database';

interface HistoryCardProps {
  generation: Generation;
  onOpen: () => void;
  onToggleFavorite: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export function HistoryCard({
  generation,
  onOpen,
  onToggleFavorite,
  onDelete,
}: HistoryCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const mode = COMMUNICATION_MODES.find((m) => m.id === generation.mode);

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      await onDelete();
      setConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  }

  async function handleFav(e: React.MouseEvent) {
    e.stopPropagation();
    if (favLoading) return;
    setFavLoading(true);
    try {
      await onToggleFavorite();
    } finally {
      setFavLoading(false);
    }
  }

  return (
    <>
      <article
        className={cn(
          'glass glass-hover animate-fade-in group cursor-pointer rounded-2xl p-5 transition-all',
          generation.is_favorite && 'border-warning/30'
        )}
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
          }
        }}
      >
        <header className="mb-3 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {mode && (
              <Badge variant="primary" size="sm">
                <span aria-hidden>{mode.icon}</span>
                {mode.label}
              </Badge>
            )}
            <span className="text-foreground-subtle text-xs">
              {formatRelativeDate(generation.created_at)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleFav}
              disabled={favLoading}
              className={cn(
                'rounded-lg p-1.5 transition-colors',
                generation.is_favorite
                  ? 'text-warning hover:bg-warning/10'
                  : 'text-foreground-subtle hover:text-warning hover:bg-white/5',
                favLoading && 'opacity-50'
              )}
              aria-label={
                generation.is_favorite
                  ? 'Retirer des favoris'
                  : 'Ajouter aux favoris'
              }
            >
              <Star
                className={cn(
                  'h-4 w-4',
                  generation.is_favorite && 'fill-current'
                )}
              />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              className="text-foreground-subtle hover:bg-danger/10 hover:text-danger rounded-lg p-1.5 transition-colors"
              aria-label="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        <p className="text-foreground mb-2 line-clamp-2 text-sm leading-relaxed">
          {truncate(generation.input_message, 200)}
        </p>

        {generation.context && (
          <p className="text-foreground-muted line-clamp-1 text-xs italic">
            Contexte : {truncate(generation.context, 100)}
          </p>
        )}

        <footer className="text-foreground-subtle mt-3 flex items-center justify-between text-xs">
          <span>3 réponses générées</span>
          <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </footer>
      </article>

      {/* Modal de confirmation suppression */}
      <Dialog
        open={confirmOpen}
        onClose={() => !deleting && setConfirmOpen(false)}
        title="Supprimer cette génération ?"
        description="Cette action est irréversible."
        size="sm"
      >
        <DialogContent>
          <div className="bg-background-subtle border-border-subtle rounded-xl border p-3">
            <p className="text-foreground-muted line-clamp-3 text-sm italic">
              « {truncate(generation.input_message, 200)} »
            </p>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setConfirmOpen(false)}
            disabled={deleting}
          >
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            loading={deleting}
            loadingText="Suppression..."
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}