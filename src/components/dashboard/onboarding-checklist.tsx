'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Check, X, ChevronDown, ChevronUp, Sparkles, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types/database';

interface OnboardingStep {
  id: string;
  label: string;
  desc: string;
  href?: string;
  linkLabel?: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: 'account',
    label: 'Compte créé',
    desc: 'Tu es bien connecté à ShadowReply AI.',
  },
  {
    id: 'generate',
    label: 'Générer ta première réponse',
    desc: 'Colle un message reçu et génère 3 réponses stratégiques.',
    href: '/dashboard',
    linkLabel: 'Générer maintenant →',
  },
  {
    id: 'analyze',
    label: 'Analyser un message',
    desc: 'Découvre le vrai sens d\'un message avant de répondre.',
    href: '/analyze',
    linkLabel: 'Essayer l\'analyse →',
  },
  {
    id: 'templates',
    label: 'Explorer les templates',
    desc: '43 scénarios prêts à l\'emploi pour toutes les situations.',
    href: '/templates',
    linkLabel: 'Voir les templates →',
  },
  {
    id: 'settings',
    label: 'Configurer tes préférences',
    desc: 'Choisir ta langue et ton ton de communication préféré.',
    href: '/settings',
    linkLabel: 'Accéder aux paramètres →',
  },
];

const STORAGE_KEY = 'sr_onboarding_steps';

function loadCompletedSteps(): Set<string> {
  if (typeof window === 'undefined') return new Set(['account']);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    return new Set(['account', ...arr]);
  } catch {
    return new Set(['account']);
  }
}

function saveCompletedSteps(steps: Set<string>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...steps]));
}

interface Props {
  profile: Profile | null;
  totalGenerations?: number;
  onComplete?: () => void;
}

export function OnboardingChecklist({ profile, totalGenerations = 0, onComplete }: Props) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set(['account']));
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const steps = loadCompletedSteps();

    // Auto-complete step 'generate' if user has generations
    if (totalGenerations > 0) steps.add('generate');

    // Auto-complete 'settings' if preferences are set
    if (profile?.preferred_tone || profile?.language !== 'fr') steps.add('settings');

    setCompletedSteps(steps);

    // Check if already dismissed
    if (localStorage.getItem('sr_onboarding_dismissed') === 'true') {
      setDismissed(true);
    }
  }, [totalGenerations, profile]);

  const markStep = useCallback((stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepId);
      saveCompletedSteps(next);

      // Check if all done
      if (STEPS.every((s) => next.has(s.id))) {
        setJustCompleted(true);
        // Mark onboarded in API
        fetch('/api/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ onboarded: true }),
        }).catch(() => null);
        setTimeout(() => {
          setDismissed(true);
          onComplete?.();
        }, 3000);
      }

      return next;
    });
  }, [onComplete]);

  const dismiss = useCallback(() => {
    localStorage.setItem('sr_onboarding_dismissed', 'true');
    setDismissed(true);
  }, []);

  // Don't show if already onboarded or dismissed
  if (!mounted || dismissed || profile?.onboarded) return null;

  const completedCount = STEPS.filter((s) => completedSteps.has(s.id)).length;
  const totalCount = STEPS.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const allDone = completedCount === totalCount;

  if (justCompleted) {
    return (
      <div className="from-accent-primary/15 to-accent-secondary/10 border-accent-primary/30 animate-fade-in mb-6 flex items-center gap-3 rounded-2xl border bg-gradient-to-r px-5 py-4">
        <PartyPopper className="text-accent-primary h-5 w-5 shrink-0" />
        <div className="flex-1">
          <p className="text-foreground text-sm font-semibold">Félicitations ! Tu as découvert toutes les fonctionnalités.</p>
          <p className="text-foreground-muted text-xs">Tu es maintenant prêt à maîtriser chaque conversation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-elevated border-accent-primary/20 animate-fade-in mb-6 rounded-2xl border">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center justify-between px-5 py-4"
        onClick={() => setCollapsed((v) => !v)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Sparkles className="text-accent-primary h-4 w-4 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="mb-1.5 flex items-center gap-3">
              <p className="text-foreground text-sm font-semibold">
                Prendre en main ShadowReply AI
              </p>
              <span className="text-foreground-muted text-xs shrink-0">
                {completedCount}/{totalCount}
              </span>
            </div>
            {/* Progress bar */}
            <div className="bg-background-elevated h-1.5 w-full max-w-xs overflow-hidden rounded-full">
              <div
                className="bg-accent-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
        <div className="ml-3 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); dismiss(); }}
            className="text-foreground-subtle hover:text-foreground-muted rounded p-0.5 transition-colors"
            title="Masquer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          {collapsed
            ? <ChevronDown className="text-foreground-muted h-4 w-4" />
            : <ChevronUp className="text-foreground-muted h-4 w-4" />
          }
        </div>
      </div>

      {/* Steps */}
      {!collapsed && (
        <div className="border-border-subtle border-t px-5 py-3">
          <div className="space-y-1">
            {STEPS.map((step) => {
              const done = completedSteps.has(step.id);
              return (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors',
                    done ? 'opacity-60' : 'hover:bg-white/[0.03]'
                  )}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => !done && markStep(step.id)}
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                      done
                        ? 'border-accent-primary bg-accent-primary'
                        : 'border-border-accent hover:border-accent-primary/60'
                    )}
                    title={done ? 'Complété' : 'Marquer comme fait'}
                    disabled={done}
                  >
                    {done && <Check className="h-3 w-3 text-white" />}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium',
                      done ? 'text-foreground-muted line-through' : 'text-foreground'
                    )}>
                      {step.label}
                    </p>
                    {!done && (
                      <>
                        <p className="text-foreground-subtle text-xs leading-relaxed mt-0.5">
                          {step.desc}
                        </p>
                        {step.href && (
                          <Link
                            href={step.href}
                            onClick={() => markStep(step.id)}
                            className="text-accent-primary hover:text-accent-glow mt-1 inline-block text-xs font-medium transition-colors"
                          >
                            {step.linkLabel}
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {allDone && (
            <div className="border-border-subtle mt-3 border-t pt-3 text-center">
              <button
                type="button"
                onClick={dismiss}
                className="text-foreground-subtle hover:text-foreground-muted text-xs transition-colors"
              >
                Masquer cette section
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
