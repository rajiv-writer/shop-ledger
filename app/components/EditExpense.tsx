'use client'

import { useState } from 'react'

type Profile = {
  id: string
  email: string
}

type Expense = {
  id: string
  description: string
  amount: number
  category: string
  who_paid: string
}

export default function EditExpense({
  expense,
  profiles,
  onClose,
  onSave,
}: {
  expense?: Expense
  profiles: Profile[]
  onClose: () => void
  onSave: (changes: Partial<Expense>) => void
}) {
const [description, setDescription] = useState(expense?.description || '')
const [amount, setAmount] = useState(expense ? String(expense.amount) : '')
const [category, setCategory] = useState(expense?.category || 'Food')
const [whoPaid, setWhoPaid] = useState(
  expense?.who_paid || profiles[0]?.id
)


  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={sheetStyle} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginBottom: 16 }}>
        {expense ? 'Edit Expense' : 'Add Expense'}
        </h2>
        
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          style={inputStyle}
        />

        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount"
          style={inputStyle}
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={inputStyle}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Entertainment</option>
          <option>Household</option>
          <option>Other</option>
        </select>

        <select
          value={whoPaid}
          onChange={e => setWhoPaid(e.target.value)}
          style={inputStyle}
        >
          {profiles.map(p => (
            <option key={p.id} value={p.id}>
              {p.email}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            style={saveBtn}
            onClick={() =>
              onSave({
                description,
                amount: Number(amount),
                category,
                who_paid: whoPaid,
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

const overlayStyle = {
  position: 'fixed' as const,
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'flex-end',
  zIndex: 200,
}

const sheetStyle = {
  background: '#111',
  width: '100%',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
}

const inputStyle = {
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
