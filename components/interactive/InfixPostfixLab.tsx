'use client'

import { useState } from 'react'

// Type any infix expression → watch the stack + output build step by step,
// following the exact Polish(Q,P) algorithm from the lecture.
// Second tab: evaluate a postfix expression the same way.

type Step = { token: string; stack: string[]; output: string[]; action: string }

const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 }

function tokenize(s: string): string[] {
  return (s.match(/\d+(\.\d+)?|[A-Za-z]+|[+\-*/^()]/g) || [])
}

function toPostfixSteps(infix: string): Step[] {
  const steps: Step[] = []
  const stack: string[] = ['(']
  const out: string[] = []
  const tokens = [...tokenize(infix), ')']
  steps.push({ token: '—', stack: [...stack], output: [], action: 'Start: push "(" onto the STACK and add ")" to the end of the expression.' })
  for (const t of tokens) {
    if (/^[A-Za-z]+$/.test(t) || /^\d/.test(t)) {
      out.push(t)
      steps.push({ token: t, stack: [...stack], output: [...out], action: `"${t}" is an OPERAND → add it straight to the output.` })
    } else if (t === '(') {
      stack.push(t)
      steps.push({ token: t, stack: [...stack], output: [...out], action: '"(" → push it onto the stack.' })
    } else if (t === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        const op = stack.pop()!
        out.push(op)
        steps.push({ token: t, stack: [...stack], output: [...out], action: `")" → pop "${op}" to the output (keep popping until "(").` })
      }
      stack.pop()
      steps.push({ token: t, stack: [...stack], output: [...out], action: 'Remove the matching "(" — do NOT add it to the output.' })
    } else {
      while (stack.length && stack[stack.length - 1] !== '(' && prec[stack[stack.length - 1]] >= prec[t]) {
        const op = stack.pop()!
        out.push(op)
        steps.push({ token: t, stack: [...stack], output: [...out], action: `"${stack.length >= 0 ? op : ''}" on top has same/higher precedence than "${t}" → pop it to the output first.` })
      }
      stack.push(t)
      steps.push({ token: t, stack: [...stack], output: [...out], action: `Push operator "${t}" onto the stack.` })
    }
  }
  steps.push({ token: '✓', stack: [...stack], output: [...out], action: `Done! Postfix: ${out.join(' ')}` })
  return steps
}

function evalPostfixSteps(postfix: string): Step[] {
  const steps: Step[] = []
  const stack: number[] = []
  const tokens = tokenize(postfix)
  for (const t of tokens) {
    if (/^\d/.test(t)) {
      stack.push(parseFloat(t))
      steps.push({ token: t, stack: stack.map(String), output: [], action: `"${t}" is a NUMBER → push it onto the stack.` })
    } else {
      if (stack.length < 2) {
        steps.push({ token: t, stack: stack.map(String), output: [], action: '⚠ Not enough operands — is the expression valid postfix (numbers only)?' })
        return steps
      }
      const b = stack.pop()!, a = stack.pop()!
      const r = t === '+' ? a + b : t === '-' ? a - b : t === '*' ? a * b : t === '^' ? a ** b : a / b
      stack.push(r)
      steps.push({ token: t, stack: stack.map(String), output: [], action: `"${t}" is an OPERATOR → pop ${b} and ${a}, compute ${a} ${t} ${b} = ${r}, push ${r} back.` })
    }
  }
  steps.push({ token: '✓', stack: stack.map(String), output: [], action: `Done! Final value on the stack: ${stack[0]}` })
  return steps
}

export default function InfixPostfixLab() {
  const [tab, setTab] = useState<'convert' | 'evaluate'>('convert')
  const [expr, setExpr] = useState('4 * ( 5 + 3 ) - 24 / 6')
  const [steps, setSteps] = useState<Step[] | null>(null)
  const [idx, setIdx] = useState(0)

  const go = () => {
    const s = tab === 'convert' ? toPostfixSteps(expr) : evalPostfixSteps(expr)
    setSteps(s)
    setIdx(0)
  }

  const switchTab = (t: 'convert' | 'evaluate') => {
    setTab(t)
    setSteps(null)
    setExpr(t === 'convert' ? '4 * ( 5 + 3 ) - 24 / 6' : '4 5 3 + * 24 6 / -')
  }

  const cur = steps ? steps[idx] : null

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 10px' }}>🧮 Infix ⇄ Postfix Machine</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => switchTab('convert')} style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--card-border)', background: tab === 'convert' ? 'var(--accent)' : 'var(--background)', color: tab === 'convert' ? 'white' : 'var(--foreground)', cursor: 'pointer' }}>Infix → Postfix</button>
        <button onClick={() => switchTab('evaluate')} style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--card-border)', background: tab === 'evaluate' ? 'var(--accent)' : 'var(--background)', color: tab === 'evaluate' ? 'white' : 'var(--foreground)', cursor: 'pointer' }}>Evaluate Postfix</button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <input value={expr} onChange={(e) => setExpr(e.target.value)} style={{ flex: 1, minWidth: 200, fontSize: 13, fontFamily: 'monospace', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }} />
        <button onClick={go} style={{ fontSize: 12, fontWeight: 700, padding: '9px 18px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer' }}>Run ▶</button>
      </div>

      {cur && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 10 }}>
              <p style={{ fontSize: 10.5, fontWeight: 800, opacity: 0.55, margin: '0 0 6px', textTransform: 'uppercase' }}>Stack (top → right)</p>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', minHeight: 34 }}>
                {cur.stack.length === 0 ? <span style={{ fontSize: 11, opacity: 0.4 }}>empty</span> : cur.stack.map((s, i) => (
                  <span key={i} style={{ padding: '6px 11px', borderRadius: 8, fontSize: 13, fontWeight: 800, background: i === cur.stack.length - 1 ? '#F3CB4B' : 'var(--pill-bg)', color: i === cur.stack.length - 1 ? '#1a1530' : 'var(--foreground)' }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 10 }}>
              <p style={{ fontSize: 10.5, fontWeight: 800, opacity: 0.55, margin: '0 0 6px', textTransform: 'uppercase' }}>{tab === 'convert' ? 'Output (postfix so far)' : 'Reading token'}</p>
              <p style={{ fontSize: 15, fontWeight: 800, margin: 0, fontFamily: 'monospace', minHeight: 22 }}>
                {tab === 'convert' ? cur.output.join(' ') || '—' : cur.token}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--pill-bg)', borderLeft: '3px solid var(--accent)', borderRadius: '0 10px 10px 0', padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ fontSize: 12.5, margin: 0, lineHeight: 1.6 }}><b>Step {idx + 1}/{steps!.length}</b> · token: <b>{cur.token}</b> — {cur.action}</p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', cursor: 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>← Back</button>
            <button onClick={() => setIdx(Math.min(steps!.length - 1, idx + 1))} disabled={idx === steps!.length - 1} style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer', opacity: idx === steps!.length - 1 ? 0.4 : 1 }}>Next step →</button>
          </div>
        </>
      )}
      {!cur && <p style={{ fontSize: 11.5, opacity: 0.55, margin: 0 }}>💡 {tab === 'convert' ? 'Try: ( ( A + B ) * ( C - E ) ) / ( F + G )  — the exam classic!' : 'Try: 5 6 2 + * 12 4 / -  (answer should be 37)'}</p>}
    </div>
  )
}
