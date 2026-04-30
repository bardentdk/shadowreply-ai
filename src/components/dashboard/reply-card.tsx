'use client';

import { useState } from 'react';
import {
  Snowflake,
  Sparkles,
  Target,
  Copy,
  Check,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { StrategicReply, ReplyStyle } from '@/types/ai';

interface ReplyCardProps {
  reply: StrategicReply;
  index: number;
}

const STYLE_CONFIG: Record<
  ReplyStyle,
  {
    label: string;
    description: string;
    icon: typeof Snowflake;
    accentClass: string;
    badgeClass: string;
    glowClass: string;
  }
> = {
  detached: {
    label: 'Détaché',
    description: 'Calme · Distance maîtrisée',
    icon: Snowflake,
    accentClass: 'text-accent-tertiary',
    badgeClass: 'border-accent-tertiary/30 bg-accent-tertiary/10',
    glowClass: 'shadow-accent-tertiary/20',
  },
  subtle: {
    label: 'Subtil',
    description: 'Charismatique · Influence douce',
    icon: Sparkles,
    accentClass: 'text-accent-primary',
    badgeClass: 'border-accent-primary/30 bg-accent-primary/10',
    glowClass: 'shadow-accent-primary/30',
  },
  direct: {
    label: 'Direct',
    description: 'Assertif · Clarté totale',
    icon: Target,
    accentClass: 'text-accent-secondary',
    badgeClass: 'border-accent-secondary/30 bg-accent-secondary/10',
    glowClass: 'shadow-accent-secondary/20',
  },
};

export function ReplyCard({ reply, index }: ReplyCardProps) {
  const config = STYLE_CONFIG[reply.style];
  const Icon = config.icon;
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(reply.message);
      setCopied(true);
      toast.success('Réponse copiée !');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Impossible de copier. Sélectionne le texte manuellement.');
    }
  }

  // Score visuel
  const scoreColor =
    reply.positioning_score >= 70
      ? 'text-success'
      : reply.positioning_score >= 50
        ? 'text-warning'
        : 'text-danger';

  return (
    <article
      className={cn(
        'glass-elevated animate-slide-up group flex flex-col rounded-2xl p-5 transition-all hover:shadow-2xl',
        config.glowClass,
        'hover:-translate-y-0.5'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl border',
              config.badgeClass
            )}
          >
            <Icon className={cn('h-4 w-4', config.accentClass)} />
          </div>
          <div>
            <h3 className={cn('text-sm font-semibold', config.accentClass)}>
              {config.label}
            </h3>
            <p className="text-foreground-subtle text-[11px]">
              {config.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-foreground-subtle text-[10px] uppercase tracking-wider">
            Score
          </span>
          <span className={cn('text-lg font-bold tabular-nums', scoreColor)}>
            {reply.positioning_score}
          </span>
        </div>
      </header>

      {/* Message principal */}
      <div
        className={cn(
          'border-border-subtle bg-background-subtle/50 relative mb-4 flex-1 rounded-xl border p-4'
        )}
      >
        <p className="text-foreground whitespace-pre-wrap text-sm leading-relaxed">
          {reply.message}
        </p>
      </div>

      {/* Bouton copier */}
      <Button
        type="button"
        variant={copied ? 'secondary' : 'primary'}
        size="md"
        fullWidth
        onClick={handleCopy}
        className="mb-3"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copié !
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copier la réponse
          </>
        )}
      </Button>

      {/* Toggle détails */}
      <button
        type="button"
        onClick={() => setShowDetails((s) => !s)}
        className="text-foreground-muted hover:text-foreground flex items-center justify-center gap-1.5 text-xs font-medium transition-colors"
        aria-expanded={showDetails}
      >
        <Eye className="h-3 w-3" />
        {showDetails ? 'Masquer' : 'Voir'} l&apos;analyse stratégique
      </button>

      {/* Détails (intention, effet, risque) */}
      {showDetails && (
        <div className="animate-slide-down mt-4 space-y-3 border-t border-white/5 pt-4">
          <DetailRow
            icon={<Lightbulb className="h-3 w-3" />}
            label="Intention"
            value={reply.intention}
          />
          <DetailRow
            icon={<TrendingUp className="text-success h-3 w-3" />}
            label="Effet attendu"
            value={reply.expected_effect}
          />
          <DetailRow
            icon={<AlertTriangle className="text-warning h-3 w-3" />}
            label="Risque"
            value={reply.risk}
          />
        </div>
      )}
    </article>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-foreground-subtle mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <p className="text-foreground-muted text-xs leading-relaxed">{value}</p>
    </div>
  );
}