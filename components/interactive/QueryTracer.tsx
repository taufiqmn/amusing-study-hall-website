'use client'

import { useEffect, useRef, useState } from 'react'
import { toSQLite, humanizeError } from '@/lib/oracle-sqlite'
import styles from './SqlPlayground.module.css'
import tstyles from './QueryTracer.module.css'

// THE QUERY TRACER.
//
// Students write SELECT ... FROM ... WHERE ... and assume it runs top-down.
// It does not. Real order is:
//     FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
// This component executes each stage separately and shows the intermediate
// row set after every clause — so you SEE rows drop at WHERE, multiply at a
// JOIN, and collapse into buckets at GROUP BY.

declare global { interface Window { initSqlJs?: any } }

type Stage = { clause: string; why: string; sql: string; rows: number; cols: string[]; data: any[][]; delta: string }

// Very small clause splitter. Good enough for teaching queries.
function parse(sql: string) {
  const s = sql.trim().replace(/;+\s*$/, '')
  const grab = (re: RegExp) => (s.match(re)?.[1] || '').trim()
  return {
    select: grab(/\bSELECT\b([\s\S]*?)\bFROM\b/i),
    from: grab(/\bFROM\b([\s\S]*?)(?=\bWHERE\b|\bGROUP\s+BY\b|\bHAVING\b|\bORDER\s+BY\b|$)/i),
    where: grab(/\bWHERE\b([\s\S]*?)(?=\bGROUP\s+BY\b|\bHAVING\b|\bORDER\s+BY\b|$)/i),
    groupBy: grab(/\bGROUP\s+BY\b([\s\S]*?)(?=\bHAVING\b|\bORDER\s+BY\b|$)/i),
    having: grab(/\bHAVING\b([\s\S]*?)(?=\bORDER\s+BY\b|$)/i),
    orderBy: grab(/\bORDER\s+BY\b([\s\S]*?)$/i),
  }
}

export default function QueryTracer({
  seed = '',
  starter = 'SELECT branch_name, COUNT(*)\nFROM account\nWHERE balance > 400\nGROUP BY branch_name\nORDER BY branch_name;',
}: { seed?: string; starter?: string }) {
  const [ready, setReady] = useState(false)
  const [sql, setSql] = useState(starter)
  const [stages, setStages] = useState<Stage[]>([])
  const [shown, setShown] = useState(0)
  const [err, setErr] = useState('')
  const db = useRef<any>(null)

  useEffect(() => {
    let cancelled = false
    const boot = async () => {
      if (!window.initSqlJs) {
        await new Promise<void>((res, rej) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.min.js'
          s.onload = () => res(); s.onerror = () => rej(new Error('x'))
          document.head.appendChild(s)
        })
      }
      const SQL = await window.initSqlJs({ locateFile: (f: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${f}` })
      if (cancelled) return
      db.current = new SQL.Database()
      if (seed) { try { db.current.run(toSQLite(seed).sql) } catch {} }
      setReady(true)
    }
    boot().catch(() => setErr('Could not load the SQL engine.'))
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const exec = (q: string) => {
    const r = db.current.exec(q)
    if (!r[0]) return { cols: [], data: [] as any[][] }
    return { cols: r[0].columns as string[], data: r[0].values as any[][] }
  }

  const trace = () => {
    if (!db.current) return
    setErr(''); setStages([]); setShown(0)
    const p = parse(toSQLite(sql).sql)
    if (!p.from) { setErr('Add a FROM clause so we can trace the query.'); return }

    const out: Stage[] = []
    const push = (clause: string, why: string, q: string, prev: number | null) => {
      const { cols, data } = exec(q)
      let delta = ''
      if (prev !== null) {
        const d = data.length - prev
        delta = d === 0 ? 'no change' : d > 0 ? `+${d} rows` : `${d} rows`
      }
      out.push({ clause, why, sql: q, rows: data.length, cols, data: data.slice(0, 6), delta })
      return data.length
    }

    try {
      // 1. FROM — the raw source (joins happen here; this is where rows multiply)
      let n = push('1. FROM', 'The source tables are loaded and joined. If a join key repeats, rows MULTIPLY here.', `SELECT * FROM ${p.from}`, null)

      // 2. WHERE — filter individual rows
      if (p.where) n = push('2. WHERE', 'Filters individual rows. Rows are DROPPED here. (Cannot use SELECT aliases yet — they do not exist.)', `SELECT * FROM ${p.from} WHERE ${p.where}`, n)

      // 3. GROUP BY — collapse rows into buckets
      if (p.groupBy) {
        const q = `SELECT ${p.groupBy}, COUNT(*) AS rows_in_group FROM ${p.from}${p.where ? ` WHERE ${p.where}` : ''} GROUP BY ${p.groupBy}`
        n = push('3. GROUP BY', 'Rows COLLAPSE into one row per group. Now only grouped columns and aggregates make sense.', q, n)
      }

      // 4. HAVING — filter the groups
      if (p.having) {
        const q = `SELECT ${p.groupBy}, COUNT(*) AS rows_in_group FROM ${p.from}${p.where ? ` WHERE ${p.where}` : ''} GROUP BY ${p.groupBy} HAVING ${p.having}`
        n = push('4. HAVING', 'Filters GROUPS (not rows). This is why HAVING can use aggregates but WHERE cannot.', q, n)
      }

      // 5. SELECT — finally choose the columns
      const sel = `SELECT ${p.select || '*'} FROM ${p.from}${p.where ? ` WHERE ${p.where}` : ''}${p.groupBy ? ` GROUP BY ${p.groupBy}` : ''}${p.having ? ` HAVING ${p.having}` : ''}`
      n = push('5. SELECT', 'Only NOW are your columns chosen and aliases created. This is why WHERE could not see them.', sel, n)

      // 6. ORDER BY — sort last
      if (p.orderBy) push('6. ORDER BY', 'Sorting happens last, on the final result. It can use SELECT aliases.', `${sel} ORDER BY ${p.orderBy}`, n)

      setStages(out); setShown(1)
    } catch (e: any) {
      setErr(humanizeError(e.message || String(e), sql))
    }
  }

  return (
    <div className={styles.wrap}>
      <p className={tstyles.lead}>
        SQL does <b>not</b> run in the order you write it. Press <b>Trace</b> and watch the real order —
        and watch the row count change at each step.
      </p>

      <textarea value={sql} onChange={(e) => setSql(e.target.value)} spellCheck={false} rows={5} className={styles.editor} />

      <div className={styles.opRowLike} style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        <button onClick={trace} disabled={!ready} className={styles.runBtn}>🔍 Trace execution</button>
        {stages.length > 0 && shown < stages.length && (
          <button onClick={() => setShown((s) => s + 1)} className={styles.ghostBtn}>▶ Next stage</button>
        )}
        {stages.length > 0 && <button onClick={() => setShown(stages.length)} className={styles.ghostBtn}>Show all</button>}
      </div>

      {err && <div className={styles.err} style={{ marginTop: 10 }}><b>⚠ {err}</b></div>}

      <div className={tstyles.stages}>
        {stages.slice(0, shown).map((st, i) => (
          <div key={i} className={tstyles.stage}>
            <div className={tstyles.stageHead}>
              <span className={tstyles.clause}>{st.clause}</span>
              <span className={tstyles.count}>
                {st.rows} row{st.rows === 1 ? '' : 's'}
                {st.delta && <b className={st.delta.startsWith('+') ? tstyles.up : st.delta.startsWith('-') ? tstyles.down : tstyles.same}> · {st.delta}</b>}
              </span>
            </div>
            <p className={tstyles.why}>{st.why}</p>
            {st.cols.length > 0 && (
              <div className={styles.tableScroll}>
                <table className={styles.results}>
                  <thead><tr>{st.cols.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                  <tbody>
                    {st.data.map((r, ri) => (
                      <tr key={ri}>{r.map((v, ci) => <td key={ci} className={v === null ? styles.nullCell : ''}>{v === null ? 'NULL' : String(v)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
                {st.rows > 6 && <p className={tstyles.more}>…showing first 6 of {st.rows}</p>}
              </div>
            )}
          </div>
        ))}
      </div>

      {shown > 0 && shown >= stages.length && stages.length > 0 && (
        <div className={tstyles.takeaway}>
          ✅ <b>The real order:</b> FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.
          That is why <code>WHERE</code> cannot use a column alias you created in <code>SELECT</code> — when WHERE runs, that alias does not exist yet.
        </div>
      )}
    </div>
  )
}
