import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="win2k-footer">
      {/* Footer window chrome */}
      <div className="win2k-footer-window">
        <div className="win2k-titlebar">
          <div className="win2k-titlebar-left">
            <span className="win2k-titlebar-icon">⛳</span>
            <span className="win2k-titlebar-text">GolfGives — Footer Information</span>
          </div>
          <div className="win2k-titlebar-buttons">
            <button className="win2k-btn-chrome" aria-label="Minimize">_</button>
            <button className="win2k-btn-chrome" aria-label="Maximize">□</button>
          </div>
        </div>
        <div className="win2k-window-body win2k-footer-body">
          <div className="win2k-footer-grid">
            <div>
              <div className="win2k-footer-logo">
                <span>⛳</span>
                <span className="win2k-footer-logo-text">GolfGives</span>
              </div>
              <p className="win2k-footer-desc">
                Play golf, win prizes, and support the charities that matter to you.
                Every subscription makes a difference.
              </p>
              <div className="win2k-footer-badges">
                <span className="win2k-badge">🔒 Secure</span>
                <span className="win2k-badge">✅ Verified</span>
                <span className="win2k-badge">🌐 Online</span>
              </div>
            </div>

            <div>
              <div className="win2k-footer-section-title">📁 Platform</div>
              <ul className="win2k-footer-links">
                <li><Link href="/charities" className="win2k-link">❤️ Charities</Link></li>
                <li><Link href="/how-it-works" className="win2k-link">❓ How It Works</Link></li>
                <li><Link href="/prizes" className="win2k-link">🏆 Prize Pool</Link></li>
              </ul>
            </div>

            <div>
              <div className="win2k-footer-section-title">👤 Account</div>
              <ul className="win2k-footer-links">
                <li><Link href="/login" className="win2k-link">🔑 Sign In</Link></li>
                <li><Link href="/signup" className="win2k-link">⭐ Subscribe</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Windows-style taskbar at the very bottom */}
      <div className="win2k-taskbar">
        <div className="win2k-taskbar-inner">
          <button className="win2k-start-btn">
            <span className="win2k-start-icon">⊞</span>
            <span>Start</span>
          </button>
          <div className="win2k-taskbar-sep" />
          <div className="win2k-taskbar-items">
            <span className="win2k-taskbar-item">⛳ GolfGives</span>
            <span className="win2k-taskbar-item">🌐 Internet Explorer</span>
          </div>
          <div className="win2k-taskbar-tray">
            <span className="win2k-tray-item">🔒</span>
            <span className="win2k-tray-item">🔊</span>
            <span className="win2k-tray-item">🌐</span>
            <span className="win2k-tray-clock">12:00 PM</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
