import Link from 'next/link';
import { Logo } from '@/components/shared/logo';

const LEGAL_LINKS = [
  { href: '/legal/mentions-legales', label: 'Mentions légales' },
  { href: '/legal/cgu', label: "CGU" },
  { href: '/legal/cgv', label: "CGV" },
  { href: '/legal/confidentialite', label: 'Confidentialité' },
  { href: '/legal/cookies', label: 'Cookies' },
];

const PRODUCT_LINKS = [
  { href: '/#features', label: 'Fonctionnalités' },
  { href: '/pricing', label: 'Tarifs' },
  { href: '/faq', label: 'FAQ' },
];

const SUPPORT_LINKS = [
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'Questions fréquentes' },
  { href: '/register', label: 'Créer un compte' },
];

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border-subtle border-t">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo size="sm" className="mb-4" />
            <p className="text-foreground-muted mb-4 text-xs leading-relaxed">
              Maîtrise chaque conversation grâce à des réponses stratégiques générées par IA.
              Discret, rapide, efficace.
            </p>
            <p className="text-foreground-subtle text-xs">
              contact@shadowreply.ai
            </p>
          </div>

          {/* Produit */}
          <div>
            <p className="text-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
              Produit
            </p>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-muted hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
              Support
            </p>
            <ul className="space-y-2">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-muted hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <p className="text-foreground mb-3 text-xs font-semibold uppercase tracking-wider">
              Légal
            </p>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-muted hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border-subtle mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-foreground-subtle text-xs">
            © {year} ShadowReply AI. Tous droits réservés.
          </p>
          <p className="text-foreground-subtle text-xs">
            Fait avec soin en France 🇫🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
