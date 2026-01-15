'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import EditExpense from '../components/EditExpense'

type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: string
  who_paid: string
}

type Profile = {
  id: string
  email: string
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [editing, setEditing] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)


  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    const [{ data: expenses }, { data: profiles }] = await Promise.all([
      supabase.from('expenses').select('*').order('date', { ascending: false }),
      supabase.from('profiles').select('id, email'),
    ])

    setExpenses(expenses || [])
    setProfiles(profiles || [])
    setLoading(false)
  }

  async function saveEdit(changes: Partial<Expense>) {
    if (!editing) return

    await supabase
      .from('expenses')
      .update(changes)
      .eq('id', editing.id)

    setEditing(null)
    loadAll()
  }
  async function addExpense(changes: any) {
  await supabase.from('expenses').insert({
    ...changes,
    date: new Date().toISOString().split('T')[0],
  })

  setCreating(false)
  loadAll()
}

  if (loading) {
    return <div style={{ padding: 40, color: '#999' }}>Loading…</div>
  }

  return (
    <main style={{ maxWidth: 420, margin: '0 auto', padding: '16px 16px 80px' }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>💳 Expenses</h1>

      {expenses.map(exp => {
        const payer =
          profiles.find(p => p.id === exp.who_paid)?.email || 'Unknown'

        return (
          <div
            key={exp.id}
            onClick={() => setEditing(exp)}
            style={{
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 16 }}>{exp.description}</div>
            <div style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>
              €{exp.amount} · {exp.category}
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
              Paid by {payer}
            </div>
          </div>
        )
      })}

      {editing && (
        <EditExpense
          expense={editing}
          profiles={profiles}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
      {creating && (
  <EditExpense
    profiles={profiles}
    onClose={() => setCreating(false)}
    onSave={addExpense}
  />
)}

      <button
  onClick={() => setCreating(true)}
  style={{
    position: 'fixed',
    bottom: 90,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    background: '#4ade80',
    color: '#000',
    fontSize: 28,
    fontWeight: 600,
    border: 'none',
    zIndex: 150,
  }}
>
  +
</button>
    </main>
  )
}
