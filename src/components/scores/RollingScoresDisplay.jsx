'use client'

export default function RollingScoresDisplay({ scores }) {
  const slots = Array(5).fill(null).map((_, i) => scores[i] || null)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Your Draw Numbers</h3>
        <span className="text-zinc-500 text-sm">{scores.length}/5 scores entered</span>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {slots.map((score, index) => (
          <div
            key={index}
            className={`aspect-square rounded-xl flex items-center justify-center border-2 ${
              score
                ? 'bg-emerald-500/10 border-emerald-500/50'
                : 'bg-zinc-900 border-zinc-700 border-dashed'
            }`}
          >
            {score ? (
              <span className="text-2xl font-bold text-emerald-400">{score.score_value}</span>
            ) : (
              <span className="text-zinc-600 text-sm">?</span>
            )}
          </div>
        ))}
      </div>
      {scores.length < 5 && (
        <p className="text-zinc-500 text-sm mt-3">
          Add {5 - scores.length} more score{5 - scores.length !== 1 ? 's' : ''} to enter the monthly draw.
        </p>
      )}
      {scores.length === 5 && (
        <p className="text-emerald-400 text-sm mt-3">
          You are eligible for the monthly draw.
        </p>
      )}
    </div>
  )
}
