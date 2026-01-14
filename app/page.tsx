'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 🚨 This is the hydration fix
  if (loading) return null

  if (!user) {
    return (
      <main style={{ padding: 40 }}>
        <h1>🏠 Home Tracker</h1>
        <p>Please log in to continue.</p>
        <Link href="/login">Go to Login</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>🏠 Home Tracker</h1>
      <p>Welcome {user.email}</p>
      <p>This is now your shared home dashboard.</p>

      <nav style={{ marginTop: 20 }}>
        <Link href="/shopping">🛒 Shopping</Link><br/>
        <Link href="/expenses">💳 Expenses</Link><br/>
        <Link href="/bills">💸 Bills</Link><br/>
        <Link href="/settle">🧮 Settle Up</Link>
      </nav>
    </main>
  )
}
