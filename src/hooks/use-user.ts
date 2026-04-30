'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiFetch, ApiClientError } from './use-fetcher';
import type { Profile } from '@/types/database';

interface UseUserResult {
  user: { id: string; email: string | null } | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

interface MeResponse {
  user: { id: string; email: string | null };
  profile: Profile;
}

export function useUser(): UseUserResult {
  const [data, setData] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch<MeResponse>('/api/me');
      setData(result);
    } catch (err) {
      if (err instanceof ApiClientError) {
        // Pas connecté → pas une vraie erreur, juste un état
        if (err.code !== 'UNAUTHENTICATED') {
          setError(err.message);
        }
      } else {
        setError('Erreur inattendue.');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    const result = await apiFetch<{ profile: Profile }>('/api/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    setData((prev) =>
      prev ? { ...prev, profile: result.profile } : prev
    );
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user: data?.user || null,
    profile: data?.profile || null,
    loading,
    error,
    refresh: fetchUser,
    updateProfile,
  };
}