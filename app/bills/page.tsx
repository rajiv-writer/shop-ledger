'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import EditBill from '../components/EditBill'

type Bill = {
  id: string
  bill_name: string
  amount: number
  due_date: string
  status: 'Paid' | 'Unpaid'
  frequency: string
}

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([])
  const [editing, setEditing] = useState<Bill | null>(null)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBills()
  }, [])

  async function loadBills() {
    const { data } = await supabase
      .from('bills')
      .select('*')
      .order('due_date', { ascending: true })

    setBills(data || [])
    setLoading(false)
  }

  async function saveEdit(changes: Partial<Bill>) {
    if (!editing) return

    await supabase
      .from('bills')
      .update(changes)
      .eq('id', editing.id)

    setEditing(null)
    loadBills()
  }

  async function addBill(changes: Partial<Bill>) {
    await supabase.from('bills').insert({
      ...changes,
      status: 'Unpaid',
    })

    setCreating(false)
    loadBills()
  }

  if (loading) {
    return <div style={{ padding: 40, color: '#999' }}>Loading…</div>
  }

  return (
    <main style={{ maxWidth: 420, margin: '0 auto', padding: '16px 16px 80px' }}>
      <h1 style={{ fontSize: 22, marginBottom: 16 }}>💸 Bills</h1>

      {bills.map(bill => {
        const overdue =
          bill.status === 'Unpaid' &&
          new Date(bill.due_date) < new Date()

        return (
          <div
            key={bill.id}
            onClick={() => setEditing(bill)}
            style={{
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 16 }}>{bill.bill_name}</div>
            <div style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>
              €{bill.amount} · due {bill.due_date}
            </div>
            <div
              style={{
                fontSize: 12,
                marginTop: 2,
                color:
                  bill.status === 'Paid'
                    ? '#4ade80'
                    : overdue
                    ? '#f87171'
                    : '#aaa',
              }}
            >
              {bill.status}
              {overdue && ' · Overdue'}
            </div>
          </div>
        )
      })}

      {/* Floating + button */}
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

      {editing && (
        <EditBill
          bill={editing}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}

      {creating && (
        <EditBill
          onClose={() => setCreating(false)}
          onSave={addBill}
        />
      )}
    </main>
  )
}
