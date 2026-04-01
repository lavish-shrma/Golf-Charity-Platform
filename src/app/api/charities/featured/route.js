import { createClient } from '@/lib/supabase/server'
import { handleApiError } from '@/lib/errors'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return Response.json({ charity: data || null })
  } catch (err) {
    return handleApiError(err)
  }
}
