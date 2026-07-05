'use client'

import { useState } from 'react'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

// COMPILER — real code execution via the free Piston API (emkc.org).
// No key needed. Runs C, C++ and Java with optional stdin.

const LANGS: Record<string, { label: string; language: string; version: string; template: string }> = {
  c: {
    label: 'C',
    language: 'c',
    version: '10.2.0',
    template: '#include <stdio.h>\n\nint main() {\n    printf("Hello, Amusing Study Hall!\\n");\n    return 0;\n}\n',
  },
  cpp: {
    label: 'C++',
    language: 'c++',
    version: '10.2.0',
    template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, Amusing Study Hall!" << endl;\n    return 0;\n}\n',
  },
  java: {
    label: 'Java',
    language: 'java',
    version: '15.0.2',
    template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Amusing Study Hall!");\n    }\n}\n',
  },
}

export default function CompilerPage() {
  const [lang, setLang] = useState<keyof typeof LANGS>('c')
  const [code, setCode] = useState(LANGS.c.template)
  const [stdin, setStdin] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')

  const switchLang = (k: keyof typeof LANGS) => {
    setLang(k)
    setCode(LANGS[k].template)
    setOutput('')
    setStatus('idle')
  }

  const run = async () => {
    setStatus('running')
    setOutput('')
    try {
      const res = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: LANGS[lang].language,
          version: LANGS[lang].version,
          files: [{ content: code }],
          stdin,
        }),
      })
      const data = await res.json()
      const compileErr = data.compile?.stderr || ''
      const runOut = data.run?.stdout || ''
      const runErr = data.run?.stderr || ''
      const text = [compileErr && `⚠ Compile errors:\n${compileErr}`, runOut, runErr && `⚠ Runtime:\n${runErr}`]
        .filter(Boolean)
        .join('\n')
      setOutput(text || '(program produced no output)')
      setStatus(compileErr || runErr ? 'error' : 'done')
    } catch {
      setOutput('Could not reach the compiler service — check your internet and try again.')
      setStatus('error')
    }
  }

  const mono: React.CSSProperties = {
    width: '100%',
    fontFamily: 'monospace',
    fontSize: 13,
    padding: 12,
    borderRadius: 12,
    border: '1px solid var(--card-border)',
    background: 'var(--card-bg)',
    color: 'var(--foreground)',
    resize: 'vertical',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: -0.5 }}>⚙️ Compiler</h1>
        <p style={{ fontSize: 14, opacity: 0.65, margin: '0 0 20px' }}>
          Write, run, experiment — right in the browser. Perfect for testing lesson code.
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {(Object.keys(LANGS) as (keyof typeof LANGS)[]).map((k) => (
            <button
              key={k}
              onClick={() => switchLang(k)}
              style={{ fontSize: 13, fontWeight: 800, padding: '8px 18px', borderRadius: 10, border: '1px solid var(--card-border)', background: lang === k ? 'var(--accent-gradient)' : 'var(--card-bg)', color: lang === k ? 'white' : 'var(--foreground)', cursor: 'pointer' }}
            >
              {LANGS[k].label}
            </button>
          ))}
          <button
            onClick={run}
            disabled={status === 'running'}
            style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 800, padding: '8px 24px', borderRadius: 10, border: 'none', background: '#4FC3A1', color: 'white', cursor: 'pointer', opacity: status === 'running' ? 0.6 : 1 }}
          >
            {status === 'running' ? 'Running…' : '▶ Run'}
          </button>
        </div>

        <textarea value={code} onChange={(e) => setCode(e.target.value)} rows={14} spellCheck={false} style={mono} />

        <p style={{ fontSize: 11.5, fontWeight: 800, opacity: 0.6, margin: '12px 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Input (stdin) — one value per line, for scanf / cin / Scanner
        </p>
        <textarea value={stdin} onChange={(e) => setStdin(e.target.value)} rows={3} spellCheck={false} style={mono} placeholder="e.g.  5" />

        <p style={{ fontSize: 11.5, fontWeight: 800, opacity: 0.6, margin: '14px 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Output</p>
        <pre
          style={{ ...mono, minHeight: 90, whiteSpace: 'pre-wrap', margin: 0, borderColor: status === 'error' ? '#e25c5c' : status === 'done' ? '#4FC3A1' : 'var(--card-border)' }}
        >
          {status === 'idle' ? 'Press ▶ Run to execute your code.' : output || '…'}
        </pre>

        <Footer />
      </div>
    </div>
  )
}
