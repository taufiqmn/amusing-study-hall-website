'use client'

import { useState } from 'react'
import styles from './StackPlayground.module.css'

// Circular Queue lab: build your own size, toggle Linear vs Circular,
// enqueue/dequeue with FRONT & REAR pointers, wrap-around, and every
// overflow / underflow case explained live.

export default function CircularQueueLab({ defaultSize = 5 }: { defaultSize?: number }) {
  const [size, setSize] = useState(defaultSize)
  const [built, setBuilt] = useState(false)
  const [mode, setMode] = useState<'linear' | 'circular'>('circular')
  const [slots, setSlots] = useState<(number | null)[]>([])
  const [front, setFront] = useState(-1)
  const [rear, setRear] = useState(-1)
  const [next, setNext] = useState(10)
  const [msg, setMsg] = useState('Set a size and press Build.')
  const [flash, setFlash] = useState<number | null>(null)

  const build = () => {
    const n = Math.max(3, Math.min(8, size))
    setSize(n); setSlots(Array(n).fill(null)); setFront(-1); setRear(-1); setNext(10); setBuilt(true)
    setMsg(`${mode === 'circular' ? 'Circular' : 'Linear'} queue built: size ${n}, front = rear = -1 (empty).`)
  }

  const count = () => {
    if (front === -1) return 0
    if (mode === 'circular') return ((rear - front + size) % size) + 1
    return rear - front + 1
  }

  const enqueue = () => {
    const v = next
    if (mode === 'linear') {
      if (rear === size - 1) {
        const free = slots.filter((s) => s === null).length
        setMsg(`🚫 OVERFLOW! rear == ${size - 1} (last slot). ${free > 0 ? `Yet ${free} slot(s) at the front are FREE and wasted — this is exactly why we need a CIRCULAR queue!` : 'Queue truly full.'}`)
        return
      }
      const r = rear + 1
      const s = [...slots]; s[r] = v; setSlots(s); setRear(r); if (front === -1) setFront(0)
      setFlash(r); setTimeout(() => setFlash(null), 500)
      setMsg(`ENQUEUE ${v}: rear = rear + 1 → ${r}, queue[${r}] = ${v}`)
    } else {
      if (front !== -1 && (rear + 1) % size === front) { setMsg('🚫 OVERFLOW! (rear + 1) % size == front — every slot occupied.'); return }
      let r: number
      if (front === -1) { setFront(0); r = 0 }
      else r = (rear + 1) % size
      const s = [...slots]; s[r] = v; setSlots(s); setRear(r)
      setFlash(r); setTimeout(() => setFlash(null), 500)
      setMsg(`ENQUEUE ${v}: rear = (rear + 1) %% size → ${r}${r === 0 && rear === size - 1 ? ' ♻️ WRAPPED to 0!' : ''}, queue[${r}] = ${v}`)
    }
    setNext(v + 5)
  }

  const dequeue = () => {
    if (front === -1) { setMsg('🚫 UNDERFLOW! front == -1 — queue is empty, nothing to remove.'); return }
    const item = slots[front]
    const s = [...slots]; s[front] = null; setSlots(s)
    if (front === rear) { setFront(-1); setRear(-1); setMsg(`DEQUEUE: removed ${item}. front == rear → queue now EMPTY, reset both to -1.`) }
    else if (mode === 'circular') { const nf = (front + 1) % size; setFront(nf); setMsg(`DEQUEUE: removed ${item}. front = (front + 1) %% size → ${nf}${nf === 0 && front === size - 1 ? ' ♻️ WRAPPED!' : ''}`) }
    else { setFront(front + 1); setMsg(`DEQUEUE: removed ${item} from FRONT. front = front + 1 → ${front + 1}`) }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <label className={styles.sizeLabel}>Size:<input type="number" min={3} max={8} value={size} onChange={(e) => setSize(parseInt(e.target.value) || 3)} className={styles.sizeInput} /></label>
        <button onClick={build} className={styles.buildBtn}>{built ? '↻ Rebuild' : '🔨 Build'}</button>
        {built && (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => { setMode('linear'); setTimeout(build, 0) }} className={styles.opBtn} style={{ background: mode === 'linear' ? 'var(--accent)' : 'var(--card-border)', color: mode === 'linear' ? 'white' : 'var(--foreground)' }}>Linear</button>
            <button onClick={() => { setMode('circular'); setTimeout(build, 0) }} className={styles.opBtn} style={{ background: mode === 'circular' ? 'var(--accent)' : 'var(--card-border)', color: mode === 'circular' ? 'white' : 'var(--foreground)' }}>♻️ Circular</button>
          </div>
        )}
      </div>

      {built && (
        <>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, justifyContent: 'center' }}>
            {slots.map((v, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 9.5, fontWeight: 800, color: '#4FC3A1', margin: '0 0 3px', minHeight: 12 }}>{i === front ? 'FRONT' : ''}</p>
                <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, fontSize: 14, fontWeight: 800, border: `2px solid ${i === front ? '#4FC3A1' : i === rear ? 'var(--gold, #f3cb4b)' : 'var(--card-border)'}`, background: flash === i ? 'var(--gold, #f3cb4b)' : v !== null ? 'var(--pill-bg)' : 'var(--background)', color: 'var(--foreground)', transition: 'all 0.3s' }}>{v ?? ''}</div>
                <p style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--gold, #f3cb4b)', margin: '3px 0 0', minHeight: 12 }}>{i === rear ? 'REAR' : ''}</p>
                <p style={{ fontSize: 9.5, opacity: 0.5, margin: 0 }}>[{i}]</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, opacity: 0.6, textAlign: 'center', margin: '0 0 12px' }}>count = {count()} / {size}</p>

          <div className={styles.opRow} style={{ justifyContent: 'center' }}>
            <button onClick={enqueue} className={styles.opBtn} style={{ background: '#4FC3A1' }}>+ Enqueue {next}</button>
            <button onClick={dequeue} className={styles.opBtn} style={{ background: '#e25c5c' }}>− Dequeue</button>
          </div>
        </>
      )}

      {built && <div className={styles.msg}>{msg}</div>}
      {built && <p style={{ fontSize: 11, opacity: 0.55, margin: '10px 0 0' }}>💡 Try in Linear mode: enqueue until full, dequeue a few, enqueue again → overflow with free slots wasted. Switch to Circular and repeat → watch REAR wrap ♻️.</p>}
    </div>
  )
}
