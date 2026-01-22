'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SummaryPage() {
  const supabase = createClient()

  const [transactions, setTransactions] = useState<any[]>([])
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  useEffect(() => {
    supabase
      .from('transactions')
      .select('*')
      .then(({ data }) => {
        setTransactions(data || [])
      })
  }, [])

  // ---- Date boundaries ----
  const today = new Date()
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  const [year, month] = selectedMonth.split('-').map(Number)
  const startOfMonth = new Date(year, month - 1, 1)
  const endOfMonth = new Date(year, month, 0, 23, 59, 59)

  // ---- Totals ----
  const todayIn = transactions
    .filter(
      (t) =>
        t.type === 'IN' &&
        new Date(t.created_at) >= startOfToday
    )
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const todayOut = transactions
    .filter(
      (t) =>
        t.type === 'OUT' &&
        new Date(t.created_at) >= startOfToday
    )
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthIn = transactions
    .filter(
      (t) =>
        t.type === 'IN' &&
        new Date(t.created_at) >= startOfMonth &&
        new Date(t.created_at) <= endOfMonth
    )
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthOut = transactions
    .filter(
      (t) =>
        t.type === 'OUT' &&
        new Date(t.created_at) >= startOfMonth &&
        new Date(t.created_at) <= endOfMonth
    )
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // ---- UI ----
  return (
    <main style={{ padding: 16 }}>
      <nav style={{ marginBottom: 16 }}>
        <a href="/">Ledger</a> | <a href="/summary">Summary</a>
      </nav>

      <h1>Summary</h1>

      <label>Select Month</label>
      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        style={{ display: 'block', marginBottom: 24 }}
      />

      <h2>Today</h2>
      <div>IN: ₹{todayIn.toLocaleString('en-IN')}</div>
      <div>OUT: ₹{todayOut.toLocaleString('en-IN')}</div>

      <h2 style={{ marginTop: 16 }}>Selected Month</h2>
      <div>IN: ₹{monthIn.toLocaleString('en-IN')}</div>
      <div>OUT: ₹{monthOut.toLocaleString('en-IN')}</div>
    </main>
  )
}
