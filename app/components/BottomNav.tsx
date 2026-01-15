'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/bills', label: 'Bills', icon: '💸' },
  { href: '/expenses', label: 'Expenses', icon: '💳' },
  { href: '/', label: 'Home', icon: '🏠', center: true },
  { href: '/shopping', label: 'Shopping', icon: '🛒' },
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
        height: 72,
        background: '#0b0b0b',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      {navItems.map(item => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              textDecoration: 'none',
              color: isActive ? '#4ade80' : '#aaa',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontSize: 12,
            }}
          >
            <div
              style={{
                fontSize: item.center ? 28 : 20,
                background: item.center ? '#4ade80' : 'transparent',
                color: item.center ? '#000' : 'inherit',
                width: item.center ? 54 : 'auto',
                height: item.center ? 54 : 'auto',
                borderRadius: item.center ? 27 : 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: item.center ? 4 : 6,
                transform: item.center ? 'translateY(-12px)' : 'none',
              }}
            >
              {item.icon}
            </div>

            {!item.center && item.label}
          </Link>
        )
      })}
    </nav>
  )
}
