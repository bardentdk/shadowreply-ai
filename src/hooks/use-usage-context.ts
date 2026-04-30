'use client';

import { createContext, useContext } from 'react';
import type { UsageData } from './use-usage';

interface UsageContextValue {
  usage: UsageData | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setOptimistic: (newCount: number) => void;
}

export const UsageContext = createContext<UsageContextValue | null>(null);

/**
 * Hook pour consommer le contexte usage partagé
 * (sidebar ↔ dashboard, pour mise à jour temps réel).
 */
export function useUsageContext() {
  const ctx = useContext(UsageContext);
  if (!ctx) {
    throw new Error('useUsageContext doit être utilisé dans DashboardLayout');
  }
  return ctx;
}