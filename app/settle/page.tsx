'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Total = {
  email: string
  total: number
}

export default function Settle() {
  const [totals, setTotals] = useState<Total[]>([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    const { data: expenses } = await supabase
      .from('expenses')
      .select('amount, who_paid')

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')

    if (!expenses || !profiles) return

    const map: Record<string, number> = {}

    expenses.forEach(exp => {
      map[exp.who_paid] = (map[exp.who_paid] || 0) + exp.amount
    })

    const result: Total[] = Object.keys(map).map(userId => {
      const user = profiles.find(p => p.id === userId)
      return {
        email: user?.email || 'Unknown',
        total: map[userId]
      }
    })

    setTotals(result)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <p style={{ padding: 40 }}>Loading…</p>

  const totalSpent = totals.reduce((sum, t) => sum + t.total, 0)
  const peopleCount = totals.length
  const fairShare = peopleCount ? totalSpent / peopleCount : 0

  return (
    <main style={{ padding: 40 }}>
      <h1>🧮 Settle Up</h1>
      <div style={{ paddingBottom: 80 }}></div>

      <p>Total household spending: €{totalSpent.toFixed(2)}</p>
      <p>Fair share per person: €{fairShare.toFixed(2)}</p>

      <ul style={{ marginTop: 20 }}>
        {totals.map(t => {
          const balance = t.total - fairShare
          return (
            <li key={t.email}>
              {t.email} paid €{t.total.toFixed(2)} —{' '}
              {balance > 0
                ? `is owed €${balance.toFixed(2)}`
                : balance < 0
                ? `owes €${Math.abs(balance).toFixed(2)}`
                : 'settled'}
            </li>
          )
        })}
      </ul>
    </main>
  )
}
