'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './StackPlayground.module.css'

// Infix → Postfix / Prefix conversion, shown as a filling chart like a
// lecture slide. Type an expression, Step through it, or Auto-play.
// Each row shows: token read, stack state, output so far.

type Mode = 'postfix' | 'prefix'
type Row = { token: string; stack: string; output: string }

const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 }
const isOp = (c: string) => c in prec
const tokenize = (s: string) => s.replace(/\s+/g, '').match(/(\d+|[+\-*/^()])/g) || []

// ---- Infix → Postfix (Shunting-yard) ----
function toPostfix(tokens: string[]): Row[] {
  const rows: Row[] = []
  const st: string[] = []
  const out: string[] = []
  for (const t of tokens) {
    if (/\d+/.test(t)) out.push(t)
    else if (t === '(') st.push(t)
    else if (t === ')') { while (st.length && st[st.length - 1] !== '(') out.push(st.pop()!); st.pop() }
    else { while (st.length && st[st.length - 1] !== '(' && prec[st[st.length - 1]] >= prec[t]) out.push(st.pop()!); st.push(t) }
    rows.push({ token: t, stack: st.join(' '), output: out.join(' ') })
  }
  while (st.length) { out.push(st.pop()!); rows.push({ token: '(end)', stack: st.join(' '), output: out.join(' ') }) }
  return rows
}

// ---- Infix → Prefix: reverse, swap parens, postfix, reverse ----
function toPrefix(tokens: string[]): { rows: Row[]; reversed: string[] } {
  const rev = [...tokens].reverse().map((t) => (t === '(' ? ')' : t === ')' ? '(' : t))
  const rows: Row[] = []
  const st: string[] = []
  const out: string[] = []
  for (const t of rev) {
    if (/\d+/.test(t)) out.push(t)
    else if (t === '(') st.push(t)
    else if (t === ')') { while (st.length && st[st.length - 1] !== '(') out.push(st.pop()!); st.pop() }
    else { while (st.length && st[st.length - 1] !== '(' && prec[st[st.length - 1]] > prec[t]) out.push(st.pop()!); st.push(t) }
    rows.push({ token: t, stack: st.join(' '), output: out.join(' ') })
  }
  while (st.length) { out.push(st.pop()!); rows.push({ token: '(end)', stack: st.join(' '), output: out.join(' ') }) }
  return { rows, reversed: rev }
}

const SUGGESTIONS = ['4 * ( 5 + 3 ) - 24 / 6', 'A + B * C', '( A + B ) * ( C - D )', '2 ^ 3 + 4 * 5']

export default function InfixConvertLab({ mode: initMode = 'postfix' }: { mode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initMode)
  const [expr, setExpr] = useState('4 * ( 5 + 3 ) - 24 / 6')
  const [rows, setRows] = useState<Row[]>([])
  const [shown, setShown] = useState(0)
  const [reversed, setReversed] = useState<string[]>([])
  const [error, setError] = useState('')
  const auto = useRef<any>(null)

  const build = () => {
    setError('')
    const tokens = tokenize(expr)
    if (tokens.length === 0) { setError('Type an expression first, e.g. A + B * C'); return }
    try {
      if (mode === 'postfix') { setRows(toPostfix(tokens)); setReversed([]) }
      else { const r = toPrefix(tokens); setRows(r.rows); setReversed(r.reversed) }
      setShown(0)
    } catch { setError('Could not parse — check your brackets and operators.') }
  }

  useEffect(() => { build(); return () => clearInterval(auto.current) }, [mode]) // eslint-disable-line

  const step = () => setShown((s) => Math.min(s + 1, rows.length))
  const autoPlay = () => {
    clearInterval(auto.current)
    setShown(0)
    auto.current = setInterval(() => {
      setShown((s) => { if (s >= rows.length) { clearInterval(auto.current); return s } return s + 1 })
    }, 700)
  }

  const final = rows.length ? rows[rows.length - 1].output : ''

  return (
    <div className={styles.wrap}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <button onClick={() => setMode('postfix')} className={styles.opBtn} style={{ background: mode === 'postfix' ? 'var(--accent)' : 'var(--card-border)', color: mode === 'postfix' ? 'white' : 'var(--foreground)' }}>Infix → Postfix</button>
        <button onClick={() => setMode('prefix')} className={styles.opBtn} style={{ background: mode === 'prefix' ? 'var(--accent)' : 'var(--card-border)', color: mode === 'prefix' ? 'white' : 'var(--foreground)' }}>Infix → Prefix</button>
      </div>

      <input value={expr} onChange={(e) => setExpr(e.target.value)} className={styles.sizeInput} style={{ width: '100%', boxSizing: 'border-box', marginBottom: 8, fontFamily: 'monospace' }} placeholder="e.g. 4 * ( 5 + 3 ) - 24 / 6" />
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => setExpr(s)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', cursor: 'pointer', fontFamily: 'monospace' }}>{s}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <button onClick={build} className={styles.buildBtn}>🔨 Load</button>
        <button onClick={step} className={styles.opBtn} style={{ background: '#4FC3A1' }} disabled={shown >= rows.length}>▶ Next step</button>
        <button onClick={autoPlay} className={styles.opBtn} style={{ background: 'var(--gold, #f3cb4b)', color: '#402a02' }}>⏯ Auto-play</button>
        <button onClick={() => setShown(rows.length)} className={styles.opBtn} style={{ background: 'var(--card-border)', color: 'var(--foreground)' }}>Show all</button>
      </div>

      {error && <p className={styles.msg} style={{ color: '#e25c5c' }}>{error}</p>}

      {mode === 'prefix' && reversed.length > 0 && (
        <p className={styles.msg} style={{ marginTop: 0 }}>Prefix trick: reverse the infix (and swap brackets) → <b style={{ fontFamily: 'monospace' }}>{reversed.join(' ')}</b> → convert like postfix → reverse the result.</p>
      )}

      {rows.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'monospace' }}>
            <thead>
              <tr>
                <th style={th}>Token</th>
                <th style={th}>Stack</th>
                <th style={th}>{mode === 'postfix' ? 'Postfix output' : 'Output (pre-reverse)'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, shown).map((r, i) => (
                <tr key={i} style={{ background: i === shown - 1 ? 'var(--pill-bg)' : 'transparent' }}>
                  <td style={td}><b style={{ color: 'var(--accent)' }}>{r.token}</b></td>
                  <td style={td}>{r.stack || '—'}</td>
                  <td style={td}>{r.output || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {shown >= rows.length && rows.length > 0 && (
        <p className={styles.msg} style={{ borderColor: '#4FC3A1' }}>
          ✅ {mode === 'postfix' ? 'Postfix' : 'Prefix'} result: <b style={{ fontFamily: 'monospace', color: '#4FC3A1' }}>{mode === 'prefix' ? final.split(' ').reverse().join(' ') : final}</b>
          {mode === 'prefix' && <span style={{ opacity: 0.7 }}> (output reversed back)</span>}
        </p>
      )}
    </div>
  )
}

const th: React.CSSProperties = { textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid var(--accent)', color: 'var(--accent-2, var(--accent))', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }
const td: React.CSSProperties = { padding: '7px 12px', borderBottom: '1px solid var(--card-border)' }
