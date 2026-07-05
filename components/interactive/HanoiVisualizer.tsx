'use client'

import { useRef, useState } from 'react'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const DISK_COLORS = ['#e25c5c', '#F3CB4B', '#4FC3A1', '#7c4dff', '#00b8d4', '#ff8a65']

function solve(n: number, from: number, aux: number, to: number, moves: [number, number][]) {
  if (n === 0) return
  solve(n - 1, from, to, aux, moves)
  moves.push([from, to])
  solve(n - 1, aux, from, to, moves)
}

export default function HanoiVisualizer() {
  const [n, setN] = useState(3)
  const [pegs, setPegs] = useState<number[][]>([[3, 2, 1], [], []])
  const [count, setCount] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [msg, setMsg] = useState('Move all disks from A to C. Rule: never put a bigger disk on a smaller one!')
  const stopRef = useRef(false)

  const reset = (disks: number) => {
    stopRef.current = true
    setN(disks)
    setPegs([Array.from({ length: disks }, (_, i) => disks - i), [], []])
    setCount(0)
    setPlaying(false)
    setMsg(`${disks} disks → minimum moves = 2^${disks} − 1 = ${2 ** disks - 1}`)
  }

  const play = async () => {
    if (playing) { stopRef.current = true; setPlaying(false); return }
    stopRef.current = false
    setPlaying(true)
    const p: number[][] = [Array.from({ length: n }, (_, i) => n - i), [], []]
    setPegs(p.map((x) => [...x]))
    setCount(0)
    const moves: [number, number][] = []
    solve(n, 0, 1, 2, moves)
    const names = ['A', 'B', 'C']
    let c = 0
    for (const [from, to] of moves) {
      if (stopRef.current) break
      const disk = p[from].pop()!
      p[to].push(disk)
      c++
      setPegs(p.map((x) => [...x]))
      setCount(c)
      setMsg(`Move #${c}: disk ${disk} from ${names[from]} → ${names[to]}`)
      await sleep(Math.max(220, 900 - n * 110))
    }
    if (!stopRef.current) setMsg(`🎉 Solved in ${c} moves — exactly 2^${n} − 1! (With 64 disks, the priests need ~585 billion years…)`)
    setPlaying(false)
  }

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 10px' }}>🗼 Tower of Hanoi</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
        {[3, 4, 5, 6].map((d) => (
          <button key={d} onClick={() => reset(d)} style={{ fontSize: 12, fontWeight: 700, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--card-border)', background: n === d ? 'var(--accent)' : 'var(--background)', color: n === d ? 'white' : 'var(--foreground)', cursor: 'pointer' }}>
            {d} disks
          </button>
        ))}
        <button onClick={play} style={{ fontSize: 12, fontWeight: 700, padding: '7px 18px', borderRadius: 8, border: 'none', background: playing ? '#e25c5c' : '#4FC3A1', color: 'white', cursor: 'pointer' }}>
          {playing ? '■ Stop' : '▶ Auto-solve'}
        </button>
        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)' }}>Moves: {count} / {2 ** n - 1}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: 150, marginBottom: 4 }}>
        {pegs.map((peg, pi) => (
          <div key={pi} style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', width: '30%', position: 'relative', height: '100%', justifyContent: 'flex-start' }}>
            <div style={{ position: 'absolute', bottom: 0, width: 6, height: '85%', background: 'var(--card-border)', borderRadius: 3 }} />
            {peg.map((disk, di) => (
              <div key={di} style={{ width: `${28 + disk * (60 / n)}%`, height: 18, borderRadius: 9, background: DISK_COLORS[disk - 1], margin: '2px 0', zIndex: 1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: 'white' }}>
                {disk}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 12 }}>
        {['A (start)', 'B (helper)', 'C (goal)'].map((l) => (
          <p key={l} style={{ fontSize: 11, fontWeight: 800, opacity: 0.6, margin: 0, width: '30%', textAlign: 'center' }}>{l}</p>
        ))}
      </div>

      <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 10 }}>
        <p style={{ fontSize: 12, margin: 0, lineHeight: 1.6 }}>{msg}</p>
      </div>
    </div>
  )
}
