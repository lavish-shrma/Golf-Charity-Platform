import { requireAdmin } from '@/lib/auth'
import { handleApiError, ApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'
import { executeDrawLogic } from '@/lib/draw-engine'
import { calculatePrizeDistribution } from '@/lib/prize-pool/calculator'
import { getCurrentPeriod } from '@/lib/utils'

export async function POST(request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const mode = body.mode || 'random'
    const period = getCurrentPeriod()

    const supabase = await createClient()

    // 1. Master Review Rule: Prevent duplicate draws for the same period
    const { data: existingDraw } = await supabase
      .from('draws')
      .select('id')
      .eq('draw_period', period)
      .single()

    if (existingDraw) {
      throw new ApiError(409, 'A draw has already been executed for this period.')
    }

    // 2. Fetch Admin Config for distributions
    const { data: configs } = await supabase.from('admin_config').select('key, value')
    const configMap = {}
    configs.forEach(c => { configMap[c.key] = parseInt(c.value) || c.value })

    // 3. Fetch Ledger for Total Pool Pence
    const { data: ledger } = await supabase
      .from('prize_pool_ledger')
      .select('total_pool_pence')
      .eq('period', period)
      .single()

    const totalPool = ledger?.total_pool_pence || 0

    // 4. Gather Eligible Users
    const { data: activeSubs } = await supabase.from('subscriptions').select('user_id').eq('status', 'active')
    const activeUserIds = activeSubs?.map(sub => sub.user_id) || []

    const { data: allScores } = await supabase
      .from('scores')
      .select('user_id, score_value, played_date')
      .in('user_id', activeUserIds)
      .order('created_at', { ascending: false })

    const userScoresMap = {}
    activeUserIds.forEach(id => { userScoresMap[id] = [] })
    allScores?.forEach(score => {
      if (userScoresMap[score.user_id].length < 5) userScoresMap[score.user_id].push(score)
    })

    const eligibleUsers = []
    for (const [user_id, scores] of Object.entries(userScoresMap)) {
      if (scores.length === 5) eligibleUsers.push({ user_id, scores })
    }

    // 5. Execute Core Logic
    const drawResult = executeDrawLogic(mode, eligibleUsers)
    const distribution = calculatePrizeDistribution(totalPool, drawResult.winnersByTier, configMap)

    // 6. Write to Database
    const { data: drawRecord, error: drawError } = await supabase
      .from('draws')
      .insert({
        draw_period: period,
        draw_mode: mode,
        drawn_numbers: drawResult.drawn_numbers,
        participant_count: eligibleUsers.length, // Updated column name
        prize_pool_pence: totalPool,             // Updated column name
        status: 'draft' // Kept as draft until admin manually publishes
      })
      .select()
      .single()

    if (drawError) throw new ApiError(500, `Failed to insert draw record: ${drawError.message}`)

    // 7. Insert Entries & Prizes (Simplified for step-by-step execution)
    const entriesToInsert = drawResult.results.map(res => ({
      draw_id: drawRecord.id,
      user_id: res.user_id,
      match_tier: res.match_tier
    }))

    if (entriesToInsert.length > 0) {
      await supabase.from('draw_entries').insert(entriesToInsert)
    }

    const prizesToInsert = drawResult.results
      .filter(res => res.match_tier !== 'none')
      .map(res => ({
        draw_id: drawRecord.id,
        user_id: res.user_id,
        tier: res.match_tier,
        amount_pence: distribution[res.match_tier].per_winner,
        payout_status: 'pending'
      }))

    if (prizesToInsert.length > 0) {
      await supabase.from('prizes').insert(prizesToInsert)
    }

    return Response.json({
      message: 'Draw executed successfully',
      draw_id: drawRecord.id,
      stats: drawResult.winnersByTier
    })
  } catch (err) {
    return handleApiError(err)
  }
}
