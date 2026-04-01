import { createClient } from '@/lib/supabase/server'
import { handleApiError } from '@/lib/errors'

export async function POST() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return Response.json({ message: 'Logged out successfully.' })
  } catch (err) {
    return handleApiError(err)
  }
}
