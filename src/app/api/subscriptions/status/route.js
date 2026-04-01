import { requireAuth } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    return Response.json({ subscription: subscription || null })
  } catch (err) {
    return handleApiError(err)
  }
}
