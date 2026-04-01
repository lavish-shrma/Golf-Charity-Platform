import { stripe } from '@/lib/stripe/client'
import { handleApiError, ApiError } from '@/lib/errors'

export async function POST(request) {
  try {
    const { charity_id, amount_pence } = await request.json()
    if (!amount_pence || amount_pence < 100) throw new ApiError(400, 'Minimum donation is £1.00')

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: { name: 'Independent Charity Donation' },
          unit_amount: amount_pence,
        },
        quantity: 1,
      }],
      mode: 'payment',
      metadata: { type: 'independent_donation', charity_id },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/charities?donation=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/charities?donation=cancelled`,
    })

    return Response.json({ checkout_url: session.url })
  } catch (err) {
    return handleApiError(err)
  }
}
