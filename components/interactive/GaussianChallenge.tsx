'use client'
import { useState } from 'react'
import GaussianSolver from './GaussianSolver'
import styles from './GaussianSolver.module.css'

// A long-question matrix task. The student solves it (on paper or with the
// engine), then enters their answer. We check ONLY the x/y/z values for a
// unique solution, or the solution TYPE for infinite/inconsistent.
export default function GaussianChallenge({
  expected = [] as string[],           // e.g. ['2','3','-1']
  answerType = 'unique' as 'unique' | 'infinite' | 'inconsistent',
  solutionMatrix,                       // optional: preload into the engine on reveal
}: {
  expected?: string[]
  answerType?: 'unique' | 'infinite' | 'inconsistent'
  solutionMatrix?: number[][]
}) {
  const names = ['x', 'y', 'z', 'w']
  const [vals, setVals] = useState<string[]>(expected.map(() => ''))
  const [type, setType] = useState<string>('')
  const [state, setState] = useState<'idle' | 'pass' | 'fail'>('idle')
  const [msg, setMsg] = useState('')
  const [showEngine, setShowEngine] = useState(false)

  const norm = (s: string) => {
    s = s.trim()
    if (/^-?\d+\/-?\d+$/.test(s)) { const [a, b] = s.split('/').map(Number); return b ? a / b : NaN }
    return Number(s)
  }

  const check = () => {
    if (answerType !== 'unique') {
      if (type === answerType) { setState('pass'); setMsg(`✅ Correct — this system has ${answerType === 'infinite' ? 'infinitely many solutions' : 'no solution'}.`) }
      else { setState('fail'); setMsg('Not quite. Reduce it to row echelon form and look at the bottom rows.') }
      return
    }
    const ok = expected.every((e, i) => Math.abs(norm(vals[i]) - norm(e)) < 1e-9)
    if (ok) { setState('pass'); setMsg('✅ Correct on the values. Any valid method that reaches these is right.') }
    else {
      setState('fail')
      setMsg('Not quite — check your back-substitution. Use the engine below to see each step.')
    }
  }

  return (
    <div className={styles.step} style={{ marginTop: 0 }}>
      {answerType === 'unique' ? (
        <div className={styles.freePick} style={{ flexWrap: 'wrap' }}>
          {expected.map((_, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'monospace', fontWeight: 700 }}>
              {names[i]} =
              <input className={styles.cell} style={{ width: 60 }} value={vals[i]}
                onChange={e => { const n = [...vals]; n[i] = e.target.value; setVals(n) }} />
            </label>
          ))}
        </div>
      ) : (
        <div className={styles.freePick} style={{ flexWrap: 'wrap' }}>
          {['unique', 'infinite', 'inconsistent'].map(t => (
            <button key={t} className={`${styles.freeBtn} ${type === t ? styles.freeOn : ''}`}
              style={{ width: 'auto', padding: '0 12px' }} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
      )}

      <div className={styles.btnRow} style={{ marginTop: 10 }}>
        <button onClick={check} className={styles.solveBtn}>Check my answer</button>
        <button onClick={() => setShowEngine(s => !s)} className={styles.ghost}>
          {showEngine ? 'Hide' : 'Solve with the engine'}
        </button>
      </div>

      {msg && <div className={state === 'pass' ? styles.unique : styles.inconsistent} style={{ marginTop: 10, padding: '10px 13px', borderRadius: 9 }}>{msg}</div>}

      {showEngine && (
        <div style={{ marginTop: 12 }}>
          <GaussianSolver />
        </div>
      )}
    </div>
  )
}
