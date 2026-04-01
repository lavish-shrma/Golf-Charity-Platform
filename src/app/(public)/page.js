import Link from 'next/link'

async function getFeaturedCharity() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/charities/featured`, {
      cache: 'no-store'
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.charity
  } catch {
    return null
  }
}

export default async function HomePage() {
  const featuredCharity = await getFeaturedCharity()

  return (
    <div className="bg-zinc-950 text-white">

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1 text-emerald-400 text-sm font-medium mb-6">
            Monthly Prize Draws · Charity Impact · Golf Performance
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Play Golf.{' '}
            <span className="text-emerald-400">Change Lives.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Subscribe, enter your scores, win prizes, and support the charity you love. Every round you play makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-lg text-lg transition-colors">
              Start Your Subscription
            </Link>
            <Link href="/how-it-works" className="border border-zinc-700 hover:border-zinc-500 text-white px-8 py-4 rounded-lg text-lg transition-colors">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-zinc-800 bg-zinc-900/50 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-emerald-400 mb-2">£12,400+</div>
            <div className="text-zinc-500 text-sm">Donated to Charities</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-400 mb-2">340+</div>
            <div className="text-zinc-500 text-sm">Active Members</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-emerald-400 mb-2">£8,200+</div>
            <div className="text-zinc-500 text-sm">Prizes Awarded</div>
          </div>
        </div>
      </section>

      {/* Featured Charity */}
      {featuredCharity && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-2">Featured Charity</p>
              <h2 className="text-3xl font-bold">This Month We Support</h2>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">{featuredCharity.name}</h3>
              <p className="text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-6">{featuredCharity.description}</p>
              <Link href="/charities" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                View all charities →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-zinc-400">Three simple steps to play, give, and win.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Subscribe', desc: 'Choose a monthly or yearly plan. A portion of every subscription goes directly to your chosen charity.' },
              { step: '02', title: 'Enter Your Scores', desc: 'Log your last 5 Stableford scores after each round. Your scores become your draw numbers.' },
              { step: '03', title: 'Win and Give', desc: 'Monthly draws match your scores against drawn numbers. Win prizes while your charity benefits every month.' }
            ].map((item) => (
              <div key={item.step} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="text-emerald-400 font-bold text-4xl mb-4">{item.step}</div>
                <h3 className="text-white font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-zinc-400 mb-8">Join hundreds of golfers supporting UK charities through the sport they love.</p>
          <Link href="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-lg text-lg transition-colors inline-block">
            Get Started Today
          </Link>
        </div>
      </section>

    </div>
  )
}
