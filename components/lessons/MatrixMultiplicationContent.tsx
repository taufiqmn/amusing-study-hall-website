import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'

export default function MatrixMultiplicationContent() {
  return (
    <div>
      <Accordion title="1. Why isn't this just 'multiply matching positions' like addition?">
        <p>This is the #1 thing that trips students up. After learning addition (position-by-position), it's natural to assume multiplication works the same way. <strong>It doesn't.</strong> Matrix multiplication uses a completely different rule: row × column, not position × position.</p>
      </Accordion>

      <Accordion title="2. The size rule — checking compatibility first">
        <p>Before multiplying, check: can these matrices even be multiplied? The rule: for A × B, the number of <strong>columns in A</strong> must equal the number of <strong>rows in B</strong>.</p>
        <p>If A is 2×3 and B is 3×4 — the "3"s match (A's columns = B's rows) — so multiplication is allowed, and the result will be 2×4 (outer numbers).</p>
      </Accordion>

      <Accordion title="3. How do you actually compute an entry?">
        <p>Each entry in the result comes from taking a <strong>full row</strong> of A and a <strong>full column</strong> of B, multiplying matching positions together, then adding those products up.</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <MatrixDisplay data={[[1, 2], [3, 4]]} label="A (2×2)" />
          <span style={{ fontSize: 20, fontWeight: 700 }}>×</span>
          <MatrixDisplay data={[[5, 6], [7, 8]]} label="B (2×2)" />
          <span style={{ fontSize: 20, fontWeight: 700 }}>=</span>
          <MatrixDisplay data={[[19, 22], [43, 50]]} label="A×B" />
        </div>
        <p>To get the top-left entry (19): take row 1 of A [1,2], and column 1 of B [5,7]. Multiply matching positions: 1×5=5, 2×7=14. Add them: 5+14=19.</p>
      </Accordion>

      <Accordion title="4. Doing it step-by-step, slowly">
        <p>Top-right entry: row 1 of A [1,2] × column 2 of B [6,8] → 1×6 + 2×8 = 6+16 = 22 ✓</p>
        <p>Bottom-left entry: row 2 of A [3,4] × column 1 of B [5,7] → 3×5 + 4×7 = 15+28 = 43 ✓</p>
        <p>Bottom-right entry: row 2 of A [3,4] × column 2 of B [6,8] → 3×6 + 4×8 = 18+32 = 50 ✓</p>
      </Accordion>

      <Accordion title="5. The big trap: A×B ≠ B×A">
        <p>Unlike regular numbers (where 3×5 = 5×3), matrix multiplication is <strong>NOT commutative</strong>. Order matters enormously — A×B and B×A can give completely different results, or one might not even be valid while the other is.</p>
      </Accordion>

      <Accordion title="6. Quick Properties Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>A×B works only if A's columns = B's rows</li>
          <li>Result size = (A's rows) × (B's columns)</li>
          <li>Each entry = (row of A) · (column of B), multiply-then-add</li>
          <li>A×B ≠ B×A in general — order matters</li>
          <li>A × Identity = A (identity acts like "1")</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="Can you multiply a 3×2 matrix by a 2×5 matrix? If so, what size is the result?"
        answer="Yes — A's columns (2) match B's rows (2). Result size = 3×5 (outer numbers)."
      />

      <RevealQuestion
        question="Can you multiply a 4×3 matrix by a 5×2 matrix?"
        answer="No — A's columns (3) don't match B's rows (5). This multiplication is undefined."
      />
    </div>
  )
}