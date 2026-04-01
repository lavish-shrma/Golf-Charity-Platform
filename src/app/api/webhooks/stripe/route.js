import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  // Idempotency check
  const { data: alreadyProcessed } = await supabase
    .from('processed_stripe_events')
    .select('stripe_event_id')
    .eq('stripe_event_id', event.id)
    .single()

  if (alreadyProcessed) {
    return Response.json({ received: true })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata.user_id
        const planType = session.metadata.plan_type

        const customer = await stripe.customers.retrieve(session.customer)
        const subscription = await stripe.subscriptions.retrieve(session.subscription)
        const priceId = subscription.items.data[0].price.id
        const pricePence = subscription.items.data[0].price.unit_amount

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          plan_type: planType,
          status: 'active',
          price_pence: pricePence,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        }, { onConflict: 'user_id' })

        await supabase.auth.admin.updateUserById(userId, {
          user_metadata: { role: 'subscriber' }
        })

        const { data: userProfile } = await supabase
          .from('users')
          .select('selected_charity_id, charity_contribution_percent, email')
          .eq('id', userId)
          .single()

        if (userProfile?.selected_charity_id) {
          const charityAmount = Math.floor(pricePence * (userProfile.charity_contribution_percent / 100))
          const period = new Date().toISOString().slice(0, 7)

          const { data: charity } = await supabase
            .from('charities')
            .select('name')
            .eq('id', userProfile.selected_charity_id)
            .single()

          const { data: sub } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', userId)
            .single()

          await supabase.from('charity_contributions').upsert({
            user_id: userId,
            charity_id: userProfile.selected_charity_id,
            charity_name: charity?.name || '',
            subscription_id: sub?.id,
            amount_pence: charityAmount,
            contribution_percent: userProfile.charity_contribution_percent,
            billing_period: period,
            status: 'recorded'
          }, { onConflict: 'user_id,billing_period' })
        }

        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        if (!invoice.subscription) break

        const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
        const userId = subscription.metadata?.user_id

        if (!userId) break

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', invoice.subscription)

        const pricePence = invoice.amount_paid
        const poolAmount = Math.floor(pricePence * 0.30)
        const period = new Date().toISOString().slice(0, 7)

        const { data: existingLedger } = await supabase
          .from('prize_pool_ledger')
          .select('id, total_contributions_pence, subscriber_count')
          .eq('period', period)
          .single()

        if (existingLedger) {
          await supabase
            .from('prize_pool_ledger')
            .update({
              total_contributions_pence: existingLedger.total_contributions_pence + poolAmount,
              subscriber_count: existingLedger.subscriber_count + 1
            })
            .eq('period', period)
        } else {
          await supabase.from('prize_pool_ledger').insert({
            period,
            subscriber_count: 1,
            total_contributions_pence: poolAmount,
            total_pool_pence: poolAmount
          })
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        if (!invoice.subscription) break

        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', invoice.subscription)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    await supabase.from('processed_stripe_events').insert({
      stripe_event_id: event.id
    })

  } catch (err) {
    console.error('Webhook processing error:', err)
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 })
  }

  return Response.json({ received: true })
}
