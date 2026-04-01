import { stripe } from '@/lib/stripe/client'
import { requireSubscriber } from '@/lib/auth'
import { ApiError, handleApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const user = await requireSubscriber()
    const supabase = await createClient()

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, current_period_end')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (!subscription) {
      throw new ApiError(404, 'No active subscription found')
    }

    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    return Response.json({
      message: 'Subscription will be cancelled at the end of the current billing period.',
      cancels_at: subscription.current_period_end
    })
  } catch (err) {
    return handleApiError(err)
  }
}
