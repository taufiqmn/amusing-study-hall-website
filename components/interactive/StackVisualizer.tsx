'use client'

import { useState } from 'react'

const MAX = 6

export default function StackVisualizer() {
  const [stack, setStack] = useState<number[]>([10, 20, 30])
  const [input, setInput] = useState('40')
  const [msg, setMsg] = useState('A stack: LIFO — Last In, First Out. Only the TOP is touchable.')
  const [flash, setFlash] = useState<number | null>(null)

  const push = () => {
    const v = parseInt(input)
    if (isNaN(v)) return
    if (stack.length >= MAX) {
      setMsg(`🚫 OVERFLOW! Top = MaxSTK (${MAX}) — the stack is full, cannot push.`)
      return
    }
    setStack((s) => [...s, v])
    setFlash(stack.length)
    setMsg(`✅ PUSH ${v}: Top = Top + 1 → Top = ${stack.length}, then Stack[Top] = ${v}`)
    setInput(String(v + 10))
    setTimeout(() => setFlash(null), 600)
  }

  const pop = () => {
    if (stack.length === 0) {
      setMsg('🚫 UNDERFLOW! Top = −1 — the stack is empty, nothing to pop.')
      return
    }
    const item = stack[stack.length - 1]
    setFlash(stack.length - 1)
    setTimeout(() => {
      setStack((s) => s.slice(0, -1))
      setFlash(null)
    }, 350)
    setMsg(`✅ POP: Item = Stack[Top] = ${item}, then Top = Top − 1 → Top = ${stack.length - 2}`)
  }

  const peek = () => {
    if (stack.length === 0) { setMsg('🚫 UNDERFLOW! Cannot peek an empty stack.'); return }
    setFlash(stack.length - 1)
    setMsg(`👀 PEEK: Stack[Top] = ${stack[stack.length - 1]} — look, but don't remove.`)
    setTimeout(() => setFlash(null), 700)
  }

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 10px' }}>🥞 Stack Machine (LIFO)</p>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 6, minHeight: MAX * 42, justifyContent: 'flex-start', border: '2px solid var(--card-border)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '0 10px 10px', width: 120 }}>
          {stack.map((v, i) => (
            <div key={i} style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontWeight: 800, fontSize: 13, background: flash === i ? '#F3CB4B' : 'var(--accent)', color: flash === i ? '#1a1530' : 'white', transition: 'all 0.3s', position: 'relative' }}>
              {v}
              {i === stack.length - 1 && (
                <span style={{ position: 'absolute', right: -52, fontSize: 10, fontWeight: 800, color: 'var(--accent)' }}>← TOP={i}</span>
              )}
            </div>
          ))}
          {stack.length === 0 && <p style={{ fontSize: 11, opacity: 0.45, textAlign: 'center' }}>empty<br />Top = −1</p>}
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} style={{ width: 64, fontSize: 12, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }} />
            <button onClick={push} style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#4FC3A1', color: 'white', cursor: 'pointer' }}>⬇ Push</button>
            <button onClick={pop} style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#e25c5c', color: 'white', cursor: 'pointer' }}>⬆ Pop</button>
            <button onClick={peek} style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', cursor: 'pointer' }}>👀 Peek</button>
          </div>
          <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 10 }}>
            <p style={{ fontSize: 12, margin: 0, lineHeight: 1.6 }}>{msg}</p>
          </div>
          <p style={{ fontSize: 11, opacity: 0.55, margin: '10px 0 0' }}>💡 Try pushing until it overflows ({MAX} slots), then popping until it underflows — the two classic stack errors.</p>
        </div>
      </div>
    </div>
  )
}
