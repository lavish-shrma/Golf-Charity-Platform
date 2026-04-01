export default function SimulationResults({ results }) {
  if (!results) return null

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
      <h3 className="text-lg font-semibold text-white">Simulation Results</h3>

      <div>
        <p className="text-sm text-zinc-400 mb-3">Drawn Numbers</p>
        <div className="flex gap-3">
          {results.drawn_numbers.map((num, i) => (
            <div key={i} className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-xl font-bold text-emerald-400">
              {num}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 mb-1">5 Matches</p>
          <p className="text-2xl font-bold text-white">{results.match_stats.five}</p>
        </div>
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 mb-1">4 Matches</p>
          <p className="text-2xl font-bold text-white">{results.match_stats.four}</p>
        </div>
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-center">
          <p className="text-sm text-zinc-500 mb-1">3 Matches</p>
          <p className="text-2xl font-bold text-white">{results.match_stats.three}</p>
        </div>
      </div>
    </div>
  )
}
