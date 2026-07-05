'use client'

import { useRef, useState } from 'react'

type Step =
  | { t: 'cmp'; i: number; j: number }
  | { t: 'swap'; i: number; j: number }
  | { t: 'set'; i: number; v: number }
  | { t: 'done'; i: number }
  | { t: 'msg'; text: string }

function bubbleSteps(a: number[]): Step[] {
  const s: Step[] = []
  const arr = [...a]
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    s.push({ t: 'msg', text: `Pass ${i + 1}: bubble the largest of the unsorted part to the right` })
    for (let j = 0; j < n - 1 - i; j++) {
      s.push({ t: 'cmp', i: j, j: j + 1 })
      if (arr[j] > arr[j + 1]) {
        s.push({ t: 'swap', i: j, j: j + 1 })
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
    s.push({ t: 'done', i: n - 1 - i })
  }
  s.push({ t: 'done', i: 0 })
  return s
}

function selectionSteps(a: number[]): Step[] {
  const s: Step[] = []
  const arr = [...a]
  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    s.push({ t: 'msg', text: `Round ${i + 1}: scan the unsorted part, find the minimum, swap it into position ${i}` })
    let min = i
    for (let j = i + 1; j < n; j++) {
      s.push({ t: 'cmp', i: min, j })
      if (arr[j] < arr[min]) min = j
    }
    if (min !== i) {
      s.push({ t: 'swap', i, j: min })
      ;[arr[i], arr[min]] = [arr[min], arr[i]]
    }
    s.push({ t: 'done', i })
  }
  s.push({ t: 'done', i: n - 1 })
  return s
}

function insertionSteps(a: number[]): Step[] {
  const s: Step[] = []
  const arr = [...a]
  const n = arr.length
  s.push({ t: 'done', i: 0 })
  for (let i = 1; i < n; i++) {
    const key = arr[i]
    s.push({ t: 'msg', text: `Pick up ${key} (the first unsorted card) and slide it left into place` })
    let j = i - 1
    while (j >= 0 && arr[j] > key) {
      s.push({ t: 'cmp', i: j, j: j + 1 })
      s.push({ t: 'set', i: j + 1, v: arr[j] })
      arr[j + 1] = arr[j]
      j--
    }
    s.push({ t: 'set', i: j + 1, v: key })
    arr[j + 1] = key
    for (let k = 0; k <= i; k++) s.push({ t: 'done', i: k })
  }
  return s
}

const ALGOS = { bubble: bubbleSteps, selection: selectionSteps, insertion: insertionSteps } as const

export default function SortVisualizer() {
  const [values, setValues] = useState<number[]>([9, 6, 2, 12, 11, 9, 3])
  const [algo, setAlgo] = useState<keyof typeof ALGOS>('bubble')
  const [hl, setHl] = useState<Record<number, string>>({})
  const [sorted, setSorted] = useState<Record<number, boolean>>({})
  const [msg, setMsg] = useState('Press Play to watch the algorithm work, step by step.')
  const [stats, setStats] = useState({ cmp: 0, swap: 0 })
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(400)
  const stopRef = useRef(false)
  const speedRef = useRef(400)

  const shuffle = () => {
    if (playing) return
    const n = 7
    setValues(Array.from({ length: n }, () => 2 + Math.floor(Math.random() * 13)))
    setSorted({}); setHl({}); setStats({ cmp: 0, swap: 0 })
    setMsg('New random array — press Play!')
  }

  const play = async () => {
    if (playing) { stopRef.current = true; return }
    stopRef.current = false
    setPlaying(true)
    setSorted({}); setStats({ cmp: 0, swap: 0 })
    const steps = ALGOS[algo](values)
    const arr = [...values]
    const done: Record<number, boolean> = {}
    let cmp = 0, swp = 0
    for (const st of steps) {
      if (stopRef.current) break
      if (st.t === 'msg') { setMsg(st.text); setHl({}) }
      else if (st.t === 'cmp') { cmp++; setStats({ cmp, swap: swp }); setHl({ [st.i]: '#F3CB4B', [st.j]: '#F3CB4B' }); setMsg(`Compare ${arr[st.i]} and ${arr[st.j]}${arr[st.i] > arr[st.j] ? ' → out of order!' : ' → OK'}`) }
      else if (st.t === 'swap') { swp++; setStats({ cmp, swap: swp }); ;[arr[st.i], arr[st.j]] = [arr[st.j], arr[st.i]]; setValues([...arr]); setHl({ [st.i]: '#7c4dff', [st.j]: '#7c4dff' }); setMsg(`Swap!`) }
      else if (st.t === 'set') { arr[st.i] = st.v; setValues([...arr]); setHl({ [st.i]: '#7c4dff' }) }
      else if (st.t === 'done') { done[st.i] = true; setSorted({ ...done }) }
      await new Promise((r) => setTimeout(r, st.t === 'msg' ? speedRef.current * 1.6 : speedRef.current))
    }
    if (!stopRef.current) { setMsg(`✅ Sorted! ${cmp} comparisons, ${swp} swaps.`); setHl({}) }
    setPlaying(false)
  }

  const max = Math.max(...values, 1)

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 10px' }}>📊 Sorting Visualizer</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        {(Object.keys(ALGOS) as (keyof typeof ALGOS)[]).map((a) => (
          <button key={a} onClick={() => !playing && setAlgo(a)} style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--card-border)', background: algo === a ? 'var(--accent)' : 'var(--background)', color: algo === a ? 'white' : 'var(--foreground)', cursor: 'pointer', textTransform: 'capitalize' }}>
            {a}
          </button>
        ))}
        <button onClick={play} style={{ fontSize: 12, fontWeight: 700, padding: '7px 16px', borderRadius: 8, border: 'none', background: playing ? '#e25c5c' : '#4FC3A1', color: 'white', cursor: 'pointer' }}>
          {playing ? '■ Stop' : '▶ Play'}
        </button>
        <button onClick={shuffle} style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', cursor: 'pointer' }}>
          🎲 Shuffle
        </button>
        <label style={{ fontSize: 11, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 6 }}>
          Speed
          <input type="range" min={100} max={800} value={900 - speed} onChange={(e) => { const v = 900 - parseInt(e.target.value); setSpeed(v); speedRef.current = v }} />
        </label>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 130, marginBottom: 8 }}>
        {values.map((v, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: (v / max) * 100 + 10, borderRadius: '6px 6px 0 0', background: sorted[i] ? '#4FC3A1' : hl[i] || 'var(--accent)', opacity: sorted[i] ? 0.9 : hl[i] ? 1 : 0.55, transition: 'all 0.25s', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'white', paddingTop: 2 }}>{v}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 10, display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 12, margin: 0 }}>{msg}</p>
        <p style={{ fontSize: 11, margin: 0, opacity: 0.6, whiteSpace: 'nowrap' }}>🔍 {stats.cmp} compares · 🔁 {stats.swap} swaps</p>
      </div>
    </div>
  )
}
