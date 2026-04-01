import { requireAuth } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    // 1. Fetch Subscription
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    // 2. Fetch Charity Info
    const { data: profile } = await supabase
      .from('users')
      .select('selected_charity_id, charity_contribution_percent')
      .eq('id', user.id)
      .single()

    let charityName = null
    if (profile?.selected_charity_id) {
      const { data: charity } = await supabase
        .from('charities')
        .select('name')
        .eq('id', profile.selected_charity_id)
        .single()
      charityName = charity?.name
    }

    // 3. Fetch Scores count (to check draw eligibility)
    const { count: scoreCount } = await supabase
      .from('scores')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // 4. Fetch total winnings
    const { data: prizes } = await supabase
      .from('prizes')
      .select('amount_pence')
      .eq('user_id', user.id)

    const totalWinnings = prizes?.reduce((sum, p) => sum + p.amount_pence, 0) || 0

    return Response.json({
      subscription: sub || null,
      charity: profile?.selected_charity_id ? { 
        name: charityName, 
        percent: profile.charity_contribution_percent 
      } : null,
      score_count: scoreCount || 0,
      total_winnings_pence: totalWinnings
    })
  } catch (err) {
    return handleApiError(err)
  }
}
