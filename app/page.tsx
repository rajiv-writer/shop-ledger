export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = createClient()

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div>Failed to load entries</div>
  }

  return (
    <main style={{ padding: 16 }}>
      <h1>Ledger Entries</h1>

      <a href="/add-entry">Add entry</a>

      <div style={{ marginTop: 16 }}>
        {transactions?.map((t) => (
          <div
            key={t.id}
            style={{
              borderLeft: `4px solid ${t.type === 'IN' ? 'green' : 'red'}`,
              paddingLeft: 8,
              marginBottom: 12,
            }}
          >
            <div>
              <strong>{t.type}</strong> — ₹
              {Number(t.amount).toLocaleString('en-IN')}
            </div>

            <div>{t.counterparty}</div>

            {t.category && (
              <div style={{ fontSize: 12, color: '#555' }}>
                {t.category}
              </div>
            )}

            <div>{t.description}</div>

            <div style={{ fontSize: 12, color: '#666' }}>
              {new Date(t.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
