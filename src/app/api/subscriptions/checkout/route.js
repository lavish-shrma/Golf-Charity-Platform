import { stripe } from '@/lib/stripe/client'
import { requireAuth } from '@/lib/auth'
import { ApiError, handleApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { plan_type } = body

    if (!plan_type || !['monthly', 'yearly'].includes(plan_type)) {
      throw new ApiError(400, 'plan_type must be monthly or yearly')
    }

    if (!user.selected_charity_id) {
      throw new ApiError(400, 'Please select a charity before subscribing.')
    }

    const supabase = await createClient()
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (existingSub) {
      throw new ApiError(400, 'You already have an active subscription.')
    }

    const priceId = plan_type === 'monthly'
      ? process.env.STRIPE_PRICE_MONTHLY
      : process.env.STRIPE_PRICE_YEARLY

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      metadata: { user_id: user.id, plan_type },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/signup?cancelled=true`,
    })

    return Response.json({ checkout_url: session.url, session_id: session.id })
  } catch (err) {
    return handleApiError(err)
  }
}
