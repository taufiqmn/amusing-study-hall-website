'use client'
import { useState } from 'react'
import CramersRule from './CramersRule'
import styles from './GaussianSolver.module.css'

export default function CramersChallenge({
  A = [] as number[][],
  B = [] as number[],
  expected = [] as string[],
}: { A?: number[][]; B?: number[]; expected?: string[] }) {
  const names = ['x', 'y', 'z', 'w']
  const [vals, setVals] = useState<string[]>(expected.map(() => ''))
  const [state, setState] = useState<'idle' | 'pass' | 'fail'>('idle')
  const [msg, setMsg] = useState('')
  const [showEngine, setShowEngine] = useState(false)

  const norm = (s: string) => Number(s.trim())

  const check = () => {
    const ok = expected.every((e, i) => Math.abs(norm(vals[i]) - norm(e)) < 1e-9)
    if (ok) { setState('pass'); setMsg('✅ Correct.') }
    else { setState('fail'); setMsg('Not quite — solve with the engine below to see every line.') }
  }

  return (
    <div className={styles.step} style={{ marginTop: 0 }}>
      <div className={styles.freePick} style={{ flexWrap: 'wrap' }}>
        {expected.map((_, i) => (
          <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'monospace', fontWeight: 700 }}>
            {names[i]} =
            <input className={styles.cell} style={{ width: 60 }} value={vals[i]}
              onChange={e => { const n = [...vals]; n[i] = e.target.value; setVals(n) }} />
          </label>
        ))}
      </div>
      <div className={styles.btnRow} style={{ marginTop: 10 }}>
        <button onClick={check} className={styles.solveBtn}>Check my answer</button>
        <button onClick={() => setShowEngine(s => !s)} className={styles.ghost}>
          {showEngine ? 'Hide' : 'Solve with the engine'}
        </button>
      </div>
      {msg && <div className={state === 'pass' ? styles.unique : styles.inconsistent} style={{ marginTop: 10, padding: '10px 13px', borderRadius: 9 }}>{msg}</div>}
      {showEngine && (
        <div style={{ marginTop: 12 }}>
          <CramersRule initialA={A} initialB={B} lockControls />
        </div>
      )}
    </div>
  )
}
