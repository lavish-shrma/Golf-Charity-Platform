'use client'
import { useState } from 'react'
import DrawConfigPanel from '@/components/admin/DrawConfigPanel'
import SimulationResults from '@/components/admin/SimulationResults'

export default function AdminDrawsPage() {
  const [mode, setMode] = useState('random')
  const [simulation, setSimulation] = useState(null)
  const [simulating, setSimulating] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSimulate() {
    setSimulating(true)
    setError('')
    setSuccess('')
    setSimulation(null)

    try {
      const res = await fetch('/api/admin/draws/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Simulation failed')
      setSimulation(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSimulating(false)
    }
  }

  async function handleExecute() {
    if (!confirm('Are you sure? This will execute the official draw and lock the results. This action cannot be undone.')) return
    
    setExecuting(true)
    setError('')
    
    try {
      const res = await fetch('/api/admin/draws/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Execution failed')
      
      setSuccess('Official draw executed successfully. Check the Winners tab.')
      setSimulation(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setExecuting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Draw Management</h1>
        <p className="text-zinc-400 mt-1">Configure, simulate, and execute the monthly prize draw.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg text-sm font-medium">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <DrawConfigPanel 
            mode={mode} 
            setMode={setMode} 
            onSimulate={handleSimulate} 
            loading={simulating || executing} 
          />
        </div>

        <div className="md:col-span-2">
          {!simulation && !simulating && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <p className="text-zinc-500">Run a simulation to preview draw results.</p>
            </div>
          )}

          {simulating && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <p className="text-emerald-400 animate-pulse font-medium">Running simulation matrix...</p>
            </div>
          )}

          {simulation && (
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-zinc-400">Eligible Participants</p>
                  <p className="text-2xl font-bold text-white">{simulation.eligible_users}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-400">Status</p>
                  <p className="text-emerald-400 font-medium tracking-wide uppercase text-sm">Simulation Ready</p>
                </div>
              </div>

              <SimulationResults results={simulation} />

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
                <h3 className="text-amber-400 font-semibold mb-2">Ready for Official Execution</h3>
                <p className="text-amber-400/80 text-sm mb-4 leading-relaxed">
                  Executing the official draw will lock in these calculations, allocate the prize pool, and finalize the results. This action cannot be reversed.
                </p>
                <button
                  onClick={handleExecute}
                  disabled={executing}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-md transition-colors disabled:opacity-50"
                >
                  {executing ? 'Executing...' : 'Execute Official Draw'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
