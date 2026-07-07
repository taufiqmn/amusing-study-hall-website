'use client'

import { useState } from 'react'

const ARRAY_ADDRS = [1000, 1004, 1008, 1012, 1016]
const LL_ADDRS = [2044, 1080, 3512, 900, 2777]

export default function RamMemoryCompare() {
  const [mode, setMode] = useState<'array' | 'linked'>('array')

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 18 }}>
      <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 10px' }}>🧠 What RAM actually looks like</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode('array')} style={tabBtn(mode === 'array')}>Array (fixed size 5)</button>
        <button onClick={() => setMode('linked')} style={tabBtn(mode === 'linked')}>Linked List (dynamic)</button>
      </div>

      {mode === 'array' ? (
        <div>
          <p style={{ fontSize: 12, marginBottom: 12 }}>
            <code>int arr[5];</code> reserves <strong>5 contiguous slots</strong> in memory, right now, whether you use them or not.
          </p>
          <div style={{ display: 'flex', gap: 4 }}>
            {ARRAY_ADDRS.map((addr, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 44, border: '2px solid var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', fontSize: 13, fontWeight: 700 }}>
                  arr[{i}]
                </div>
                <p style={{ fontSize: 9, opacity: 0.6, margin: '4px 0 0', fontFamily: 'monospace' }}>{addr}</p>
              </div>
            ))}
            <div style={{ textAlign: 'center', opacity: 0.4 }}>
              <div style={{ width: 56, height: 44, border: '2px dashed #e05353', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🚫</div>
              <p style={{ fontSize: 9, margin: '4px 0 0' }}>no slot 6!</p>
            </div>
          </div>
          <p style={{ fontSize: 12, marginTop: 12, color: '#e05353', fontWeight: 600 }}>
            Notice: the addresses are perfectly back-to-back (1000 → 1004 → 1008...). Want a 6th element? Too bad — that memory might already belong to something else. You'd have to allocate a whole new bigger array and copy everything over.
          </p>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: 12, marginBottom: 12 }}>
            A linked list doesn't need contiguous memory at all — each node just needs to know the <em>address</em> of the next one.
          </p>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            {LL_ADDRS.map((addr, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 64, height: 44, border: '2px solid var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', fontSize: 12, fontWeight: 700 }}>
                    node{i + 1}
                  </div>
                  <p style={{ fontSize: 9, opacity: 0.6, margin: '4px 0 0', fontFamily: 'monospace' }}>@{addr}</p>
                </div>
                {i < LL_ADDRS.length - 1 && <span style={{ fontSize: 14 }}>➜</span>}
              </div>
            ))}
            <span style={{ fontSize: 14, opacity: 0.5 }}>➜</span>
            <div style={{ fontSize: 11, opacity: 0.5, border: '1.5px dashed var(--card-border)', padding: '10px 12px', borderRadius: 8 }}>NULL</div>
          </div>
          <p style={{ fontSize: 12, marginTop: 12, color: '#2e9e5b', fontWeight: 600 }}>
            Look at those addresses — scattered all over RAM, nowhere near each other! But it doesn't matter, because each
            node carries a "next" pointer telling us exactly where to jump. Need a 6th node? Just malloc() one anywhere free
            and link it in — no resizing, no copying. You can grow the list as long as your computer's memory lets you 😉
          </p>
        </div>
      )}
    </div>
  )
}

function tabBtn(active: boolean): React.CSSProperties {
  return {
    padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
    border: active ? 'none' : '1px solid var(--card-border)',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? '#fff' : 'var(--foreground)',
  }
}
