'use client'

import { useState } from 'react'

// Paste C / C++ / Java / JS style code → get an ESTIMATED Big-O.
// It reads the structure: loop nesting, halving loops (log n),
// and recursion patterns. It's an estimator for learning — always
// double-check by reasoning yourself!

type Result = {
  complexity: string
  reasons: string[]
}

function stripNoise(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/.*$/gm, ' ')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
}

function analyze(srcRaw: string): Result {
  const src = stripNoise(srcRaw)
  const reasons: string[] = []

  // ---- recursion detection ----
  const fnMatches = [...src.matchAll(/([A-Za-z_]\w*)\s*\([^;)]*\)\s*\{/g)].map((m) => m[1])
    .filter((n) => !['if', 'for', 'while', 'switch', 'main', 'else'].includes(n))
  let recursive: string | null = null
  let selfCalls = 0
  let halvesArg = false
  for (const name of new Set(fnMatches)) {
    const calls = [...src.matchAll(new RegExp('\\b' + name + '\\s*\\(', 'g'))].length
    if (calls >= 2) {
      // appears once as definition + at least once as call inside
      recursive = name
      selfCalls = calls - 1
      halvesArg = new RegExp(name + '\\s*\\([^)]*(\\/\\s*2|>>\\s*1|mid)').test(src)
      break
    }
  }

  // ---- loop scan: nesting via brace depth ----
  const headerRe = /\b(for|while)\s*\(([^)]*)\)/g
  const events: { pos: number; log: boolean }[] = []
  let m: RegExpExecArray | null
  while ((m = headerRe.exec(src))) {
    const header = m[2]
    const isLog = /([*\/]\s*=\s*2|>>=?\s*1|<<=?\s*1)/.test(header) || /=\s*\w+\s*[*\/]\s*2/.test(header)
    events.push({ pos: m.index, log: isLog })
  }
  let maxLinear = 0
  let logCount = 0
  {
    const stack: ('loop' | 'logloop' | 'block')[] = []
    let pend: 'loop' | 'logloop' | null = null
    let e2 = 0
    for (let i = 0; i < src.length; i++) {
      while (e2 < events.length && events[e2].pos === i) { pend = events[e2].log ? 'logloop' : 'loop'; e2++ }
      const c = src[i]
      if (c === '{') {
        stack.push(pend || 'block')
        pend = null
        const lin = stack.filter((x) => x === 'loop').length
        const lg = stack.filter((x) => x === 'logloop').length
        if (lin > maxLinear || (lin === maxLinear && lg > logCount)) { maxLinear = lin; logCount = lg }
      } else if (c === '}') { stack.pop() }
      else if (c === ';' && pend) {
        // brace-less loop body: for(...) stmt;
        const lin = (pend === 'loop' ? 1 : 0) + stack.filter((x) => x === 'loop').length
        const lg = (pend === 'logloop' ? 1 : 0) + stack.filter((x) => x === 'logloop').length
        if (lin > maxLinear || (lin === maxLinear && lg > logCount)) { maxLinear = lin; logCount = lg }
        pend = null
      }
    }
  }

  // ---- verdict ----
  let complexity = 'O(1)'
  if (recursive) {
    if (selfCalls >= 2 && !halvesArg) {
      complexity = 'O(2ⁿ)'
      reasons.push(`Function "${recursive}" calls itself ${selfCalls}× per call (like Fibonacci) → exponential growth.`)
    } else if (selfCalls >= 2 && halvesArg) {
      complexity = 'O(n log n)'
      reasons.push(`Function "${recursive}" splits the problem in half and recurses on both halves (like Merge Sort).`)
    } else if (halvesArg) {
      complexity = 'O(log n)'
      reasons.push(`Function "${recursive}" calls itself on half the input each time (like Binary Search).`)
    } else {
      complexity = maxLinear >= 1 ? 'O(n²)' : 'O(n)'
      reasons.push(`Function "${recursive}" calls itself once per call, shrinking the input by 1 (like Factorial) → n levels of calls.`)
      if (maxLinear >= 1) reasons.push('Plus a loop inside/around the recursion multiplies the work.')
    }
  } else if (maxLinear === 0 && logCount === 0) {
    complexity = 'O(1)'
    reasons.push('No loops and no recursion found — a fixed number of steps regardless of input size.')
  } else {
    const nPart = maxLinear === 0 ? '' : maxLinear === 1 ? 'n' : maxLinear === 2 ? 'n²' : maxLinear === 3 ? 'n³' : 'n^' + maxLinear
    const logPart = logCount > 0 ? (logCount === 1 ? (nPart ? ' log n' : 'log n') : (nPart ? ' log²n' : 'log²n')) : ''
    complexity = `O(${nPart}${logPart})`
    if (maxLinear > 0) reasons.push(`Deepest nesting of normal loops: ${maxLinear} → gives the n${maxLinear > 1 ? '^' + maxLinear : ''} factor.`)
    if (logCount > 0) reasons.push(`Found ${logCount} loop(s) that double/halve the counter (i *= 2 or i /= 2) → each contributes log n, not n.`)
  }

  return { complexity, reasons }
}

const GROWTH: Record<string, (n: number) => number> = {
  'O(1)': () => 1,
  'O(log n)': (n) => Math.log2(n),
  'O(n)': (n) => n,
  'O(n log n)': (n) => n * Math.log2(n),
  'O(n²)': (n) => n * n,
  'O(n³)': (n) => n ** 3,
  'O(2ⁿ)': (n) => 2 ** Math.min(n, 40),
}

const SAMPLE = `for (i = 0; i < n; i++) {
    for (j = 0; j < n; j++) {
        sum = sum + a[i][j];
    }
}`

export default function ComplexityLab() {
  const [code, setCode] = useState(SAMPLE)
  const [result, setResult] = useState<Result | null>(null)

  const fmt = (x: number) => (x >= 1e9 ? x.toExponential(1) : Math.round(x).toLocaleString())

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 4px' }}>⏱ Complexity Lab</p>
      <p style={{ fontSize: 12, opacity: 0.65, margin: '0 0 10px' }}>Paste any C / Java / JS style code — I'll estimate its Big-O from the structure (loops, halving, recursion).</p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={8}
        spellCheck={false}
        style={{ width: '100%', fontSize: 12.5, fontFamily: 'monospace', padding: 12, borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', resize: 'vertical', boxSizing: 'border-box' }}
      />

      <button
        onClick={() => setResult(analyze(code))}
        style={{ marginTop: 10, fontSize: 13, fontWeight: 700, padding: '10px 20px', borderRadius: 10, border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer' }}
      >
        Measure complexity →
      </button>

      {result && (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent)', margin: '0 0 8px' }}>{result.complexity}</p>
          {result.reasons.map((r, i) => (
            <p key={i} style={{ fontSize: 12.5, lineHeight: 1.6, margin: '0 0 6px' }}>• {r}</p>
          ))}
          {GROWTH[result.complexity] && (
            <div style={{ marginTop: 10, overflowX: 'auto' }}>
              <p style={{ fontSize: 11, fontWeight: 800, opacity: 0.6, margin: '0 0 6px', textTransform: 'uppercase' }}>Roughly how many steps?</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[10, 100, 1000, 100000].map((n) => (
                  <div key={n} style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
                    <p style={{ fontSize: 10, opacity: 0.55, margin: 0 }}>n = {n.toLocaleString()}</p>
                    <p style={{ fontSize: 13, fontWeight: 800, margin: 0 }}>{fmt(GROWTH[result.complexity](n))}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p style={{ fontSize: 11, opacity: 0.5, margin: '10px 0 0' }}>⚠ This is a structural estimate for learning — tricky code can fool it. Always verify by counting the steps yourself.</p>
        </div>
      )}
    </div>
  )
}
