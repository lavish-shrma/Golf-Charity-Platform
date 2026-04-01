'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then(res => res.json())
      .then(data => {
        setSummary(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-zinc-500">Loading overview...</div>
  if (!summary) return <div className="text-red-400">Failed to load dashboard data.</div>

  const isActive = !!summary.subscription
  const eligibleForDraw = summary.score_count === 5

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-zinc-400 mt-1">Welcome back. Here is your current platform status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Subscription Status Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-zinc-400 text-sm font-medium mb-2">Subscription</h2>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">
              {isActive ? <span className="text-emerald-400">Active</span> : 'Inactive'}
            </div>
            <Link href="/settings" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Manage →
            </Link>
          </div>
          <p className="text-sm text-zinc-500 mt-2">
            {isActive 
              ? `Next billing: ${new Date(summary.subscription.current_period_end).toLocaleDateString('en-GB')}`
              : 'Subscribe to enter the prize draws.'}
          </p>
        </div>

        {/* Charity Impact Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-zinc-400 text-sm font-medium mb-2">My Charity</h2>
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-white truncate pr-4">
              {summary.charity ? summary.charity.name : 'None Selected'}
            </div>
            <Link href="/my-charity" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Edit →
            </Link>
          </div>
          <p className="text-sm text-emerald-400 mt-2 font-medium">
            {summary.charity ? `${summary.charity.percent}% of subscription` : 'Action required'}
          </p>
        </div>

        {/* Draw Eligibility Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-zinc-400 text-sm font-medium mb-2">Draw Status</h2>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">
              {summary.score_count} <span className="text-lg text-zinc-500 font-normal">/ 5 Scores</span>
            </div>
            <Link href="/scores" className="text-sm text-zinc-500 hover:text-white transition-colors">
              Enter Scores →
            </Link>
          </div>
          <p className={`text-sm mt-2 font-medium ${eligibleForDraw ? 'text-emerald-400' : 'text-amber-400'}`}>
            {eligibleForDraw ? 'Ready for next draw' : 'More scores needed'}
          </p>
        </div>

        {/* Winnings Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-zinc-400 text-sm font-medium mb-2">Total Winnings</h2>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-emerald-400">
              {formatCurrency(summary.total_winnings_pence)}
            </div>
            <Link href="/winnings" className="text-sm text-zinc-500 hover:text-white transition-colors">
              View History →
            </Link>
          </div>
          <p className="text-sm text-zinc-500 mt-2">Lifetime prize money won</p>
        </div>

      </div>
    </div>
  )
}
