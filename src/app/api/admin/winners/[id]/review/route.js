import { requireAdmin } from '@/lib/auth'
import { handleApiError, ApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request, { params }) {
  try {
    await requireAdmin()
    const { id } = await params
    const { status } = await request.json()

    if (!['approved', 'rejected'].includes(status)) throw new ApiError(400, 'Invalid status')

    const supabase = await createClient()

    const { data: verification, error: verError } = await supabase
      .from('winner_verifications')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (verError) throw new ApiError(500, verError.message)

    if (status === 'approved') {
      await supabase
        .from('prizes')
        .update({ payout_status: 'paid' })
        .eq('id', verification.prize_id)
    }

    return Response.json({ message: `Verification ${status}.` })
  } catch (err) { return handleApiError(err) }
}
