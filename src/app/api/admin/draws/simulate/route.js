import { requireAdmin } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'
import { createClient } from '@/lib/supabase/server'
import { executeDrawLogic } from '@/lib/draw-engine'

export async function POST(request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const mode = body.mode || 'random'

    const supabase = await createClient()

    // 1. Fetch active subscribers
    const { data: activeSubs } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active')

    if (!activeSubs || activeSubs.length === 0) {
      return Response.json({ eligible_users: 0, drawn_numbers: [], match_stats: { five: 0, four: 0, three: 0 } })
    }

    const activeUserIds = activeSubs.map(sub => sub.user_id)

    // 2. Fetch scores
    const { data: allScores } = await supabase
      .from('scores')
      .select('user_id, score_value, played_date')
      .in('user_id', activeUserIds)
      .order('created_at', { ascending: false })

    // 3. Group and filter users who have exactly 5 scores
    const userScoresMap = {}
    activeUserIds.forEach(id => { userScoresMap[id] = [] })
    
    allScores?.forEach(score => {
      if (userScoresMap[score.user_id].length < 5) {
        userScoresMap[score.user_id].push(score)
      }
    })

    const eligibleUsers = []
    for (const [user_id, scores] of Object.entries(userScoresMap)) {
      if (scores.length === 5) {
        eligibleUsers.push({ user_id, scores })
      }
    }

    // 4. Run pure logic simulation (no database writes)
    const simulationResult = executeDrawLogic(mode, eligibleUsers)

    // Master Review Fix: Return only stats, no personal identifiers
    return Response.json({
      eligible_users: eligibleUsers.length,
      drawn_numbers: simulationResult.drawn_numbers,
      match_stats: simulationResult.winnersByTier
    })
  } catch (err) {
    return handleApiError(err)
  }
}
