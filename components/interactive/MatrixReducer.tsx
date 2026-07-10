'use client'

import { useMemo, useState } from 'react'
import styles from './StackPlayground.module.css'

// Matrix row-reduction engine. Pure FRACTION arithmetic (never decimals).
// Reduces a user-entered augmented matrix to Row Echelon (Gaussian) or
// Reduced Row Echelon (Gauss-Jordan), recording each step as a fresh
// matrix copy + the row operation label (e.g. R2 = R2 - 2R1) so students
// can compare before/after and take notes.

// ---------- fraction helpers ----------
type Fr = { n: number; d: number }
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))
const fr = (n: number, d = 1): Fr => {
  if (d === 0) d = 1
  if (d < 0) { n = -n; d = -d }
  const g = gcd(n, d) || 1
  return { n: n / g, d: d / g }
}
const add = (a: Fr, b: Fr) => fr(a.n * b.d + b.n * a.d, a.d * b.d)
const sub = (a: Fr, b: Fr) => fr(a.n * b.d - b.n * a.d, a.d * b.d)
const mul = (a: Fr, b: Fr) => fr(a.n * b.n, a.d * b.d)
const div = (a: Fr, b: Fr) => fr(a.n * b.d, a.d * b.n)
const isZero = (a: Fr) => a.n === 0
const frStr = (a: Fr) => (a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`)

type Step = { matrix: Fr[][]; label: string; note: string; pivot?: [number, number] }

function reduce(rows: number, cols: number, data: Fr[][], full: boolean): Step[] {
  const M = data.map((r) => r.map((c) => ({ ...c })))
  const steps: Step[] = [{ matrix: M.map((r) => r.map((c) => ({ ...c }))), label: 'Original', note: 'The augmented matrix we start from.' }]
  const snap = (label: string, note: string, pivot?: [number, number]) =>
    steps.push({ matrix: M.map((r) => r.map((c) => ({ ...c }))), label, note, pivot })

  let pivotRow = 0
  const varCols = cols - 1
  for (let col = 0; col < varCols && pivotRow < rows; col++) {
    // find a pivot in this column at or below pivotRow
    let sel = -1
    for (let r = pivotRow; r < rows; r++) if (!isZero(M[r][col])) { sel = r; break }
    if (sel === -1) continue // no pivot in this column, move on

    if (sel !== pivotRow) {
      ;[M[sel], M[pivotRow]] = [M[pivotRow], M[sel]]
      snap(`R${pivotRow + 1} ↔ R${sel + 1}`, `Swap to bring a non-zero pivot into position (row ${pivotRow + 1}, col ${col + 1}).`, [pivotRow, col])
    }

    // eliminate BELOW the pivot (echelon)
    for (let r = pivotRow + 1; r < rows; r++) {
      if (isZero(M[r][col])) continue
      const factor = div(M[r][col], M[pivotRow][col]) // R_r = R_r - factor * R_pivot
      for (let c = 0; c < cols; c++) M[r][c] = sub(M[r][c], mul(factor, M[pivotRow][c]))
      const fs = frStr(factor)
      snap(`R${r + 1} = R${r + 1} − (${fs})R${pivotRow + 1}`, `Make the entry under the pivot zero.`, [pivotRow, col])
    }
    pivotRow++
  }

  if (full) {
    // normalize each pivot to 1, then eliminate ABOVE
    // find pivots again
    const pivots: [number, number][] = []
    let pr = 0
    for (let col = 0; col < varCols && pr < rows; col++) {
      if (!isZero(M[pr][col])) { pivots.push([pr, col]); pr++ }
    }
    for (const [r, col] of pivots) {
      if (!isZero(M[r][col]) && !(M[r][col].n === 1 && M[r][col].d === 1)) {
        const p = { ...M[r][col] }
        for (let c = 0; c < cols; c++) M[r][c] = div(M[r][c], p)
        snap(`R${r + 1} = R${r + 1} ÷ (${frStr(p)})`, `Scale the pivot to 1.`, [r, col])
      }
    }
    for (let i = pivots.length - 1; i >= 0; i--) {
      const [r, col] = pivots[i]
      for (let rr = r - 1; rr >= 0; rr--) {
        if (isZero(M[rr][col])) continue
        const factor = div(M[rr][col], M[r][col])
        for (let c = 0; c < cols; c++) M[rr][c] = sub(M[rr][c], mul(factor, M[r][c]))
        snap(`R${rr + 1} = R${rr + 1} − (${frStr(factor)})R${r + 1}`, `Clear the entry ABOVE the pivot (reduced form).`, [r, col])
      }
    }
  }

  snap(full ? 'Reduced Row Echelon Form ✓' : 'Row Echelon Form ✓', full ? 'Every pivot is 1 with zeros above and below.' : 'Zeros below every pivot, pivots step to the right.')
  return steps
}

function backSolve(M: Fr[][], rows: number, cols: number): string[] {
  // assumes echelon; solve bottom-up
  const varCols = cols - 1
  const x: (Fr | null)[] = Array(varCols).fill(null)
  const names = varCols === 3 ? ['x', 'y', 'z'] : Array.from({ length: varCols }, (_, i) => `x${i + 1}`)
  const lines: string[] = []
  for (let r = rows - 1; r >= 0; r--) {
    let lead = -1
    for (let c = 0; c < varCols; c++) if (!isZero(M[r][c])) { lead = c; break }
    if (lead === -1) continue
    let rhs = { ...M[r][varCols] }
    for (let c = lead + 1; c < varCols; c++) if (!isZero(M[r][c]) && x[c]) rhs = sub(rhs, mul(M[r][c], x[c]!))
    const val = div(rhs, M[r][lead])
    x[lead] = val
    lines.push(`${names[lead]} = ${frStr(val)}`)
  }
  return lines.reverse()
}

const PRESETS: Record<string, { r: number; c: number; data: number[][] }> = {
  '3×3 system': { r: 3, c: 4, data: [[1, 1, 1, 6], [0, 2, 5, -4], [2, 5, -1, 27]] },
  '2×2 system': { r: 2, c: 3, data: [[2, 1, 5], [1, -1, 1]] },
  'needs swap': { r: 3, c: 4, data: [[0, 1, 1, 4], [1, 2, 1, 8], [2, 7, 9, 3]] },
}

export default function MatrixReducer({ mode: initMode = 'echelon' }: { mode?: 'echelon' | 'reduced' }) {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(4)
  const [mode, setMode] = useState<'echelon' | 'reduced'>(initMode)
  const [grid, setGrid] = useState<string[][]>(PRESETS['3×3 system'].data.map((r) => r.map(String)))
  const [steps, setSteps] = useState<Step[] | null>(null)
  const [shown, setShown] = useState(1)
  const [solution, setSolution] = useState<string[]>([])
  const [error, setError] = useState('')

  const resize = (r: number, c: number) => {
    setRows(r); setCols(c)
    setGrid((g) => Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => g[i]?.[j] ?? '0')))
    setSteps(null)
  }

  const loadPreset = (name: string) => {
    const p = PRESETS[name]
    setRows(p.r); setCols(p.c)
    setGrid(p.data.map((r) => r.map(String)))
    setSteps(null)
  }

  const run = () => {
    setError('')
    try {
      const data: Fr[][] = grid.map((r) => r.map((v) => {
        const t = v.trim()
        if (t.includes('/')) { const [a, b] = t.split('/'); return fr(parseInt(a), parseInt(b)) }
        return fr(parseInt(t || '0'))
      }))
      const s = reduce(rows, cols, data, mode === 'reduced')
      setSteps(s); setShown(1)
      const last = s[s.length - 1].matrix
      setSolution(backSolve(last, rows, cols))
    } catch { setError('Check your entries — use integers or fractions like 3/2.') }
  }

  const setCell = (i: number, j: number, v: string) => setGrid((g) => g.map((r, ri) => ri === i ? r.map((c, ci) => ci === j ? v : c) : r))

  const MatrixView = ({ m, pivot, dim }: { m: Fr[][]; pivot?: [number, number]; dim?: boolean }) => (
    <div style={{ display: 'inline-block', border: '2px solid var(--card-border)', borderRadius: 8, padding: '6px 4px', opacity: dim ? 0.5 : 1 }}>
      {m.map((row, i) => (
        <div key={i} style={{ display: 'flex' }}>
          {row.map((c, j) => (
            <span key={j} style={{
              minWidth: 42, textAlign: 'center', padding: '4px 8px', fontFamily: 'monospace', fontSize: 13, fontWeight: 700,
              borderLeft: j === cols - 1 ? '2px solid var(--card-border)' : 'none',
              background: pivot && pivot[0] === i && pivot[1] === j ? 'var(--gold, #f3cb4b)' : 'transparent',
              color: pivot && pivot[0] === i && pivot[1] === j ? '#402a02' : 'var(--foreground)',
              borderRadius: 4,
            }}>{frStr(c)}</span>
          ))}
        </div>
      ))}
    </div>
  )

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <label className={styles.sizeLabel}>Rows:<input type="number" min={2} max={5} value={rows} onChange={(e) => resize(parseInt(e.target.value) || 2, cols)} className={styles.sizeInput} /></label>
        <label className={styles.sizeLabel}>Cols:<input type="number" min={2} max={6} value={cols} onChange={(e) => resize(rows, parseInt(e.target.value) || 2)} className={styles.sizeInput} /></label>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setMode('echelon')} className={styles.opBtn} style={{ background: mode === 'echelon' ? 'var(--accent)' : 'var(--card-border)', color: mode === 'echelon' ? 'white' : 'var(--foreground)' }}>Echelon</button>
          <button onClick={() => setMode('reduced')} className={styles.opBtn} style={{ background: mode === 'reduced' ? 'var(--accent)' : 'var(--card-border)', color: mode === 'reduced' ? 'white' : 'var(--foreground)' }}>Reduced (G-J)</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {Object.keys(PRESETS).map((p) => (
          <button key={p} onClick={() => loadPreset(p)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', cursor: 'pointer' }}>{p}</button>
        ))}
      </div>

      {/* input grid */}
      <div style={{ display: 'inline-block', marginBottom: 10 }}>
        {grid.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            {row.map((c, j) => (
              <input key={j} value={c} onChange={(e) => setCell(i, j, e.target.value)}
                style={{ width: 46, textAlign: 'center', padding: '6px 4px', fontFamily: 'monospace', fontSize: 13, borderRadius: 6, border: `1.5px solid ${j === cols - 1 ? 'var(--accent)' : 'var(--card-border)'}`, background: 'var(--background)', color: 'var(--foreground)' }} />
            ))}
          </div>
        ))}
        <p style={{ fontSize: 10.5, opacity: 0.55, margin: '2px 0 0' }}>last column (blue) = right-hand side · fractions like 3/2 allowed</p>
      </div>

      <div className={styles.opRow}>
        <button onClick={run} className={styles.buildBtn}>⚙️ Reduce step by step</button>
        {steps && <button onClick={() => setShown((s) => Math.min(s + 1, steps.length))} className={styles.opBtn} style={{ background: '#4FC3A1' }} disabled={shown >= steps.length}>▶ Next step</button>}
        {steps && <button onClick={() => setShown(steps.length)} className={styles.opBtn} style={{ background: 'var(--card-border)', color: 'var(--foreground)' }}>Show all</button>}
      </div>

      {error && <div className={styles.msg} style={{ color: '#e25c5c' }}>{error}</div>}

      {steps && (
        <div style={{ marginTop: 14 }}>
          {steps.slice(0, shown).map((st, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', padding: '10px 0', borderTop: i > 0 ? '1px dashed var(--card-border)' : 'none' }}>
              {i > 0 && <div style={{ fontSize: 20, opacity: 0.4 }}>↓</div>}
              <MatrixView m={st.matrix} pivot={st.pivot} />
              <div style={{ flex: 1, minWidth: 160 }}>
                <p style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent)', margin: '0 0 3px' }}>{st.label}</p>
                <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>{st.note}</p>
              </div>
            </div>
          ))}

          {shown >= steps.length && solution.length > 0 && (
            <div style={{ marginTop: 12, background: 'var(--background)', border: '1px solid #4FC3A1', borderRadius: 10, padding: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#4FC3A1', margin: '0 0 6px' }}>✅ Solution (by back-substitution)</p>
              {solution.map((l, i) => <p key={i} style={{ fontSize: 15, fontFamily: 'monospace', fontWeight: 700, margin: '2px 0' }}>{l}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
