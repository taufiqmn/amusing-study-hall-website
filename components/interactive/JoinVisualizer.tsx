'use client'

import { useState, useMemo } from 'react'
import styles from './JoinVisualizer.module.css'

// Visualise how a join pairs rows from two tables on a key.
// Students pick the join type and step through; matching rows highlight,
// unmatched rows either drop (inner) or stay with NULLs (outer).

type Row = Record<string, any>

const LEFT: Row[] = [
  { student_id: 'S1', name: 'Alice', dept_id: 'CSE' },
  { student_id: 'S2', name: 'Bob', dept_id: 'EEE' },
  { student_id: 'S3', name: 'Carol', dept_id: 'CSE' },
  { student_id: 'S4', name: 'Danny', dept_id: 'MPE' },   // MPE has no dept row → unmatched
]
const RIGHT: Row[] = [
  { dept_id: 'CSE', dept_name: 'Computer Sci.' },
  { dept_id: 'EEE', dept_name: 'Electrical' },
  { dept_id: 'BBA', dept_name: 'Business' },              // BBA has no student → unmatched
]

type JoinType = 'inner' | 'left' | 'right' | 'full'

const DESC: Record<JoinType, string> = {
  inner: 'INNER JOIN — only rows that match on both sides. Unmatched rows from either table are dropped.',
  left: 'LEFT JOIN — every left row is kept; if it has no match on the right, the right columns are NULL.',
  right: 'RIGHT JOIN — every right row is kept; if it has no match on the left, the left columns are NULL.',
  full: 'FULL JOIN — every row from both sides is kept; missing side becomes NULL.',
}

export default function JoinVisualizer() {
  const [jt, setJt] = useState<JoinType>('inner')

  const result = useMemo(() => {
    const rows: { left: Row | null; right: Row | null; matched: boolean }[] = []
    const rightUsed = new Set<number>()

    LEFT.forEach(l => {
      const idx = RIGHT.findIndex(r => r.dept_id === l.dept_id)
      if (idx >= 0) { rows.push({ left: l, right: RIGHT[idx], matched: true }); rightUsed.add(idx) }
      else if (jt === 'left' || jt === 'full') rows.push({ left: l, right: null, matched: false })
    })
    // right-only rows for right/full
    if (jt === 'right' || jt === 'full') {
      RIGHT.forEach((r, i) => {
        if (!rightUsed.has(i)) rows.push({ left: null, right: r, matched: false })
      })
    }
    // for right join, also include the matched ones already captured above via LEFT loop
    if (jt === 'right') {
      // ensure matched pairs are present (they are, from the LEFT loop) — nothing to add
    }
    return rows
  }, [jt])

  const cell = (v: any) => (v === null || v === undefined
    ? <span className={styles.nullv}>NULL</span>
    : String(v))

  return (
    <div className={styles.wrap}>
      {/* join type picker */}
      <div className={styles.picker}>
        {(['inner', 'left', 'right', 'full'] as JoinType[]).map(t => (
          <button key={t}
            className={`${styles.jbtn} ${jt === t ? styles.jon : ''}`}
            onClick={() => setJt(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>
      <p className={styles.desc}>{DESC[jt]}</p>

      {/* the two source tables */}
      <div className={styles.tables}>
        <div className={styles.tbl}>
          <p className={styles.tname}>Student <span className={styles.key}>dept_id →</span></p>
          <table className={styles.grid}>
            <thead><tr><th>student_id</th><th>name</th><th>dept_id</th></tr></thead>
            <tbody>
              {LEFT.map(l => {
                const has = RIGHT.some(r => r.dept_id === l.dept_id)
                return (
                  <tr key={l.student_id} className={has ? styles.match : styles.nomatch}>
                    <td>{l.student_id}</td><td>{l.name}</td><td>{l.dept_id}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.tbl}>
          <p className={styles.tname}><span className={styles.key}>← dept_id</span> Department</p>
          <table className={styles.grid}>
            <thead><tr><th>dept_id</th><th>dept_name</th></tr></thead>
            <tbody>
              {RIGHT.map(r => {
                const has = LEFT.some(l => l.dept_id === r.dept_id)
                return (
                  <tr key={r.dept_id} className={has ? styles.match : styles.nomatch}>
                    <td>{r.dept_id}</td><td>{r.dept_name}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.legend}>
        <span><i className={styles.dotMatch} /> matches on dept_id</span>
        <span><i className={styles.dotNo} /> no match on the other side</span>
      </div>

      {/* the join result */}
      <p className={styles.resultLabel}>Result of the {jt.toUpperCase()} JOIN on dept_id:</p>
      <table className={styles.grid}>
        <thead><tr><th>student_id</th><th>name</th><th>Student.dept_id</th><th>dept_name</th></tr></thead>
        <tbody>
          {result.map((row, i) => (
            <tr key={i} className={row.matched ? styles.match : styles.nomatch}>
              <td>{cell(row.left?.student_id ?? null)}</td>
              <td>{cell(row.left?.name ?? null)}</td>
              <td>{cell(row.left?.dept_id ?? row.right?.dept_id ?? null)}</td>
              <td>{cell(row.right?.dept_name ?? null)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.count}>{result.length} row(s). {
        jt === 'inner' ? 'Danny (MPE) and Business (BBA) both vanish — neither had a match.'
        : jt === 'left' ? 'Danny stays, with NULL department. Business (BBA) is gone — it\u2019s on the right.'
        : jt === 'right' ? 'Business stays, with NULL student. Danny is gone — he\u2019s on the left.'
        : 'Both Danny and Business stay, each with NULLs on the missing side.'
      }</p>
    </div>
  )
}
