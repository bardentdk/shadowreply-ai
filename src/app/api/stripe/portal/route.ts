import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST /api/stripe/portal
 *
 * Crée une session Stripe Billing Portal pour gérer l'abonnement existant.
 * (Annulation, changement de carte, factures, etc.)
 */
export async function POST(_req: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Tu dois être connecté.');
  }
  const { profile } = auth;

  if (!profile.stripe_customer_id) {
    return apiError('FORBIDDEN', 'Aucun abonnement Stripe trouvé sur ce compte.');
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return apiError('INTERNAL_ERROR', 'Stripe non configuré.');
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${appUrl}/settings`,
  });

  return apiSuccess({ url: session.url });
}
