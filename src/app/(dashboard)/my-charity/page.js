'use client'
import { useState, useEffect } from 'react'

export default function MyCharityPage() {
  const [charities, setCharities] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [percent, setPercent] = useState(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/charities').then(r => r.json()),
      fetch('/api/user/charity').then(r => r.json())
    ]).then(([charitiesData, userData]) => {
      if (charitiesData.charities) setCharities(charitiesData.charities)
      if (userData.charity_id) setSelectedId(userData.charity_id)
      if (userData.contribution_percent) setPercent(userData.contribution_percent)
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage('')
    setError('')
    
    try {
      const res = await fetch('/api/user/charity', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          charity_id: selectedId,
          contribution_percent: percent
        })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Failed to save preferences.')
      
      setMessage('Preferences saved successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-zinc-500">Loading charity data...</div>

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">My Charity</h1>
        <p className="text-zinc-400 mt-1">Select the charity you want to support and set your contribution.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">1. Select a Charity</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {charities.map(charity => (
            <button
              key={charity.id}
              onClick={() => setSelectedId(charity.id)}
              className={`p-4 rounded-xl border text-left transition-colors ${
                selectedId === charity.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <div className="font-bold mb-1">{charity.name}</div>
              <div className="text-sm opacity-80 line-clamp-2">{charity.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-white">2. Set Contribution Percentage</h2>
        <p className="text-sm text-zinc-400">Choose how much of your subscription goes to your selected charity. The minimum is 10%.</p>
        
        <div className="flex items-center gap-4 mt-4">
          <input
            type="range"
            min="10"
            max="100"
            value={percent}
            onChange={(e) => setPercent(parseInt(e.target.value))}
            className="flex-1 accent-emerald-500"
          />
          <span className="text-2xl font-bold text-emerald-400 w-16 text-right">{percent}%</span>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {message && <p className="text-emerald-400 text-sm">{message}</p>}

      <button
        onClick={handleSave}
        disabled={saving || !selectedId}
        className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  )
}
