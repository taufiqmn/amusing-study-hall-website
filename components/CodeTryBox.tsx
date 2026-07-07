'use client'

import { useState } from 'react'

// Inline "Try it yourself" compiler for long questions.
// Free-run (see output) + optional Check (compare stdout to `expected`).
// Runs through the /api/run server route (Piston).

const LANGS: Record<string, { label: string; language: string; version: string }> = {
  c: { label: 'C', language: 'c', version: '10.2.0' },
  cpp: { label: 'C++', language: 'c++', version: '10.2.0' },
  java: { label: 'Java', language: 'java', version: '15.0.2' },
}

export default function CodeTryBox({
  starter = '',
  stdin = '',
  expected,
  defaultLang = 'c',
}: {
  starter?: string
  stdin?: string
  expected?: string
  defaultLang?: keyof typeof LANGS
}) {
  const [lang, setLang] = useState<keyof typeof LANGS>(defaultLang)
  const [code, setCode] = useState(starter)
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'running' | 'ok' | 'err' | 'pass' | 'fail'>('idle')

  const execute = async (check: boolean) => {
    setStatus('running')
    setOutput('')
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: LANGS[lang].language, version: LANGS[lang].version, files: [{ content: code }], stdin }),
      })
      const data = await res.json()
      const compileErr = data.compile?.stderr || ''
      const out = (data.run?.stdout || '').trim()
      const runErr = data.run?.stderr || ''
      const shown = [compileErr && `⚠ Compile:\n${compileErr}`, data.run?.stdout || '', runErr && `⚠ Runtime:\n${runErr}`].filter(Boolean).join('\n')
      setOutput(shown || '(no output)')

      if (check && expected !== undefined) {
        const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
        setStatus(norm(out) === norm(expected) ? 'pass' : 'fail')
      } else {
        setStatus(compileErr || runErr ? 'err' : 'ok')
      }
    } catch {
      setOutput('Could not reach the compiler service — check your connection.')
      setStatus('err')
    }
  }

  const mono: React.CSSProperties = { width: '100%', fontFamily: 'monospace', fontSize: 12.5, padding: 11, borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', resize: 'vertical', boxSizing: 'border-box' }

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 14, margin: '10px 0' }}>
      <p style={{ fontSize: 12, fontWeight: 800, margin: '0 0 8px', color: 'var(--accent-2, var(--accent))' }}>🧪 Try it yourself — write your answer and run it</p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {(Object.keys(LANGS) as (keyof typeof LANGS)[]).map((k) => (
          <button key={k} onClick={() => setLang(k)} style={{ fontSize: 11.5, fontWeight: 800, padding: '5px 12px', borderRadius: 8, border: '1px solid var(--card-border)', background: lang === k ? 'var(--accent-gradient)' : 'transparent', color: lang === k ? 'white' : 'var(--foreground)', cursor: 'pointer' }}>{LANGS[k].label}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button onClick={() => execute(false)} disabled={status === 'running'} style={{ fontSize: 12, fontWeight: 800, padding: '6px 14px', borderRadius: 8, border: 'none', background: '#4FC3A1', color: 'white', cursor: 'pointer' }}>▶ Run</button>
          {expected !== undefined && (
            <button onClick={() => execute(true)} disabled={status === 'running'} style={{ fontSize: 12, fontWeight: 800, padding: '6px 14px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer' }}>✓ Check</button>
          )}
        </div>
      </div>

      <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={9} spellCheck={false} style={mono} placeholder="Write your solution here…" />

      {status !== 'idle' && (
        <pre style={{ ...mono, marginTop: 8, minHeight: 44, whiteSpace: 'pre-wrap', borderColor: status === 'pass' ? '#4FC3A1' : status === 'fail' || status === 'err' ? '#e25c5c' : 'var(--card-border)' }}>
          {status === 'running' ? 'Running…' : output}
        </pre>
      )}
      {status === 'pass' && <p style={{ fontSize: 12.5, fontWeight: 800, color: '#4FC3A1', margin: '6px 0 0' }}>✅ Correct! Your output matches the expected result.</p>}
      {status === 'fail' && <p style={{ fontSize: 12.5, fontWeight: 800, color: '#e25c5c', margin: '6px 0 0' }}>❌ Not matching yet. Compare your output with the expected one, then peek at the solution below.</p>}
    </div>
  )
}
