'use client';

import {
  Brain,
  Activity,
  Target,
  Scale,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { MessageAnalysis } from '@/types/ai';

interface AnalysisPanelProps {
  analysis: MessageAnalysis;
}

const INTEREST_CONFIG = {
  high: { label: 'Élevé', variant: 'success' as const },
  medium: { label: 'Modéré', variant: 'warning' as const },
  low: { label: 'Faible', variant: 'danger' as const },
  unknown: { label: 'Indéterminé', variant: 'default' as const },
};

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const interest = INTEREST_CONFIG[analysis.interest_level];

  return (
    <div className="glass-elevated animate-fade-in rounded-2xl p-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="bg-accent-secondary/10 border-accent-secondary/20 flex h-9 w-9 items-center justify-center rounded-xl border">
          <Brain className="text-accent-secondary h-4 w-4" />
        </div>
        <div>
          <h3 className="text-foreground text-base font-semibold">
            Analyse globale
          </h3>
          <p className="text-foreground-subtle text-xs">
            Décodage du message reçu
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AnalysisItem
          icon={<Activity className="h-3.5 w-3.5" />}
          label="Tonalité détectée"
          value={analysis.detected_tone}
        />

        <AnalysisItem
          icon={<Target className="h-3.5 w-3.5" />}
          label="Niveau d'intérêt"
          value={<Badge variant={interest.variant}>{interest.label}</Badge>}
        />

        <AnalysisItem
          icon={<Lightbulb className="h-3.5 w-3.5" />}
          label="Intention probable"
          value={analysis.probable_intention}
          fullWidth
        />

        <AnalysisItem
          icon={<Scale className="h-3.5 w-3.5" />}
          label="Dynamique de pouvoir"
          value={analysis.power_dynamic}
          fullWidth
        />

        {analysis.risks.length > 0 && (
          <AnalysisItem
            icon={<AlertTriangle className="text-warning h-3.5 w-3.5" />}
            label="Risques à éviter"
            value={
              <ul className="space-y-1">
                {analysis.risks.map((risk, i) => (
                  <li
                    key={i}
                    className="text-foreground-muted before:bg-warning relative pl-3.5 text-sm leading-relaxed before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full"
                  >
                    {risk}
                  </li>
                ))}
              </ul>
            }
            fullWidth
          />
        )}
      </dl>

      <div className="border-accent-primary/30 from-accent-primary/10 to-accent-secondary/5 mt-5 rounded-xl border bg-gradient-to-br p-4">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Lightbulb className="text-accent-primary h-3.5 w-3.5" />
          <span className="text-accent-primary text-xs font-semibold uppercase tracking-wider">
            Conseil stratégique
          </span>
        </div>
        <p className="text-foreground text-sm leading-relaxed">
          {analysis.strategic_advice}
        </p>
      </div>
    </div>
  );
}

function AnalysisItem({
  icon,
  label,
  value,
  fullWidth,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? 'sm:col-span-2' : ''}>
      <dt className="text-foreground-subtle mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider">
        {icon}
        {label}
      </dt>
      <dd className="text-foreground-muted text-sm leading-relaxed">
        {value}
      </dd>
    </div>
  );
}