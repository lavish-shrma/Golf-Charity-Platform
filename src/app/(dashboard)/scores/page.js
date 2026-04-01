'use client'

import { useState, useEffect } from 'react'
import ScoreEntryForm from '@/components/scores/ScoreEntryForm'
import ScoreCard from '@/components/scores/ScoreCard'
import RollingScoresDisplay from '@/components/scores/RollingScoresDisplay'

export default function ScoresPage() {
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScores()
  }, [])

  async function fetchScores() {
    try {
      const res = await fetch('/api/scores')
      const data = await res.json()
      if (res.ok) setScores(data.scores || [])
    } finally {
      setLoading(false)
    }
  }

  function handleScoreAdded(newScore) {
    setScores(prev => {
      const updated = [newScore, ...prev]
      return updated.slice(0, 5)
    })
  }

  function handleScoreUpdated(updatedScore) {
    setScores(prev => prev.map(s => s.id === updatedScore.id ? updatedScore : s))
  }

  function handleScoreDeleted(deletedId) {
    setScores(prev => prev.filter(s => s.id !== deletedId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-500">Loading scores...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">My Scores</h1>
        <p className="text-zinc-400 mt-1">Your last 5 Stableford scores are your draw numbers.</p>
      </div>

      <RollingScoresDisplay scores={scores} />

      <ScoreEntryForm onScoreAdded={handleScoreAdded} />

      <div className="space-y-3">
        <h3 className="text-white font-semibold">Score History</h3>
        {scores.length === 0 ? (
          <p className="text-zinc-500 text-sm">No scores yet. Add your first score above.</p>
        ) : (
          scores.map(score => (
            <ScoreCard
              key={score.id}
              score={score}
              onUpdated={handleScoreUpdated}
              onDeleted={handleScoreDeleted}
            />
          ))
        )}
      </div>
    </div>
  )
}
