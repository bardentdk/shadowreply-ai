'use client';

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

export type CookieCategory = 'essential' | 'analytics' | 'marketing';

export interface CookieConsent {
  decided: boolean;
  essential: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string | null;
}

const DEFAULT_CONSENT: CookieConsent = {
  decided: false,
  essential: true,
  analytics: false,
  marketing: false,
  decidedAt: null,
};

const STORAGE_KEY = 'sr_cookie_consent';

function readFromStorage(): CookieConsent {
  if (typeof window === 'undefined') return DEFAULT_CONSENT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENT;
    return { ...DEFAULT_CONSENT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONSENT;
  }
}

function writeToStorage(consent: CookieConsent) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

interface CookieConsentContextValue {
  consent: CookieConsent;
  acceptAll: () => void;
  rejectAll: () => void;
  saveCustom: (analytics: boolean, marketing: boolean) => void;
  reset: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent>(DEFAULT_CONSENT);

  useEffect(() => {
    setConsent(readFromStorage());
  }, []);

  const save = useCallback((next: CookieConsent) => {
    setConsent(next);
    writeToStorage(next);
  }, []);

  const acceptAll = useCallback(() => {
    save({ decided: true, essential: true, analytics: true, marketing: true, decidedAt: new Date().toISOString() });
  }, [save]);

  const rejectAll = useCallback(() => {
    save({ decided: true, essential: true, analytics: false, marketing: false, decidedAt: new Date().toISOString() });
  }, [save]);

  const saveCustom = useCallback((analytics: boolean, marketing: boolean) => {
    save({ decided: true, essential: true, analytics, marketing, decidedAt: new Date().toISOString() });
  }, [save]);

  const reset = useCallback(() => {
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    setConsent(DEFAULT_CONSENT);
  }, []);

  return (
    <CookieConsentContext.Provider value={{ consent, acceptAll, rejectAll, saveCustom, reset }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent must be used inside CookieConsentProvider');
  return ctx;
}

