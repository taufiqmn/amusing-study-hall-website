'use client'

import { useRef, useState } from 'react'
import styles from './StackPlayground.module.css'

// Single-operation teaching demo. Set op="push" | "pop" | "peek".
// Shows ONLY that operation's button + its C code, animating together.
// side="left" puts code left / visual right; "right" flips it.

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const CODE: Record<string, string[]> = {
  push: [
    'void push(int x) {',
    '    if (top == n - 1) {      // FULL',
    '        printf("Overflow!");',
    '        return;',
    '    }',
    '    top = top + 1;           // move up',
    '    stack[top] = x;          // place',
    '}',
  ],
  pop: [
    'int pop() {',
    '    if (top == -1) {         // EMPTY',
    '        printf("Underflow!");',
    '        return -1;',
    '    }',
    '    int item = stack[top];   // read',
    '    top = top - 1;           // move down',
    '    return item;             // value stays in memory!',
    '}',
  ],
  peek: [
    'int peek() {',
    '    if (top == -1) return -1;// empty',
    '    return stack[top];       // look only',
    '}',
  ],
}

const LABEL: Record<string, string> = { push: '⬇ Push', pop: '⬆ Pop', peek: '👀 Peek' }
const COLOR: Record<string, string> = { push: '#4FC3A1', pop: '#e25c5c', peek: 'var(--gold, #f3cb4b)' }

export default function StackOpDemo({
  op = 'push',
  side = 'left',
  size = 4,
  preset = [],
}: {
  op?: 'push' | 'pop' | 'peek'
  side?: 'left' | 'right'
  size?: number
  preset?: number[]
}) {
  const [stack, setStack] = useState<number[]>(preset.slice(0, size))
  const [ghost, setGhost] = useState<number | null>(null)
  const [top, setTop] = useState(preset.length ? Math.min(preset.length, size) - 1 : -1)
  const [line, setLine] = useState(-1)
  const [hand, setHand] = useState<{ val: number; y: number } | null>(null)
  const [peekIdx, setPeekIdx] = useState(-1)
  const [input, setInput] = useState(preset.length ? Math.max(...preset) + 5 : 10)
  const [msg, setMsg] = useState(`Press ${LABEL[op]} to run this operation step by step.`)
  const busy = useRef(false)

  const reset = () => {
    setStack(preset.slice(0, size))
    setTop(preset.length ? Math.min(preset.length, size) - 1 : -1)
    setGhost(null); setLine(-1); setPeekIdx(-1)
    setMsg('Reset. Try again!')
  }

  const runPush = () => run(async () => {
    setGhost(null); setLine(1); await sleep(600)
    if (top === size - 1) { setLine(2); setMsg(`🚫 OVERFLOW! top == ${size - 1} (n-1). Stack is full.`); await sleep(1400); return }
    setHand({ val: input, y: 0 }); setMsg(`Pushing ${input}…`); await sleep(400)
    for (let y = 0; y <= 100; y += 25) { setHand({ val: input, y }); await sleep(70) }
    setLine(5); const nt = top + 1; setTop(nt); setMsg(`top = top + 1 → ${nt}`); await sleep(600)
    setLine(6); setStack((s) => [...s, input]); setHand(null); setMsg(`stack[${nt}] = ${input} — placed! ✅`); setInput(input + 5); await sleep(700)
  })

  const runPop = () => run(async () => {
    setLine(1); await sleep(600)
    if (top === -1) { setLine(2); setMsg('🚫 UNDERFLOW! top == -1 — empty, nothing to pop.'); await sleep(1400); return }
    const v = stack[top]; setLine(5); setMsg(`item = stack[${top}] = ${v}`)
    for (let y = 100; y >= 0; y -= 25) { setHand({ val: v, y }); await sleep(70) }
    await sleep(250); setLine(6); const nt = top - 1; setTop(nt); setStack((s) => s.slice(0, -1)); setGhost(v); setHand(null)
    setMsg(`top = top - 1 → ${nt}. Plate ${v} looks gone… but the red ghost shows it's still in memory — we only moved top.`); await sleep(1700)
  })

  const runPeek = () => run(async () => {
    setLine(1); await sleep(400)
    if (top === -1) { setMsg('🚫 Empty — nothing to peek.'); await sleep(1000); return }
    setLine(2); setPeekIdx(top); setMsg(`👀 returns stack[${top}] = ${stack[top]} — look, don't remove.`); await sleep(1600); setPeekIdx(-1)
  })

  const run = async (fn: () => Promise<void>) => {
    if (busy.current) return
    busy.current = true
    await fn()
    setLine(-1)
    busy.current = false
  }
  const trigger = op === 'push' ? runPush : op === 'pop' ? runPop : runPeek

  const slotH = 44
  const codeBlock = (
    <div className={styles.codeCol} style={{ flex: 1 }}>
      <div className={styles.codeHead}>{op}() — watch the line light up</div>
      <pre className={styles.code}>
        {CODE[op].map((l, i) => (
          <div key={i} className={`${styles.codeLine} ${i === line ? styles.codeActive : ''}`}>{l || ' '}</div>
        ))}
      </pre>
    </div>
  )
  const visualBlock = (
    <div className={styles.visualCol} style={{ flex: 1 }}>
      <div className={styles.hand} style={{ opacity: hand ? 1 : 0, transform: `translateY(${hand ? hand.y : -20}px)` }} aria-hidden="true">
        ✋<div className={styles.handPlate}>{hand?.val}</div>
      </div>
      <div className={styles.container} style={{ height: size * slotH + 14 }}>
        {Array.from({ length: size }).map((_, i) => {
          const idx = size - 1 - i
          const filled = idx <= top
          const isTop = idx === top
          const isPeek = idx === peekIdx
          const isGhost = idx === top + 1 && ghost !== null
          return (
            <div key={idx} className={styles.slotRow}>
              <div className={`${styles.slot} ${filled ? styles.filled : ''} ${isTop ? styles.topSlot : ''} ${isPeek ? styles.peekSlot : ''} ${isGhost ? styles.ghostSlot : ''}`}>
                {filled ? stack[idx] : isGhost ? ghost : ''}
              </div>
              <span className={styles.idxLabel}>[{idx}]{isTop && <b className={styles.topPtr}> ← top</b>}{top === -1 && idx === 0 && <b className={styles.topPtr} style={{ opacity: 0.5 }}> top=-1</b>}</span>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        {side === 'left' ? <>{codeBlock}{visualBlock}</> : <>{visualBlock}{codeBlock}</>}
      </div>
      <div className={styles.opRow}>
        {op === 'push' && <input type="number" value={input} onChange={(e) => setInput(parseInt(e.target.value) || 0)} className={styles.valInput} disabled={busy.current} />}
        <button onClick={trigger} className={styles.opBtn} style={{ background: COLOR[op] }} disabled={busy.current}>{LABEL[op]}</button>
        <button onClick={reset} className={styles.opBtn} style={{ background: 'var(--card-border)', color: 'var(--foreground)' }} disabled={busy.current}>↻ Reset</button>
      </div>
      <div className={styles.msg}>{msg}</div>
    </div>
  )
}
