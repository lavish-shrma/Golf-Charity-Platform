export function calculateMatchTier(userScores, drawnNumbers) {
  // CRITICAL: Master Review Edge Case D5 - Matching uses unique score values only.
  // Five scores of 32 give you ONE unique number match, not five.
  const uniqueUserScores = new Set(userScores.map(s => s.score_value))
  const drawnSet = new Set(drawnNumbers)

  let matchCount = 0
  for (const score of uniqueUserScores) {
    if (drawnSet.has(score)) {
      matchCount++
    }
  }

  if (matchCount === 5) return 'five'
  if (matchCount === 4) return 'four'
  if (matchCount === 3) return 'three'
  return 'none'
}
