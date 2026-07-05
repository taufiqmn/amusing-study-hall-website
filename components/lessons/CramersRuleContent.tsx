'use client'

import { useState, useMemo } from 'react'
import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'
import PracticeSection from '@/components/PracticeSection'
import { cramersRuleLongQuestions } from '@/components/lessons/CramersRuleLongQuestions'

// Working example: 2x + y = 5 ; x - 3y = -8   →  x=1, y=3 (clean answer)
const COEFF = [[2, 1], [1, -3]]
const CONST = [5, -8]

function det2(m: number[][]) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0]
}
function replaceCol(m: number[][], col: number, values: number[]) {
  return m.map((row, i) => row.map((v, j) => (j === col ? values[i] : v)))
}

function CramersVisualizer() {
  const steps = useMemo(() => {
    const D = det2(COEFF)
    const Dx_matrix = replaceCol(COEFF, 0, CONST)
    const Dy_matrix = replaceCol(COEFF, 1, CONST)
    const Dx = det2(Dx_matrix)
    const Dy = det2(Dy_matrix)
    return [
      { matrix: COEFF, label: 'Coefficient matrix A', note: 'System: 2x + y = 5,  x − 3y = −8. First, write the coefficient matrix A.' },
      { matrix: COEFF, label: 'D = det(A)', note: `D = det(A) = (2×−3) − (1×1) = −6 − 1 = ${D}. Since D ≠ 0, a unique solution exists.` },
      { matrix: Dx_matrix, label: 'Dx (column 1 → constants)', note: 'Replace column 1 (x-coefficients) with the constants [5, −8] to form Dx.' },
      { matrix: Dx_matrix, label: `Dx = ${Dx}`, note: `Dx = (5×−3) − (1×−8) = −15 − (−8) = ${Dx}` },
      { matrix: Dy_matrix, label: 'Dy (column 2 → constants)', note: 'Replace column 2 (y-coefficients) with the constants [5, −8] to form Dy.' },
      { matrix: Dy_matrix, label: `Dy = ${Dy}`, note: `Dy = (2×−8) − (5×1) = −16 − 5 = ${Dy}` },
      { matrix: COEFF, label: 'Final answer', note: `x = Dx/D = ${Dx}/${D} = ${Dx / D},   y = Dy/D = ${Dy}/${D} = ${Dy / D}` },
    ]
  }, [])

  const [idx, setIdx] = useState(0)
  const s = steps[idx]

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MatrixDisplay data={s.matrix} label={s.label} />
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

export default function CramersRuleContent({ lessonId }: { lessonId: string }) {
  return (
    <div>
      <CramersVisualizer />

      <Accordion title="1. What is Cramer's Rule?" defaultOpen>
        <p>Cramer's Rule solves a system of linear equations using determinants — no elimination or substitution needed. For a system with coefficient matrix A and constants B, replace one column of A at a time with B to get a new determinant, then divide.</p>
      </Accordion>

      <Accordion title="2. The Formula (2 variables)">
        <pre style={preStyle}>{`For:  a1x + b1y = c1
      a2x + b2y = c2

D  = det([[a1,b1],[a2,b2]])
Dx = det([[c1,b1],[c2,b2]])   ← column 1 replaced
Dy = det([[a1,c1],[a2,c2]])   ← column 2 replaced

x = Dx / D
y = Dy / D`}</pre>
      </Accordion>

      <Accordion title="3. Extending to 3 variables">
        <p>The same idea scales to 3×3 systems: D uses the full 3×3 coefficient matrix, and Dx, Dy, Dz each replace one column with the constants column, then use 3×3 determinant expansion (cofactor expansion).</p>
      </Accordion>

      <Accordion title="4. When Cramer's Rule Fails">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>If <strong>D = 0</strong>, the rule cannot give a unique solution — this means either no solution exists, or infinitely many do.</li>
          <li>If D = 0 <em>and</em> Dx = Dy = 0 too → infinitely many solutions (the equations are dependent).</li>
          <li>If D = 0 but at least one of Dx, Dy ≠ 0 → no solution (inconsistent system).</li>
        </ul>
      </Accordion>

      <Accordion title="5. Cramer's Rule vs Gaussian Elimination">
        <p>Cramer's Rule is elegant for small systems (2×2, 3×3) but becomes computationally expensive for larger ones — computing several large determinants is far more work than a single Gaussian elimination pass. In practice, elimination methods scale better.</p>
      </Accordion>

      <RevealQuestion
        question="If D = 0 and Dx = 7, what does that tell you about the system?"
        answer="The system has NO solution — it's inconsistent. A nonzero Dx or Dy alongside D=0 rules out both 'unique solution' and 'infinite solutions'."
      />
      <RevealQuestion
        question="Why is column 1 of A replaced with B to find Dx, and not column 2?"
        answer="Because column 1 holds the x-coefficients in A. Replacing that specific column isolates the effect of x in the determinant ratio Dx/D, which Cramer's Rule proves equals x."
      />

      <div style={{ marginTop: 24 }}>
        <PracticeSection lessonId={lessonId} longQuestions={cramersRuleLongQuestions} />
      </div>
    </div>
  )
}

const preStyle: React.CSSProperties = { background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: '12px 14px', fontSize: 12, overflowX: 'auto', marginBottom: 8 }
