import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-emerald-400 font-bold text-lg mb-3">GolfGives</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Play golf, win prizes, and support the charities that matter to you. Every subscription makes a difference.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/charities" className="text-zinc-500 hover:text-white text-sm transition-colors">Charities</Link></li>
              <li><Link href="/how-it-works" className="text-zinc-500 hover:text-white text-sm transition-colors">How It Works</Link></li>
              <li><Link href="/prizes" className="text-zinc-500 hover:text-white text-sm transition-colors">Prize Pool</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-zinc-500 hover:text-white text-sm transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="text-zinc-500 hover:text-white text-sm transition-colors">Subscribe</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
          <p className="text-zinc-600 text-sm">© 2026 GolfGives. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
