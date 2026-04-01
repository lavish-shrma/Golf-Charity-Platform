import { requireSubscriber } from '@/lib/auth'
import { handleApiError, ApiError } from '@/lib/errors'
import { validateScore } from '@/lib/validators/scores'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await requireSubscriber()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw new ApiError(500, error.message)

    return Response.json({ scores: data, count: data.length })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(request) {
  try {
    const user = await requireSubscriber()
    const body = await request.json()

    const validation = validateScore(body)
    if (!validation.valid) {
      throw new ApiError(400, validation.errors.join(', '))
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('scores')
      .insert({
        user_id: user.id,
        score_value: body.score_value,
        played_date: body.played_date,
      })
      .select()
      .single()

    if (error) throw new ApiError(500, error.message)

    return Response.json({ score: data, message: 'Score added.' }, { status: 201 })
  } catch (err) {
    return handleApiError(err)
  }
}
