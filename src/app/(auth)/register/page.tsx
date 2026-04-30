'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});

  function validate(): boolean {
    const errs: typeof errors = {};

    if (!fullName.trim()) errs.fullName = 'Ton nom est requis.';
    else if (fullName.trim().length < 2)
      errs.fullName = 'Nom trop court (min 2 caractères).';

    if (!email.trim()) errs.email = 'Email requis.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Email invalide.';

    if (!password) errs.password = 'Mot de passe requis.';
    else if (password.length < 8)
      errs.password = 'Au moins 8 caractères requis.';
    else if (!/[A-Z]/.test(password) && !/[0-9]/.test(password))
      errs.password = 'Ajoute une majuscule ou un chiffre.';

    if (!passwordConfirm)
      errs.passwordConfirm = 'Confirme ton mot de passe.';
    else if (password !== passwordConfirm)
      errs.passwordConfirm = 'Les mots de passe ne correspondent pas.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      setLoading(false);
      let message = 'Inscription impossible. Réessaie.';

      if (error.message.includes('already registered')) {
        message = 'Un compte existe déjà avec cet email.';
      } else if (error.message.includes('Password should be')) {
        message = 'Mot de passe trop faible.';
      } else if (error.message.includes('rate limit')) {
        message = 'Trop de tentatives. Réessaie dans quelques minutes.';
      }

      toast.error(message);
      return;
    }

    setLoading(false);

    // Si email confirmation activée, l'utilisateur doit valider son mail
    if (data.user && !data.session) {
      setSuccess(true);
      return;
    }

    // Sinon, connexion immédiate
    toast.success('Compte créé ! Bienvenue.');
    router.push('/dashboard');
    router.refresh();
  }

  // ÉCRAN DE SUCCÈS : "Vérifie ton email"
  if (success) {
    return (
      <div className="glass-elevated rounded-2xl p-8 text-center shadow-2xl">
        <div className="bg-success/10 border-success/30 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border">
          <CheckCircle2 className="text-success h-8 w-8" />
        </div>
        <h1 className="mb-3 text-2xl font-bold">Vérifie ton email</h1>
        <p className="text-foreground-muted mb-6 text-sm leading-relaxed">
          On t&apos;a envoyé un lien de confirmation à <br />
          <span className="text-foreground font-medium">{email}</span>
        </p>
        <p className="text-foreground-subtle mb-8 text-xs">
          Pas reçu ? Vérifie tes spams ou réessaie dans quelques minutes.
        </p>
        <Link href="/login">
          <Button variant="secondary" fullWidth>
            Retour à la connexion
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-elevated rounded-2xl p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Crée ton compte</h1>
        <p className="text-foreground-muted text-sm">
          5 générations gratuites par jour, sans carte bancaire
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Ton nom"
          type="text"
          placeholder="Alex Martin"
          icon={<User className="h-4 w-4" />}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
          autoComplete="name"
          autoFocus
          disabled={loading}
        />

        <Input
          label="Email"
          type="email"
          placeholder="ton@email.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          disabled={loading}
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="8 caractères minimum"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          helperText={
            !errors.password
              ? 'Au moins 8 caractères, avec une majuscule ou un chiffre'
              : undefined
          }
          autoComplete="new-password"
          disabled={loading}
        />

        <Input
          label="Confirme le mot de passe"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          error={errors.passwordConfirm}
          autoComplete="new-password"
          disabled={loading}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          loadingText="Création..."
          className="mt-2"
        >
          Créer mon compte
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="text-foreground-subtle text-center text-xs leading-relaxed">
          En créant un compte, tu acceptes nos conditions d&apos;utilisation et
          notre politique de confidentialité.
        </p>
      </form>

      <div className="border-border-subtle mt-6 border-t pt-6 text-center">
        <p className="text-foreground-muted text-sm">
          Déjà un compte ?{' '}
          <Link
            href="/login"
            className="text-accent-primary hover:text-accent-glow font-medium transition-colors"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}