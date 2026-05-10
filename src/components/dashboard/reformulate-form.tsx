'use client';

import { useState, type FormEvent } from 'react';
import { Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export interface ReformulateFormData {
  draft: string;
  objective: string;
  context: string;
}

interface ReformulateFormProps {
  onSubmit: (data: ReformulateFormData) => void;
  loading?: boolean;
}

export function ReformulateForm({ onSubmit, loading }: ReformulateFormProps) {
  const [draft, setDraft] = useState('');
  const [objective, setObjective] = useState('');
  const [context, setContext] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const canSubmit = draft.trim().length >= 5 && !loading;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ draft: draft.trim(), objective: objective.trim(), context: context.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="glass-elevated space-y-5 rounded-2xl p-6 md:p-8">
      <Textarea
        label="Ton brouillon"
        placeholder="Colle ici le message que tu as rédigé et que tu veux améliorer..."
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={6}
        maxLength={3000}
        helperText={`${draft.length} / 3000 caractères`}
        disabled={loading}
        required
      />

      {/* Options optionnelles */}
      <div>
        <button
          type="button"
          onClick={() => setShowOptions((v) => !v)}
          className="text-foreground-muted hover:text-foreground flex items-center gap-1.5 text-xs font-medium transition-colors"
        >
          {showOptions ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
          Options supplémentaires (optionnel)
        </button>

        {showOptions && (
          <div className="mt-4 space-y-4 animate-fade-in">
            <Input
              label="Objectif du message"
              placeholder="Ex : convaincre, relancer, s'excuser, négocier..."
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              maxLength={500}
              disabled={loading}
            />
            <Input
              label="Contexte"
              placeholder="Ex : email à un client, SMS à un ami, message pro..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              maxLength={1000}
              disabled={loading}
            />
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={!canSubmit}
        loading={loading}
        loadingText="Reformulation en cours..."
      >
        <Wand2 className="h-4 w-4" />
        Reformuler mon message
      </Button>
    </form>
  );
}
