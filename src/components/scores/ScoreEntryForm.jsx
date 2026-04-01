'use client'

import { useState } from 'react'

export default function ScoreEntryForm({ onScoreAdded }) {
  const [scoreValue, setScoreValue] = useState('')
  const [playedDate, setPlayedDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score_value: parseInt(scoreValue),
          played_date: playedDate
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error?.message || 'Failed to add score')
        return
      }

      setScoreValue('')
      setPlayedDate('')
      if (onScoreAdded) onScoreAdded(data.score)
    } catch (err) {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">Add New Score</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Stableford Score (1-45)</label>
          <input
            type="number"
            min="1"
            max="45"
            value={scoreValue}
            onChange={(e) => setScoreValue(e.target.value)}
            required
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g. 32"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Date Played</label>
          <input
            type="date"
            value={playedDate}
            onChange={(e) => setPlayedDate(e.target.value)}
            max={today}
            required
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2 rounded-md transition-colors disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Score'}
      </button>
    </form>
  )
}
