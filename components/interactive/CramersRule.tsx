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

// ── determinant EXPANSION tree — the "how" behind a det() value ──
// 2x2 is a direct formula (ad-bc). 3x3+ expands along row 1 into minors,
// each minor recursively expanded the same way, down to the 2x2 base case.
type DetNode = {
  value: Fr
  text: string
  terms?: { coef: string; sign: 1 | -1; minor: string[][]; sub: DetNode }[]
}
function detExpand(M: Fr[][]): DetNode {
  const n = M.length
  if (n === 1) return { value: M[0][0], text: `det = ${M[0][0].str()}` }
  if (n === 2) {
    const [[a, b], [c, d]] = M
    const ad = a.mul(d), bc = b.mul(c), val = ad.sub(bc)
    return { value: val, text: `det = (${a.str()}×${d.str()}) − (${b.str()}×${c.str()}) = ${ad.str()} − ${bc.str()} = ${val.str()}` }
  }
  const terms: DetNode['terms'] = []
  let sum = f(0)
  for (let c = 0; c < n; c++) {
    const minor = M.slice(1).map(row => row.filter((_, j) => j !== c))
    const sign: 1 | -1 = c % 2 === 0 ? 1 : -1
    const sub = detExpand(minor)
    const term = M[0][c].mul(sub.value).mul(f(sign))
    sum = sum.add(term)
    terms!.push({ coef: M[0][c].str(), sign, minor: minor.map(r => r.map(x => x.str())), sub })
  }
  const formula = terms!.map((t, i) =>
    (i === 0 ? (t.sign < 0 ? '−' : '') : (t.sign < 0 ? ' − ' : ' + ')) + `${t.coef}·det(minor${i + 1})`
  ).join('')
  return { value: sum, text: `det = ${formula} = ${sum.str()}`, terms }
}

type MatPart = { label: string; rows: string[][]; highlightCol?: number; op?: never } | { op: string; label?: never; rows?: never }
type Step = {
  kind: 'setup' | 'detA' | 'detAi' | 'xi'
  label: string
  matrix?: string[][]
  parts?: MatPart[]
  value?: string
  highlightCol?: number
  detNode?: DetNode   // present on detA / detAi steps — the expansion, hidden until asked for
}

function solve(A: number[][], B: number[]) {
  const n = A.length
  const Af = A.map(r => r.map(f)), Bf = B.map(f)
  const steps: Step[] = []
  const names = ['x', 'y', 'z', 'w'].slice(0, n)

  // Setup: show A, X (symbolic column), and B side by side — not A alone.
  const Astr = Af.map(r => r.map(x => x.str()))
  const Xstr = names.map(nm => [nm])
  const Bstr = Bf.map(x => [x.str()])
  steps.push({
    kind: 'setup',
    label: 'Write the system as AX = B',
    parts: [
      { label: 'A', rows: Astr },
      { op: '·' },
      { label: 'X', rows: Xstr },
      { op: '=' },
      { label: 'B', rows: Bstr },
    ],
  })

  const detANode = detExpand(Af)
  const detA = detANode.value
  steps.push({ kind: 'detA', label: `det(A) = ${detA.str()}`, matrix: Astr, value: detA.str(), detNode: detANode })

  if (detA.isZero()) {
    return { steps, verdict: `det(A) = 0 — Cramer's Rule does not apply here (no unique solution).`, solution: null, names }
  }

  const solution: string[] = []
  for (let i = 0; i < n; i++) {
    const Ai = Af.map((row, r) => row.map((v, c) => (c === i ? Bf[r] : v)))
    const detAiNode = detExpand(Ai)
    const detAi = detAiNode.value
    const xi = detAi.div(detA)
    steps.push({
      kind: 'detAi',
      label: `Replace column ${i + 1} of A with B → A${i + 1}, then det(A${i + 1}) = ${detAi.str()}`,
      matrix: Ai.map(r => r.map(x => x.str())),
      value: detAi.str(),
      highlightCol: i,
      detNode: detAiNode,
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

// ── renders one determinant's expansion tree — matrices with real brackets,
//    recursing into minors until the 2x2 base case ──
function DetExpansionView({ node, depth = 0 }: { node: DetNode; depth?: number }) {
  return (
    <div className={own.detNode} style={{ marginLeft: depth ? 14 : 0 }}>
      <p className={own.detLine}>{node.text}</p>
      {node.terms && (
        <div className={own.detTerms}>
          {node.terms.map((t, i) => (
            <div key={i} className={own.detTerm}>
              <p className={own.detTermLabel}>
                {t.sign < 0 ? '−' : '+'} {t.coef} × det(minor{i + 1})
              </p>
              <div className={styles.matrix}>
                <span className={styles.bracket} aria-hidden="true" />
                <div className={styles.mBody}>
                  {t.minor.map((row, r) => (
                    <div key={r} className={styles.mRow}>
                      {row.map((v, c) => <span key={c} className={styles.mCell}>{v}</span>)}
                    </div>
                  ))}
                </div>
                <span className={styles.bracket} aria-hidden="true" />
              </div>
              <DetExpansionView node={t.sub} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
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
  const [openDet, setOpenDet] = useState<Set<number>>(new Set())  // which step indices have "show determinant steps" open
  const playRef = useRef<any>(null)

  const load = (n: number, mat: number[][], vec: number[]) => {
    setSize(n); setA(mat.map(r => r.map(String))); setB(vec.map(String))
    setResult(null); setShown(0); setErr(''); setOpenDet(new Set())
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
    setResult(r); setShown(1); setOpenDet(new Set())
  }

  const play = () => {
    clearInterval(playRef.current)
    if (!result) return
    playRef.current = setInterval(() => {
      setShown(s => { if (s >= result.steps.length) { clearInterval(playRef.current); return s } return s + 1 })
    }, 1100)
  }

  const toggleDet = (i: number) => {
    setOpenDet(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i); else next.add(i)
      return next
    })
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
          {st.parts ? (
            <div className={own.partsRow}>
              {st.parts.map((p: any, pi: number) => p.op ? (
                <span key={pi} className={own.partsOp}>{p.op}</span>
              ) : (
                <div key={pi} className={own.partsItem}>
                  <p className={own.partsLabel}>{p.label}</p>
                  <div className={styles.matrix}>
                    <span className={styles.bracket} aria-hidden="true" />
                    <div className={styles.mBody}>
                      {p.rows.map((row: string[], r: number) => (
                        <div key={r} className={styles.mRow}>
                          {row.map((v: string, c: number) => <span key={c} className={styles.mCell}>{v}</span>)}
                        </div>
                      ))}
                    </div>
                    <span className={styles.bracket} aria-hidden="true" />
                  </div>
                </div>
              ))}
            </div>
          ) : st.matrix && (
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

          {/* per-determinant "show determinant steps" — collapsed by default */}
          {st.detNode && (
            <div className={own.detToggleWrap}>
              <button className={own.detToggleBtn} onClick={() => toggleDet(i)}>
                {openDet.has(i) ? '▾ Hide determinant steps' : '▸ Show determinant steps'}
              </button>
              {openDet.has(i) && (
                <div className={own.detPanel}>
                  <DetExpansionView node={st.detNode} />
                </div>
              )}
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
