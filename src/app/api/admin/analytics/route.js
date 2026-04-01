import { requireAdmin } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
    const { count: activeSubs } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')

    const { data: ledger } = await supabase.from('prize_pool_ledger').select('total_pool_pence, total_contributions_pence')
    const totalPrizePool = ledger?.reduce((sum, row) => sum + (row.total_pool_pence || 0), 0) || 0
    const totalCharity = ledger?.reduce((sum, row) => sum + (row.total_contributions_pence || 0), 0) || 0

    return Response.json({
      total_users: userCount || 0,
      active_subscriptions: activeSubs || 0,
      total_prize_pool_pence: totalPrizePool,
      total_charity_pence: totalCharity
    })
  } catch (err) {
    return handleApiError(err)
  }
}
