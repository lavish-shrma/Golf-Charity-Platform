import { requireSubscriber } from '@/lib/auth'
import { handleApiError, ApiError } from '@/lib/errors'
import { validateScoreUpdate } from '@/lib/validators/scores'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request, { params }) {
  try {
    const user = await requireSubscriber()
    const body = await request.json()
    const { id } = await params

    const validation = validateScoreUpdate(body)
    if (!validation.valid) {
      throw new ApiError(400, validation.errors.join(', '))
    }

    const supabase = await createClient()

    const { data: existing } = await supabase
      .from('scores')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing || existing.user_id !== user.id) {
      throw new ApiError(404, 'Score not found')
    }

    const updates = {}
    if (body.score_value != null) updates.score_value = body.score_value
    if (body.played_date != null) updates.played_date = body.played_date

    const { data, error } = await supabase
      .from('scores')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new ApiError(500, error.message)

    return Response.json({ score: data, message: 'Score updated.' })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireSubscriber()
    const { id } = await params
    const supabase = await createClient()

    const { data: existing } = await supabase
      .from('scores')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing || existing.user_id !== user.id) {
      throw new ApiError(404, 'Score not found')
    }

    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', id)

    if (error) throw new ApiError(500, error.message)

    return Response.json({ message: 'Score deleted.' })
  } catch (err) {
    return handleApiError(err)
  }
}
