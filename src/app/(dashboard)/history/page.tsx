'use client';

import { useState } from 'react';
import { History as HistoryIcon, Wand2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { HistoryFilters } from '@/components/dashboard/history-filters';
import { HistoryCard } from '@/components/dashboard/history-card';
import { HistoryDetail } from '@/components/dashboard/history-detail';
import { Pagination } from '@/components/dashboard/pagination';
import { useHistory } from '@/hooks/use-history';
import type { CommunicationMode } from '@/types/database';

export default function HistoryPage() {
  const {
    items,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    deleteGeneration,
    toggleFavorite,
  } = useHistory({ page: 1, limit: 9 });

  const [openId, setOpenId] = useState<string | null>(null);

  function handleModeChange(mode: CommunicationMode | undefined) {
    setFilters((f) => ({ ...f, mode, page: 1 }));
  }

  function handleFavoritesToggle() {
    setFilters((f) => ({ ...f, favorites_only: !f.favorites_only, page: 1 }));
  }

  function handleReset() {
    setFilters({ page: 1, limit: 9 });
  }

  function handlePageChange(page: number) {
    setFilters((f) => ({ ...f, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    try {
      await deleteGeneration(id);
      toast.success('Génération supprimée.');
    } catch {
      toast.error('Suppression impossible.');
    }
  }

  async function handleToggleFavorite(id: string, current: boolean) {
    try {
      await toggleFavorite(id, current);
    } catch {
      toast.error('Action impossible.');
    }
  }

  const hasItems = items.length > 0;
  const hasFilters = !!filters.mode || !!filters.favorites_only;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-foreground mb-1 text-2xl font-bold md:text-3xl">
          Historique
        </h1>
        <p className="text-foreground-muted text-sm">
          Retrouve toutes tes générations passées.
        </p>
      </header>

      {/* Filtres */}
      <HistoryFilters
        mode={filters.mode}
        favoritesOnly={!!filters.favorites_only}
        onModeChange={handleModeChange}
        onFavoritesToggle={handleFavoritesToggle}
        onReset={handleReset}
        total={pagination?.total}
      />

      {/* Erreur */}
      {error && (
        <div className="border-danger/30 bg-danger/5 rounded-2xl border p-4 text-sm">
          <p className="text-danger">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="mb-2 h-4 w-full" />
              <Skeleton className="mb-3 h-4 w-4/5" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasItems && (
        <EmptyState
          icon={<HistoryIcon className="text-accent-primary h-7 w-7" />}
          title={
            hasFilters
              ? 'Aucun résultat avec ces filtres'
              : 'Pas encore de génération'
          }
          description={
            hasFilters
              ? 'Essaie de modifier ou réinitialiser les filtres.'
              : 'Tes générations apparaîtront ici dès que tu en auras créé une.'
          }
          action={
            hasFilters ? (
              <Button variant="secondary" onClick={handleReset}>
                Réinitialiser les filtres
              </Button>
            ) : (
              <Link href="/dashboard">
                <Button variant="primary">
                  <Wand2 className="h-4 w-4" />
                  Faire ma première génération
                </Button>
              </Link>
            )
          }
        />
      )}

      {/* Liste */}
      {!loading && hasItems && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((gen) => (
              <HistoryCard
                key={gen.id}
                generation={gen}
                onOpen={() => setOpenId(gen.id)}
                onToggleFavorite={() =>
                  handleToggleFavorite(gen.id, gen.is_favorite)
                }
                onDelete={() => handleDelete(gen.id)}
              />
            ))}
          </div>

          {pagination && pagination.total_pages > 1 && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.total_pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Modal de détail */}
      <HistoryDetail
        generationId={openId}
        onClose={() => setOpenId(null)}
      />
    </div>
  );
}