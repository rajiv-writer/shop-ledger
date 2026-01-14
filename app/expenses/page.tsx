'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Expense = {
  id: string
  description: string
  amount: number
  category: string
  who_paid: string
}

type Profile = {
  id: string
  email: string
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [paidBy, setPaidBy] = useState('')
  const [user, setUser] = useState<any>(null)

  async function loadExpenses() {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })

    setExpenses(data || [])
  }

  async function loadProfiles() {
    const { data } = await supabase
      .from('profiles')
      .select('id, email')

    setProfiles(data || [])
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    loadExpenses()
    loadProfiles()
  }, [])

  async function addExpense() {
    if (!description || !amount || !user) return

    await supabase.from('expenses').insert({
      description,
      amount: Number(amount),
      category,
      date: new Date().toISOString(),
      who_paid: paidBy || user.id
    })

    setDescription('')
    setAmount('')
    setPaidBy('')
    loadExpenses()
  }

  async function editExpense(exp: Expense) {
    const newAmount = prompt('New amount', exp.amount.toString())
    if (!newAmount) return

    await supabase
      .from('expenses')
      .update({ amount: Number(newAmount) })
      .eq('id', exp.id)

    loadExpenses()
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>💳 Expenses</h1>
      <div style={{ paddingBottom: 80 }}>

      <input
        placeholder="Dinner, groceries, Uber..."
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option>Food</option>
        <option>Travel</option>
        <option>Entertainment</option>
        <option>Household</option>
        <option>Other</option>
      </select>

      <select value={paidBy} onChange={e => setPaidBy(e.target.value)}>
        <option value="">Who paid?</option>
        {profiles.map(p => (
          <option key={p.id} value={p.id}>
            {p.email}
          </option>
        ))}
      </select>

      <button onClick={addExpense}>Add Expense</button>

      <ul style={{ marginTop: 20 }}>
        {expenses.map(exp => (
          <li key={exp.id}>
            {exp.description} — €{exp.amount} — {exp.category} —{' '}
            {profiles.find(p => p.id === exp.who_paid)?.email || 'Unknown'}
            <button onClick={() => editExpense(exp)} style={{ marginLeft: 10 }}>
              Edit
            </button>
          </li>
        ))}
      </ul>
      </div>
    </main>
  )
}
