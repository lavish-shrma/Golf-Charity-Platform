import { stripe } from '@/lib/stripe/client'
import { requireAuth } from '@/lib/auth'
import { ApiError, handleApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    if (!subscription?.stripe_customer_id) {
      throw new ApiError(404, 'No subscription found')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    })

    return Response.json({ portal_url: session.url })
  } catch (err) {
    return handleApiError(err)
  }
}
