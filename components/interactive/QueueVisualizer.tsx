'use client'

import { useState } from 'react'

const N = 6

export default function QueueVisualizer() {
  const [mode, setMode] = useState<'linear' | 'circular'>('linear')
  const [slots, setSlots] = useState<(number | null)[]>(Array(N).fill(null))
  const [front, setFront] = useState(-1)
  const [rear, setRear] = useState(-1)
  const [next, setNext] = useState(10)
  const [msg, setMsg] = useState('A queue: FIFO — First In, First Out. Insert at REAR, remove from FRONT.')

  const reset = (m: 'linear' | 'circular') => {
    setMode(m)
    setSlots(Array(N).fill(null))
    setFront(-1); setRear(-1); setNext(10)
    setMsg(m === 'linear' ? 'Linear queue: watch the elements "crawl" right and get stuck!' : 'Circular queue: when REAR hits the end, it wraps around to reuse free slots.')
  }

  const enqueue = () => {
    const v = next
    if (mode === 'linear') {
      if (rear === N - 1) {
        const free = slots.filter((s) => s === null).length
        setMsg(`🚫 OVERFLOW! Rear = ${N - 1} (the end). ${free > 0 ? `But look — ${free} slot(s) at the left are FREE and wasted. This is the big drawback of a linear queue → circular queue fixes it!` : 'Queue is truly full.'}`)
        return
      }
      const r = rear + 1
      const s = [...slots]; s[r] = v
      setSlots(s); setRear(r)
      if (front === -1) setFront(0)
      setMsg(`✅ ENQUEUE ${v}: Rear = Rear + 1 → ${r}, Queue[${r}] = ${v}`)
    } else {
      const isFull = (front === 0 && rear === N - 1) || front === rear + 1
      if (front !== -1 && isFull) { setMsg('🚫 OVERFLOW! Front = Rear + 1 (circularly) — every slot is genuinely occupied.'); return }
      let r: number
      let f = front
      if (front === -1) { f = 0; r = 0; setFront(0) }
      else if (rear === N - 1) r = 0
      else r = rear + 1
      const s = [...slots]; s[r] = v
      setSlots(s); setRear(r)
      setMsg(`✅ ENQUEUE ${v}: ${rear === N - 1 && front !== -1 ? `Rear was ${N - 1}, so it WRAPS to 0 ♻️` : `Rear = ${r}`}`)
    }
    setNext(v + 10)
  }

  const dequeue = () => {
    if (front === -1) { setMsg('🚫 UNDERFLOW! The queue is empty — nothing to remove.'); return }
    const item = slots[front]
    const s = [...slots]; s[front] = null
    setSlots(s)
    if (front === rear) {
      setFront(-1); setRear(-1)
      setMsg(`✅ DEQUEUE: removed ${item}. Front = Rear, so the queue is now empty → reset both to −1.`)
    } else if (mode === 'circular' && front === N - 1) {
      setFront(0)
      setMsg(`✅ DEQUEUE: removed ${item}. Front was ${N - 1}, so it WRAPS to 0 ♻️`)
    } else {
      setFront(front + 1)
      setMsg(`✅ DEQUEUE: removed ${item} from the FRONT. Front = Front + 1 → ${front + 1}`)
    }
  }

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 10px' }}>🚶 Queue Simulator (FIFO)</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <button onClick={() => reset('linear')} style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--card-border)', background: mode === 'linear' ? 'var(--accent)' : 'var(--background)', color: mode === 'linear' ? 'white' : 'var(--foreground)', cursor: 'pointer' }}>Linear</button>
        <button onClick={() => reset('circular')} style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--card-border)', background: mode === 'circular' ? 'var(--accent)' : 'var(--background)', color: mode === 'circular' ? 'white' : 'var(--foreground)', cursor: 'pointer' }}>♻️ Circular</button>
        <button onClick={enqueue} style={{ fontSize: 12, fontWeight: 700, padding: '7px 16px', borderRadius: 8, border: 'none', background: '#4FC3A1', color: 'white', cursor: 'pointer' }}>+ Enqueue {next}</button>
        <button onClick={dequeue} style={{ fontSize: 12, fontWeight: 700, padding: '7px 16px', borderRadius: 8, border: 'none', background: '#e25c5c', color: 'white', cursor: 'pointer' }}>− Dequeue</button>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {slots.map((v, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 9.5, fontWeight: 800, color: '#4FC3A1', margin: '0 0 3px', minHeight: 12 }}>{i === front ? 'FRONT' : ''}</p>
            <div style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, fontSize: 13, fontWeight: 800, border: `2px solid ${i === front ? '#4FC3A1' : i === rear ? '#F3CB4B' : 'var(--card-border)'}`, background: v !== null ? 'var(--pill-bg)' : 'var(--background)', color: 'var(--foreground)', transition: 'all 0.3s' }}>
              {v ?? ''}
            </div>
            <p style={{ fontSize: 9.5, fontWeight: 800, color: '#F3CB4B', margin: '3px 0 0', minHeight: 12 }}>{i === rear ? 'REAR' : ''}</p>
            <p style={{ fontSize: 9.5, opacity: 0.5, margin: 0 }}>[{i}]</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 10 }}>
        <p style={{ fontSize: 12, margin: 0, lineHeight: 1.6 }}>{msg}</p>
      </div>
      <p style={{ fontSize: 11, opacity: 0.55, margin: '10px 0 0' }}>💡 Challenge: in Linear mode, enqueue 6 times, dequeue 3 times, then try to enqueue — see the wasted slots. Switch to Circular and repeat!</p>
    </div>
  )
}
