'use client'

import { useState, useMemo } from 'react'
import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'
import PracticeSection from '@/components/PracticeSection'
import { gaussJordanLongQuestions } from '@/components/lessons/GaussJordanEliminationLongQuestions'

type Step = { matrix: number[][]; note: string }

function round(v: number) {
  return Math.round(v * 1000) / 1000
}

// Working example: x + y + z = 6, 2x - y + z = 3, x + 2y - z = 2 -> x=1,y=2,z=3
function buildGaussJordanSteps(): Step[] {
  const steps: Step[] = []
  let m = [[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]]
  steps.push({ matrix: m.map((r) => [...r]), note: 'Start with the augmented matrix [A | B].' })

  m = m.map((r) => [...r])
  m[1] = m[1].map((v, i) => round(v - 2 * m[0][i]))
  steps.push({ matrix: m.map((r) => [...r]), note: 'R2 := R2 − 2·R1 → eliminate x below the first pivot.' })

  m[2] = m[2].map((v, i) => round(v - 1 * m[0][i]))
  steps.push({ matrix: m.map((r) => [...r]), note: 'R3 := R3 − 1·R1 → eliminate x from row 3.' })

  const f1 = m[1][1]
  m[1] = m[1].map((v) => round(v / f1))
  steps.push({ matrix: m.map((r) => [...r]), note: `R2 := R2 / ${f1} → make the pivot in row 2 equal 1.` })

  const f2 = m[2][1]
  m[2] = m[2].map((v, i) => round(v - f2 * m[1][i]))
  steps.push({ matrix: m.map((r) => [...r]), note: `R3 := R3 − (${f2})·R2 → eliminate y below the row 2 pivot.` })

  const f3 = m[2][2]
  m[2] = m[2].map((v) => round(v / f3))
  steps.push({ matrix: m.map((r) => [...r]), note: `R3 := R3 / ${f3} → make the pivot in row 3 equal 1. Row-echelon form reached.` })

  // Now eliminate upward (Gauss-Jordan's key difference from plain Gaussian elimination)
  const g1 = m[1][2]
  m[1] = m[1].map((v, i) => round(v - g1 * m[2][i]))
  steps.push({ matrix: m.map((r) => [...r]), note: `R2 := R2 − (${g1})·R3 → eliminate z ABOVE the row 3 pivot. This upward elimination is what makes it "Gauss-Jordan."` })

  const h1 = m[0][2]
  m[0] = m[0].map((v, i) => round(v - h1 * m[2][i]))
  steps.push({ matrix: m.map((r) => [...r]), note: `R1 := R1 − (${h1})·R3 → eliminate z from row 1 too.` })

  const h2 = m[0][1]
  m[0] = m[0].map((v, i) => round(v - h2 * m[1][i]))
  steps.push({ matrix: m.map((r) => [...r]), note: `R1 := R1 − (${h2})·R2 → eliminate y from row 1. Left side is now the identity matrix — read the solution directly from the last column!` })

  return steps
}

function GaussJordanVisualizer() {
  const steps = useMemo(() => buildGaussJordanSteps(), [])
  const [idx, setIdx] = useState(0)
  const s = steps[idx]
  const isDone = idx === steps.length - 1

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MatrixDisplay data={s.matrix} label={isDone ? 'Reduced row-echelon form [I | X]' : 'Augmented matrix [A | B]'} />
      </div>
      <p style={{ fontSize: 13, textAlign: 'center', color: 'var(--accent)', fontWeight: 600, minHeight: 34 }}>{s.note}</p>
      {isDone && (
        <p style={{ fontSize: 13, textAlign: 'center', fontWeight: 700 }}>
          x = {s.matrix[0][3]}, &nbsp; y = {s.matrix[1][3]}, &nbsp; z = {s.matrix[2][3]}
        </p>
      )}
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

export default function GaussJordanEliminationContent({ lessonId }: { lessonId: string }) {
  return (
    <div>
      <GaussJordanVisualizer />

      <Accordion title="1. What is Gauss-Jordan Elimination?" defaultOpen>
        <p>An extension of Gaussian elimination that continues past row-echelon form all the way to <strong>reduced row-echelon form</strong> — where the left side becomes the identity matrix. The solution can then be read directly off the last column, with no back-substitution needed.</p>
      </Accordion>

      <Accordion title="2. Gaussian Elimination vs Gauss-Jordan">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li><strong>Gaussian elimination</strong>: stops at row-echelon form (upper triangular), then needs back-substitution.</li>
          <li><strong>Gauss-Jordan</strong>: keeps going, eliminating entries <em>above</em> each pivot too, until the identity matrix appears. No back-substitution step at all.</li>
        </ul>
      </Accordion>

      <Accordion title="3. Reduced Row-Echelon Form">
        <pre style={preStyle}>{`[ 1  0  0 | x ]
[ 0  1  0 | y ]
[ 0  0  1 | z ]`}</pre>
        <p>Every pivot is exactly 1, and every other entry in a pivot's column is 0 — both above and below. That's the defining feature of reduced row-echelon form.</p>
      </Accordion>

      <Accordion title="4. Why Divide Each Pivot to 1?">
        <p>Making the pivot equal to 1 (by dividing the whole row) simplifies every later elimination step — multiplying by the pivot's row to cancel other rows becomes a clean subtraction rather than juggling fractions throughout.</p>
      </Accordion>

      <Accordion title="5. Using Gauss-Jordan for Matrix Inverse">
        <p>A powerful application: augment A with the identity matrix, [A | I], then row-reduce until the left side becomes I. What remains on the right is A⁻¹ — i.e., [A | I] → [I | A⁻¹].</p>
      </Accordion>

      <RevealQuestion
        question="What's the main practical trade-off of Gauss-Jordan vs plain Gaussian elimination?"
        answer="Gauss-Jordan does more total row operations (eliminating both above and below each pivot) but skips back-substitution entirely. For solving a single system, Gaussian elimination is usually slightly more efficient; Gauss-Jordan is preferred when you need the fully reduced form, like for computing a matrix inverse."
      />
      <RevealQuestion
        question="In reduced row-echelon form, if a row reads [0, 0, 0 | 5], what does that mean?"
        answer="That row represents the equation 0 = 5, a contradiction — the system has NO solution. This is a classic trap: always check for an all-zero row with a nonzero constant."
      />

      <div style={{ marginTop: 24 }}>
        <PracticeSection lessonId={lessonId} longQuestions={gaussJordanLongQuestions} />
      </div>
    </div>
  )
}

const preStyle: React.CSSProperties = { background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: '12px 14px', fontSize: 12, overflowX: 'auto', marginBottom: 8 }
