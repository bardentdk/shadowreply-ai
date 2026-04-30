import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="bg-mesh relative min-h-screen">
      <div
        aria-hidden
        className="bg-accent-primary/20 pointer-events-none absolute -top-20 left-1/4 h-96 w-96 rounded-full blur-3xl"
      />
      <div
        aria-hidden
        className="bg-accent-secondary/15 pointer-events-none absolute right-1/4 top-1/2 h-96 w-96 rounded-full blur-3xl"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <Logo size="md" />
        <nav className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Se connecter
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Commencer
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex min-h-[calc(100vh-100px)] flex-col items-center justify-center px-6 pb-16 text-center">
        <div className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by AI · 100% privé
        </div>

        <h1 className="animate-slide-up mb-6 max-w-4xl text-balance text-5xl font-bold leading-[1.1] sm:text-6xl md:text-7xl">
          Maîtrise chaque <br />
          <span className="gradient-text">conversation</span>
        </h1>

        <p className="text-foreground-muted animate-slide-up mb-10 max-w-2xl text-balance text-lg sm:text-xl">
          Reçois 3 réponses stratégiques pour chaque message.
          <br />
          Détaché, charismatique, ou direct — tu choisis ton angle.
        </p>

        <div className="animate-slide-up flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/register">
            <Button variant="primary" size="xl" className="min-w-[220px]">
              Essayer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="xl" className="min-w-[220px]">
              J&apos;ai déjà un compte
            </Button>
          </Link>
        </div>

        <p className="text-foreground-subtle mt-6 text-sm">
          5 générations gratuites par jour · Aucune carte bancaire requise
        </p>
      </main>
    </div>
  );
}