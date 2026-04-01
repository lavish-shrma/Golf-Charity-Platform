import { requireAuth } from '@/lib/auth'
import { handleApiError, ApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function POST(request, { params }) {
  try {
    const user = await requireAuth()
    const { prizeId } = await params
    const body = await request.json()

    if (!body.screenshot_url) throw new ApiError(400, 'Screenshot URL is required.')
    const supabase = await createClient()

    const { data: prize } = await supabase
      .from('prizes')
      .select('payout_status')
      .eq('id', prizeId)
      .eq('user_id', user.id)
      .single()

    if (!prize) throw new ApiError(404, 'Prize not found.')
    if (prize.payout_status !== 'pending') throw new ApiError(400, 'Prize is not pending verification.')

    const { data: existing } = await supabase
      .from('winner_verifications')
      .select('id')
      .eq('prize_id', prizeId)
      .single()

    if (existing) throw new ApiError(409, 'Verification already submitted.')

    const { error } = await supabase
      .from('winner_verifications')
      .insert({
        prize_id: prizeId, user_id: user.id,
        screenshot_url: body.screenshot_url, status: 'pending'
      })

    if (error) throw new ApiError(500, error.message)
    return Response.json({ message: 'Verification submitted.' })
  } catch (err) { return handleApiError(err) }
}
