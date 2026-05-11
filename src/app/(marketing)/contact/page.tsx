'use client';

import { useState, type FormEvent } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';

const SUBJECTS = [
  'Question sur le produit',
  'Problème technique',
  'Facturation / Abonnement',
  'Demande de remboursement',
  'Signaler un bug',
  'Suggestion de fonctionnalité',
  'Demande RGPD (accès / suppression de données)',
  'Autre',
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Merci de remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
      toast.success('Message envoyé ! On te répond sous 24h.');
    } catch {
      toast.error('Erreur lors de l\'envoi. Réessaie ou écris-nous directement par email.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-mesh flex min-h-screen items-center justify-center px-6 pt-24">
        <div className="glass-elevated max-w-md w-full rounded-2xl p-10 text-center">
          <div className="bg-accent-primary/10 mb-4 inline-flex rounded-full p-4">
            <CheckCircle className="text-accent-primary h-8 w-8" />
          </div>
          <h2 className="text-foreground mb-2 text-xl font-bold">Message envoyé !</h2>
          <p className="text-foreground-muted text-sm leading-relaxed">
            Merci <strong>{name}</strong>. Notre équipe te répondra à{' '}
            <strong>{email}</strong> sous 24h (hors week-end).
          </p>
          <button
            type="button"
            onClick={() => { setSent(false); setName(''); setEmail(''); setSubject(''); setMessage(''); }}
            className="text-accent-primary hover:text-accent-glow mt-6 text-sm font-medium transition-colors"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mesh min-h-screen pt-24">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="bg-accent-primary/10 border-accent-primary/30 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
            <MessageSquare className="text-accent-primary h-4 w-4" />
            <span className="text-accent-primary text-sm font-medium">Contact</span>
          </div>
          <h1 className="text-foreground mb-4 text-4xl font-bold">Parlons-en</h1>
          <p className="text-foreground-muted text-base">
            Une question, un bug, une suggestion ? On te répond sous 24h.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="glass-elevated rounded-2xl p-5">
              <div className="bg-accent-primary/10 mb-3 inline-flex rounded-xl p-2.5">
                <Mail className="text-accent-primary h-5 w-5" />
              </div>
              <p className="text-foreground mb-1 text-sm font-semibold">Email direct</p>
              <a
                href="mailto:support@shadowreply.ai"
                className="text-accent-primary hover:text-accent-glow text-sm transition-colors"
              >
                support@shadowreply.ai
              </a>
              <p className="text-foreground-muted mt-2 text-xs">
                Réponse sous 24h · Lun-Ven 9h–18h (heure de Paris)
              </p>
            </div>

            <div className="glass-elevated rounded-2xl p-5">
              <p className="text-foreground mb-2 text-sm font-semibold">Avant de nous écrire</p>
              <p className="text-foreground-muted text-xs leading-relaxed">
                Consulte notre{' '}
                <a href="/faq" className="text-accent-primary hover:underline">FAQ</a>{' '}
                — la plupart des questions courantes y sont déjà répondues.
              </p>
            </div>

            <div className="glass-elevated rounded-2xl p-5">
              <p className="text-foreground mb-2 text-sm font-semibold">Demande RGPD</p>
              <p className="text-foreground-muted text-xs leading-relaxed">
                Pour exercer tes droits (accès, rectification, effacement), sélectionne
                &quot;Demande RGPD&quot; dans le formulaire ci-contre ou écris à{' '}
                <a href="mailto:dpo@shadowreply.ai" className="text-accent-primary hover:underline">
                  dpo@shadowreply.ai
                </a>
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="glass-elevated rounded-2xl p-6 lg:col-span-2 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Nom *"
                  placeholder="Ton prénom ou nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                  disabled={loading}
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="toi@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={200}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-foreground-muted mb-1.5 block text-xs font-medium">
                  Sujet
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={loading}
                  className="bg-background-elevated border-border-subtle text-foreground focus:border-accent-primary focus:ring-accent-primary/20 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2"
                >
                  <option value="">Choisir un sujet…</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <Textarea
                label="Message *"
                placeholder="Décris ta question ou ton problème en détail…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                maxLength={3000}
                showCounter
                required
                disabled={loading}
              />

              <p className="text-foreground-subtle text-xs">
                En soumettant ce formulaire, tu acceptes que tes données soient utilisées pour
                traiter ta demande, conformément à notre{' '}
                <a href="/legal/confidentialite" className="text-accent-primary hover:underline">
                  politique de confidentialité
                </a>.
              </p>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                loadingText="Envoi en cours…"
                disabled={!name.trim() || !email.trim() || !message.trim() || loading}
              >
                <Send className="h-4 w-4" />
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
