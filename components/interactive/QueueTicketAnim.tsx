'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './StackPlayground.module.css'

// Auto-running ticket-counter animation. People (emoji + number) join at
// the REAR and are served at the FRONT — showing FIFO visually. Loops.

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function QueueTicketAnim() {
  const [people, setPeople] = useState<number[]>([])
  const [serving, setServing] = useState<number | null>(null)
  const [caption, setCaption] = useState('An empty counter. People will line up…')
  const alive = useRef(true)
  const visible = useRef(true)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    alive.current = true
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting }, { threshold: 0.2 })
    if (wrapRef.current) io.observe(wrapRef.current)
    const waitVisible = async () => { while (alive.current && !visible.current) await sleep(300) }

    const loop = async () => {
      while (alive.current) {
        setPeople([]); setServing(null)
        setCaption('An empty counter. People will line up…'); await sleep(1000)
        for (const n of [1, 2, 3]) {
          await waitVisible()
          setCaption(`🎫 Customer ${n} joins at the REAR (enqueue)`) 
          setPeople((p) => [...p, n]); await sleep(950)
        }
        setCaption('Three in line. Now the counter serves — FRONT first (FIFO).'); await sleep(1100)
        for (let i = 0; i < 3; i++) {
          await waitVisible()
          const first = await new Promise<number>((res) => setPeople((p) => { res(p[0]); return p }))
          setServing(first); setCaption(`🔔 Serving customer ${first} — the FIRST who arrived leaves FIRST`); await sleep(700)
          setPeople((p) => p.slice(1)); await sleep(600); setServing(null)
        }
        setCaption('Everyone served in arrival order. That is FIFO. ↻ replaying…'); await sleep(1600)
      }
    }
    loop()
    return () => { alive.current = false; io.disconnect() }
  }, [])

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <p className={styles.msg} style={{ marginTop: 0, marginBottom: 16, textAlign: 'center', fontWeight: 700 }}>{caption}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 30 }}>🏪</div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#4FC3A1' }}>COUNTER (front)</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', minHeight: 60 }}>
          {serving !== null && (
            <div style={{ textAlign: 'center', animation: 'none', opacity: 0.5 }}>
              <div style={{ fontSize: 26 }}>🚶</div>
              <div style={{ fontSize: 10, color: '#4FC3A1', fontWeight: 800 }}>#{serving} served</div>
            </div>
          )}
          {people.map((n, i) => (
            <div key={n} style={{ textAlign: 'center', transition: 'all 0.4s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: i === 0 ? '#4FC3A1' : 'var(--pill-bg)', border: `2px solid ${i === 0 ? '#4FC3A1' : i === people.length - 1 ? 'var(--gold, #f3cb4b)' : 'var(--card-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧍</div>
              <div style={{ fontSize: 10, fontWeight: 800, marginTop: 2 }}>#{n}</div>
              <div style={{ fontSize: 8.5, fontWeight: 800, color: i === 0 ? '#4FC3A1' : i === people.length - 1 ? 'var(--gold, #f3cb4b)' : 'transparent' }}>{i === 0 ? 'FRONT' : i === people.length - 1 ? 'REAR' : '·'}</div>
            </div>
          ))}
          {people.length === 0 && serving === null && <div style={{ fontSize: 12, opacity: 0.5, padding: '0 20px' }}>(empty line)</div>}
        </div>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--gold, #f3cb4b)', writingMode: 'vertical-rl' as any }}>← JOIN HERE (rear)</div>
      </div>
    </div>
  )
}
