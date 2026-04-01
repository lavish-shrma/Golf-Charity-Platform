import { requireAuth } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('prizes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json({ prizes: data })
  } catch (err) {
    return handleApiError(err)
  }
}
