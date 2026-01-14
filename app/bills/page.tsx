'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Bills() {
  const [bills, setBills] = useState<any[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')

  async function loadBills() {
    const { data } = await supabase
      .from('bills')
      .select('*')
      .order('due_date', { ascending: true })

    setBills(data || [])
  }

  async function addBill() {
    if (!name || !amount || !dueDate) return

    await supabase.from('bills').insert({
      bill_name: name,
      amount: Number(amount),
      due_date: dueDate,
      frequency: 'Monthly',
      status: 'Unpaid'
    })

    setName('')
    setAmount('')
    setDueDate('')
    loadBills()
  }

  async function markPaid(id: string) {
    await supabase
      .from('bills')
      .update({ status: 'Paid' })
      .eq('id', id)

    loadBills()
  }

  useEffect(() => {
    loadBills()
  }, [])

  return (
    <main style={{ padding: 40 }}>
      <h1>💸 Bills</h1>
      <div style={{ paddingBottom: 80 }}></div>

      <input
        placeholder="Rent, Internet, Electricity..."
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
      />

      <button onClick={addBill}>Add Bill</button>

      <ul style={{ marginTop: 20 }}>
        {bills.map(bill => (
          <li key={bill.id}>
            {bill.bill_name} — €{bill.amount} — due{' '}
            {new Date(bill.due_date).toLocaleDateString()} — {bill.status}

            {bill.status === 'Unpaid' && new Date(bill.due_date) < new Date() && (
            <span style={{ color: 'red', marginLeft: 10 }}>
            OVERDUE
            </span>
            )}

            {bill.status === 'Unpaid' && (
                <button onClick={() => markPaid(bill.id)} style={{ marginLeft: 10 }}>
            Mark Paid
                </button>
            )}
        </li>
        ))}
      </ul>
    </main>
  )
}
