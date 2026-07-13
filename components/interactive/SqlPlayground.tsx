'use client'

import { useEffect, useRef, useState } from 'react'
import { toSQLite, humanizeError } from '@/lib/oracle-sqlite'
import styles from './SqlPlayground.module.css'

// Real SQL engine in the browser (SQLite via sql.js WASM), fed through an
// Oracle translation layer so students type genuine Oracle SQL.
// Left: editor + results. Right: live schema — click a table to see columns.

type Col = { name: string; type: string; pk: boolean; notnull: boolean }
type Tbl = { name: string; cols: Col[]; rows: number }
type Result = { cols: string[]; rows: any[][] } | null

declare global { interface Window { initSqlJs?: any } }

export default function SqlPlayground({
  seed = '',
  starter = '',
  height = 260,
  resetOnRun = false,
  revealAnswer = '',
}: {
  seed?: string
  starter?: string
  height?: number
  resetOnRun?: boolean
  revealAnswer?: string
}) {
  const [ready, setReady] = useState(false)
  const [sql, setSql] = useState(starter)
  const [result, setResult] = useState<Result>(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [notes, setNotes] = useState<string[]>([])
  const [tables, setTables] = useState<Tbl[]>([])
  const [openTbl, setOpenTbl] = useState<string | null>(null)
  const db = useRef<any>(null)

  // ---- boot the engine ----
  useEffect(() => {
    let cancelled = false
    const boot = async () => {
      if (!window.initSqlJs) {
        await new Promise<void>((res, rej) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.min.js'
          s.onload = () => res()
          s.onerror = () => rej(new Error('load failed'))
          document.head.appendChild(s)
        })
      }
      const SQL = await window.initSqlJs({
        locateFile: (f: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${f}`,
      })
      if (cancelled) return
      db.current = new SQL.Database()
      if (seed) { try { db.current.run(toSQLite(seed).sql) } catch { /* seed errors are silent */ } }
      refreshSchema()
      setReady(true)
    }
    boot().catch(() => setErr('Could not load the SQL engine. Check your connection and refresh.'))
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---- read the live schema out of sqlite_master ----
  const refreshSchema = () => {
    if (!db.current) return
    try {
      const r = db.current.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name`)
      const names: string[] = r[0] ? r[0].values.map((v: any[]) => v[0]) : []
      const out: Tbl[] = names.map((n) => {
        const info = db.current.exec(`PRAGMA table_info(${n})`)
        const cols: Col[] = info[0] ? info[0].values.map((v: any[]) => ({
          name: v[1], type: v[2] || 'TEXT', notnull: !!v[3], pk: !!v[5],
        })) : []
        let rows = 0
        try { const c = db.current.exec(`SELECT COUNT(*) FROM ${n}`); rows = c[0]?.values[0][0] ?? 0 } catch {}
        return { name: n, cols, rows }
      })
      setTables(out)
    } catch { /* ignore */ }
  }

  // ---- run ----
  const run = () => {
    if (!db.current) return
    setErr(''); setMsg(''); setResult(null); setNotes([])
    const raw = sql.trim()
    if (!raw) { setErr('Write a SQL statement first.'); return }

    // If the script builds its own tables, reset first so re-running doesn't
    // stack duplicate rows. Lessons opt in via resetOnRun.
    if (resetOnRun) {
      try {
        const r = db.current.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`)
        const names: string[] = r[0] ? r[0].values.map((v: any[]) => v[0]) : []
        names.forEach((n) => db.current.run(`DROP TABLE IF EXISTS ${n}`))
        if (seed) db.current.run(toSQLite(seed).sql)
      } catch { /* ignore */ }
    }

    const { sql: translated, notes: n } = toSQLite(raw)
    setNotes(n)
    try {
      const res = db.current.exec(translated)
      if (res.length > 0) {
        setResult({ cols: res[res.length - 1].columns, rows: res[res.length - 1].values })
        setMsg(`${res[res.length - 1].values.length} row(s) returned.`)
      } else {
        const changed = db.current.getRowsModified()
        setMsg(changed > 0 ? `Statement OK — ${changed} row(s) affected.` : 'Statement executed successfully.')
      }
      refreshSchema()
    } catch (e: any) {
      setErr(humanizeError(e.message || String(e), raw))
    }
  }

  const reset = () => {
    if (!db.current) return
    try {
      const r = db.current.exec(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`)
      const names: string[] = r[0] ? r[0].values.map((v: any[]) => v[0]) : []
      names.forEach((n) => db.current.run(`DROP TABLE IF EXISTS ${n}`))
      if (seed) db.current.run(toSQLite(seed).sql)
    } catch {}
    refreshSchema(); setResult(null); setMsg('Database reset.'); setErr(''); setNotes([])
  }

  const insertText = (t: string) => setSql((s) => (s.trim() ? s + '\n' + t : t))

  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        {/* ---------- left: editor + results ---------- */}
        <div className={styles.main}>
          <div className={styles.bar}>
            <span className={styles.barTitle}>SQL editor — write Oracle syntax</span>
            <div className={styles.barBtns}>
              <button onClick={run} disabled={!ready} className={styles.runBtn}>▶ Run</button>
              <button onClick={reset} disabled={!ready} className={styles.ghostBtn}>↻ Reset</button>
              {revealAnswer && (
                <button
                  onClick={() => { setSql(revealAnswer); setTimeout(run, 60) }}
                  disabled={!ready}
                  className={styles.ghostBtn}
                  title="Paste the answer and run it"
                >💡 Show answer</button>
              )}
            </div>
          </div>

          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            spellCheck={false}
            rows={7}
            placeholder={ready ? "SELECT * FROM student;" : 'Loading SQL engine…'}
            className={styles.editor}
            style={{ minHeight: height * 0.42 }}
            onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run() } }}
          />
          <p className={styles.hint}>Tip: press Ctrl+Enter to run. End each statement with a semicolon <code>;</code></p>

          {err && <div className={styles.err}><b>⚠ {err}</b></div>}
          {msg && !err && <div className={styles.ok}>{msg}</div>}

          {notes.map((n, i) => (
            <div key={i} className={styles.note}>💡 {n}</div>
          ))}

          {result && (
            <div className={styles.tableScroll}>
              <table className={styles.results}>
                <thead>
                  <tr>{result.cols.map((c) => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody>
                  {result.rows.map((r, i) => (
                    <tr key={i}>
                      {r.map((v, j) => (
                        <td key={j} className={v === null ? styles.nullCell : ''}>
                          {v === null ? 'NULL' : String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.rows.length === 0 && <p className={styles.emptyRes}>No rows matched. That is a valid answer — not an error.</p>}
            </div>
          )}
        </div>

        {/* ---------- right: live schema ---------- */}
        <div className={styles.side}>
          <div className={styles.sideHead}>
            <span>📚 Your tables</span>
            <button onClick={refreshSchema} className={styles.refreshBtn} title="Refresh">↻</button>
          </div>

          {tables.length === 0 && (
            <p className={styles.sideEmpty}>
              No tables yet. Run a <code>CREATE TABLE</code> and it will appear here.
            </p>
          )}

          {tables.map((t) => (
            <div key={t.name} className={styles.tblCard}>
              <button
                onClick={() => setOpenTbl(openTbl === t.name ? null : t.name)}
                className={styles.tblBtn}
              >
                <span className={styles.tblName}>{openTbl === t.name ? '▾' : '▸'} {t.name}</span>
                <span className={styles.tblRows}>{t.rows} row{t.rows === 1 ? '' : 's'}</span>
              </button>

              {openTbl === t.name && (
                <div className={styles.colList}>
                  {t.cols.map((c) => (
                    <div key={c.name} className={styles.colRow}>
                      <button className={styles.colName} onClick={() => insertText(c.name)} title="Click to insert into editor">
                        {c.pk && <span className={styles.pk} title="Primary key">🔑</span>}
                        {c.name}
                      </button>
                      <span className={styles.colType}>
                        {c.type}{c.notnull && !c.pk ? ' · NOT NULL' : ''}
                      </span>
                    </div>
                  ))}
                  <button className={styles.peekBtn} onClick={() => { setSql(`SELECT * FROM ${t.name};`); }}>
                    SELECT * FROM {t.name}
                  </button>
                </div>
              )}
            </div>
          ))}

          <p className={styles.sideFoot}>
            Click a table to see its columns. Click a column name to drop it into the editor — no more guessing spellings.
          </p>
        </div>
      </div>
    </div>
  )
}
