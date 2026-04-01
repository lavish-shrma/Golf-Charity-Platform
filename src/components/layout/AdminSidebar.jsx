'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: 'Overview', href: '/admin' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Draws', href: '/admin/draws' },
    { name: 'Charities', href: '/admin/charities' },
    { name: 'Winners', href: '/admin/winners' },
    { name: 'Prize Pool', href: '/admin/prize-pool' },
    { name: 'Audit Log', href: '/admin/audit-log' },
  ]

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          GolfGives <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider font-semibold">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          // Check exact match for overview, or startsWith for sub-pages like /admin/users/[id]
          const isActive = item.href === '/admin' 
            ? pathname === '/admin' 
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2.5 rounded-md text-sm transition-colors ${
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
