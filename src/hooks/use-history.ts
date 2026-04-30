'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from './use-fetcher';
import type { Generation, CommunicationMode } from '@/types/database';

export interface HistoryFilters {
  page?: number;
  limit?: number;
  mode?: CommunicationMode;
  favorites_only?: boolean;
}

interface HistoryResponse {
  items: Generation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export function useHistory(initialFilters: HistoryFilters = {}) {
  const [filters, setFilters] = useState<HistoryFilters>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      if (filters.limit) params.set('limit', String(filters.limit));
      if (filters.mode) params.set('mode', filters.mode);
      if (filters.favorites_only) params.set('favorites_only', 'true');

      const result = await apiFetch<HistoryResponse>(
        `/api/history?${params.toString()}`
      );
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const deleteGeneration = useCallback(
    async (id: string) => {
      await apiFetch(`/api/history/${id}`, { method: 'DELETE' });
      // Refresh local
      setData((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((g) => g.id !== id),
              pagination: {
                ...prev.pagination,
                total: prev.pagination.total - 1,
              },
            }
          : prev
      );
    },
    []
  );

  const toggleFavorite = useCallback(
    async (id: string, currentValue: boolean) => {
      const result = await apiFetch<{ id: string; is_favorite: boolean }>(
        `/api/history/${id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ is_favorite: !currentValue }),
        }
      );
      // Update local
      setData((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((g) =>
                g.id === id ? { ...g, is_favorite: result.is_favorite } : g
              ),
            }
          : prev
      );
    },
    []
  );

  return {
    items: data?.items || [],
    pagination: data?.pagination || null,
    loading,
    error,
    filters,
    setFilters,
    refresh: fetchHistory,
    deleteGeneration,
    toggleFavorite,
  };
}