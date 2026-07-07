'use client'

import { useRef, useState } from 'react'
import styles from './StackPlayground.module.css'

// Size-configurable stack with a HAND that drops a plate on push and
// lifts it on pop. The C code panel highlights the exact line running,
// so code and visual move together. Shows overflow / underflow, and the
// "ghost" plate that stays in memory after pop (top just moved down).

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const CODE = {
  push: [
    'void push(int stack[], int *top, int n, int x) {',
    '    if (*top == n - 1) {          // stack is FULL',
    '        printf("Overflow!");',
    '        return;',
    '    }',
    '    *top = *top + 1;              // move top up',
    '    stack[*top] = x;              // place value x here',
    '}',
  ],
  pop: [
    'int pop(int stack[], int *top) {',
    '    if (*top == -1) {             // stack is EMPTY',
    '        printf("Underflow!");',
    '        return -1;',
    '    }',
    '    int item = stack[*top];       // read top plate',
    '    *top = *top - 1;              // top moves down (plate "gone")',
    '    return item;',
    '}',
  ],
  peek: [
    'int peek(int stack[], int top) {',
    '    if (top == -1) return -1;     // empty',
    '    return stack[top];            // look, don\'t remove',
    '}',
  ],
}

export default function StackPlayground({ defaultSize = 5 }: { defaultSize?: number }) {
  const [size, setSize] = useState(defaultSize)
  const [built, setBuilt] = useState(false)
  const [stack, setStack] = useState<number[]>([])       // real values
  const [ghost, setGhost] = useState<number | null>(null) // last popped (still "in memory")
  const [top, setTop] = useState(-1)
  const [input, setInput] = useState(10)
  const [hand, setHand] = useState<{ val: number; y: number } | null>(null)
  const [op, setOp] = useState<'push' | 'pop' | 'peek' | null>(null)
  const [line, setLine] = useState(-1)
  const [msg, setMsg] = useState('Set a size and press Build to create your stack.')
  const [peekIdx, setPeekIdx] = useState(-1)
  const busy = useRef(false)

  const build = () => {
    const s = Math.max(2, Math.min(8, size))
    setSize(s)
    setStack([])
    setGhost(null)
    setTop(-1)
    setBuilt(true)
    setOp(null)
    setLine(-1)
    setPeekIdx(-1)
    setMsg(`Stack built: int stack[${s}], top = -1 (empty). Capacity ${s}.`)
  }

  const run = async (fn: () => Promise<void>) => {
    if (busy.current || !built) return
    busy.current = true
    await fn()
    setLine(-1)
    setOp(null)
    busy.current = false
  }

  const push = () =>
    run(async () => {
      setOp('push')
      setGhost(null)
      const x = input
      setLine(1)
      await sleep(650)
      if (top === size - 1) {
        setLine(2)
        setMsg(`🚫 OVERFLOW! top == ${size - 1} (n-1). The stack is full — can't push ${x}.`)
        await sleep(1200)
        return
      }
      // hand drops the plate
      setHand({ val: x, y: 0 })
      setMsg(`Pushing ${x}: the hand carries it in…`)
      await sleep(500)
      for (let y = 0; y <= 100; y += 20) { setHand({ val: x, y }); await sleep(60) }
      setLine(5)
      const newTop = top + 1
      setTop(newTop)
      setMsg(`top = top + 1 → top = ${newTop}`)
      await sleep(600)
      setLine(6)
      setStack((s) => [...s, x])
      setHand(null)
      setMsg(`stack[${newTop}] = ${x}. Plate placed on top! ✅`)
      setInput(x + 5)
      await sleep(700)
    })

  const pop = () =>
    run(async () => {
      setOp('pop')
      setLine(1)
      await sleep(600)
      if (top === -1) {
        setLine(2)
        setMsg('🚫 UNDERFLOW! top == -1 — the stack is empty, nothing to pop.')
        await sleep(1200)
        return
      }
      const val = stack[top]
      setLine(5)
      setMsg(`item = stack[${top}] = ${val} (reading the top plate)`)
      // hand lifts the plate
      for (let y = 100; y >= 0; y -= 20) { setHand({ val, y }); await sleep(60) }
      await sleep(300)
      setLine(6)
      const newTop = top - 1
      setTop(newTop)
      setStack((s) => s.slice(0, -1))
      setGhost(val) // stays visible faintly — still in memory!
      setHand(null)
      setMsg(`top = top - 1 → top = ${newTop}. Plate ${val} is "gone"… but look — it's still in memory (faded). We only moved top; the value isn't erased.`)
      await sleep(1600)
    })

  const peek = () =>
    run(async () => {
      setOp('peek')
      setLine(1)
      await sleep(400)
      if (top === -1) {
        setMsg('🚫 The stack is empty — nothing to peek.')
        await sleep(1000)
        return
      }
      setLine(2)
      setPeekIdx(top)
      setMsg(`👀 peek returns stack[${top}] = ${stack[top]} — we LOOK at the top plate but don't remove it.`)
      await sleep(1600)
      setPeekIdx(-1)
    })

  const slotHeight = 46
  let codeLines = op ? CODE[op] : []
  if (op === 'push') {
    // show the ACTUAL value the user typed, e.g. push(..., 25) and stack[*top] = 25
    codeLines = codeLines.map((l) =>
      l.includes('int x)') ? l.replace('int x)', `int x)   // called as push(.., ${input})`) :
      l.includes('= x;') ? l.replace('= x;', `= ${input};`) : l
    )
  }

  return (
    <div className={styles.wrap}>
      {/* size builder */}
      <div className={styles.controls}>
        <label className={styles.sizeLabel}>
          Stack size (n):
          <input type="number" min={2} max={8} value={size} onChange={(e) => setSize(parseInt(e.target.value) || 2)} className={styles.sizeInput} disabled={busy.current} />
        </label>
        <button onClick={build} className={styles.buildBtn} disabled={busy.current}>{built ? '↻ Rebuild' : '🔨 Build stack'}</button>
      </div>

      {built && (
        <div className={styles.stage}>
          {/* left: the visual stack + hand */}
          <div className={styles.visualCol}>
            <div className={styles.hand} style={{ opacity: hand ? 1 : 0, transform: `translateY(${hand ? hand.y : -20}px)` }} aria-hidden="true">
              ✋<div className={styles.handPlate}>{hand?.val}</div>
            </div>

            <div className={styles.container} style={{ height: size * slotHeight + 14 }}>
              {Array.from({ length: size }).map((_, i) => {
                const idx = size - 1 - i // render top-down
                const filled = idx <= top
                const isTop = idx === top
                const isPeek = idx === peekIdx
                const isGhost = idx === top + 1 && ghost !== null
                return (
                  <div key={idx} className={styles.slotRow}>
                    <div
                      className={`${styles.slot} ${filled ? styles.filled : ''} ${isTop ? styles.topSlot : ''} ${isPeek ? styles.peekSlot : ''} ${isGhost ? styles.ghostSlot : ''}`}
                    >
                      {filled ? stack[idx] : isGhost ? ghost : ''}
                    </div>
                    <span className={styles.idxLabel}>
                      [{idx}]{isTop && <b className={styles.topPtr}> ← top</b>}
                      {top === -1 && idx === 0 && <b className={styles.topPtr} style={{ opacity: 0.5 }}> top = -1 (empty)</b>}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* right: code panel with live line highlight */}
          <div className={styles.codeCol}>
            <div className={styles.codeHead}>
              {op ? `${op}() running…` : 'Press Push / Pop / Peek to run the code'}
            </div>
            <pre className={styles.code}>
              {codeLines.length === 0 ? (
                <span className={styles.codeDim}>// the matching C function will light up here,
// line by line, as it runs.</span>
              ) : (
                codeLines.map((l, i) => (
                  <div key={i} className={`${styles.codeLine} ${i === line ? styles.codeActive : ''}`}>{l || ' '}</div>
                ))
              )}
            </pre>
          </div>
        </div>
      )}

      {built && (
        <div className={styles.opRow}>
          <input type="number" value={input} onChange={(e) => setInput(parseInt(e.target.value) || 0)} className={styles.valInput} disabled={busy.current} />
          <button onClick={push} className={`${styles.opBtn} ${styles.pushBtn}`} disabled={busy.current}>⬇ Push</button>
          <button onClick={pop} className={`${styles.opBtn} ${styles.popBtn}`} disabled={busy.current}>⬆ Pop</button>
          <button onClick={peek} className={`${styles.opBtn} ${styles.peekBtn}`} disabled={busy.current}>👀 Peek</button>
        </div>
      )}

      {built && <div className={styles.msg}>{msg}</div>}
    </div>
  )
}
