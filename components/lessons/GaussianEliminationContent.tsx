'use client'

import { useState, useMemo } from 'react'
import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'
import PracticeSection from '@/components/PracticeSection'
import { gaussianEliminationLongQuestions } from '@/components/lessons/GaussianEliminationLongQuestions'

// Working example (augmented matrix): x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2 → x=1,y=2,z=3
type Step = { matrix: number[][]; note: string }

function buildGaussianSteps(): Step[] {
  const steps: Step[] = []
  let m = [[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]]
  steps.push({ matrix: m.map((r) => [...r]), note: 'Start with the augmented matrix [A | B].' })

  // R2 := R2 - 2*R1
  m = m.map((r) => [...r])
  m[1] = m[1].map((v, i) => v - 2 * m[0][i])
  steps.push({ matrix: m.map((r) => [...r]), note: 'R2 := R2 − 2·R1 → eliminate x from row 2.' })

  // R3 := R3 - R1
  m[2] = m[2].map((v, i) => v - 1 * m[0][i])
  steps.push({ matrix: m.map((r) => [...r]), note: 'R3 := R3 − 1·R1 → eliminate x from row 3.' })

  // R3 := R3 - (R2/R2[1])*R3[1]  -> eliminate y from row3 using row2
  const factor = m[2][1] / m[1][1]
  m[2] = m[2].map((v, i) => v - factor * m[1][i])
  steps.push({ matrix: m.map((r) => [...r]), note: `R3 := R3 − (${factor.toFixed(2)})·R2 → eliminate y from row 3. Matrix is now in row-echelon form (upper triangular).` })

  // Back substitution notes are textual only (matrix stays the same)
  const z = m[2][3] / m[2][2]
  steps.push({ matrix: m.map((r) => [...r]), note: `Back-substitute: from row 3 → ${m[2][2]}z = ${m[2][3]} → z = ${z}` })
  const y = (m[1][3] - m[1][2] * z) / m[1][1]
  steps.push({ matrix: m.map((r) => [...r]), note: `From row 2 → ${m[1][1]}y + ${m[1][2]}z = ${m[1][3]} → y = ${y}` })
  const x = m[0][3] - m[0][1] * y - m[0][2] * z
  steps.push({ matrix: m.map((r) => [...r]), note: `From row 1 → x + y + z = 6 → x = ${x}` })

  return steps
}

function GaussianVisualizer() {
  const steps = useMemo(() => buildGaussianSteps(), [])
  const [idx, setIdx] = useState(0)
  const s = steps[idx]

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MatrixDisplay data={s.matrix} label="Augmented matrix [A | B]" />
      </div>
      <p style={{ fontSize: 13, textAlign: 'center', color: 'var(--accent)', fontWeight: 600, minHeight: 34 }}>{s.note}</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
        <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} style={btnStyle(true, idx === 0)}>← Prev</button>
        <span style={{ fontSize: 12, alignSelf: 'center', opacity: 0.6 }}>Step {idx + 1} / {steps.length}</span>
        <button onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))} disabled={idx === steps.length - 1} style={btnStyle(false, idx === steps.length - 1)}>Next →</button>
      </div>
    </div>
  )
}

function btnStyle(ghost: boolean, disabled: boolean): React.CSSProperties {
  return { padding: '8px 18px', borderRadius: 8, border: ghost ? '1px solid var(--card-border)' : 'none', background: ghost ? 'transparent' : 'var(--accent)', color: ghost ? 'var(--foreground)' : '#fff', fontWeight: 700, fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1 }
}

export default function GaussianEliminationContent({ lessonId }: { lessonId: string }) {
  return (
    <div>
      <GaussianVisualizer />

      <Accordion title="1. What is Gaussian Elimination?" defaultOpen>
        <p>A systematic way to solve linear systems by using row operations to transform the augmented matrix [A | B] into <strong>row-echelon form</strong> (a triangular shape with zeros below the diagonal), then solving via back-substitution.</p>
      </Accordion>

      <Accordion title="2. The Three Allowed Row Operations">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Swap two rows</li>
          <li>Multiply a row by a nonzero constant</li>
          <li>Add a multiple of one row to another row</li>
        </ul>
        <p style={{ marginTop: 8 }}>These operations never change the solution set — they just rewrite the same system in a more convenient form.</p>
      </Accordion>

      <Accordion title="3. Row-Echelon Form">
        <pre style={preStyle}>{`[ a  b  c | d ]
[ 0  e  f | g ]
[ 0  0  h | i ]`}</pre>
        <p>Notice the "staircase" of zeros below the diagonal. Once here, solve the last row first (1 unknown), then substitute upward — this is <strong>back-substitution</strong>.</p>
      </Accordion>

      <Accordion title="4. Common Trap: Zero Pivot">
        <p>If a pivot element (the diagonal entry you're dividing by) is 0, you cannot use it directly — you must first swap that row with a row below it that has a nonzero entry in that column. Skipping this check leads to division by zero.</p>
      </Accordion>

      <Accordion title="5. Gaussian Elimination vs Cramer's Rule">
        <p>Elimination scales much better to large systems (n equations) than Cramer's Rule, which needs n+1 determinant calculations. Elimination is what's actually used in real-world numerical software.</p>
      </Accordion>

      <RevealQuestion
        question="Why can't we just multiply a row by 0 as a valid row operation?"
        answer="Multiplying by 0 destroys information — that row's equation would vanish entirely, changing the system's solution set. Row operations must be reversible; multiplying by 0 isn't."
      />
      <RevealQuestion
        question="After reaching row-echelon form, why do we solve the LAST row first, not the first?"
        answer="The last row has the fewest unknowns (often just one, after elimination) — solving it first gives a known value to substitute into the row above, which is why it's called back-substitution."
      />

      <div style={{ marginTop: 24 }}>
        <PracticeSection lessonId={lessonId} longQuestions={gaussianEliminationLongQuestions} />
      </div>
    </div>
  )
}

const preStyle: React.CSSProperties = { background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: '12px 14px', fontSize: 12, overflowX: 'auto', marginBottom: 8 }
