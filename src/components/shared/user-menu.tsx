'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, User as UserIcon, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types/database';

interface UserMenuProps {
  profile: Profile | null;
}

export function UserMenu({ profile }: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu au clic extérieur
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    if (open) {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : profile?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="glass glass-hover flex h-10 items-center gap-2 rounded-xl px-2 transition-all"
        aria-label="Menu utilisateur"
        aria-expanded={open}
      >
        <div className="from-accent-primary to-accent-secondary flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-semibold text-white">
          {initials}
        </div>
        <span className="text-foreground hidden max-w-[120px] truncate pr-2 text-sm md:inline">
          {profile?.full_name || profile?.email || 'Mon compte'}
        </span>
      </button>

      {open && (
        <div
          className={cn(
            'glass-elevated animate-slide-down absolute right-0 top-12 w-64 overflow-hidden rounded-xl shadow-2xl',
            'border-border-subtle border'
          )}
          role="menu"
        >
          {/* Infos user */}
          <div className="border-border-subtle border-b p-4">
            <p className="text-foreground truncate text-sm font-medium">
              {profile?.full_name || 'Utilisateur'}
            </p>
            <p className="text-foreground-subtle truncate text-xs">
              {profile?.email}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <Sparkles className="text-accent-primary h-3 w-3" />
              <span className="text-foreground-muted text-[10px] uppercase tracking-wider">
                Plan {profile?.plan || 'free'}
              </span>
            </div>
          </div>

          {/* Liens */}
          <nav className="p-1.5">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="text-foreground-muted hover:text-foreground hover:bg-white/[0.04] flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
              role="menuitem"
            >
              <UserIcon className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="text-foreground-muted hover:text-foreground hover:bg-white/[0.04] flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors"
              role="menuitem"
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </Link>
          </nav>

          {/* Déconnexion */}
          <div className="border-border-subtle border-t p-1.5">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-danger hover:bg-danger/10 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? 'Déconnexion...' : 'Se déconnecter'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}