import { requireAdmin } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('winner_verifications')
      .select(`
        *,
        user:users!winner_verifications_user_id_fkey(email, full_name),
        prize:prizes(amount_pence, tier, draw_id)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return Response.json({ verifications: data })
  } catch (err) {
    return handleApiError(err)
  }
}
