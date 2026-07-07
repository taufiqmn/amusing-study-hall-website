'use client'

import { useState } from 'react'
import styles from './StackPlayground.module.css'

// TRUE circular queue — slots arranged on a RING. Enqueue/dequeue move
// front & rear around the circle with modulo wrap. Shows the exact
// full/empty conditions and the running C code.

const CODE = {
  enqueue: [
    'void enqueue(int x) {',
    '    if ((rear + 1) % N == front) {   // FULL',
    '        printf("Overflow!");',
    '        return;',
    '    }',
    '    if (front == -1) front = 0;      // first item',
    '    rear = (rear + 1) % N;           // wrap with %',
    '    queue[rear] = x;',
    '}',
  ],
  dequeue: [
    'int dequeue() {',
    '    if (front == -1) {               // EMPTY',
    '        printf("Underflow!");',
    '        return -1;',
    '    }',
    '    int x = queue[front];',
    '    if (front == rear)               // last item',
    '        front = rear = -1;           // reset to empty',
    '    else front = (front + 1) % N;    // wrap with %',
    '    return x;',
    '}',
  ],
}

export default function CircularQueueRing({ defaultSize = 6 }: { defaultSize?: number }) {
  const [N, setN] = useState(defaultSize)
  const [built, setBuilt] = useState(false)
  const [slots, setSlots] = useState<(number | null)[]>([])
  const [front, setFront] = useState(-1)
  const [rear, setRear] = useState(-1)
  const [next, setNext] = useState(10)
  const [op, setOp] = useState<'enqueue' | 'dequeue' | null>(null)
  const [line, setLine] = useState(-1)
  const [msg, setMsg] = useState('Set a size and press Build.')

  const build = () => {
    const n = Math.max(4, Math.min(8, N))
    setN(n); setSlots(Array(n).fill(null)); setFront(-1); setRear(-1); setNext(10); setBuilt(true)
    setOp(null); setLine(-1)
    setMsg(`Ring built: ${n} slots, front = rear = -1 (empty).`)
  }

  const count = front === -1 ? 0 : ((rear - front + N) % N) + 1
  const isFull = front !== -1 && (rear + 1) % N === front

  const enqueue = () => {
    setOp('enqueue')
    if (isFull) { setLine(1); setMsg('🚫 OVERFLOW! (rear + 1) % N == front — the ring is full.'); return }
    setLine(6)
    const nf = front === -1 ? 0 : front
    const nr = (rear + 1) % N
    const s = [...slots]; s[nr] = next; setSlots(s); setFront(nf); setRear(nr)
    setMsg(`enqueue(${next}): rear = (${rear} + 1) % ${N} = ${nr}${nr === 0 && rear === N - 1 ? ' ♻️ WRAPPED!' : ''}`)
    setNext(next + 5); setTimeout(() => setLine(-1), 900)
  }

  const dequeue = () => {
    setOp('dequeue')
    if (front === -1) { setLine(1); setMsg('🚫 UNDERFLOW! front == -1 — the ring is empty.'); return }
    const val = slots[front]
    const s = [...slots]; s[front] = null; setSlots(s)
    if (front === rear) { setLine(6); setFront(-1); setRear(-1); setMsg(`dequeue(): removed ${val}. front == rear → reset to EMPTY (-1).`) }
    else { setLine(8); const nf = (front + 1) % N; setFront(nf); setMsg(`dequeue(): removed ${val}. front = (${front} + 1) % ${N} = ${nf}${nf === 0 && front === N - 1 ? ' ♻️ WRAPPED!' : ''}`) }
    setTimeout(() => setLine(-1), 900)
  }

  // ring geometry
  const R = 95, cx = 120, cy = 120
  const codeLines = op ? CODE[op] : []

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <label className={styles.sizeLabel}>Ring size:<input type="number" min={4} max={8} value={N} onChange={(e) => setN(parseInt(e.target.value) || 4)} className={styles.sizeInput} /></label>
        <button onClick={build} className={styles.buildBtn}>{built ? '↻ Rebuild' : '🔨 Build'}</button>
      </div>

      {built && (
        <div className={styles.stage}>
          {/* the RING */}
          <div style={{ flex: 1, minWidth: 250, display: 'flex', justifyContent: 'center' }}>
            <svg width={240} height={240} viewBox="0 0 240 240">
              <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--card-border)" strokeWidth={2} strokeDasharray="4 4" />
              {slots.map((v, i) => {
                const ang = (i / N) * 2 * Math.PI - Math.PI / 2
                const x = cx + R * Math.cos(ang)
                const y = cy + R * Math.sin(ang)
                const isFront = i === front
                const isRear = i === rear
                const stroke = isFront ? '#4FC3A1' : isRear ? 'var(--gold, #f3cb4b)' : 'var(--card-border)'
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={20} fill={v !== null ? 'var(--pill-bg)' : 'var(--background)'} stroke={stroke} strokeWidth={isFront || isRear ? 3 : 1.5} />
                    <text x={x} y={y + 4} textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--foreground)">{v ?? ''}</text>
                    <text x={x} y={y - 26} textAnchor="middle" fontSize="8" fill="var(--foreground-muted)">[{i}]</text>
                    {isFront && <text x={x} y={y + 34} textAnchor="middle" fontSize="8" fontWeight="800" fill="#4FC3A1">FRONT</text>}
                    {isRear && <text x={x} y={y + (isFront ? 44 : 34)} textAnchor="middle" fontSize="8" fontWeight="800" fill="var(--gold, #f3cb4b)">REAR</text>}
                  </g>
                )
              })}
              <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--foreground)">{count}/{N}</text>
              <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="var(--foreground-muted)">{isFull ? 'FULL' : count === 0 ? 'EMPTY' : 'in use'}</text>
            </svg>
          </div>

          {/* code */}
          <div className={styles.codeCol}>
            <div className={styles.codeHead}>{op ? `${op}() running` : 'press Enqueue / Dequeue'}</div>
            <pre className={styles.code}>
              {codeLines.length === 0 ? <span className={styles.codeDim}>// code appears here as it runs</span> : codeLines.map((l, i) => (
                <div key={i} className={`${styles.codeLine} ${i === line ? styles.codeActive : ''}`}>{l || ' '}</div>
              ))}
            </pre>
          </div>
        </div>
      )}

      {built && (
        <div className={styles.opRow} style={{ justifyContent: 'center' }}>
          <button onClick={enqueue} className={styles.opBtn} style={{ background: '#4FC3A1' }}>+ Enqueue {next}</button>
          <button onClick={dequeue} className={styles.opBtn} style={{ background: '#e25c5c' }}>− Dequeue</button>
        </div>
      )}
      {built && <div className={styles.msg}>{msg}</div>}
      {built && <p style={{ fontSize: 11, opacity: 0.55, margin: '10px 0 0' }}>💡 Fill it up → OVERFLOW at (rear+1)%N==front. Empty it → UNDERFLOW at front==-1. Dequeue a few then enqueue → watch REAR wrap around the ring ♻️.</p>}
    </div>
  )
}
