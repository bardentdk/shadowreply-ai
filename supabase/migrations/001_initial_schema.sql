-- ============================================================
-- SHADOWREPLY AI - INITIAL SCHEMA MIGRATION
-- Version: 1.0.0
-- Description: Création complète de la base de données
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. ENUMS
-- ============================================================

-- Plans disponibles
DO $$ BEGIN
  CREATE TYPE public.user_plan AS ENUM ('free', 'pro', 'enterprise');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Modes de communication
DO $$ BEGIN
  CREATE TYPE public.communication_mode AS ENUM (
    'dating',
    'business',
    'conflict',
    'friendly',
    'cold_polite',
    'follow_up',
    'apology',
    'negotiation'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Préférence de ton
DO $$ BEGIN
  CREATE TYPE public.tone_preference AS ENUM (
    'balanced',
    'detached',
    'subtle',
    'direct'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 3. TABLE: profiles
-- Profils utilisateurs liés à auth.users
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  plan public.user_plan NOT NULL DEFAULT 'free',
  preferred_tone public.tone_preference NOT NULL DEFAULT 'balanced',
  language TEXT NOT NULL DEFAULT 'fr' CHECK (language IN ('fr', 'en', 'es')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT,
  subscription_current_period_end TIMESTAMPTZ,
  onboarded BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_plan_idx ON public.profiles(plan);
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_idx ON public.profiles(stripe_customer_id);

-- Commentaires de table
COMMENT ON TABLE public.profiles IS 'Profils utilisateurs avec préférences et abonnement';
COMMENT ON COLUMN public.profiles.plan IS 'Plan de l''utilisateur : free, pro, enterprise';
COMMENT ON COLUMN public.profiles.preferred_tone IS 'Style de réponse favori de l''utilisateur';

-- ============================================================
-- 4. TABLE: generations
-- Historique des générations IA
-- ============================================================

CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  input_message TEXT NOT NULL CHECK (char_length(input_message) BETWEEN 1 AND 5000),
  context TEXT CHECK (char_length(context) <= 2000),
  objective TEXT CHECK (char_length(objective) <= 1000),
  mode public.communication_mode NOT NULL,
  ai_response JSONB NOT NULL,
  ai_provider TEXT,
  ai_model TEXT,
  tokens_used INTEGER,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes pour la performance
CREATE INDEX IF NOT EXISTS generations_user_id_idx ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS generations_created_at_idx ON public.generations(created_at DESC);
CREATE INDEX IF NOT EXISTS generations_user_created_idx ON public.generations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS generations_mode_idx ON public.generations(mode);
CREATE INDEX IF NOT EXISTS generations_favorite_idx ON public.generations(user_id, is_favorite) WHERE is_favorite = TRUE;

COMMENT ON TABLE public.generations IS 'Historique de toutes les générations IA';
COMMENT ON COLUMN public.generations.ai_response IS 'Réponse JSON complète de l''IA (analysis + 3 replies)';

-- ============================================================
-- 5. TABLE: usage_limits
-- Tracking des limites quotidiennes par utilisateur
-- ============================================================

CREATE TABLE IF NOT EXISTS public.usage_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  generation_count INTEGER NOT NULL DEFAULT 0 CHECK (generation_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Une seule entrée par user et par jour
  CONSTRAINT usage_limits_user_date_unique UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS usage_limits_user_date_idx ON public.usage_limits(user_id, date DESC);

COMMENT ON TABLE public.usage_limits IS 'Compteur quotidien de générations par utilisateur';

-- ============================================================
-- 6. FUNCTION: Trigger pour mettre à jour updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply trigger to profiles
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Apply trigger to usage_limits
DROP TRIGGER IF EXISTS usage_limits_updated_at ON public.usage_limits;
CREATE TRIGGER usage_limits_updated_at
  BEFORE UPDATE ON public.usage_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 7. FUNCTION: Création automatique du profil à l'inscription
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger : à chaque nouvel utilisateur dans auth.users, on crée son profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 8. FUNCTION: Incrément du compteur de générations
-- Utilisée par l'API pour tracker l'usage quotidien
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_generation_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO public.usage_limits (user_id, date, generation_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    generation_count = usage_limits.generation_count + 1,
    updated_at = NOW()
  RETURNING generation_count INTO v_count;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 9. FUNCTION: Vérification de la limite quotidienne
-- Retourne TRUE si l'utilisateur peut encore générer
-- ============================================================

CREATE OR REPLACE FUNCTION public.can_user_generate(p_user_id UUID)
RETURNS TABLE(
  can_generate BOOLEAN,
  current_count INTEGER,
  daily_limit INTEGER,
  user_plan TEXT
) AS $$
DECLARE
  v_plan public.user_plan;
  v_count INTEGER;
  v_limit INTEGER;
BEGIN
  -- Récupère le plan de l'utilisateur
  SELECT plan INTO v_plan
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_plan IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 0, 'unknown'::TEXT;
    RETURN;
  END IF;

  -- Récupère le compteur du jour (0 si aucune génération aujourd'hui)
  SELECT COALESCE(generation_count, 0) INTO v_count
  FROM public.usage_limits
  WHERE user_id = p_user_id AND date = CURRENT_DATE;

  v_count := COALESCE(v_count, 0);

  -- Détermine la limite selon le plan
  v_limit := CASE v_plan
    WHEN 'free' THEN 5
    WHEN 'pro' THEN 999
    WHEN 'enterprise' THEN 9999
    ELSE 0
  END;

  RETURN QUERY SELECT
    (v_count < v_limit)::BOOLEAN,
    v_count,
    v_limit,
    v_plan::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Active RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 11. POLICIES: profiles
-- ============================================================

-- DROP existing policies pour permettre la re-exécution
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- SELECT : un user voit uniquement son propre profil
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- UPDATE : un user peut modifier uniquement son propre profil
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- INSERT : un user peut créer son propre profil (utile en plus du trigger)
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- 12. POLICIES: generations
-- ============================================================

DROP POLICY IF EXISTS "Users can view their own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can insert their own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can update their own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can delete their own generations" ON public.generations;

-- SELECT : un user voit uniquement ses propres générations
CREATE POLICY "Users can view their own generations"
  ON public.generations
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT : un user peut créer ses propres générations
CREATE POLICY "Users can insert their own generations"
  ON public.generations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE : un user peut modifier ses propres générations (ex: favoris)
CREATE POLICY "Users can update their own generations"
  ON public.generations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE : un user peut supprimer ses propres générations
CREATE POLICY "Users can delete their own generations"
  ON public.generations
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 13. POLICIES: usage_limits
-- ============================================================

DROP POLICY IF EXISTS "Users can view their own usage" ON public.usage_limits;
DROP POLICY IF EXISTS "Users can insert their own usage" ON public.usage_limits;
DROP POLICY IF EXISTS "Users can update their own usage" ON public.usage_limits;

-- SELECT : un user voit uniquement son propre usage
CREATE POLICY "Users can view their own usage"
  ON public.usage_limits
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT : un user peut créer son propre usage
CREATE POLICY "Users can insert their own usage"
  ON public.usage_limits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE : un user peut modifier son propre usage
CREATE POLICY "Users can update their own usage"
  ON public.usage_limits
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 14. GRANT permissions pour les fonctions RPC
-- ============================================================

-- Permet aux utilisateurs authentifiés d'appeler ces fonctions
GRANT EXECUTE ON FUNCTION public.increment_generation_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_user_generate(UUID) TO authenticated;

-- ============================================================
-- 15. VIEWS UTILES (optionnel mais pratique)
-- ============================================================

-- Vue : statistiques utilisateur
CREATE OR REPLACE VIEW public.user_stats AS
SELECT
  p.id AS user_id,
  p.email,
  p.plan,
  p.created_at AS user_created_at,
  COUNT(DISTINCT g.id) AS total_generations,
  COUNT(DISTINCT g.id) FILTER (WHERE g.is_favorite) AS favorite_generations,
  COUNT(DISTINCT g.id) FILTER (WHERE g.created_at >= CURRENT_DATE) AS today_generations,
  COUNT(DISTINCT g.id) FILTER (WHERE g.created_at >= CURRENT_DATE - INTERVAL '7 days') AS week_generations,
  MAX(g.created_at) AS last_generation_at
FROM public.profiles p
LEFT JOIN public.generations g ON g.user_id = p.id
GROUP BY p.id, p.email, p.plan, p.created_at;

-- RLS sur la vue : applique les permissions de la table sous-jacente
ALTER VIEW public.user_stats SET (security_invoker = true);

-- ============================================================
-- FIN DE LA MIGRATION
-- ============================================================