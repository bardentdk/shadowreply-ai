'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from './use-fetcher';

export interface UsageData {
  current_count: number;
  daily_limit: number;
  remaining: number;
  can_generate: boolean;
  plan: string;
}

export function useUsage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<UsageData>('/api/usage');
      setUsage(data);
    } catch {
      setUsage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return {
    usage,
    loading,
    refresh: fetchUsage,
    /**
     * Met à jour localement après une génération réussie
     * (évite un round-trip API supplémentaire).
     */
    setOptimistic: (newCount: number) => {
      setUsage((prev) =>
        prev
          ? {
              ...prev,
              current_count: newCount,
              remaining: Math.max(0, prev.daily_limit - newCount),
              can_generate: newCount < prev.daily_limit,
            }
          : prev
      );
    },
  };
}