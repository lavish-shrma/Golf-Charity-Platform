'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-emerald-400">
            GolfGives
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/charities" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Charities
            </Link>
            <Link href="/how-it-works" className="text-zinc-400 hover:text-white transition-colors text-sm">
              How It Works
            </Link>
            <Link href="/prizes" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Prize Pool
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors text-sm">
              Sign In
            </Link>
            <Link href="/signup" className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-md text-sm transition-colors">
              Subscribe
            </Link>
          </div>

          <button
            className="md:hidden text-zinc-400"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-zinc-800">
            <Link href="/charities" className="block text-zinc-400 hover:text-white text-sm py-1">Charities</Link>
            <Link href="/how-it-works" className="block text-zinc-400 hover:text-white text-sm py-1">How It Works</Link>
            <Link href="/prizes" className="block text-zinc-400 hover:text-white text-sm py-1">Prize Pool</Link>
            <Link href="/login" className="block text-zinc-400 hover:text-white text-sm py-1">Sign In</Link>
            <Link href="/signup" className="block bg-emerald-500 text-black font-semibold px-4 py-2 rounded-md text-sm text-center">Subscribe</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
