import { createClient } from '@/lib/supabase/server'
import { handleApiError } from '@/lib/errors'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (error) throw error
    
    return Response.json({ charities: data })
  } catch (err) {
    return handleApiError(err)
  }
}
