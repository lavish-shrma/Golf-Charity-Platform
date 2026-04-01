export function calculatePrizeDistribution(totalPoolPence, winnersByTier, config) {
  // config expects: tier5_percent (40), tier4_percent (35), tier3_percent (25)
  const distribution = {
    five: { total: 0, per_winner: 0 },
    four: { total: 0, per_winner: 0 },
    three: { total: 0, per_winner: 0 },
    rollover: 0 // Unclaimed funds compound to next month's pool
  }

  const tier5Allocated = Math.floor(totalPoolPence * (config.tier5_percent / 100))
  const tier4Allocated = Math.floor(totalPoolPence * (config.tier4_percent / 100))
  const tier3Allocated = Math.floor(totalPoolPence * (config.tier3_percent / 100))

  // Tier 5 Match
  if (winnersByTier.five > 0) {
    distribution.five.total = tier5Allocated
    distribution.five.per_winner = Math.floor(tier5Allocated / winnersByTier.five)
  } else {
    distribution.rollover += tier5Allocated
  }

  // Tier 4 Match
  if (winnersByTier.four > 0) {
    distribution.four.total = tier4Allocated
    distribution.four.per_winner = Math.floor(tier4Allocated / winnersByTier.four)
  } else {
    distribution.rollover += tier4Allocated
  }

  // Tier 3 Match
  if (winnersByTier.three > 0) {
    distribution.three.total = tier3Allocated
    distribution.three.per_winner = Math.floor(tier3Allocated / winnersByTier.three)
  } else {
    distribution.rollover += tier3Allocated
  }

  return distribution
}
