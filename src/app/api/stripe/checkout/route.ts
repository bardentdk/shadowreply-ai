import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST /api/stripe/checkout
 *
 * Crée une session Stripe Checkout pour passer au plan Pro.
 * Redirige vers Stripe après réception de l'URL.
 */
export async function POST(_req: NextRequest) {
  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Tu dois être connecté.');
  }
  const { user, profile } = auth;

  if (profile.plan !== 'free') {
    return apiError('FORBIDDEN', 'Tu as déjà un abonnement actif.');
  }

  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!priceId) {
    console.error('[stripe/checkout] STRIPE_PRO_PRICE_ID manquant');
    return apiError('INTERNAL_ERROR', 'Configuration Stripe incomplète.');
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return apiError('INTERNAL_ERROR', 'Stripe non configuré.');
  }

  // Récupère ou crée le customer Stripe
  let customerId = profile.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: profile.full_name || undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    const supabase = await createClient();
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${appUrl}/settings?upgrade=success`,
    cancel_url: `${appUrl}/settings?upgrade=cancelled`,
    metadata: { supabase_user_id: user.id },
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  });

  return apiSuccess({ url: session.url });
}
