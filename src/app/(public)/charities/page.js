'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PublicCharitiesPage() {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/charities')
      .then(res => res.json())
      .then(data => {
        setCharities(data.charities || [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="min-h-screen pt-24 pb-12 px-4 text-center text-zinc-500">Loading charities...</div>

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Our Partner <span className="text-emerald-400">Charities</span></h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            A portion of every subscription goes directly to the causes that matter to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map(charity => (
            <div key={charity.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col h-full hover:border-emerald-500/50 transition-colors">
              {charity.is_featured && (
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                  FEATURED
                </span>
              )}
              <h2 className="text-xl font-bold text-white mb-3">{charity.name}</h2>
              <p className="text-zinc-400 text-sm flex-1 leading-relaxed mb-6">
                {charity.description}
              </p>
              <Link href="/signup" className="text-emerald-400 text-sm font-medium hover:text-emerald-300">
                Support this cause →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
