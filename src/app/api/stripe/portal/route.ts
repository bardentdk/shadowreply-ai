import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    console.error('[stripe/portal] STRIPE_SECRET_KEY manquant');
    return apiError('INTERNAL_ERROR', 'Configuration Stripe incomplète.');
  }

  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Tu dois être connecté.');
  }
  const { profile } = auth;

  if (!profile.stripe_customer_id) {
    return apiError('FORBIDDEN', 'Aucun abonnement Stripe trouvé sur ce compte.');
  }

  const stripe = new Stripe(stripeKey);

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://airepl.vercel.app';

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${appUrl}/settings`,
    });

    return apiSuccess({ url: session.url });
  } catch (err) {
    console.error('[stripe/portal] Erreur Stripe:', err);
    return apiError('INTERNAL_ERROR', "Erreur lors de l'ouverture du portail de facturation.");
  }
}
