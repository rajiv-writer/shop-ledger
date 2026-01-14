'use client'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0b0b',
        color: 'white',
        paddingBottom: 70, // space for bottom nav
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,   // phone width
          padding: 16
        }}
      >
        {children}
      </div>
    </div>
  )
}
