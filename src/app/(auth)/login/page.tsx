'use client';

import { useState, type FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = 'Email requis.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Email invalide.';

    if (!password) errs.password = 'Mot de passe requis.';
    else if (password.length < 6)
      errs.password = 'Le mot de passe est trop court.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setLoading(false);
      // Mapping des erreurs Supabase vers messages clairs
      let message = 'Connexion impossible. Réessaie.';

      if (error.message.includes('Invalid login credentials')) {
        message = 'Email ou mot de passe incorrect.';
      } else if (error.message.includes('Email not confirmed')) {
        message = 'Confirme ton email avant de te connecter.';
      } else if (error.message.includes('Too many requests')) {
        message = 'Trop de tentatives. Réessaie dans quelques minutes.';
      }

      toast.error(message);
      return;
    }

    toast.success('Connexion réussie !');
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="glass-elevated rounded-2xl p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold">Bon retour parmi nous</h1>
        <p className="text-foreground-muted text-sm">
          Connecte-toi pour générer tes réponses stratégiques
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="ton@email.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          autoFocus
          disabled={loading}
        />

        <div>
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
            disabled={loading}
          />
          <div className="mt-2 text-right">
            <Link
              href="/forgot-password"
              className="text-foreground-subtle hover:text-accent-primary text-xs transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          loadingText="Connexion..."
        >
          Se connecter
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="border-border-subtle mt-6 border-t pt-6 text-center">
        <p className="text-foreground-muted text-sm">
          Pas encore de compte ?{' '}
          <Link
            href="/register"
            className="text-accent-primary hover:text-accent-glow font-medium transition-colors"
          >
            S&apos;inscrire gratuitement
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}