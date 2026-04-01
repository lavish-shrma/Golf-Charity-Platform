'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="win2k-navbar">
      {/* Windows 2000 top system bar */}
      <div className="win2k-sysbar">
        <div className="win2k-sysbar-inner">
          <div className="win2k-sysbar-left">
            <span className="win2k-sysbar-logo">⛳ GolfGives</span>
          </div>
          <div className="win2k-sysbar-right">
            <span className="win2k-sysbar-item">🔒 Secure Connection</span>
            <span className="win2k-sysbar-sep">|</span>
            <span className="win2k-sysbar-item">🌐 www.golfgives.co.uk</span>
          </div>
        </div>
      </div>

      {/* Main menu bar */}
      <div className="win2k-menubar">
        <div className="win2k-menubar-inner">
          {/* Left: Logo + nav links */}
          <div className="win2k-menubar-left">
            <Link href="/" className="win2k-nav-logo">
              <span className="win2k-nav-logo-icon">⛳</span>
              <span className="win2k-nav-logo-text">GolfGives</span>
            </Link>

            <div className="win2k-nav-divider" />

            <div className="hidden md:flex items-center">
              <Link href="/charities" className="win2k-nav-item">
                ❤️ Charities
              </Link>
              <Link href="/how-it-works" className="win2k-nav-item">
                ❓ How It Works
              </Link>
              <Link href="/prizes" className="win2k-nav-item">
                🏆 Prize Pool
              </Link>
            </div>
          </div>

          {/* Right: Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login" className="win2k-btn win2k-btn-default win2k-nav-btn">
              👤 Sign In
            </Link>
            <Link href="/signup" className="win2k-btn win2k-btn-primary win2k-nav-btn">
              ⭐ Subscribe
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden win2k-btn win2k-btn-default"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕ Close' : '☰ Menu'}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="win2k-mobile-menu">
            <Link href="/charities" className="win2k-mobile-link" onClick={() => setMenuOpen(false)}>❤️ Charities</Link>
            <Link href="/how-it-works" className="win2k-mobile-link" onClick={() => setMenuOpen(false)}>❓ How It Works</Link>
            <Link href="/prizes" className="win2k-mobile-link" onClick={() => setMenuOpen(false)}>🏆 Prize Pool</Link>
            <div className="win2k-mobile-divider" />
            <Link href="/login" className="win2k-mobile-link" onClick={() => setMenuOpen(false)}>👤 Sign In</Link>
            <Link href="/signup" className="win2k-btn win2k-btn-primary win2k-mobile-cta" onClick={() => setMenuOpen(false)}>⭐ Subscribe Now</Link>
          </div>
        )}
      </div>

      {/* IE-style toolbar */}
      <div className="win2k-toolbar">
        <div className="win2k-toolbar-inner">
          <button className="win2k-toolbar-btn" onClick={() => window.history.back()}>◀ Back</button>
          <button className="win2k-toolbar-btn" onClick={() => window.history.forward()}>▶ Forward</button>
          <button className="win2k-toolbar-btn" onClick={() => window.location.reload()}>🔄 Refresh</button>
          <button className="win2k-toolbar-btn" onClick={() => window.location.href = '/'}>🏠 Home</button>
          <div className="win2k-toolbar-sep" />
          <button className="win2k-toolbar-btn">🔍 Search</button>
          <button className="win2k-toolbar-btn">⭐ Favorites</button>
          <button className="win2k-toolbar-btn">📜 History</button>
        </div>
      </div>
    </nav>
  )
}
