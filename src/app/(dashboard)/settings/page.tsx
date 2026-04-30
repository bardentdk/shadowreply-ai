'use client';

import { useEffect, useState } from 'react';
import {
  User as UserIcon,
  Palette,
  Globe,
  CreditCard,
  Sparkles,
  Save,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SettingsSection } from '@/components/dashboard/settings-section';
import { ToneSelector } from '@/components/dashboard/tone-selector';
import { LanguageSelector } from '@/components/dashboard/language-selector';
import { useUser } from '@/hooks/use-user';
import { PLANS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { TonePreference } from '@/types/database';

export default function SettingsPage() {
  const { user, profile, loading, updateProfile } = useUser();

  // État local pour formulaire
  const [fullName, setFullName] = useState('');
  const [tone, setTone] = useState<TonePreference>('balanced');
  const [language, setLanguage] = useState<string>('fr');
  const [saving, setSaving] = useState(false);

  // Sync l'état local quand le profil arrive
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setTone(profile.preferred_tone);
      setLanguage(profile.language);
    }
  }, [profile]);

  // Détection des modifications
  const isDirty =
    profile &&
    (fullName.trim() !== (profile.full_name || '') ||
      tone !== profile.preferred_tone ||
      language !== profile.language);

  async function handleSave() {
    if (!isDirty || saving) return;

    if (!fullName.trim()) {
      toast.error('Le nom ne peut pas être vide.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        preferred_tone: tone,
        language,
      });
      toast.success('Préférences enregistrées.');
    } catch {
      toast.error('Échec de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <SettingsSkeleton />;
  }

  if (!profile) {
    return (
      <div className="border-danger/30 bg-danger/5 rounded-2xl border p-6">
        <p className="text-danger">Impossible de charger ton profil.</p>
      </div>
    );
  }

  const currentPlan = profile.plan;
  const planDetails =
    currentPlan === 'pro'
      ? PLANS.pro
      : currentPlan === 'enterprise'
        ? { ...PLANS.pro, name: 'Enterprise', price: 0 }
        : PLANS.free;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground mb-1 text-2xl font-bold md:text-3xl">
            Paramètres
          </h1>
          <p className="text-foreground-muted text-sm">
            Personnalise ton expérience et gère ton compte.
          </p>
        </div>

        {isDirty && (
          <div className="flex items-center gap-2">
            <span className="text-warning text-xs">
              Modifications non enregistrées
            </span>
            <span className="bg-warning h-2 w-2 animate-pulse rounded-full" />
          </div>
        )}
      </header>

      {/* PROFIL */}
      <SettingsSection
        icon={<UserIcon className="text-accent-primary h-5 w-5" />}
        title="Profil"
        description="Tes informations personnelles."
      >
        <Input
          label="Nom complet"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ton nom"
          disabled={saving}
          maxLength={100}
        />

        <Input
          label="Email"
          value={user?.email || ''}
          disabled
          helperText="L'email ne peut pas être modifié pour le moment."
        />
      </SettingsSection>

      {/* PRÉFÉRENCES */}
      <SettingsSection
        icon={<Palette className="text-accent-primary h-5 w-5" />}
        title="Ton préféré"
        description="L'IA inclinera légèrement les 3 réponses dans ce style."
      >
        <ToneSelector value={tone} onChange={setTone} disabled={saving} />
      </SettingsSection>

      {/* LANGUE */}
      <SettingsSection
        icon={<Globe className="text-accent-primary h-5 w-5" />}
        title="Langue"
        description="Langue dans laquelle l'IA générera tes réponses."
      >
        <LanguageSelector
          value={language}
          onChange={setLanguage}
          disabled={saving}
        />
      </SettingsSection>

      {/* Bouton Sauvegarder (sticky en bas pour mobile) */}
      <div className="bg-background/80 border-border-subtle sticky bottom-0 -mx-4 border-t px-4 py-4 backdrop-blur-xl md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
          disabled={!isDirty || saving}
          loading={saving}
          loadingText="Enregistrement..."
          className="md:max-w-xs"
        >
          <Save className="h-4 w-4" />
          {isDirty ? 'Enregistrer les modifications' : 'Tout est à jour'}
        </Button>
      </div>

      {/* PLAN */}
      <SettingsSection
        icon={<CreditCard className="text-accent-primary h-5 w-5" />}
        title="Abonnement"
        description="Ton plan actuel et options de mise à niveau."
      >
        <div className="border-border-subtle bg-background-subtle rounded-xl border p-5">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  currentPlan === 'free'
                    ? 'bg-foreground/10'
                    : 'from-accent-primary to-accent-secondary bg-gradient-to-br'
                )}
              >
                <Sparkles className="text-foreground h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground text-base font-semibold">
                    Plan {planDetails.name}
                  </h3>
                  <Badge
                    variant={currentPlan === 'free' ? 'default' : 'primary'}
                  >
                    {currentPlan === 'free' ? 'Gratuit' : 'Actif'}
                  </Badge>
                </div>
                <p className="text-foreground-muted text-xs">
                  {planDetails.dailyGenerations === 999
                    ? 'Générations illimitées'
                    : `${planDetails.dailyGenerations} générations / jour`}
                </p>
              </div>
            </div>
          </div>

          <ul className="mb-5 space-y-2">
            {planDetails.features.map((feature) => (
              <li
                key={feature}
                className="text-foreground-muted flex items-center gap-2 text-sm"
              >
                <CheckCircle2 className="text-success h-3.5 w-3.5 shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          {currentPlan === 'free' && (
            <div className="border-accent-primary/30 from-accent-primary/10 to-accent-secondary/10 rounded-xl border bg-gradient-to-br p-4">
              <h4 className="text-foreground mb-1 flex items-center gap-1.5 text-sm font-semibold">
                <Sparkles className="text-accent-primary h-3.5 w-3.5" />
                Passer au plan Pro
              </h4>
              <p className="text-foreground-muted mb-3 text-xs">
                Générations illimitées, historique sans limite, styles
                personnalisés et bien plus.
              </p>
              <Button
                variant="primary"
                size="sm"
                disabled
                className="cursor-not-allowed opacity-70"
                title="Stripe sera bientôt disponible"
              >
                Bientôt disponible
              </Button>
            </div>
          )}
        </div>
      </SettingsSection>

      {/* LIENS UTILES */}
      <SettingsSection
        icon={<AlertTriangle className="text-foreground-muted h-5 w-5" />}
        title="Compte"
        description="Liens rapides et zone sensible."
      >
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="glass glass-hover flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all"
          >
            <span className="text-foreground-muted">
              Retour au dashboard
            </span>
            <span className="text-foreground-subtle">→</span>
          </Link>

          <button
            type="button"
            onClick={() =>
              toast('La suppression de compte sera bientôt disponible.', {
                icon: '🛠️',
              })
            }
            className="hover:bg-danger/5 flex w-full items-center justify-between rounded-xl border border-transparent px-4 py-3 text-left text-sm transition-all"
          >
            <span className="text-danger">Supprimer mon compte</span>
            <span className="text-foreground-subtle">→</span>
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-2 h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass-elevated rounded-2xl p-6 md:p-8">
          <div className="mb-6 flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-5 w-32" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}