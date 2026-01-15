'use client'

import { useState } from 'react'

type Bill = {
  id?: string
  bill_name: string
  amount: number
  due_date: string
  status: 'Paid' | 'Unpaid'
  frequency: string
}

export default function EditBill({
  bill,
  onClose,
  onSave,
}: {
  bill?: Bill
  onClose: () => void
  onSave: (changes: Partial<Bill>) => void
}) {
  const [name, setName] = useState(bill?.bill_name || '')
  const [amount, setAmount] = useState(bill ? String(bill.amount) : '')
  const [dueDate, setDueDate] = useState(bill?.due_date || '')
  const [frequency, setFrequency] = useState(bill?.frequency || 'Monthly')
  const [status, setStatus] = useState<Bill['status']>(
    bill?.status || 'Unpaid'
  )

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: 16 }}>
          {bill ? 'Edit Bill' : 'Add Bill'}
        </h2>

        <input
          placeholder="Rent, Internet, Electricity…"
          value={name}
          onChange={e => setName(e.target.value)}
          style={input}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={input}
        />

        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          style={input}
        />

        <select
          value={frequency}
          onChange={e => setFrequency(e.target.value)}
          style={input}
        >
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Yearly</option>
          <option>One-time</option>
        </select>

        {bill && (
          <select
            value={status}
            onChange={e => setStatus(e.target.value as Bill['status'])}
            style={input}
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            style={saveBtn}
            onClick={() =>
              onSave({
                bill_name: name,
                amount: Number(amount),
                due_date: dueDate,
                frequency,
                status,
              })
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

/* styles */

const overlay = {
  position: 'fixed' as const,
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'flex-end',
  zIndex: 200,
}

const sheet = {
  background: '#111',
  width: '100%',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
}

const input = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: '#000',
  color: '#fff',
  fontSize: 16,
  marginBottom: 10,
}

const saveBtn = {
  flex: 1,
  padding: 14,
  borderRadius: 12,
  background: '#4ade80',
  color: '#000',
  fontWeight: 600,
  border: 'none',
}

const cancelBtn = {
  flex: 1,
  padding: 14,
  borderRadius: 12,
  background: '#222',
  color: '#fff',
  border: 'none',
}
