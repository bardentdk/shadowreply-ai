'use client';

import { useState, type FormEvent } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ModeSelector } from './mode-selector';
import type { CommunicationMode } from '@/types/database';

export interface GenerationFormData {
  message: string;
  context: string;
  objective: string;
  mode: CommunicationMode;
}

interface GenerationFormProps {
  onSubmit: (data: GenerationFormData) => void;
  loading: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

export function GenerationForm({
  onSubmit,
  loading,
  disabled,
  disabledReason,
}: GenerationFormProps) {
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('');
  const [objective, setObjective] = useState('');
  const [mode, setMode] = useState<CommunicationMode>('dating');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<{ message?: string }>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const errs: typeof errors = {};
    if (!message.trim()) {
      errs.message = 'Colle le message que tu as reçu.';
    } else if (message.trim().length < 2) {
      errs.message = 'Trop court — ajoute un peu plus de contexte.';
    } else if (message.length > 5000) {
      errs.message = 'Trop long (max 5000 caractères).';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit({
      message: message.trim(),
      context: context.trim(),
      objective: objective.trim(),
      mode,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-elevated rounded-2xl p-6 md:p-8"
      noValidate
    >
      <div className="mb-6 flex items-center gap-2">
        <div className="bg-accent-primary/10 border-accent-primary/20 flex h-9 w-9 items-center justify-center rounded-xl border">
          <Sparkles className="text-accent-primary h-4 w-4" />
        </div>
        <div>
          <h2 className="text-foreground text-base font-semibold">
            Nouvelle génération
          </h2>
          <p className="text-foreground-subtle text-xs">
            Colle un message reçu, choisis ton mode, on s&apos;occupe du reste
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <Textarea
          label="Message reçu"
          placeholder="Colle ici le message auquel tu veux répondre..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          error={errors.message}
          maxLength={5000}
          showCounter
          rows={5}
          disabled={loading || disabled}
          autoFocus
        />

        <ModeSelector
          value={mode}
          onChange={setMode}
          disabled={loading || disabled}
        />

        {/* Champs avancés (collapsible) */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            className="text-foreground-muted hover:text-foreground text-xs font-medium transition-colors"
            disabled={loading || disabled}
          >
            {showAdvanced ? '− Masquer' : '+ Ajouter'} contexte / objectif
            <span className="text-foreground-subtle ml-1">(optionnel)</span>
          </button>

          {showAdvanced && (
            <div className="animate-slide-down mt-4 space-y-4">
              <Textarea
                label="Contexte"
                placeholder="Qui c'est, où vous en êtes, ce qui s'est passé avant..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                maxLength={2000}
                showCounter
                rows={2}
                disabled={loading || disabled}
                helperText="Plus tu donnes de contexte, plus la réponse sera précise."
              />

              <Textarea
                label="Ton objectif"
                placeholder="Ce que tu veux obtenir avec cette réponse..."
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                maxLength={1000}
                showCounter
                rows={2}
                disabled={loading || disabled}
              />
            </div>
          )}
        </div>

        {disabled && disabledReason && (
          <div className="border-warning/30 bg-warning/10 text-warning rounded-xl border p-3 text-sm">
            {disabledReason}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          loadingText="Génération en cours..."
          disabled={disabled}
        >
          <Send className="h-4 w-4" />
          Générer 3 réponses stratégiques
        </Button>
      </div>
    </form>
  );
}