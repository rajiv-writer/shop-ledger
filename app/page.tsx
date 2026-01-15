'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [loading, setLoading] = useState(true)

  const [unpaidBills, setUnpaidBills] = useState<any[]>([])
  const [shoppingCount, setShoppingCount] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(0)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const [
      { data: bills },
      { data: shopping },
      { data: expenses }
    ] = await Promise.all([
      supabase
        .from('bills')
        .select('amount, due_date, status')
        .eq('status', 'Unpaid'),

      supabase
        .from('shopping_list')
        .select('id')
        .eq('status', false),

      supabase
        .from('expenses')
        .select('amount')
        .gte('date', firstDayOfMonth.toISOString().split('T')[0])
    ])

    setUnpaidBills(bills || [])
    setShoppingCount(shopping?.length || 0)

    const totalExpenses =
      expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0

    setMonthlyExpenses(totalExpenses)
    setLoading(false)
  }

  if (loading) {
    return (
      <main style={{ padding: 40, textAlign: 'center', color: '#999' }}>
        Loading dashboard…
      </main>
    )
  }

  const unpaidTotal = unpaidBills.reduce(
    (sum, b) => sum + Number(b.amount),
    0
  )

  const overdueCount = unpaidBills.filter(
    b => new Date(b.due_date) < new Date()
  ).length

  return (
    <main
      style={{
        maxWidth: 420,
        margin: '0 auto',
        padding: '16px 16px 80px'
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 20 }}>🏠 Home</h1>

      {/* Bills */}
      <Link href="/bills" style={{ textDecoration: 'none' }}>
        <div style={cardStyle}>
          <div style={cardTitle}>💸 Bills</div>
          {unpaidBills.length === 0 ? (
            <div style={cardValue}>All bills paid 🎉</div>
          ) : (
            <>
              <div style={cardValue}>
                {unpaidBills.length} unpaid · €{unpaidTotal}
              </div>
              {overdueCount > 0 && (
                <div style={{ color: '#f87171', fontSize: 13 }}>
                  {overdueCount} overdue
                </div>
              )}
            </>
          )}
        </div>
      </Link>

      {/* Shopping */}
      <Link href="/shopping" style={{ textDecoration: 'none' }}>
        <div style={cardStyle}>
          <div style={cardTitle}>🛒 Shopping</div>
          <div style={cardValue}>
            {shoppingCount} item{shoppingCount === 1 ? '' : 's'} to buy
          </div>
        </div>
      </Link>

      {/* Expenses */}
      <Link href="/expenses" style={{ textDecoration: 'none' }}>
        <div style={cardStyle}>
          <div style={cardTitle}>📊 Expenses (this month)</div>
          <div style={cardValue}>€{monthlyExpenses}</div>
        </div>
      </Link>
    </main>
  )
}

const cardStyle = {
  background: '#111',
  borderRadius: 16,
  padding: 16,
  marginBottom: 14,
  border: '1px solid rgba(255,255,255,0.06)'
}

const cardTitle = {
  fontSize: 14,
  color: '#aaa',
  marginBottom: 6
}

const cardValue = {
  fontSize: 18,
  color: '#fff'
}