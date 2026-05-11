'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/#features', label: 'Fonctionnalités' },
  { href: '/pricing', label: 'Tarifs' },
  { href: '/extension', label: 'Extension' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'border-border-subtle glass-elevated border-b py-3'
          : 'bg-transparent py-4'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Logo size="sm" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-foreground'
                  : 'text-foreground-muted hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Se connecter
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              <Sparkles className="h-3.5 w-3.5" />
              Essayer gratuitement
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="text-foreground-muted hover:text-foreground rounded-lg p-2 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="glass-elevated border-border-subtle border-t px-6 py-4 md:hidden">
          <nav className="mb-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground-muted hover:text-foreground text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" fullWidth>
                Se connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm" fullWidth>
                Essayer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
