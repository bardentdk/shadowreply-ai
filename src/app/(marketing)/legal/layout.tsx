import Link from 'next/link';

const LEGAL_LINKS = [
  { href: '/legal/mentions-legales', label: 'Mentions légales' },
  { href: '/legal/cgu', label: 'CGU' },
  { href: '/legal/cgv', label: 'CGV' },
  { href: '/legal/confidentialite', label: 'Confidentialité' },
  { href: '/legal/cookies', label: 'Cookies' },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Navigation légale */}
      <nav className="mb-8 flex flex-wrap gap-2">
        {LEGAL_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="border-border-subtle text-foreground-muted hover:text-foreground rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
