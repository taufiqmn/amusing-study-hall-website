'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import styles from './GaussianSolver.module.css'

// ── exact fraction ──
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
  num() { return this.n / this.d }
}
const f = (n: number) => new Fr(n)

type Step = { desc: string; m: string[][]; changed: number[]; pivot?: [number, number] }

function solve(matrix: number[][], mode: 'ref' | 'rref' = 'ref') {
  const rows = matrix.length, cols = matrix[0].length
  let M = matrix.map(r => r.map(f))
  const rev = Array(rows).fill(0)
  const lab = (row: number) => `R${row + 1}${"'".repeat(rev[row])}`
  const steps: Step[] = []
  const snap = (desc: string, changed: number[] = [], pivot?: [number, number]) =>
    steps.push({ desc, m: M.map(r => r.map(x => x.str())), changed, pivot })
  snap('Augmented form')

  let pr = 0
  const pivotCols: number[] = []
  for (let col = 0; col < cols - 1 && pr < rows; col++) {
    let sel = -1
    for (let r = pr; r < rows; r++) if (!M[r][col].isZero()) { sel = r; break }
    if (sel === -1) continue
    if (sel !== pr) {
      [M[pr], M[sel]] = [M[sel], M[pr]];[rev[pr], rev[sel]] = [rev[sel], rev[pr]]
      snap(`Swap ${lab(pr)} ↔ ${lab(sel)}`, [pr, sel], [pr, col])
    }
    for (let r = pr + 1; r < rows; r++) {
      if (M[r][col].isZero()) continue
      const factor = M[r][col].div(M[pr][col])
      const before = lab(r)
      M[r] = M[r].map((v, c) => v.sub(factor.mul(M[pr][c])))
      rev[r]++
      const fs = factor.str()
      const op = fs.startsWith('-') ? `+ (${fs.slice(1)})` : `− (${fs})`
      snap(`${lab(r)} = ${before} ${op}·${lab(pr)}`, [r], [pr, col])
    }
    pivotCols[pr] = col
    pr++
  }

  // Gauss-Jordan: continue to reduced row echelon form
  if (mode === 'rref') {
    for (let i = pr - 1; i >= 0; i--) {
      const col = pivotCols[i]
      if (!(M[i][col].n === M[i][col].d)) {
        const dv = M[i][col]; const before = lab(i)
        M[i] = M[i].map(v => v.div(dv)); rev[i]++
        snap(`${lab(i)} = ${before} ÷ (${dv.str()})`, [i], [i, col])
      }
      for (let r = i - 1; r >= 0; r--) {
        if (M[r][col].isZero()) continue
        const factor = M[r][col]; const before = lab(r)
        M[r] = M[r].map((v, c) => v.sub(factor.mul(M[i][c]))); rev[r]++
        const fs = factor.str(); const op = fs.startsWith('-') ? `+ (${fs.slice(1)})` : `− (${fs})`
        snap(`${lab(r)} = ${before} ${op}·${lab(i)}`, [r], [i, col])
      }
    }
  }

  let inconsistent = false, pivots = 0
  for (let r = 0; r < rows; r++) {
    const zc = M[r].slice(0, cols - 1).every(x => x.isZero())
    if (zc && !M[r][cols - 1].isZero()) inconsistent = true
    if (!zc) pivots++
  }
  const unknowns = cols - 1
  const names = ['x', 'y', 'z', 'w'].slice(0, unknowns)
  let verdict: string, kind: 'unique' | 'infinite' | 'inconsistent', solution: string[] | null = null, back: string[] = []

  if (inconsistent) {
    kind = 'inconsistent'
    verdict = 'No solution. A row reduces to 0 = (a non-zero number), which is impossible.'
  } else if (pivots < unknowns) {
    kind = 'infinite'
    verdict = `Infinitely many solutions. Rank is ${pivots}, but there are ${unknowns} unknowns — so ${unknowns - pivots} free variable(s). One variable can be anything; the others follow.`
  } else {
    kind = 'unique'
    if (mode === 'rref') {
      solution = names.map((_, i) => M[i][unknowns].str())
      back = names.map((n, i) => `${n} = ${solution![i]}`)
      verdict = `Unique solution, read straight off: ${names.map((n, i) => `${n} = ${solution![i]}`).join(',  ')}`
    } else {
      const x: Fr[] = Array(unknowns).fill(null)
      for (let r = unknowns - 1; r >= 0; r--) {
        let sum = M[r][unknowns]
        for (let c = r + 1; c < unknowns; c++) { sum = sum.sub(M[r][c].mul(x[c])); }
        x[r] = sum.div(M[r][r])
        back.push(`${names[r]} = ${x[r].str()}`)
      }
      back.reverse()
      solution = x.map(v => v.str())
      verdict = `Unique solution: ${names.map((n, i) => `${n} = ${solution![i]}`).join(',  ')}`
    }
  }
  return { steps, verdict, kind, solution, back, unknowns, names, M }
}

const PRESETS: Record<string, number[][]> = {
  'Unique (3×3)': [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]],
  'Infinite (3×3)': [[1, 1, 1, 6], [2, 2, 2, 12], [1, -1, 1, 2]],
  'Inconsistent (3×3)': [[1, 1, 1, 3], [2, 2, 2, 7], [1, 0, 1, 2]],
  '2×2': [[2, 1, 5], [1, -1, 1]],
  '4×4': [[1, 1, 1, 1, 10], [1, 2, 3, 4, 30], [1, 3, 6, 10, 65], [1, 4, 10, 20, 120]],
}

function parseCell(s: string): number | null {
  s = s.trim()
  if (s === '' || s === '-') return null
  if (/^-?\d+\/-?\d+$/.test(s)) { const [a, b] = s.split('/').map(Number); return b ? a / b : null }
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export default function GaussianSolver({ preset = 'Unique (3×3)', method = 'ref' }: { preset?: string; method?: 'ref' | 'rref' }) {
  const [size, setSize] = useState<[number, number]>([3, 4]) // rows, cols(=unknowns+1)
  const [cells, setCells] = useState<string[][]>(() =>
    (PRESETS[preset] || PRESETS['Unique (3×3)']).map(r => r.map(String)))
  const [shown, setShown] = useState(0)
  const [result, setResult] = useState<ReturnType<typeof solve> | null>(null)
  const [err, setErr] = useState('')
  const [freeVal, setFreeVal] = useState(0)
  const [freeVar, setFreeVar] = useState(0)
  const playRef = useRef<any>(null)

  const loadPreset = (name: string) => {
    const m = PRESETS[name]
    setCells(m.map(r => r.map(String)))
    setSize([m.length, m[0].length])
    setResult(null); setShown(0); setErr('')
  }

  const setDims = (r: number, unknowns: number) => {
    const c = unknowns + 1
    const next = Array.from({ length: r }, (_, i) =>
      Array.from({ length: c }, (_, j) => cells[i]?.[j] ?? '0'))
    setCells(next); setSize([r, c]); setResult(null); setShown(0)
  }

  const run = () => {
    setErr('')
    const nums: number[][] = []
    for (let i = 0; i < size[0]; i++) {
      const row: number[] = []
      for (let j = 0; j < size[1]; j++) {
        const v = parseCell(cells[i]?.[j] ?? '')
        if (v === null) { setErr(`Row ${i + 1}, column ${j + 1} isn't a number. Use integers or fractions like 3/2.`); return }
        row.push(v)
      }
      nums.push(row)
    }
    const r = solve(nums, method)
    setResult(r); setShown(1); setFreeVal(0); setFreeVar(Math.max(0, (size[1]-1)-1))
  }

  useEffect(() => () => clearInterval(playRef.current), [])
  const play = () => {
    clearInterval(playRef.current)
    if (!result) return
    playRef.current = setInterval(() => {
      setShown(s => { if (s >= result.steps.length) { clearInterval(playRef.current); return s } return s + 1 })
    }, 900)
  }

  const unknowns = size[1] - 1
  const names = ['x', 'y', 'z', 'w'].slice(0, unknowns)

  return (
    <div className={styles.wrap}>
      {/* presets */}
      <div className={styles.presets}>
        {Object.keys(PRESETS).map(p => (
          <button key={p} className={styles.presetBtn} onClick={() => loadPreset(p)}>{p}</button>
        ))}
      </div>

      {/* size */}
      <div className={styles.sizeRow}>
        <span>Equations:</span>
        {[2, 3, 4].map(n => (
          <button key={n} className={`${styles.sizeBtn} ${size[0] === n ? styles.sizeOn : ''}`}
            onClick={() => setDims(n, n)}>{n}</button>
        ))}
        <span className={styles.sizeHint}>type integers or fractions (e.g. 3/2)</span>
      </div>

      {/* input grid */}
      <div className={styles.inputGrid} style={{ gridTemplateColumns: `repeat(${size[1] - 1}, 1fr) 20px 1fr` }}>
        {cells.map((row, i) => row.map((c, j) => (
          <div key={`${i}-${j}`} style={{ gridColumn: j === size[1] - 1 ? `${size[1] + 1}` : `${j + 1}` }}>
            <input className={styles.cell} value={c}
              onChange={e => { const n = cells.map(r => [...r]); n[i][j] = e.target.value; setCells(n) }} />
          </div>
        )))}
        {Array.from({ length: size[0] }).map((_, i) => (
          <div key={`bar-${i}`} className={styles.bar} style={{ gridColumn: size[1], gridRow: i + 1 }}>│</div>
        ))}
      </div>

      <div className={styles.btnRow}>
        <button onClick={run} className={styles.solveBtn}>Solve step by step</button>
        {result && shown < result.steps.length && (
          <button onClick={() => setShown(s => s + 1)} className={styles.ghost}>Next step ▸</button>
        )}
        {result && <button onClick={play} className={styles.ghost}>▶ Auto-play</button>}
        {result && <button onClick={() => setShown(result.steps.length)} className={styles.ghost}>Show all</button>}
      </div>

      {err && <div className={styles.err}>⚠ {err}</div>}

      {/* steps */}
      {result && result.steps.slice(0, shown).map((st, i) => (
        <div key={i} className={styles.step}>
          <div className={styles.stepDesc}>
            <span className={styles.stepNum}>{i === 0 ? 'Start' : `Step ${i}`}</span>
            <span className={styles.op}>{st.desc}</span>
          </div>
          <Matrix rows={st.m} changed={st.changed} pivot={st.pivot} cols={size[1]} />
        </div>
      ))}

      {/* verdict + back-substitution */}
      {result && shown >= result.steps.length && (
        <div className={`${styles.verdict} ${styles[result.kind]}`}>
          <p className={styles.vTitle}>
            {result.kind === 'unique' ? '✅ Unique solution' :
             result.kind === 'infinite' ? '♾ Infinitely many solutions' :
             '✖ No solution'}
          </p>
          {result.kind === 'unique' && (
            <>
              <p className={styles.vSub}>Now read it bottom-up (back-substitution):</p>
              <div className={styles.backSub}>
                {result.back.map((b, i) => <span key={i} className={styles.solPill}>{b}</span>)}
              </div>
            </>
          )}
          <p className={styles.vText}>{result.verdict}</p>

          {/* free-variable slider for the infinite case */}
          {result.kind === 'infinite' && (
            <div className={styles.freeBox}>
              <p className={styles.freeLabel}>Choose which variable to treat as free:</p>
              <div className={styles.freePick}>
                {names.map((n, i) => (
                  <button key={n}
                    className={`${styles.freeBtn} ${freeVar === i ? styles.freeOn : ''}`}
                    onClick={() => setFreeVar(i)}>{n}</button>
                ))}
              </div>
              <p className={styles.freeLabel}>
                Now drag <b>{names[freeVar]}</b> and watch the others follow:
              </p>
              <input type="range" min={-5} max={5} step={1} value={freeVal}
                onChange={e => setFreeVal(Number(e.target.value))} className={styles.slider} />
              <FreeSolution M={result.M} unknowns={unknowns} names={names} free={freeVal} freeIdx={freeVar} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// stacked-bracket matrix — the thing that kept rendering broken
function Matrix({ rows, changed, pivot, cols }: { rows: string[][]; changed: number[]; pivot?: [number, number]; cols: number }) {
  return (
    <div className={styles.matrix}>
      <span className={styles.bracket} aria-hidden="true" />
      <div className={styles.mBody}>
        {rows.map((r, i) => (
          <div key={i} className={`${styles.mRow} ${changed.includes(i) ? styles.mChanged : ''}`}>
            {r.map((v, j) => (
              <span key={j}
                className={`${styles.mCell} ${j === cols - 1 ? styles.mAug : ''} ${pivot && pivot[0] === i && pivot[1] === j ? styles.mPivot : ''}`}>
                {v}
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className={styles.bracket} aria-hidden="true" />
    </div>
  )
}

// compute the particular solution when the last variable is free
function FreeSolution({ M, unknowns, names, free, freeIdx }: { M: Fr[][]; unknowns: number; names: string[]; free: number; freeIdx: number }) {
  const vals = useMemo(() => {
    const x: (Fr | null)[] = Array(unknowns).fill(null)
    x[freeIdx] = f(free)                              // chosen free variable
    // find pivot rows (non-zero coeff rows), back-substitute the rest
    const rows = M.length
    for (let r = rows - 1; r >= 0; r--) {
      // leading col of this row
      let lead = -1
      for (let c = 0; c < unknowns; c++) if (!M[r][c].isZero()) { lead = c; break }
      if (lead === -1 || lead === freeIdx) continue
      let sum = M[r][unknowns]
      for (let c = lead + 1; c < unknowns; c++) if (x[c]) sum = sum.sub(M[r][c].mul(x[c]!))
      x[lead] = sum.div(M[r][lead])
    }
    return x
  }, [M, unknowns, free, freeIdx])
  return (
    <div className={styles.backSub}>
      {names.map((n, i) => (
        <span key={i} className={styles.solPill}>{n} = {vals[i] ? vals[i]!.str() : '?'}</span>
      ))}
    </div>
  )
}
