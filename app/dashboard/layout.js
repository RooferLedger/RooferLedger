'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()

  const navLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
    { name: 'Invoices', href: '/invoice/new', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          RooferLedger.
        </div>
        <nav className="sidebar-nav">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/dashboard')
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
        
        <div style={{ marginTop: 'auto' }}>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}>
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
      
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  )
}
