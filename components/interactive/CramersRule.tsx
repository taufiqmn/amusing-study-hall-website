'use client'

import { useState, useRef } from 'react'
import styles from './GaussianSolver.module.css'   // reuse the verified matrix/bracket CSS
import own from './CramersRule.module.css'

// ── exact fraction (same verified engine as GaussianSolver) ──
class Fr {
  n: number; d: number
  constructor(n: number, d = 1) {
    if (d < 0) { n = -n; d = -d }
    const g = Fr.gcd(Math.abs(n), Math.abs(d)) || 1
    this.n = n / g; this.d = d / g
  }
  static gcd(a: number, b: number): number { while (b) { [a, b] = [b, a % b] } return a }
  add(o: Fr) { return new Fr(this.n * o.d + o.n * this.d, this.d * o.d) }
  sub(o: Fr) { return new Fr(this.n * o.d - o.n * this.d, this.d * o.d) }
  mul(o: Fr) { return new Fr(this.n * o.n, this.d * o.d) }
  div(o: Fr) { return new Fr(this.n * o.d, this.d * o.n) }
  isZero() { return this.n === 0 }
  str() { return this.d === 1 ? `${this.n}` : `${this.n}/${this.d}` }
}
const f = (n: number) => new Fr(n)

function det(M: Fr[][]): Fr {
  const n = M.length
  if (n === 1) return M[0][0]
  if (n === 2) return M[0][0].mul(M[1][1]).sub(M[0][1].mul(M[1][0]))
  let sum = f(0)
  for (let c = 0; c < n; c++) {
    const minor = M.slice(1).map(row => row.filter((_, j) => j !== c))
    const cof = det(minor).mul(f(c % 2 === 0 ? 1 : -1))
    sum = sum.add(M[0][c].mul(cof))
  }
  return sum
}

type Step = { kind: 'setup' | 'detA' | 'detAi' | 'xi'; label: string; matrix?: string[][]; value?: string; highlightCol?: number }

function solve(A: number[][], B: number[]) {
  const n = A.length
  const Af = A.map(r => r.map(f)), Bf = B.map(f)
  const steps: Step[] = []
  const names = ['x', 'y', 'z', 'w'].slice(0, n)

  steps.push({ kind: 'setup', label: 'Write the system as AX = B', matrix: Af.map(r => r.map(x => x.str())) })

  const detA = det(Af)
  steps.push({ kind: 'detA', label: `det(A) = ${detA.str()}`, matrix: Af.map(r => r.map(x => x.str())), value: detA.str() })

  if (detA.isZero()) {
    return { steps, verdict: `det(A) = 0 — Cramer's Rule does not apply here (no unique solution).`, solution: null, names }
  }

  const solution: string[] = []
  for (let i = 0; i < n; i++) {
    const Ai = Af.map((row, r) => row.map((v, c) => (c === i ? Bf[r] : v)))
    const detAi = det(Ai)
    const xi = detAi.div(detA)
    steps.push({
      kind: 'detAi',
      label: `Replace column ${i + 1} of A with B → A${i + 1}, then det(A${i + 1}) = ${detAi.str()}`,
      matrix: Ai.map(r => r.map(x => x.str())),
      value: detAi.str(),
      highlightCol: i,
    })
    steps.push({
      kind: 'xi',
      label: `${names[i]} = det(A${i + 1}) / det(A) = ${detAi.str()} / ${detA.str()} = ${xi.str()}`,
      value: xi.str(),
    })
    solution.push(xi.str())
  }
  return { steps, verdict: 'unique', solution, names }
}

const PRESETS: Record<number, { label: string; A: number[][]; B: number[] }[]> = {
  2: [{ label: 'Recommended', A: [[2, 1], [1, -1]], B: [5, 1] }],
  3: [{ label: 'Recommended', A: [[2, 1, -1], [-3, -1, 2], [-2, 1, 2]], B: [8, -11, -3] }],
  4: [{ label: 'Recommended', A: [[1, 1, 1, 1], [1, 2, 3, 4], [1, 3, 6, 10], [1, 4, 10, 20]], B: [10, 30, 65, 120] }],
}

function randomSystem(n: number): { A: number[][]; B: number[] } {
  for (let attempt = 0; attempt < 30; attempt++) {
    const A = Array.from({ length: n }, () => Array.from({ length: n }, () => Math.floor(Math.random() * 9) - 4))
    const Af = A.map(r => r.map(f))
    if (det(Af).isZero()) continue
    const x = Array.from({ length: n }, () => Math.floor(Math.random() * 7) - 3)
    const B = A.map(row => row.reduce((s, c, j) => s + c * x[j], 0))
    return { A, B }
  }
  return PRESETS[n][0]
}

function parseCell(s: string): number | null {
  s = s.trim()
  if (s === '' || s === '-') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export default function CramersRule({
  initialA, initialB, lockControls = false,
}: { initialA?: number[][]; initialB?: number[]; lockControls?: boolean } = {}) {
  const initSize = initialA ? initialA.length : 3
  const [size, setSize] = useState(initSize)
  const [A, setA] = useState<string[][]>(() => (initialA ?? PRESETS[3][0].A).map(r => r.map(String)))
  const [B, setB] = useState<string[]>(() => (initialB ?? PRESETS[3][0].B).map(String))
  const [result, setResult] = useState<ReturnType<typeof solve> | null>(null)
  const [shown, setShown] = useState(0)
  const [err, setErr] = useState('')
  const playRef = useRef<any>(null)

  const load = (n: number, mat: number[][], vec: number[]) => {
    setSize(n); setA(mat.map(r => r.map(String))); setB(vec.map(String))
    setResult(null); setShown(0); setErr('')
  }
  const pickSize = (n: number) => load(n, PRESETS[n][0].A, PRESETS[n][0].B)
  const randomize = () => { const { A: a, B: b } = randomSystem(size); load(size, a, b) }

  const start = () => {
    setErr('')
    const nums: number[][] = []
    for (let i = 0; i < size; i++) {
      const row: number[] = []
      for (let j = 0; j < size; j++) {
        const v = parseCell(A[i]?.[j] ?? '')
        if (v === null) { setErr(`Row ${i + 1}, column ${j + 1} of A isn't a number.`); return }
        row.push(v)
      }
      nums.push(row)
    }
    const bvals: number[] = []
    for (let i = 0; i < size; i++) {
      const v = parseCell(B[i] ?? '')
      if (v === null) { setErr(`B, row ${i + 1} isn't a number.`); return }
      bvals.push(v)
    }
    const r = solve(nums, bvals)
    setResult(r); setShown(1)
  }

  const play = () => {
    clearInterval(playRef.current)
    if (!result) return
    playRef.current = setInterval(() => {
      setShown(s => { if (s >= result.steps.length) { clearInterval(playRef.current); return s } return s + 1 })
    }, 1100)
  }

  return (
    <div className={styles.wrap}>
      {/* size */}
      {!lockControls && (
        <div className={styles.sizeRow}>
          <span>Size:</span>
          {[2, 3, 4].map(n => (
            <button key={n} className={`${styles.sizeBtn} ${size === n ? styles.sizeOn : ''}`} onClick={() => pickSize(n)}>{n}×{n}</button>
          ))}
          <button className={own.recBtn} onClick={() => pickSize(size)}>⭐ Recommended</button>
          <button className={own.recBtn} onClick={randomize}>🎲 Random</button>
        </div>
      )}

      {/* AX = B input */}
      <div className={own.axbRow}>
        <div className={own.aGrid} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {A.map((row, i) => row.map((c, j) => (
            <input key={`${i}-${j}`} className={styles.cell} value={c}
              onChange={e => { const n = A.map(r => [...r]); n[i][j] = e.target.value; setA(n) }} />
          )))}
        </div>
        <span className={own.xLabel}>X</span>
        <span className={own.eq}>=</span>
        <div className={own.bGrid}>
          {B.map((v, i) => (
            <input key={i} className={styles.cell} value={v}
              onChange={e => { const n = [...B]; n[i] = e.target.value; setB(n) }} />
          ))}
        </div>
      </div>

      <div className={styles.btnRow}>
        <button onClick={start} className={styles.solveBtn}>▶ Start</button>
        {result && shown < result.steps.length && <button onClick={() => setShown(s => s + 1)} className={styles.ghost}>Next line ▸</button>}
        {result && <button onClick={play} className={styles.ghost}>▶ Auto-play</button>}
        {result && <button onClick={() => setShown(result.steps.length)} className={styles.ghost}>Show all</button>}
      </div>

      {err && <div className={styles.err}>⚠ {err}</div>}

      {result && result.steps.slice(0, shown).map((st, i) => (
        <div key={i} className={styles.step}>
          <div className={styles.stepDesc}><span className={styles.op}>{st.label}</span></div>
          {st.matrix && (
            <div className={styles.matrix}>
              <span className={styles.bracket} aria-hidden="true" />
              <div className={styles.mBody}>
                {st.matrix.map((row, r) => (
                  <div key={r} className={styles.mRow}>
                    {row.map((v, c) => (
                      <span key={c} className={`${styles.mCell} ${st.highlightCol === c ? own.colHi : ''}`}>{v}</span>
                    ))}
                  </div>
                ))}
              </div>
              <span className={styles.bracket} aria-hidden="true" />
            </div>
          )}
        </div>
      ))}

      {result && shown >= result.steps.length && (
        <div className={`${styles.verdict} ${result.solution ? styles.unique : styles.inconsistent}`}>
          {result.solution ? (
            <>
              <p className={styles.vTitle}>✅ Solution</p>
              <div className={styles.backSub}>
                {result.names!.map((n, i) => <span key={n} className={styles.solPill}>{n} = {result.solution![i]}</span>)}
              </div>
            </>
          ) : (
            <p className={styles.vText}>{result.verdict}</p>
          )}
        </div>
      )}
    </div>
  )
}
