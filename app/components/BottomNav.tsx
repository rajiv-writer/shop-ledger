'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/shopping', label: 'Shop', icon: '🛒' },
  { href: '/bills', label: 'Bills', icon: '💸' },
  { href: '/expenses', label: 'Expenses', icon: '💳' },
  { href: '/settle', label: 'Settle', icon: '🧮' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        background: '#000',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      {tabs.map(tab => {
        const active = pathname.startsWith(tab.href)

        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              textDecoration: 'none',
              color: active ? '#4ade80' : '#888',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: 12,
              gap: 4
            }}
          >
            <div style={{ fontSize: 20 }}>{tab.icon}</div>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
