'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import EditShoppingItem from '../components/EditShoppingItem'

type Item = {
  id: string
  item_name: string
  status: boolean
  who_is_buying: string | null
}

type Profile = {
  id: string
  email: string
}

export default function Shopping() {
  const [items, setItems] = useState<Item[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [newItem, setNewItem] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Item | null>(null)


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null)
      loadAll()
    })
  }, [])

  async function loadAll() {
    const [{ data: items }, { data: profiles }] = await Promise.all([
      supabase.from('shopping_list').select('*').order('id', { ascending: false }),
      supabase.from('profiles').select('id, email')
    ])

    setItems(items || [])
    setProfiles(profiles || [])
    setLoading(false)
  }

  async function addItem() {
    if (!newItem || !user) return

    await supabase.from('shopping_list').insert({
      item_name: newItem,
      category: 'Groceries',
      status: false,
      who_is_buying: user.id
    })

    setNewItem('')
    loadAll()
  }

  async function toggleDone(id: string, status: boolean) {
    await supabase
      .from('shopping_list')
      .update({ status })
      .eq('id', id)

    loadAll()
  }
  async function saveEdit(changes: any) {
  if (!editingItem) return

  await supabase
    .from('shopping_list')
    .update({
      item_name: changes.name,
      who_is_buying: changes.buyer
    })
    .eq('id', editingItem.id)

  setEditingItem(null)
  loadAll()
}

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
        Loading…
      </div>
    )
  }

  return (
    <main
      style={{
        maxWidth: 420,
        margin: '0 auto',
        padding: '16px 16px 80px',
      }}
    >
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>🛒 Shopping</h1>

      {/* Input */}
      <input
        placeholder="Milk, eggs, toilet paper…"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.1)',
          background: '#111',
          color: '#fff',
          fontSize: 16,
          outline: 'none'
        }}
      />

      <button
        onClick={addItem}
        style={{
          width: '100%',
          marginTop: 10,
          padding: '14px',
          borderRadius: 14,
          background: '#4ade80',
          color: '#000',
          fontWeight: 600,
          fontSize: 16,
          border: 'none'
        }}
      >
        Add
      </button>

      {/* List */}
      <div style={{ marginTop: 20 }}>
        {items.map(item => {
          const buyer =
            profiles.find(p => p.id === item.who_is_buying)?.email || 'Unassigned'

          return (
            <div
                key={item.id}
                    onClick={() => setEditingItem(item)}
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={item.status}
                onChange={(e) => toggleDone(item.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                style={{ width: 20, height: 20 }}
              />
              <div style={{ color: '#555', fontSize: 18 }}>›</div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 16,
                    textDecoration: item.status ? 'line-through' : 'none',
                    opacity: item.status ? 0.5 : 1
                  }}
                >
                  {item.item_name}
                </div>

                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {buyer}
                </div>
              </div>
            </div>
          )
        })}
      </div>
        {editingItem && (
            <EditShoppingItem
             item={editingItem}
                profiles={profiles}
                onClose={() => setEditingItem(null)}
            onSave={saveEdit}
            />
        )}
    </main>
  )
}
