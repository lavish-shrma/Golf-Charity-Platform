'use client'
import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'

export default function WinningsPage() {
  const [prizes, setPrizes] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadingId, setUploadingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchPrizes()
  }, [])

  async function fetchPrizes() {
    try {
      const res = await fetch('/api/winners/my-prizes')
      const data = await res.json()
      if (res.ok) setPrizes(data.prizes || [])
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(prizeId) {
    setUploadingId(prizeId)
    setError('')
    setSuccess('')
    
    // Simulating file upload by providing a mock URL for the assignment scope
    const mockScreenshotUrl = 'https://example.com/screenshot-proof.png'

    try {
      const res = await fetch(`/api/winners/verify/${prizeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screenshot_url: mockScreenshotUrl })
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error?.message || 'Verification failed')
      
      setSuccess('Proof submitted! An admin will review it shortly.')
      fetchPrizes()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingId(null)
    }
  }

  if (loading) return <div className="text-zinc-500">Loading winnings...</div>

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">My Winnings</h1>
        <p className="text-zinc-400 mt-1">View your prizes and submit score verifications.</p>
      </div>

      {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-lg text-sm">{success}</div>}

      {prizes.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <p className="text-zinc-400">You haven't won any prizes yet. Keep entering those scores!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prizes.map(prize => (
            <div key={prize.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{formatCurrency(prize.amount_pence)}</div>
                <div className="text-sm text-zinc-400 mt-1">
                  Tier: {prize.match_tier} Match | Status: <span className="capitalize text-white">{prize.status}</span>
                </div>
              </div>

              {prize.status === 'pending' && (
                <button
                  onClick={() => handleVerify(prize.id)}
                  disabled={uploadingId === prize.id}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {uploadingId === prize.id ? 'Submitting...' : 'Upload Proof'}
                </button>
              )}
              {prize.status !== 'pending' && (
                <div className="px-4 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-300">
                  Verification {prize.status}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
