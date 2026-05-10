import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * POST /api/stripe/webhook
 *
 * Reçoit les événements Stripe et met à jour les profils en conséquence.
 *
 * Événements gérés :
 *  - checkout.session.completed → active le plan Pro
 *  - customer.subscription.updated → synchronise le statut
 *  - customer.subscription.deleted → rétrograde vers Free
 *  - invoice.payment_failed → marque comme past_due
 *
 * ⚠️ Utilise le raw body pour vérifier la signature Stripe.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Stripe-Signature header manquant.' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET manquant');
    return NextResponse.json({ error: 'Webhook secret non configuré.' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[webhook] Vérification de signature échouée:', err);
    return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        if (!userId) {
          console.warn('[webhook] checkout.session.completed sans supabase_user_id');
          break;
        }

        const { error } = await supabase
          .from('profiles')
          .update({
            plan: 'pro',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            subscription_status: 'active',
          })
          .eq('id', userId);

        if (error) console.error('[webhook] Erreur update profil checkout:', error);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) {
          console.warn('[webhook] customer.subscription.updated sans supabase_user_id');
          break;
        }

        const isActive = sub.status === 'active' || sub.status === 'trialing';
        // current_period_end was moved to subscription items in Stripe API 2024-11-20+
        const rawPeriodEnd =
          (sub as unknown as Record<string, number | undefined>)['current_period_end'] ??
          sub.items?.data?.[0]?.current_period_end;
        const periodEnd = rawPeriodEnd
          ? new Date(rawPeriodEnd * 1000).toISOString()
          : null;

        const { error } = await supabase
          .from('profiles')
          .update({
            plan: isActive ? 'pro' : 'free',
            subscription_status: sub.status,
            stripe_subscription_id: sub.id,
            subscription_current_period_end: periodEnd,
          })
          .eq('id', userId);

        if (error) console.error('[webhook] Erreur update profil subscription.updated:', error);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) {
          console.warn('[webhook] customer.subscription.deleted sans supabase_user_id');
          break;
        }

        const { error } = await supabase
          .from('profiles')
          .update({
            plan: 'free',
            subscription_status: 'cancelled',
            stripe_subscription_id: null,
            subscription_current_period_end: null,
          })
          .eq('id', userId);

        if (error) console.error('[webhook] Erreur update profil subscription.deleted:', error);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        if (!customerId) break;

        const { error } = await supabase
          .from('profiles')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', customerId);

        if (error) console.error('[webhook] Erreur update profil payment_failed:', error);
        break;
      }

      default:
        // Événement non géré — ignoré silencieusement
        break;
    }
  } catch (err) {
    console.error(`[webhook] Erreur non gérée pour ${event.type}:`, err);
    return NextResponse.json({ error: 'Erreur interne du handler.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
