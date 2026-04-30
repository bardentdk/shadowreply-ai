import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /auth/callback?code=...&next=/dashboard
 *
 * Endpoint appelé par Supabase après que l'utilisateur ait cliqué
 * sur le lien de confirmation reçu par email.
 *
 * Échange le code OTP contre une session, puis redirige.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Cas d'erreur renvoyée par Supabase (ex: lien expiré)
  if (error) {
    const url = new URL('/login', origin);
    url.searchParams.set(
      'error',
      errorDescription || 'Erreur de confirmation.'
    );
    return NextResponse.redirect(url);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error('[auth/callback] Exchange error:', exchangeError);
  }

  // Fallback : redirection vers login avec message d'erreur
  const url = new URL('/login', origin);
  url.searchParams.set(
    'error',
    'Le lien de confirmation est invalide ou expiré.'
  );
  return NextResponse.redirect(url);
}