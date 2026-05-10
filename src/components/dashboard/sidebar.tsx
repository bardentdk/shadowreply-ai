'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, Settings, X, PenLine, Sparkles, ScanText, BookOpen, BarChart2 } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { UsageIndicator } from './usage-indicator';
import { cn } from '@/lib/utils';
import type { UsageData } from '@/hooks/use-usage';

interface SidebarProps {
  usage: UsageData | null;
  usageLoading: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Générer',
    icon: LayoutDashboard,
    proOnly: false,
  },
  {
    href: '/analyze',
    label: 'Analyser',
    icon: ScanText,
    proOnly: false,
  },
  {
    href: '/reformulate',
    label: 'Reformuler',
    icon: PenLine,
    proOnly: true,
  },
  {
    href: '/templates',
    label: 'Templates',
    icon: BookOpen,
    proOnly: false,
  },
  {
    href: '/history',
    label: 'Historique',
    icon: History,
    proOnly: false,
  },
  {
    href: '/stats',
    label: 'Statistiques',
    icon: BarChart2,
    proOnly: false,
  },
  {
    href: '/settings',
    label: 'Paramètres',
    icon: Settings,
    proOnly: false,
  },
];

export function Sidebar({
  usage,
  usageLoading,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const isPro = usage?.plan === 'pro' || usage?.plan === 'enterprise';

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'glass-elevated fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/5 transition-transform duration-300',
          'md:relative md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Navigation principale"
      >
        {/* Header */}
        <div className="border-border-subtle flex items-center justify-between border-b p-5">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onMobileClose}
            className="text-foreground-muted hover:text-foreground rounded-lg p-1.5 transition-colors md:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-accent-primary/10 border-accent-primary/20 text-foreground border'
                    : 'text-foreground-muted hover:bg-white/[0.04] hover:text-foreground border border-transparent'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isActive ? 'text-accent-primary' : ''
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.proOnly && !isPro && (
                  <Sparkles className="text-accent-primary h-3 w-3 shrink-0 opacity-70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer : quota */}
        <div className="border-border-subtle border-t p-4">
          <UsageIndicator usage={usage} loading={usageLoading} />
        </div>
      </aside>
    </>
  );
}