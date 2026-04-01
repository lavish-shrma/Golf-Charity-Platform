'use client'
import { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/subscriptions/status').then(r => r.json())
    ]).then(([userData, subData]) => {
      if (userData.user) setUser(userData.user)
      if (subData.subscription) setSubscription(subData.subscription)
      setLoading(false)
    }).catch(() => {
      setError('Failed to load settings.')
      setLoading(false)
    })
  }, [])

  async function handleSubscribe(planType) {
    setProcessing(true)
    setError('')
    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_type: planType })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Checkout failed')
      window.location.href = data.checkout_url
    } catch (err) {
      setError(err.message)
      setProcessing(false)
    }
  }

  async function handleManageBilling() {
    setProcessing(true)
    setError('')
    try {
      const res = await fetch('/api/subscriptions/portal')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Failed to open portal')
      window.location.href = data.portal_url
    } catch (err) {
      setError(err.message)
      setProcessing(false)
    }
  }

  if (loading) return <div className="text-zinc-500">Loading settings...</div>

  const isActive = subscription?.status === 'active'

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account and subscription.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Full Name</label>
            <div className="text-white font-medium">{user?.full_name}</div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Email</label>
            <div className="text-white font-medium">{user?.email}</div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Subscription</h2>
          <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 border border-zinc-700">
            Status: {isActive ? <span className="text-emerald-400 ml-1">Active</span> : <span className="text-zinc-500 ml-1">Inactive</span>}
          </div>
        </div>

        {isActive ? (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              You are currently subscribed to the <strong className="text-white capitalize">{subscription.plan_type}</strong> plan.
              Your next billing date is {new Date(subscription.current_period_end).toLocaleDateString('en-GB')}.
            </p>
            <button
              onClick={handleManageBilling}
              disabled={processing}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 py-2 rounded-md transition-colors border border-zinc-700 disabled:opacity-50"
            >
              {processing ? 'Loading...' : 'Manage Billing'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              Subscribe to enter your scores and participate in the monthly charity draws. Note: You must select a charity in the <a href="/my-charity" className="text-emerald-400 hover:underline">My Charity</a> tab before subscribing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleSubscribe('monthly')}
                disabled={processing}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                Monthly (£9.99)
              </button>
              <button
                onClick={() => handleSubscribe('yearly')}
                disabled={processing}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-lg transition-colors border border-zinc-700 disabled:opacity-50"
              >
                Yearly (£99.99)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
