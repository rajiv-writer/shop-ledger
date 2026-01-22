'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CATEGORY_OPTIONS = [
  'Sales',
  'Jeans',
  'Washing',
  'Transport',
  'Misc',
]

const COUNTERPARTY_OPTIONS = [
  'Customer',
  'Washing Factory',
  'Transporter',
  'Supplier',
]

export default function AddEntryPage() {
  const supabase = createClient()
  const router = useRouter()

  const [type, setType] = useState<'IN' | 'OUT'>('OUT')
  const [amount, setAmount] = useState('')
  const [counterparty, setCounterparty] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [entryDate, setEntryDate] = useState(
  new Date().toISOString().split('T')[0]
)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const { error } = await supabase.from('transactions').insert([
      {
        type,
        amount: Number(amount),
        counterparty,
        description,
        category,
        created_at: new Date(entryDate).toISOString(),
      },
    ])

    if (error) {
      setError(error.message)
      return
    }

    router.push('/')
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>Add Entry</h1>

<form onSubmit={handleSubmit}>
  <div style={{ maxWidth: 420 }}>
    <div style={{ marginBottom: 24 }}>
      <label>Type</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as 'IN' | 'OUT')}
      >
        <option value="IN">IN</option>
        <option value="OUT">OUT</option>
      </select>
    </div>

    <div style={{ marginBottom: 24 }}>
      <label>Date</label>
      <input
        type="date"
        value={entryDate}
        onChange={(e) => setEntryDate(e.target.value)}
      />
    </div>

    <div style={{ marginBottom: 24 }}>
      <label>Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        style={{ width: '100%', fontSize: 16 }}
      />
    </div>

    <div style={{ marginBottom: 24 }}>
      <label>Category</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select category</option>
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>

    <div style={{ marginBottom: 24 }}>
      <label>Counterparty</label>
      <input
        list="counterparties"
        value={counterparty}
        onChange={(e) => setCounterparty(e.target.value)}
        required
      />
      <datalist id="counterparties">
        {COUNTERPARTY_OPTIONS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
    </div>

    <div style={{ marginBottom: 24 }}>
      <label>Description</label>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: '100%' }}
      />
    </div>

    {error && <p style={{ color: 'red' }}>{error}</p>}

    <button
      type="submit"
      style={{
        padding: '10px 16px',
        fontSize: 16,
        marginTop: 8,
        cursor: 'pointer',
      }}
    >
      Save Entry
    </button>
  </div>
</form>
    </main>
  )
}
