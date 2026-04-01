'use client'
import { useState, useEffect } from 'react'

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCharities()
  }, [])

  async function fetchCharities() {
    const res = await fetch('/api/admin/charities')
    const data = await res.json()
    if (res.ok) setCharities(data.charities || [])
    setLoading(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/charities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, is_featured: isFeatured })
      })
      if (res.ok) {
        setShowForm(false)
        setName(''); setSlug(''); setDescription(''); setIsFeatured(false)
        fetchCharities()
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-zinc-500">Loading charities...</div>

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Charity Management</h1>
          <p className="text-zinc-400 mt-1">Add and manage platform partner charities.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-md transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Charity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">URL Slug</label>
              <input required value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white" placeholder="e.g. cancer-research-uk" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-white h-24" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} id="featured" className="accent-emerald-500" />
            <label htmlFor="featured" className="text-sm text-zinc-300">Set as Featured Charity (appears on homepage)</label>
          </div>
          <button type="submit" disabled={saving} className="bg-emerald-500 text-black font-semibold px-6 py-2 rounded-md disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Charity'}
          </button>
        </form>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Charity Name</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Featured</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {charities.map(c => (
              <tr key={c.id} className="hover:bg-zinc-800/50">
                <td className="px-6 py-4 font-medium text-white">{c.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${c.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">{c.is_featured ? '⭐ Yes' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
