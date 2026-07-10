'use client'

import styles from './RelAlgebra.module.css'

// Renders relational algebra with proper notation (σ, ∏, ⋈, ρ, ∪, ∩, −)
// beside its SQL equivalent, plus a plain-English translation.
// Notation stops being scary once every symbol has a sentence.

type Row = { ra: string; sql?: string; plain?: string; label?: string }

// Turn  sigma_{cond}(R)  markup into real subscripts.
// Input format:  "σ_{dept_name = 'Physics'}(instructor)"
function render(expr: string) {
  const parts: React.ReactNode[] = []
  let i = 0, key = 0
  while (i < expr.length) {
    const sub = expr.indexOf('_{', i)
    if (sub === -1) { parts.push(<span key={key++}>{expr.slice(i)}</span>); break }
    parts.push(<span key={key++}>{expr.slice(i, sub)}</span>)
    const close = expr.indexOf('}', sub)
    if (close === -1) { parts.push(<span key={key++}>{expr.slice(sub)}</span>); break }
    parts.push(<sub key={key++} className={styles.sub}>{expr.slice(sub + 2, close)}</sub>)
    i = close + 1
  }
  return parts
}

export default function RelAlgebra({ rows = [], caption }: { rows?: Row[]; caption?: string }) {
  return (
    <div className={styles.wrap}>
      {rows.map((r, i) => (
        <div key={i} className={styles.row}>
          {r.label && <p className={styles.label}>{r.label}</p>}

          <div className={styles.pair}>
            <div className={styles.side}>
              <p className={styles.sideHead}>Relational algebra</p>
              <div className={styles.ra}>{render(r.ra)}</div>
            </div>

            {r.sql && (
              <div className={styles.side}>
                <p className={styles.sideHead}>The same thing in SQL</p>
                <pre className={styles.sql}>{r.sql}</pre>
              </div>
            )}
          </div>

          {r.plain && <p className={styles.plain}>💬 {r.plain}</p>}
        </div>
      ))}
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  )
}
