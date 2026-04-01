'use client'

import { useState } from 'react'

export default function ScoreCard({ score, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false)
  const [scoreValue, setScoreValue] = useState(score.score_value)
  const [playedDate, setPlayedDate] = useState(score.played_date)
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  async function handleUpdate(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/scores/${score.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score_value: parseInt(scoreValue),
          played_date: playedDate
        })
      })

      const data = await res.json()
      if (res.ok) {
        setEditing(false)
        if (onUpdated) onUpdated(data.score)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this score?')) return
    setLoading(true)

    try {
      const res = await fetch(`/api/scores/${score.id}`, { method: 'DELETE' })
      if (res.ok && onDeleted) onDeleted(score.id)
    } finally {
      setLoading(false)
    }
  }

  if (editing) {
    return (
      <form onSubmit={handleUpdate} className="bg-zinc-900 border border-emerald-500/50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="number"
            min="1"
            max="45"
            value={scoreValue}
            onChange={(e) => setScoreValue(e.target.value)}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="date"
            value={playedDate}
            max={today}
            onChange={(e) => setPlayedDate(e.target.value)}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-emerald-500 text-black text-sm font-medium px-3 py-1 rounded-md">
            Save
          </button>
          <button type="button" onClick={() => setEditing(false)} className="bg-zinc-700 text-white text-sm px-3 py-1 rounded-md">
            Cancel
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between">
      <div>
        <span className="text-3xl font-bold text-emerald-400">{score.score_value}</span>
        <span className="text-zinc-500 text-sm ml-2">pts</span>
        <p className="text-zinc-500 text-xs mt-1">{new Date(score.played_date).toLocaleDateString('en-GB')}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setEditing(true)}
          className="text-zinc-400 hover:text-white text-sm px-3 py-1 rounded-md border border-zinc-700 hover:border-zinc-500 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-400 hover:text-red-300 text-sm px-3 py-1 rounded-md border border-zinc-700 hover:border-red-500 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
