'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: 'Overview', href: '/dashboard' },
    { name: 'My Scores', href: '/scores' },
    { name: 'My Charity', href: '/my-charity' },
    { name: 'Draws', href: '/draws' },
    { name: 'Winnings', href: '/winnings' },
    { name: 'Settings', href: '/settings' },
  ]

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold text-emerald-400 tracking-tight">
          GolfGives
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
