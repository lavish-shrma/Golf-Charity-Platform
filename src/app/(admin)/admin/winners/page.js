'use client'
import { useState, useEffect } from 'react'
import WinnerReviewCard from '@/components/admin/WinnerReviewCard'

export default function AdminWinnersPage() {
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchVerifications()
  }, [])

  async function fetchVerifications() {
    try {
      const res = await fetch('/api/admin/winners')
      const data = await res.json()
      if (res.ok) setVerifications(data.verifications || [])
    } catch (err) {
      setError('Failed to load verifications.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReview(id, status) {
    setError('')
    try {
      const res = await fetch(`/api/admin/winners/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Review failed')
      
      // Optimistically update the UI to reflect the new status
      setVerifications(prev => prev.map(v => v.id === id ? { ...v, status } : v))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="text-zinc-500">Loading verifications...</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Winner Verifications</h1>
        <p className="text-zinc-400 mt-1">Review score proofs and approve payouts.</p>
      </div>

      {error && <div className="bg-red-500/10 text-red-400 p-4 rounded-lg text-sm">{error}</div>}

      {verifications.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <p className="text-zinc-500">No verifications pending review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {verifications.map(verification => (
            <WinnerReviewCard 
              key={verification.id} 
              verification={verification} 
              onReview={handleReview} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
