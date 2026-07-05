'use client'

import { useRef, useState } from 'react'

// "When you declare an array, boxes appear" — exactly that.
// Declare → boxes with indexes. Insert/Delete → watch elements shift
// one by one, following the same algorithm from the lecture.

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const COLORS = { active: '#F3CB4B', shift: '#7c4dff', ok: '#4FC3A1', del: '#e25c5c' }

export default function ArrayVisualizer() {
  const [cells, setCells] = useState<(number | null)[]>([])
  const [highlight, setHighlight] = useState<Record<number, string>>({})
  const [log, setLog] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [declareInput, setDeclareInput] = useState('10, 20, 30, 40, 50')
  const [valInput, setValInput] = useState('15')
  const [posInput, setPosInput] = useState('3')
  const busyRef = useRef(false)

  const say = (msg: string) => setLog((l) => [...l.slice(-5), msg])

  const declare = () => {
    const vals = declareInput.split(',').map((s) => parseInt(s.trim())).filter((n) => !isNaN(n)).slice(0, 10)
    if (vals.length === 0) return
    setCells(vals)
    setHighlight({})
    setLog([`✅ Declared: int LA[${vals.length}] — ${vals.length} boxes created in memory, indexes 0 to ${vals.length - 1}`])
  }

  const run = async (fn: () => Promise<void>) => {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(true)
    await fn()
    setHighlight({})
    busyRef.current = false
    setBusy(false)
  }

  const insert = () =>
    run(async () => {
      const item = parseInt(valInput)
      let k = parseInt(posInput)
      if (isNaN(item) || isNaN(k)) return
      const n = cells.length
      if (n >= 10) { say('⚠ Array is full (max 10 here) — overflow!'); return }
      k = Math.max(0, Math.min(k, n))
      say(`Insert ${item} at index ${k}: first make room by shifting right →`)
      const a: (number | null)[] = [...cells, null]
      setCells([...a])
      for (let j = n - 1; j >= k; j--) {
        setHighlight({ [j]: COLORS.shift, [j + 1]: COLORS.shift })
        say(`LA[${j + 1}] = LA[${j}]   (moving ${a[j]} right)`)
        await sleep(750)
        a[j + 1] = a[j]
        a[j] = null
        setCells([...a])
        await sleep(350)
      }
      setHighlight({ [k]: COLORS.active })
      say(`LA[${k}] = ${item}   (place the new item)`)
      await sleep(700)
      a[k] = item
      setCells([...a])
      setHighlight({ [k]: COLORS.ok })
      say(`✅ Done! N becomes ${n + 1}. Notice: inserting needed ${n - k} shifts.`)
      await sleep(900)
    })

  const remove = () =>
    run(async () => {
      let k = parseInt(posInput)
      const n = cells.length
      if (isNaN(k) || n === 0) return
      k = Math.max(0, Math.min(k, n - 1))
      setHighlight({ [k]: COLORS.del })
      say(`Delete index ${k} (value ${cells[k]}): shift everything after it left ←`)
      await sleep(800)
      const a = [...cells]
      for (let j = k; j < n - 1; j++) {
        setHighlight({ [j]: COLORS.shift, [j + 1]: COLORS.shift })
        say(`LA[${j}] = LA[${j + 1}]   (moving ${a[j + 1]} left)`)
        await sleep(700)
        a[j] = a[j + 1]
        setCells([...a])
        await sleep(300)
      }
      a.pop()
      setCells([...a])
      say(`✅ Done! N becomes ${n - 1}. Deleting needed ${n - 1 - k} shifts.`)
      await sleep(900)
    })

  const traverse = () =>
    run(async () => {
      say('Traversing: visit every element exactly once, left to right')
      let sum = 0
      for (let i = 0; i < cells.length; i++) {
        setHighlight({ [i]: COLORS.active })
        sum += cells[i] || 0
        say(`Visit LA[${i}] = ${cells[i]}   (running sum = ${sum})`)
        await sleep(650)
      }
      say(`✅ Traversal complete — sum of all elements = ${sum}`)
      await sleep(800)
    })

  const reverse = () =>
    run(async () => {
      const a = [...cells]
      say('Reversing: swap ends, move inward (two-pointer)')
      let i = 0, j = a.length - 1
      while (i < j) {
        setHighlight({ [i]: COLORS.active, [j]: COLORS.active })
        say(`swap(LA[${i}], LA[${j}])  →  ${a[i]} ↔ ${a[j]}`)
        await sleep(800)
        const t = a[i]; a[i] = a[j]; a[j] = t
        setCells([...a])
        i++; j--
        await sleep(300)
      }
      say('✅ Reversed!')
      await sleep(700)
    })

  const btn = (label: string, onClick: () => void, disabled = false) => (
    <button onClick={onClick} disabled={disabled || busy} style={{ fontSize: 12, fontWeight: 700, padding: '8px 14px', borderRadius: 8, border: 'none', cursor: disabled || busy ? 'not-allowed' : 'pointer', background: 'var(--accent)', color: 'white', opacity: disabled || busy ? 0.5 : 1 }}>
      {label}
    </button>
  )

  const inp = (value: string, set: (v: string) => void, width: number, placeholder: string) => (
    <input value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} style={{ width, fontSize: 12, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }} />
  )

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 10px' }}>🧪 Array Playground</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
        {inp(declareInput, setDeclareInput, 170, 'e.g. 10, 20, 30')}
        {btn('Declare array', declare)}
      </div>

      {cells.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            {cells.map((v, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, fontSize: 15, fontWeight: 800, border: `2px solid ${highlight[i] || 'var(--card-border)'}`, background: highlight[i] ? `${highlight[i]}22` : 'var(--background)', transition: 'all 0.3s', color: 'var(--foreground)' }}>
                  {v === null ? '' : v}
                </div>
                <p style={{ fontSize: 10, opacity: 0.55, margin: '4px 0 0', fontWeight: 700 }}>[{i}]</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, opacity: 0.55, margin: '0 0 12px' }}>N = {cells.length} · each box is one memory slot · index starts at 0</p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
            {inp(valInput, setValInput, 60, 'value')}
            {inp(posInput, setPosInput, 60, 'index')}
            {btn('Insert at index', insert)}
            {btn('Delete at index', remove)}
            {btn('Traverse (sum)', traverse)}
            {btn('Reverse', reverse)}
          </div>
        </>
      )}

      <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 10, minHeight: 44 }}>
        {log.length === 0 ? (
          <p style={{ fontSize: 12, opacity: 0.5, margin: 0 }}>👆 Declare an array to create the boxes, then try the operations.</p>
        ) : (
          log.map((l, i) => <p key={i} style={{ fontSize: 12, margin: '2px 0', fontFamily: 'monospace', opacity: i === log.length - 1 ? 1 : 0.55 }}>{l}</p>)
        )}
      </div>
    </div>
  )
}
