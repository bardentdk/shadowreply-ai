'use client';

import { Menu } from 'lucide-react';
import { UserMenu } from '@/components/shared/user-menu';
import type { Profile } from '@/types/database';

interface TopbarProps {
  profile: Profile | null;
  onMenuToggle: () => void;
  title?: string;
}

export function Topbar({ profile, onMenuToggle, title }: TopbarProps) {
  return (
    <header className="glass border-border-subtle sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="text-foreground-muted hover:text-foreground glass rounded-lg p-2 transition-colors md:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <h1 className="text-foreground text-base font-semibold md:text-lg">
            {title}
          </h1>
        )}
      </div>

      <UserMenu profile={profile} />
    </header>
  );
}