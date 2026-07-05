'use client'

import { useRef, useState } from 'react'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const DATA = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

export default function SearchVisualizer() {
  const [target, setTarget] = useState('60')
  const [hl, setHl] = useState<Record<number, string>>({})
  const [labels, setLabels] = useState<Record<number, string>>({})
  const [log, setLog] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const busyRef = useRef(false)

  const say = (m: string) => setLog((l) => [...l.slice(-4), m])

  const run = async (fn: () => Promise<void>) => {
    if (busyRef.current) return
    busyRef.current = true; setBusy(true)
    setLog([]); setHl({}); setLabels({})
    await fn()
    busyRef.current = false; setBusy(false)
  }

  const linear = () =>
    run(async () => {
      const item = parseInt(target)
      say(`Linear search for ${item}: check boxes one by one, left → right`)
      await sleep(700)
      for (let k = 0; k < DATA.length; k++) {
        setHl({ [k]: '#F3CB4B' })
        say(`Step ${k + 1}: DATA[${k}] = ${DATA[k]} — ${DATA[k] === item ? 'MATCH! ✅' : 'not it, move on'}`)
        await sleep(600)
        if (DATA[k] === item) {
          setHl({ [k]: '#4FC3A1' })
          say(`✅ Found at index ${k} after ${k + 1} comparisons.`)
          return
        }
      }
      setHl({})
      say(`❌ Not found — checked all ${DATA.length} elements. That's the worst case: C(n) = n.`)
    })

  const binary = () =>
    run(async () => {
      const item = parseInt(target)
      let beg = 0, end = DATA.length - 1, steps = 0
      say(`Binary search for ${item}: the array is SORTED, so cut the range in half each time`)
      await sleep(800)
      while (beg <= end) {
        const mid = Math.floor((beg + end) / 2)
        steps++
        const h: Record<number, string> = {}
        for (let i = beg; i <= end; i++) h[i] = 'rgba(124,77,255,0.25)'
        h[mid] = '#F3CB4B'
        setHl(h)
        setLabels({ [beg]: 'BEG', [end]: end === beg ? 'BEG END' : 'END', [mid]: mid === beg || mid === end ? (labels[mid] || '') + ' MID' : 'MID' })
        setLabels({ [beg]: 'BEG', [mid]: 'MID', [end]: 'END' })
        say(`Step ${steps}: MID = (${beg}+${end})/2 = ${mid} → DATA[${mid}] = ${DATA[mid]}`)
        await sleep(1000)
        if (DATA[mid] === item) {
          setHl({ [mid]: '#4FC3A1' }); setLabels({})
          say(`✅ Found at index ${mid} in only ${steps} steps (linear could take up to ${DATA.length}).`)
          return
        } else if (item > DATA[mid]) {
          say(`${item} > ${DATA[mid]} → throw away the LEFT half. BEG = MID + 1`)
          beg = mid + 1
        } else {
          say(`${item} < ${DATA[mid]} → throw away the RIGHT half. END = MID − 1`)
          end = mid - 1
        }
        await sleep(800)
      }
      setHl({}); setLabels({})
      say(`❌ Not found — BEG passed END, so ${item} can't be in the array. Only ${steps} steps!`)
    })

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 10px' }}>🔍 Search Race: Linear vs Binary</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        <input value={target} onChange={(e) => setTarget(e.target.value)} style={{ width: 70, fontSize: 12, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }} />
        <button onClick={linear} disabled={busy} style={{ fontSize: 12, fontWeight: 700, padding: '8px 14px', borderRadius: 8, border: 'none', background: '#F3CB4B', color: '#1a1530', cursor: 'pointer', opacity: busy ? 0.5 : 1 }}>🐢 Linear search</button>
        <button onClick={binary} disabled={busy} style={{ fontSize: 12, fontWeight: 700, padding: '8px 14px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer', opacity: busy ? 0.5 : 1 }}>🐇 Binary search</button>
        <span style={{ fontSize: 11, opacity: 0.55 }}>try 60, 100, or 35 (not in the array)</span>
      </div>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
        {DATA.map((v, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, fontSize: 13, fontWeight: 800, border: `2px solid ${typeof hl[i] === 'string' && hl[i].startsWith('#') ? hl[i] : 'var(--card-border)'}`, background: hl[i] ? (hl[i].startsWith('#') ? hl[i] + '33' : hl[i]) : 'var(--background)', transition: 'all 0.3s', color: 'var(--foreground)' }}>
              {v}
            </div>
            <p style={{ fontSize: 9.5, margin: '3px 0 0', fontWeight: 800, color: 'var(--accent)', minHeight: 12 }}>{labels[i] || ''}</p>
            <p style={{ fontSize: 9.5, opacity: 0.5, margin: 0 }}>[{i}]</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 10, minHeight: 40 }}>
        {log.length === 0 ? (
          <p style={{ fontSize: 12, opacity: 0.5, margin: 0 }}>Type a number and race the two algorithms. The array is sorted — binary search's requirement!</p>
        ) : (
          log.map((l, i) => <p key={i} style={{ fontSize: 12, margin: '2px 0', fontFamily: 'monospace', opacity: i === log.length - 1 ? 1 : 0.55 }}>{l}</p>)
        )}
      </div>
    </div>
  )
}
