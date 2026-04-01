import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'

export default function WinnerReviewCard({ verification, onReview }) {
  const [processing, setProcessing] = useState(false)

  async function handleAction(status) {
    if (!confirm(`Are you sure you want to ${status.slice(0, -1)} this submission?`)) return
    setProcessing(true)
    await onReview(verification.id, status)
    setProcessing(false)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white font-medium">{verification.user?.full_name || 'Unknown User'}</h3>
          <p className="text-sm text-zinc-400">{verification.user?.email || 'Unknown Email'}</p>
        </div>
        <div className="text-right">
          <div className="text-emerald-400 font-bold">{formatCurrency(verification.prize.amount_pence)}</div>
          <p className="text-sm text-zinc-500">{verification.prize.tier} Match</p>
        </div>
      </div>

      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
        <p className="text-sm text-zinc-400 mb-2">Proof Screenshot URL:</p>
        <a href={verification.screenshot_url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline text-sm break-all">
          {verification.screenshot_url}
        </a>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-sm">
          Status: <span className={`font-medium capitalize ${
            verification.status === 'approved' ? 'text-emerald-400' :
            verification.status === 'rejected' ? 'text-red-400' : 'text-amber-400'
          }`}>{verification.status}</span>
        </div>

        {verification.status === 'pending' && (
          <div className="flex gap-3">
            <button
              onClick={() => handleAction('rejected')}
              disabled={processing}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-md transition-colors disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={() => handleAction('approved')}
              disabled={processing}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-md transition-colors disabled:opacity-50"
            >
              Approve & Pay
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
