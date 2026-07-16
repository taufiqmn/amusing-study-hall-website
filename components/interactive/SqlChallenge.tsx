'use client'

import { useEffect, useRef, useState } from 'react'
import { toSQLite, humanizeError } from '@/lib/oracle-sqlite'
import styles from './SqlPlayground.module.css'
import cstyles from './SqlChallenge.module.css'

// An auto-graded SQL task.
//
// The student writes a query. We run it, and compare the RESULT SET against
// the expected one — ignoring row order and column order, because SQL promises
// neither. A different-but-correct query still passes.
//
// First-attempt correctness is recorded, because that's what earns a badge.

declare global { interface Window { initSqlJs?: any } }

type Grid = { cols: string[]; rows: any[][] }

// Normalise a result set so two correct answers compare equal:
//   - column order ignored (sort by name, carry the values with them)
//   - row order ignored (sort the rows canonically)
//   - numbers compared loosely (3 === 3.0)
function canon(g: Grid): string {
  const order = g.cols.map((c, i) => [c.toLowerCase(), i] as [string, number])
                      .sort((a, b) => a[0].localeCompare(b[0]))
  const cols = order.map(o => o[0])
  const rows = g.rows.map(r => order.map(o => {
    const v = r[o[1]]
    if (v === null || v === undefined) return '∅'
    if (typeof v === 'number') return String(Number(v))          // 3.0 -> "3"
    const n = Number(v)
    return Number.isFinite(n) && String(v).trim() !== '' ? String(n) : String(v)
  }))
  rows.sort((a, b) => a.join('\u0001').localeCompare(b.join('\u0001')))
  return JSON.stringify({ cols, rows })
}

// Pull individual CREATE TABLE statements out of the seed so we can show each
// table's schema (the CREATE code) and its data separately, with toggles.
function parseSeedTables(seed: string): { name: string; create: string }[] {
  const out: { name: string; create: string }[] = []
  const re = /CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\)\s*;/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(seed)) !== null) {
    out.push({ name: m[1], create: m[0].trim() })
  }
  return out
}

export default function SqlChallenge({
  seed = '',
  task = '',
  hint = '',
  expected = '',       // a reference SQL query; we run it to get the target
  starter = '',
  solution = '',
  id = '',             // stable id so attempts can be stored
}: {
  seed?: string
  task?: string
  hint?: string
  expected?: string
  starter?: string
  solution?: string
  id?: string
}) {
  const [ready, setReady] = useState(false)
  const [sql, setSql] = useState(starter)
  const [state, setState] = useState<'idle' | 'pass' | 'fail'>('idle')
  const [msg, setMsg] = useState('')
  const [got, setGot] = useState<Grid | null>(null)
  const [want, setWant] = useState<Grid | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showSol, setShowSol] = useState(false)
  const [showData, setShowData] = useState(false)   // "Show tables" (data)
  const [showSchema, setShowSchema] = useState(false) // "Show SQL" (CREATE code)
  const db = useRef<any>(null)
  const seedTables = parseSeedTables(seed)

  useEffect(() => {
    let dead = false
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
      if (dead) return
      db.current = new SQL.Database()
      if (seed) { try { db.current.run(toSQLite(seed).sql) } catch {} }
      setReady(true)
    }
    boot().catch(() => setMsg('Could not load the SQL engine.'))
    return () => { dead = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const exec = (q: string): Grid => {
    const r = db.current.exec(toSQLite(q).sql)
    if (!r[0]) return { cols: [], rows: [] }
    return { cols: r[0].columns, rows: r[0].values }
  }

  const check = () => {
    if (!db.current || !sql.trim()) { setMsg('Write a query first.'); return }
    const n = attempts + 1
    setAttempts(n)
    setState('idle'); setMsg(''); setGot(null); setWant(null)

    let mine: Grid
    try {
      mine = exec(sql)
    } catch (e: any) {
      setState('fail')
      setMsg(humanizeError(e.message || String(e), sql))
      return
    }

    let target: Grid
    try {
      target = exec(expected)
    } catch {
      setState('fail'); setMsg('The expected answer could not be computed. Tell your instructor.')
      return
    }

    setGot(mine); setWant(target)

    if (canon(mine) === canon(target)) {
      setState('pass')
      setMsg(n === 1
        ? '✅ Correct — first attempt! That counts towards your badge.'
        : `✅ Correct, on attempt ${n}.`)
      // record the attempt (best-effort; the page works without it)
      try {
        window.dispatchEvent(new CustomEvent('sql-challenge-result', {
          detail: { id, passed: true, attempts: n, firstTry: n === 1 },
        }))
      } catch {}
    } else {
      setState('fail')
      const rowDiff = mine.rows.length - target.rows.length
      setMsg(
        rowDiff === 0
          ? `Not quite — you have the right number of rows (${mine.rows.length}), but the values differ. Compare the two tables below.`
          : rowDiff > 0
            ? `Not quite — you returned ${mine.rows.length} rows; the answer has ${target.rows.length}. Your filter may be too loose.`
            : `Not quite — you returned ${mine.rows.length} rows; the answer has ${target.rows.length}. Your filter may be too strict.`
      )
    }
  }

  const Table = ({ g, label }: { g: Grid; label: string }) => (
    <div className={cstyles.gridBox}>
      <p className={cstyles.gridLabel}>{label}</p>
      <div className={styles.tableScroll}>
        <table className={styles.results}>
          <thead><tr>{g.cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
          <tbody>
            {g.rows.slice(0, 8).map((r, i) => (
              <tr key={i}>{r.map((v, j) => <td key={j} className={v === null ? styles.nullCell : ''}>{v === null ? 'NULL' : String(v)}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      {g.rows.length > 8 && <p className={cstyles.more}>…{g.rows.length} rows total</p>}
      {g.rows.length === 0 && <p className={cstyles.more}>no rows</p>}
    </div>
  )

  return (
    <div className={`${styles.wrap} ${state === 'pass' ? cstyles.passWrap : ''}`}>
      <div className={cstyles.head}>
        <span className={cstyles.badge}>🎯 Challenge</span>
        {attempts > 0 && <span className={cstyles.attempts}>attempt {attempts}</span>}
      </div>

      <p className={cstyles.task}>{task}</p>

      {seedTables.length > 0 && (
        <div className={cstyles.peekWrap}>
          <div className={cstyles.peekBtns}>
            <button
              onClick={() => setShowData(s => !s)}
              className={`${cstyles.peekBtn} ${showData ? cstyles.peekOn : ''}`}
            >📊 {showData ? 'Hide' : 'Show'} table{seedTables.length > 1 ? 's' : ''} & data</button>
            <button
              onClick={() => setShowSchema(s => !s)}
              className={`${cstyles.peekBtn} ${showSchema ? cstyles.peekOn : ''}`}
            >{'</>'} {showSchema ? 'Hide' : 'Show'} CREATE code</button>
          </div>

          {showData && (
            <div className={cstyles.peekPanel}>
              {seedTables.map(t => {
                let g: Grid = { cols: [], rows: [] }
                try { if (ready) g = exec(`SELECT * FROM ${t.name}`) } catch {}
                return (
                  <div key={t.name} className={cstyles.peekTable}>
                    <p className={cstyles.peekName}>📋 {t.name}</p>
                    <div className={styles.tableScroll}>
                      <table className={styles.results}>
                        <thead><tr>{g.cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
                        <tbody>
                          {g.rows.slice(0, 12).map((r, i) => (
                            <tr key={i}>{r.map((v, j) => <td key={j} className={v === null ? styles.nullCell : ''}>{v === null ? 'NULL' : String(v)}</td>)}</tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {g.rows.length > 12 && <p className={cstyles.more}>…{g.rows.length} rows total</p>}
                  </div>
                )
              })}
            </div>
          )}

          {showSchema && (
            <div className={cstyles.peekPanel}>
              {seedTables.map(t => (
                <pre key={t.name} className={cstyles.peekCode}>{t.create}</pre>
              ))}
              <p className={cstyles.peekTip}>The CREATE code shows each column's type and which columns are keys / foreign keys.</p>
            </div>
          )}
        </div>
      )}

      <textarea
        value={sql}
        onChange={e => setSql(e.target.value)}
        spellCheck={false}
        rows={5}
        className={styles.editor}
        placeholder={ready ? 'Write your query here…' : 'Loading SQL engine…'}
        onKeyDown={e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); check() } }}
      />

      <div className={cstyles.btnRow}>
        <button onClick={check} disabled={!ready} className={styles.runBtn}>✓ Check my answer</button>
        {hint && <button onClick={() => setShowHint(h => !h)} className={styles.ghostBtn}>💡 Hint</button>}
        {solution && (
          <button
            onClick={() => {
              const next = !showSol
              setShowSol(next)
              if (next && attempts === 0) {
                try {
                  window.dispatchEvent(new CustomEvent('sql-challenge-result', {
                    detail: { id, passed: false, attempts: 0, firstTry: false, revealed: true },
                  }))
                } catch {}
              }
            }}
            className={styles.ghostBtn}>
            {showSol ? 'Hide' : 'Show'} answer
          </button>
        )}
      </div>

      {showHint && hint && <div className={cstyles.hint}>💡 {hint}</div>}

      {msg && (
        <div className={state === 'pass' ? cstyles.pass : state === 'fail' ? cstyles.fail : styles.ok}>
          {msg}
        </div>
      )}

      {state === 'fail' && got && want && (
        <div className={cstyles.compare}>
          <Table g={got} label="What your query returned" />
          <Table g={want} label="What the answer should be" />
        </div>
      )}

      {showSol && solution && (
        <div className={cstyles.solution}>
          {attempts === 0 && (
            <p className={cstyles.solWarn}>
              ⚠ You're viewing the answer before attempting. If you're logged in, this challenge won't count towards your badge score. Try it yourself first for the credit.
            </p>
          )}
          <p className={cstyles.solLabel}>One correct answer — yours may differ and still be right:</p>
          <pre className={styles.code || cstyles.pre}>{solution}</pre>
        </div>
      )}
    </div>
  )
}
