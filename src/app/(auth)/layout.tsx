import { Logo } from '@/components/shared/logo';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-mesh relative flex min-h-screen flex-col">
      {/* Glow décoratifs en arrière-plan */}
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
        <Link
          href="/"
          className="text-foreground-muted hover:text-foreground text-sm transition-colors"
        >
          ← Retour à l&apos;accueil
        </Link>
      </header>

      {/* Contenu */}
      <main className="relative z-10 flex flex-1 items-center justify-center p-6">
        <div className="animate-fade-in w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="text-foreground-subtle relative z-10 p-6 text-center text-xs">
        © {new Date().getFullYear()} ShadowReply AI · Tous droits réservés
      </footer>
    </div>
  );
}