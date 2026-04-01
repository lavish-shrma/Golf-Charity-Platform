'use client'
import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="text-zinc-500">Loading analytics...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-zinc-400 mt-1">Platform performance and aggregate metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-sm text-zinc-400 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-white">{stats?.total_users}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-sm text-zinc-400 mb-1">Active Subscriptions</p>
          <p className="text-3xl font-bold text-emerald-400">{stats?.active_subscriptions}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-sm text-zinc-400 mb-1">Total Prize Pool</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(stats?.total_prize_pool_pence || 0)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <p className="text-sm text-zinc-400 mb-1">Charity Contributions</p>
          <p className="text-3xl font-bold text-emerald-400">{formatCurrency(stats?.total_charity_pence || 0)}</p>
        </div>
      </div>
    </div>
  )
}
