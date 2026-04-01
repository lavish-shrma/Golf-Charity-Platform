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

function Win2kWindow({ title, icon, children, className = '' }) {
  return (
    <div className={`win2k-window ${className}`}>
      <div className="win2k-titlebar">
        <div className="win2k-titlebar-left">
          {icon && <span className="win2k-titlebar-icon">{icon}</span>}
          <span className="win2k-titlebar-text">{title}</span>
        </div>
        <div className="win2k-titlebar-buttons">
          <button className="win2k-btn-chrome" aria-label="Minimize">_</button>
          <button className="win2k-btn-chrome" aria-label="Maximize">□</button>
          <button className="win2k-btn-chrome win2k-btn-close" aria-label="Close">✕</button>
        </div>
      </div>
      <div className="win2k-window-body">
        {children}
      </div>
    </div>
  )
}

function Win2kButton({ href, children, primary, className = '' }) {
  const cls = `win2k-btn ${primary ? 'win2k-btn-primary' : 'win2k-btn-default'} ${className}`
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

export default async function HomePage() {
  const featuredCharity = await getFeaturedCharity()

  return (
    <div className="win2k-desktop">

      {/* Desktop wallpaper tiling pattern */}
      <div className="win2k-wallpaper-overlay" />

      <div className="win2k-desktop-content">

        {/* Hero Window */}
        <Win2kWindow title="Welcome to GolfGives - Microsoft Internet Explorer" icon="🌐" className="win2k-hero-window">
          {/* IE-style address bar */}
          <div className="win2k-addressbar">
            <span className="win2k-addressbar-label">Address</span>
            <div className="win2k-addressbar-input">
              <span className="win2k-addressbar-icon">🌐</span>
              <span className="win2k-url-text">http://www.golfgives.co.uk/</span>
            </div>
            <button className="win2k-btn win2k-btn-default win2k-go-btn">Go</button>
          </div>

          <div className="win2k-hero-content">
            {/* MSN-style animated star/badge */}
            <div className="win2k-marquee-wrapper">
              <div className="win2k-marquee">
                ★ &nbsp; MONTHLY PRIZE DRAWS &nbsp; · &nbsp; CHARITY IMPACT &nbsp; · &nbsp; GOLF PERFORMANCE &nbsp; ★ &nbsp; NEW: £12,400+ DONATED! &nbsp; ·
              </div>
            </div>

            <div className="win2k-hero-body">
              <div className="win2k-hero-left">
                <div className="win2k-logo-box">
                  <div className="win2k-logo-icon">⛳</div>
                  <div>
                    <div className="win2k-logo-title">GolfGives</div>
                    <div className="win2k-logo-subtitle">The Official Golf Charity Platform</div>
                  </div>
                </div>

                <div className="win2k-hero-headline">
                  <span className="win2k-headline-main">Play Golf.</span>
                  <br />
                  <span className="win2k-headline-accent">Change Lives.</span>
                </div>

                <p className="win2k-hero-desc">
                  Subscribe, enter your scores, win prizes, and support the charity you love.
                  Every round you play makes a difference.
                </p>

                <div className="win2k-button-row">
                  <Win2kButton href="/signup" primary>
                    ▶ Start Your Subscription
                  </Win2kButton>
                  <Win2kButton href="/how-it-works">
                    ℹ How It Works
                  </Win2kButton>
                </div>

                {/* Windows XP-style bliss */}
                <div className="win2k-disclaimer">
                  <span className="win2k-lock-icon">🔒</span>
                  Secure · Trusted by 340+ golfers · Est. 2024
                </div>
              </div>

              <div className="win2k-hero-right">
                {/* Fake sidebar like old MSN */}
                <div className="win2k-sidebar-box">
                  <div className="win2k-sidebar-header">📢 Latest News</div>
                  <ul className="win2k-sidebar-list">
                    <li><Link href="/prizes" className="win2k-link">💰 Prize pool reaches £8,200!</Link></li>
                    <li><Link href="/draws" className="win2k-link">🏆 June draw results posted</Link></li>
                    <li><Link href="/charities" className="win2k-link">❤️ New charity added</Link></li>
                    <li><Link href="/how-it-works" className="win2k-link">📋 How draws work</Link></li>
                  </ul>
                </div>

                <div className="win2k-sidebar-box win2k-sidebar-ad">
                  <div className="win2k-sidebar-header">🌟 Did You Know?</div>
                  <p className="win2k-sidebar-text">
                    Your Stableford scores become your lottery numbers. The better you play, the better your odds!
                  </p>
                  <Win2kButton href="/signup" primary className="win2k-full-width">
                    Join Now — FREE Trial!
                  </Win2kButton>
                </div>
              </div>
            </div>
          </div>
        </Win2kWindow>

        {/* Stats Row */}
        <div className="win2k-stats-row">
          {[
            { icon: '💷', value: '£12,400+', label: 'Donated to Charities' },
            { icon: '👤', value: '340+', label: 'Active Members' },
            { icon: '🏆', value: '£8,200+', label: 'Prizes Awarded' },
          ].map((stat) => (
            <Win2kWindow key={stat.label} title={stat.label} className="win2k-stat-window">
              <div className="win2k-stat-content">
                <div className="win2k-stat-icon">{stat.icon}</div>
                <div className="win2k-stat-value">{stat.value}</div>
                <div className="win2k-stat-label">{stat.label}</div>
              </div>
            </Win2kWindow>
          ))}
        </div>

        {/* Featured Charity */}
        {featuredCharity && (
          <Win2kWindow title="Featured Charity - This Month We Support" icon="❤️" className="win2k-charity-window">
            <div className="win2k-charity-content">
              <div className="win2k-charity-badge">⭐ FEATURED THIS MONTH ⭐</div>
              <h3 className="win2k-charity-name">{featuredCharity.name}</h3>
              <p className="win2k-charity-desc">{featuredCharity.description}</p>
              <Link href="/charities" className="win2k-link win2k-charity-link">
                📋 View all supported charities &gt;&gt;
              </Link>
            </div>
          </Win2kWindow>
        )}

        {/* How It Works */}
        <Win2kWindow title="How It Works - GolfGives Help" icon="❓" className="win2k-howitworks-window">
          <div className="win2k-howitworks-inner">
            <div className="win2k-section-heading">
              <span className="win2k-section-icon">📖</span>
              Three Simple Steps to Play, Give, and Win
            </div>
            <div className="win2k-steps-grid">
              {[
                { step: '01', icon: '💳', title: 'Subscribe', desc: 'Choose a monthly or yearly plan. A portion of every subscription goes directly to your chosen charity.' },
                { step: '02', icon: '⛳', title: 'Enter Your Scores', desc: 'Log your last 5 Stableford scores after each round. Your scores become your draw numbers.' },
                { step: '03', icon: '🏆', title: 'Win and Give', desc: 'Monthly draws match your scores against drawn numbers. Win prizes while your charity benefits every month.' }
              ].map((item) => (
                <div key={item.step} className="win2k-step-card">
                  <div className="win2k-step-header">
                    <div className="win2k-step-icon">{item.icon}</div>
                    <div className="win2k-step-number">Step {item.step}</div>
                  </div>
                  <div className="win2k-inset-panel">
                    <h3 className="win2k-step-title">{item.title}</h3>
                    <p className="win2k-step-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Win2kWindow>

        {/* Final CTA Window */}
        <Win2kWindow title="Ready to Make an Impact?" icon="⭐" className="win2k-cta-window">
          <div className="win2k-cta-content">
            <div className="win2k-cta-icon-row">🏌️</div>
            <h2 className="win2k-cta-heading">Ready to Make an Impact?</h2>
            <p className="win2k-cta-desc">
              Join hundreds of golfers supporting UK charities through the sport they love.
            </p>
            <div className="win2k-cta-buttons">
              <Win2kButton href="/signup" primary>
                ▶ Get Started Today
              </Win2kButton>
              <Win2kButton href="/how-it-works">
                ℹ Learn More
              </Win2kButton>
            </div>
          </div>
        </Win2kWindow>

        {/* Windows-style status bar at bottom of page content */}
        <div className="win2k-page-statusbar">
          <span>✅ Done</span>
          <span className="win2k-statusbar-sep">|</span>
          <span>🌐 Internet</span>
          <span className="win2k-statusbar-sep">|</span>
          <span>🔒 Secure</span>
        </div>

      </div>
    </div>
  )
}
