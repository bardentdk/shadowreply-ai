import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getAuthenticatedUser } from '@/lib/api/auth';
import { apiError, apiSuccess } from '@/lib/api/responses';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(_req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRO_PRICE_ID;

  if (!stripeKey) {
    console.error('[stripe/checkout] STRIPE_SECRET_KEY manquant');
    return apiError('INTERNAL_ERROR', 'Configuration Stripe incomplète.');
  }
  if (!priceId) {
    console.error('[stripe/checkout] STRIPE_PRO_PRICE_ID manquant');
    return apiError('INTERNAL_ERROR', 'Configuration Stripe incomplète.');
  }

  const auth = await getAuthenticatedUser();
  if (!auth) {
    return apiError('UNAUTHENTICATED', 'Tu dois être connecté.');
  }
  const { user, profile } = auth;

  if (profile.plan !== 'free') {
    return apiError('FORBIDDEN', 'Tu as déjà un abonnement actif.');
  }

  const stripe = new Stripe(stripeKey);

  try {
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

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://airepl.vercel.app';

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
  } catch (err) {
    console.error('[stripe/checkout] Erreur Stripe:', err);
    return apiError('INTERNAL_ERROR', 'Erreur lors de la création de la session de paiement.');
  }
}
