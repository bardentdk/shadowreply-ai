'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart2, Star, Zap, Calendar, Clock, TrendingUp, Sparkles, Award } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/use-user';
import { COMMUNICATION_MODES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface StatsData {
  total_generations: number;
  favorite_generations: number;
  today_generations: number;
  week_generations: number;
  last_generation_at: string | null;
}

interface StatsResponse {
  stats: StatsData;
  mode_distribution: Record<string, number> | null;
  weekly_activity: { date: string; count: number }[] | null;
  is_pro: boolean;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={cn('glass-elevated rounded-2xl p-5', accent && 'border-accent-primary/20 border')}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn('h-4 w-4', accent ? 'text-accent-primary' : 'text-foreground-muted')} />
        <p className="text-foreground-muted text-xs font-medium uppercase tracking-wider">{label}</p>
      </div>
      <p className={cn('text-3xl font-bold', accent ? 'text-accent-primary' : 'text-foreground')}>{value}</p>
      {sub && <p className="text-foreground-muted mt-1 text-xs">{sub}</p>}
    </div>
  );
}

function ModeDistribution({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (total === 0) return <p className="text-foreground-muted text-sm">Aucune génération pour l&apos;instant.</p>;

  const sorted = Object.entries(data).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-3">
      {sorted.map(([mode, count]) => {
        const modeInfo = COMMUNICATION_MODES.find((m) => m.id === mode);
        const pct = Math.round((count / total) * 100);
        return (
          <div key={mode}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-foreground flex items-center gap-1.5 font-medium">
                <span>{modeInfo?.icon ?? '📝'}</span>
                {modeInfo?.label ?? mode}
              </span>
              <span className="text-foreground-muted">
                {count} · {pct}%
              </span>
            </div>
            <div className="bg-background-elevated h-2 overflow-hidden rounded-full">
              <div
                className="bg-accent-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WeeklyChart({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="flex h-32 items-end gap-2">
      {data.map(({ date, count }) => {
        const pct = (count / max) * 100;
        const dayName = days[new Date(date + 'T12:00:00').getDay()];
        return (
          <div key={date} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-foreground-muted text-xs">{count > 0 ? count : ''}</span>
            <div className="bg-background-elevated flex w-full flex-col justify-end overflow-hidden rounded-md" style={{ height: 80 }}>
              <div
                className={cn(
                  'w-full rounded-md transition-all duration-700',
                  count > 0 ? 'bg-accent-primary' : 'bg-border-accent'
                )}
                style={{ height: `${Math.max(pct, count > 0 ? 8 : 4)}%` }}
              />
            </div>
            <span className="text-foreground-muted text-xs">{dayName}</span>
          </div>
        );
      })}
    </div>
  );
}

function formatRelativeDate(iso: string | null): string {
  if (!iso) return 'Jamais';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
}

export default function StatsPage() {
  const { profile, loading: profileLoading } = useUser();
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPro = profile?.plan === 'pro' || profile?.plan === 'enterprise';

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (!json.success) {
        setError(json.error?.message || 'Erreur lors du chargement.');
        return;
      }
      setData(json.data);
    } catch {
      setError('Erreur réseau.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!profileLoading) fetchStats();
  }, [profileLoading, fetchStats]);

  if (profileLoading || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-foreground mb-1 flex items-center gap-2 text-2xl font-bold md:text-3xl">
          <BarChart2 className="text-accent-primary h-7 w-7" />
          Statistiques
        </h1>
        <p className="text-foreground-muted text-sm">
          Suis ta progression et tes habitudes de communication.
          {!isPro && (
            <>
              {' '}·{' '}
              <Link href="/settings" className="text-accent-primary hover:underline">
                Passe Pro pour voir l&apos;analyse détaillée →
              </Link>
            </>
          )}
        </p>
      </div>

      {error && (
        <div className="border-danger/30 bg-danger/5 rounded-2xl border p-5">
          <p className="text-foreground text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchStats}
            className="text-accent-primary hover:text-accent-glow mt-2 text-sm font-medium"
          >
            Réessayer
          </button>
        </div>
      )}

      {data && (
        <>
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Zap}
              label="Total générations"
              value={data.stats.total_generations}
              accent
            />
            <StatCard
              icon={Star}
              label="Favoris"
              value={data.stats.favorite_generations}
            />
            <StatCard
              icon={Calendar}
              label="Aujourd'hui"
              value={data.stats.today_generations}
            />
            <StatCard
              icon={TrendingUp}
              label="Cette semaine"
              value={data.stats.week_generations}
            />
          </div>

          {/* Dernière génération */}
          <div className="glass-elevated rounded-2xl p-5">
            <p className="text-foreground-muted mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5" />
              Dernière génération
            </p>
            <p className="text-foreground text-sm font-medium">
              {formatRelativeDate(data.stats.last_generation_at)}
            </p>
          </div>

          {/* Pro features */}
          {isPro ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Activité 7 jours */}
              {data.weekly_activity && (
                <div className="glass-elevated rounded-2xl p-5">
                  <p className="text-foreground-muted mb-4 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                    <BarChart2 className="h-3.5 w-3.5" />
                    Activité — 7 derniers jours
                  </p>
                  <WeeklyChart data={data.weekly_activity} />
                </div>
              )}

              {/* Répartition par mode */}
              {data.mode_distribution && (
                <div className="glass-elevated rounded-2xl p-5">
                  <p className="text-foreground-muted mb-4 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
                    <Award className="h-3.5 w-3.5" />
                    Modes utilisés
                  </p>
                  <ModeDistribution data={data.mode_distribution} />
                </div>
              )}
            </div>
          ) : (
            /* Pro gate */
            <div className="border-accent-primary/20 bg-accent-primary/5 rounded-2xl border p-6">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="text-accent-primary h-5 w-5" />
                <p className="text-foreground text-sm font-semibold">Statistiques avancées — Pro</p>
              </div>
              <p className="text-foreground-muted mb-4 text-sm leading-relaxed">
                Les utilisateurs Pro voient le graphique d&apos;activité des 7 derniers jours et la
                répartition de leurs générations par mode de communication.
              </p>
              <Link
                href="/settings"
                className="btn-premium inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Passer Pro pour débloquer
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
