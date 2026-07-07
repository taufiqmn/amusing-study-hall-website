'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './StackPlayground.module.css'

// Self-running INTRO animation. No buttons — it builds a stack and
// pushes/pops plates on a loop so the learner SEES LIFO before touching
// anything. Pauses when scrolled off-screen.

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const SIZE = 4

export default function StackAutoPlay() {
  const [stack, setStack] = useState<number[]>([])
  const [hand, setHand] = useState<{ val: number; y: number; dir: 'in' | 'out' } | null>(null)
  const [caption, setCaption] = useState('Watch: an empty stack is born…')
  const [ghost, setGhost] = useState<number | null>(null)
  const alive = useRef(true)
  const visible = useRef(true)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    alive.current = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting }, { threshold: 0.2 })
    if (wrapRef.current) io.observe(wrapRef.current)

    const waitVisible = async () => { while (alive.current && !visible.current) await sleep(300) }

    const push = async (v: number) => {
      await waitVisible()
      setCaption(`push(${v}) — a hand drops plate ${v} on TOP`)
      setGhost(null)
      setHand({ val: v, y: 0, dir: 'in' })
      for (let y = 0; y <= 100 && alive.current; y += 25) { setHand({ val: v, y, dir: 'in' }); await sleep(70) }
      setStack((s) => [...s, v]); setHand(null); await sleep(650)
    }
    const pop = async () => {
      await waitVisible()
      let popped = 0
      setStack((s) => { popped = s[s.length - 1]; return s })
      await sleep(10)
      setCaption('pop() — the TOP plate comes off first (LIFO!)')
      const cur = await new Promise<number[]>((res) => setStack((s) => { res(s); return s }))
      const v = cur[cur.length - 1]
      for (let y = 100; y >= 0 && alive.current; y -= 25) { setHand({ val: v, y, dir: 'out' }); await sleep(70) }
      setStack((s) => s.slice(0, -1)); setGhost(v); setHand(null); await sleep(650)
    }

    const loop = async () => {
      while (alive.current) {
        setStack([]); setGhost(null)
        setCaption('An empty stack: top = -1'); await sleep(900)
        await push(10); await push(20); await push(30)
        setCaption('Three plates in. Now watch them leave TOP-first…'); await sleep(900)
        await pop(); await pop(); await pop()
        setCaption('Empty again. That LIFO order is the whole idea. ↻ replaying…')
        await sleep(1500)
        if (reduce) { await sleep(4000) }
      }
    }
    loop()
    return () => { alive.current = false; io.disconnect() }
  }, [])

  const slotH = 44
  return (
    <div className={styles.wrap} ref={wrapRef}>
      <p className={styles.msg} style={{ marginTop: 0, marginBottom: 14, textAlign: 'center', fontWeight: 700 }}>{caption}</p>
      <div className={styles.visualCol} style={{ maxWidth: 240, margin: '0 auto' }}>
        <div className={styles.hand} style={{ opacity: hand ? 1 : 0, transform: `translateY(${hand ? hand.y : -20}px)` }} aria-hidden="true">
          ✋<div className={styles.handPlate}>{hand?.val}</div>
        </div>
        <div className={styles.container} style={{ height: SIZE * slotH + 14 }}>
          {Array.from({ length: SIZE }).map((_, i) => {
            const idx = SIZE - 1 - i
            const top = stack.length - 1
            const filled = idx <= top
            const isTop = idx === top
            const isGhost = idx === top + 1 && ghost !== null
            return (
              <div key={idx} className={styles.slotRow}>
                <div className={`${styles.slot} ${filled ? styles.filled : ''} ${isTop ? styles.topSlot : ''} ${isGhost ? styles.ghostSlot : ''}`}>
                  {filled ? stack[idx] : isGhost ? ghost : ''}
                </div>
                <span className={styles.idxLabel}>[{idx}]{isTop && <b className={styles.topPtr}> ← top</b>}{top === -1 && idx === 0 && <b className={styles.topPtr} style={{ opacity: 0.5 }}> top=-1</b>}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
