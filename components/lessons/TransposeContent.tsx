import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'

export default function TransposeContent() {
  return (
    <div>
      <Accordion title="1. What does 'transpose' even mean?">
        <p>Picture grabbing a matrix and flipping it along its diagonal — every row becomes a column, and every column becomes a row. That's it. We write the transpose of A as <strong>Aᵀ</strong>.</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <MatrixDisplay data={[[1, 2, 3], [4, 5, 6]]} label="A (2×3)" />
          <span style={{ fontSize: 20, fontWeight: 700 }}>→</span>
          <MatrixDisplay data={[[1, 4], [2, 5], [3, 6]]} label="Aᵀ (3×2)" />
        </div>
      </Accordion>

      <Accordion title="2. How do I actually do it, step by step?">
        <p>The simplest trick: <strong>the first row of A becomes the first column of Aᵀ.</strong> The second row becomes the second column. And so on.</p>
        <p>Notice in the example above: row 1 of A was [1, 2, 3] — and that's now exactly column 1 of Aᵀ, read top to bottom.</p>
      </Accordion>

      <Accordion title="3. What happens to the size?">
        <p>If A is m×n, then Aᵀ is <strong>n×m</strong> — the size flips. A 2×3 matrix becomes 3×2 after transposing, exactly what you saw above.</p>
      </Accordion>

      <Accordion title="4. Special case: square matrices">
        <p>If A is square (say 3×3), Aᵀ is still 3×3 — the size doesn't change, but the entries still move (unless the matrix happens to be symmetric, a special case we'll cover soon).</p>
      </Accordion>

      <Accordion title="5. Quick Properties Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Aᵀ flips rows into columns</li>
          <li>If A is m×n, Aᵀ is n×m</li>
          <li>(Aᵀ)ᵀ = A — transposing twice gets you back to the original</li>
          <li>Trace(A) = Trace(Aᵀ) — the diagonal never moves during a transpose</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="What is the transpose of [[7,2],[5,9],[1,3]]?"
        answer="Answer: [[7,5,1],[2,9,3]]. The first row [7,2] becomes the first column; the second row [5,9] becomes the second column; the third row [1,3] becomes the third column."
      />

      <RevealQuestion
        question="If matrix A is 4×7, what is the size of Aᵀ?"
        answer="Answer: 7×4. The size always flips — rows and columns swap."
      />

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '16px 18px', marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📝 Long Question</p>
        <p style={{ fontSize: 13, marginBottom: 10 }}>
          Given A = [[2,9],[6,1]], find Aᵀ. Then find (Aᵀ)ᵀ. What do you notice, and why does this make sense?
        </p>
        <details>
          <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal full solution</summary>
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7 }}>
            <p><strong>Step 1:</strong> Aᵀ — flip rows to columns: row 1 [2,9] becomes column 1, row 2 [6,1] becomes column 2 → Aᵀ = [[2,6],[9,1]]</p>
            <p><strong>Step 2:</strong> (Aᵀ)ᵀ — transpose Aᵀ the same way: row 1 [2,6] becomes column 1, row 2 [9,1] becomes column 2 → [[2,9],[6,1]]</p>
            <p><strong>Observation:</strong> (Aᵀ)ᵀ = A exactly, the original matrix. Transposing twice undoes itself — it makes sense because flipping rows/columns and flipping back returns everything to where it started.</p>
          </div>
        </details>
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(226,92,92,0.08), rgba(243,203,75,0.08))', border: '1px solid #e25c5c', borderRadius: 12, padding: '16px 18px', marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: '#e25c5c' }}>🔥 Challenge Question</p>
        <p style={{ fontSize: 13, marginBottom: 10 }}>
          Matrix A is 3×5. Matrix B = Aᵀ. What is the size of Bᵀ? Without computing any actual entries, explain in one sentence why this must be true using only the size-flipping rule.
        </p>
        <details>
          <summary style={{ fontSize: 12, color: '#e25c5c', cursor: 'pointer', fontWeight: 700 }}>Click to reveal solution</summary>
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7 }}>
            <p><strong>Step 1:</strong> A is 3×5, so B = Aᵀ is 5×3 (size flips).</p>
            <p><strong>Step 2:</strong> Bᵀ flips B's size again: 5×3 → 3×5.</p>
            <p><strong>Conclusion:</strong> Bᵀ is 3×5 — the same size as the original A. This makes sense because transposing is its own inverse: flipping size twice always returns you to the starting size, since (Aᵀ)ᵀ = A always holds.</p>
          </div>
        </details>
      </div>
    </div>
  )
}