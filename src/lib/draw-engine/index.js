import { generateRandomDraw } from './random'
import { calculateMatchTier } from './matcher'

export function executeDrawLogic(mode = 'random', activeUsersScores = []) {
  // mode 'weighted' would branch here in the future
  const drawnNumbers = generateRandomDraw()
  
  const results = activeUsersScores.map(user => {
    const tier = calculateMatchTier(user.scores, drawnNumbers)
    return {
      user_id: user.user_id,
      match_tier: tier
    }
  })

  // Group winners for the prize pool calculator
  const winnersByTier = { five: 0, four: 0, three: 0 }
  results.forEach(r => {
    if (r.match_tier !== 'none') {
      winnersByTier[r.match_tier]++
    }
  })

  return {
    drawn_numbers: drawnNumbers,
    results,
    winnersByTier
  }
}
