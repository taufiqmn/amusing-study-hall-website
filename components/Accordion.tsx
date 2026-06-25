'use client'

import { useState } from 'react'

export function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ border: '1px solid var(--card-border)', borderRadius: 12, marginBottom: 10, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '12px 16px',
          background: 'var(--card-bg)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--foreground)',
        }}
      >
        {title}
        <span style={{ color: 'var(--accent)', fontSize: 14 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '14px 16px', background: 'var(--background)', fontSize: 13, lineHeight: 1.7 }}>
          {children}
        </div>
      )}
    </div>
  )
}

export function RevealQuestion({ question, answer }: { question: string; answer: string }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '14px 16px', marginTop: 10 }}>
      <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px' }}>❓ {question}</p>
      <div onClick={() => setRevealed(!revealed)} style={{ cursor: 'pointer' }}>
        {!revealed ? (
          <p style={{ color: 'var(--accent)', fontSize: 11, margin: 0, fontStyle: 'italic' }}>👆 click to reveal answer</p>
        ) : (
          <p style={{ color: 'var(--accent)', fontSize: 12, margin: 0 }}>{answer}</p>
        )}
      </div>
    </div>
  )
}