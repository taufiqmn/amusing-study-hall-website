import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'

export default function TraceContent() {
  return (
    <div>
      <Accordion title="1. What is the Trace?">
        <p>Here's the surprise: the trace is actually one of the *simplest* operations in this whole course. It's just the sum of the entries sitting on the <strong>main diagonal</strong> — the line of entries where row number equals column number (a₁₁, a₂₂, a₃₃...).</p>
        <MatrixDisplay data={[[4, 1, 2], [0, 5, 3], [1, 2, 6]]} label="Diagonal entries: 4, 5, 6 → Trace = 15" />
      </Accordion>

      <Accordion title="2. Why only the diagonal? What about the rest?">
        <p>Every other number is completely ignored — only positions where row = column count. In the matrix above, the diagonal entries are 4 (row1,col1), 5 (row2,col2), and 6 (row3,col3). Everything else (1, 2, 0, 3, 1, 2) doesn't matter for the trace.</p>
      </Accordion>

      <Accordion title="3. Important rule: Trace only exists for square matrices">
        <p>A non-square matrix (like 2×3) doesn't have a clean main diagonal that covers the whole matrix evenly, so <strong>trace is only defined for square matrices</strong> (rows = columns).</p>
      </Accordion>

      <Accordion title="4. Quick Properties Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Trace = sum of main diagonal entries only</li>
          <li>Only defined for square matrices</li>
          <li>Trace(A) = Trace(Aᵀ) — transposing doesn't change the trace (diagonal stays the same)</li>
          <li>Trace(A+B) = Trace(A) + Trace(B)</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="Find the trace of [[3,7],[2,9]]"
        answer="Answer: 3 + 9 = 12. Only the diagonal entries (top-left, bottom-right) count."
      />

      <RevealQuestion
        question="Can you find the trace of a 2×3 matrix? Why or why not?"
        answer="No. Trace is only defined for square matrices, since a 2×3 matrix doesn't have a complete, well-defined main diagonal."
      />

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '16px 18px', marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📝 Long Question</p>
        <p style={{ fontSize: 13, marginBottom: 10 }}>
          Given matrix A = [[5,2,1],[0,8,4],[3,1,2]], find Trace(A), then find Trace(2A). What relationship do you notice?
        </p>
        <details>
          <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal full solution</summary>
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7 }}>
            <p><strong>Step 1:</strong> Trace(A) = diagonal entries = 5 + 8 + 2 = 15</p>
            <p><strong>Step 2:</strong> 2A means every entry is multiplied by 2, including the diagonal: new diagonal = 10, 16, 4</p>
            <p><strong>Step 3:</strong> Trace(2A) = 10 + 16 + 4 = 30</p>
            <p><strong>Relationship:</strong> Trace(2A) = 2 × Trace(A) (15 × 2 = 30). Scalar multiplication scales the trace by the same factor.</p>
          </div>
        </details>
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(226,92,92,0.08), rgba(243,203,75,0.08))', border: '1px solid #e25c5c', borderRadius: 12, padding: '16px 18px', marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: '#e25c5c' }}>🔥 Challenge Question</p>
        <p style={{ fontSize: 13, marginBottom: 10 }}>
          If Trace(A) = 20 for a 4×4 matrix, and three of its four diagonal entries are 6, 5, and -3, what is the fourth diagonal entry? Then: if every diagonal entry were instead increased by 2, what would the new trace be?
        </p>
        <details>
          <summary style={{ fontSize: 12, color: '#e25c5c', cursor: 'pointer', fontWeight: 700 }}>Click to reveal solution</summary>
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7 }}>
            <p><strong>Step 1:</strong> 6 + 5 + (-3) = 8. Trace = 20, so the fourth entry = 20 - 8 = 12.</p>
            <p><strong>Step 2:</strong> A 4×4 matrix has 4 diagonal entries. If each increases by 2, total increase = 4 × 2 = 8.</p>
            <p><strong>New trace</strong> = 20 + 8 = 28.</p>
          </div>
        </details>
      </div>
    </div>
  )
}