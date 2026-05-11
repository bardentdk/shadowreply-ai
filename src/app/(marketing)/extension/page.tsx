import Link from 'next/link';
import { Download, Monitor, Globe, Puzzle, MousePointer, Zap, ScanText, Check, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Extension navigateur — ShadowReply AI',
  description:
    'Installez l\'extension ShadowReply AI pour Chrome, Edge et Firefox. Accédez à l\'IA depuis n\'importe quelle page web.',
};

const FEATURES = [
  {
    icon: Zap,
    title: 'Lanceur rapide',
    description: 'Accédez à ShadowReply AI en un clic depuis la barre d\'outils de votre navigateur.',
  },
  {
    icon: MousePointer,
    title: 'Menu contextuel',
    description: 'Sélectionnez du texte sur n\'importe quelle page → clic droit → Analyser ou Générer une réponse.',
  },
  {
    icon: Globe,
    title: 'Widget flottant',
    description: 'Un bouton discret sur toutes les pages pour accéder instantanément à l\'IA sans changer d\'onglet.',
  },
];

const CHROME_STEPS = [
  {
    step: '1',
    title: 'Télécharger le fichier',
    desc: 'Cliquez sur le bouton "Télécharger l\'extension" ci-dessous pour obtenir le fichier .zip.',
  },
  {
    step: '2',
    title: 'Dézipper le fichier',
    desc: 'Extrayez le contenu du fichier .zip dans un dossier de votre choix (ex: Bureau/shadowreply-extension/).',
  },
  {
    step: '3',
    title: 'Ouvrir chrome://extensions',
    desc: 'Dans Chrome ou Edge, collez chrome://extensions dans la barre d\'adresse et appuyez sur Entrée.',
  },
  {
    step: '4',
    title: 'Activer le mode développeur',
    desc: 'En haut à droite de la page Extensions, activez le bouton "Mode développeur".',
  },
  {
    step: '5',
    title: 'Charger l\'extension',
    desc: 'Cliquez sur "Charger l\'extension non empaquetée" et sélectionnez le dossier extrait à l\'étape 2.',
  },
  {
    step: '6',
    title: 'C\'est prêt !',
    desc: 'L\'icône ShadowReply AI apparaît dans votre barre d\'outils. Épinglez-la pour un accès rapide.',
  },
];

const FIREFOX_STEPS = [
  {
    step: '1',
    title: 'Télécharger le fichier .zip',
    desc: 'Téléchargez l\'extension depuis le bouton ci-dessous.',
  },
  {
    step: '2',
    title: 'Ouvrir about:debugging',
    desc: 'Dans Firefox, saisissez about:debugging dans la barre d\'adresse.',
  },
  {
    step: '3',
    title: 'Cet Firefox → Charger un module temporaire',
    desc: 'Cliquez sur "Cet Firefox" puis "Charger un module complémentaire temporaire".',
  },
  {
    step: '4',
    title: 'Sélectionner le manifest.json',
    desc: 'Extrayez le .zip, puis sélectionnez le fichier manifest.json dans le dossier extrait.',
  },
];

export default function ExtensionPage() {
  return (
    <div className="bg-mesh min-h-screen pt-24">
      <div className="mx-auto max-w-4xl px-6 py-16">

        {/* Header */}
        <div className="mb-16 text-center">
          <div className="bg-accent-primary/10 border-accent-primary/30 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
            <Puzzle className="text-accent-primary h-4 w-4" />
            <span className="text-accent-primary text-sm font-medium">Extension navigateur</span>
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-bold md:text-5xl">
            ShadowReply AI<br />
            <span className="gradient-text">dans votre navigateur</span>
          </h1>
          <p className="text-foreground-muted mx-auto max-w-xl text-base leading-relaxed">
            Sélectionnez du texte sur n&apos;importe quelle page web et analysez-le ou générez une réponse
            sans jamais changer d&apos;onglet.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href="/extension/shadowreply-extension.zip" download>
              <Button variant="primary" size="lg" className="btn-premium min-w-[240px]">
                <Download className="h-4 w-4" />
                Télécharger l&apos;extension
              </Button>
            </a>
            <p className="text-foreground-subtle text-sm">
              Chrome · Edge · Firefox · v1.0.0
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass-elevated rounded-2xl p-5">
                <div className="bg-accent-primary/10 mb-3 inline-flex rounded-xl p-2.5">
                  <Icon className="text-accent-primary h-5 w-5" />
                </div>
                <p className="text-foreground mb-1.5 text-sm font-semibold">{f.title}</p>
                <p className="text-foreground-muted text-xs leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>

        {/* Demo screenshot placeholder */}
        <div className="glass-elevated border-accent-primary/20 mb-16 rounded-2xl border p-6">
          <p className="text-foreground-muted mb-4 text-xs font-medium uppercase tracking-wider">
            Comment ça fonctionne
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: ScanText, step: 'Sélectionnez', desc: 'Surlignez n\'importe quel texte sur une page web — un SMS, un email, un message…' },
              { icon: MousePointer, step: 'Clic droit', desc: 'Dans le menu contextuel, choisissez "Analyser ce message" ou "Générer des réponses".' },
              { icon: Zap, step: 'Réponse en 3s', desc: 'ShadowReply s\'ouvre avec le texte pré-rempli. Tes 3 réponses stratégiques arrivent en quelques secondes.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="bg-accent-primary/10 mt-0.5 rounded-lg p-2 shrink-0">
                    <Icon className="text-accent-primary h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-foreground mb-1 text-sm font-semibold">{item.step}</p>
                    <p className="text-foreground-muted text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Installation Chrome/Edge */}
        <div className="mb-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-accent-primary/10 rounded-xl p-2.5">
              <Monitor className="text-accent-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-bold">Installation Chrome &amp; Edge</h2>
              <p className="text-foreground-muted text-xs">En mode développeur (sideload)</p>
            </div>
          </div>

          <div className="glass-elevated mb-4 rounded-2xl p-4">
            <div className="flex items-start gap-2">
              <Terminal className="text-warning mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-foreground-muted text-xs leading-relaxed">
                <strong className="text-warning">Note :</strong> L&apos;extension n&apos;est pas encore publiée sur le Chrome Web Store.
                L&apos;installation en mode développeur est temporaire et disparaît si Chrome est réinstallé.
                Pour une installation permanente, nous prévoyons de la publier sur le Chrome Web Store prochainement.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {CHROME_STEPS.map((s) => (
              <div key={s.step} className="glass-elevated flex items-start gap-4 rounded-2xl p-4">
                <div className="bg-accent-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  {s.step}
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">{s.title}</p>
                  <p className="text-foreground-muted mt-0.5 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Firefox */}
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-accent-primary/10 rounded-xl p-2.5">
              <Globe className="text-accent-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-bold">Installation Firefox</h2>
              <p className="text-foreground-muted text-xs">Chargement temporaire via about:debugging</p>
            </div>
          </div>

          <div className="space-y-3">
            {FIREFOX_STEPS.map((s) => (
              <div key={s.step} className="glass-elevated flex items-start gap-4 rounded-2xl p-4">
                <div className="bg-accent-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  {s.step}
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">{s.title}</p>
                  <p className="text-foreground-muted mt-0.5 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="/extension/shadowreply-extension.zip" download>
            <Button variant="primary" size="lg" className="btn-premium min-w-[240px]">
              <Download className="h-4 w-4" />
              Télécharger l&apos;extension (ZIP)
            </Button>
          </a>
          <p className="text-foreground-subtle mt-4 text-xs">
            Version 1.0.0 · Compatible Chrome 88+, Edge 88+, Firefox 109+
          </p>
          <p className="text-foreground-subtle mt-2 text-xs">
            Un problème ?{' '}
            <Link href="/contact" className="text-accent-primary hover:underline">
              Contactez-nous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
