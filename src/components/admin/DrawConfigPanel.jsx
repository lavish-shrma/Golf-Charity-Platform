export default function DrawConfigPanel({ mode, setMode, onSimulate, loading }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold text-white">Draw Configuration</h2>
      
      <div>
        <label className="block text-sm text-zinc-400 mb-2">Algorithm Mode</label>
        <select 
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="random">Standard Random</option>
          <option value="weighted">Weighted (Frequency Based)</option>
        </select>
        <p className="text-xs text-zinc-500 mt-2">Weighted mode requires algorithmic expansion. Currently runs fallback random behavior.</p>
      </div>

      <button
        onClick={onSimulate}
        disabled={loading}
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 rounded-md transition-colors border border-zinc-700 disabled:opacity-50"
      >
        {loading ? 'Simulating...' : 'Run Simulation'}
      </button>
    </div>
  )
}
