import { requireAuth } from '@/lib/auth'
import { handleApiError, ApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('users')
      .select('selected_charity_id, charity_contribution_percent')
      .eq('id', user.id)
      .single()
      
    if (error) throw error
    
    return Response.json({
      charity_id: data.selected_charity_id,
      contribution_percent: data.charity_contribution_percent || 10
    })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function PUT(request) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { charity_id, contribution_percent } = body

    if (!charity_id) {
      throw new ApiError(400, 'Charity selection is required.')
    }
    if (contribution_percent < 10 || contribution_percent > 100) {
      throw new ApiError(400, 'Contribution must be between 10% and 100%.')
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('users')
      .update({
        selected_charity_id: charity_id,
        charity_contribution_percent: contribution_percent
      })
      .eq('id', user.id)

    if (error) throw error
    
    return Response.json({ message: 'Charity preferences updated.' })
  } catch (err) {
    return handleApiError(err)
  }
}
