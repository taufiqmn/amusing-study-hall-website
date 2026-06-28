import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'

export default function MatrixTypesContent() {
  return (
    <div>
      <Accordion title="1. Rectangular Matrix">
        <p>This is just the general case — any matrix where rows ≠ columns. Nothing special required, just the basic shape.</p>
        <MatrixDisplay data={[[1, 2, 3], [4, 5, 6]]} label="Rectangular (2×3)" />
      </Accordion>

      <Accordion title="2. Row Matrix">
        <p>Exactly <strong>1 row</strong>, any number of columns. Think of it as a matrix squashed flat horizontally.</p>
        <MatrixDisplay data={[[7, 2, 9, 4]]} label="Row matrix (1×4)" />
      </Accordion>

      <Accordion title="3. Column Matrix">
        <p>The opposite — exactly <strong>1 column</strong>, any number of rows. Squashed flat vertically instead.</p>
        <MatrixDisplay data={[[3], [8], [1]]} label="Column matrix (3×1)" />
      </Accordion>

      <Accordion title="4. Square Matrix">
        <p>Rows = Columns. This is the special shape that unlocks operations like trace and (later) determinants and inverses — those only work on square matrices.</p>
        <MatrixDisplay data={[[2, 5], [1, 9]]} label="Square matrix (2×2)" />
      </Accordion>

      <Accordion title="5. Main Diagonal of a Matrix">
        <p>For a square matrix, the main diagonal is the line of entries where row number = column number (a₁₁, a₂₂, a₃₃...). You already met this in the Trace lesson.</p>
        <MatrixDisplay data={[[4, 1, 2], [0, 5, 3], [1, 2, 6]]} label="Main diagonal: 4, 5, 6" />
      </Accordion>

      <Accordion title="6. Diagonal Matrix">
        <p>A square matrix where <strong>every entry off the main diagonal is 0</strong>. The diagonal entries themselves can be anything.</p>
        <MatrixDisplay data={[[5, 0, 0], [0, 3, 0], [0, 0, 8]]} label="Diagonal matrix" />
      </Accordion>

      <Accordion title="7. Identity Matrix">
        <p>A special diagonal matrix where every diagonal entry is exactly <strong>1</strong>. Written as I — it behaves like the number "1" does in regular multiplication (multiplying anything by I leaves it unchanged, a property we'll use a lot later).</p>
        <MatrixDisplay data={[[1, 0, 0], [0, 1, 0], [0, 0, 1]]} label="Identity matrix (I₃)" />
      </Accordion>

      <Accordion title="8. Scalar Multiple of a Matrix">
        <p>Not a "shape" type like the others — this means multiplying every single entry of a matrix by the same number (a scalar).</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>3 ×</span>
          <MatrixDisplay data={[[1, 2], [3, 4]]} />
          <span style={{ fontSize: 20, fontWeight: 700 }}>=</span>
          <MatrixDisplay data={[[3, 6], [9, 12]]} />
        </div>
      </Accordion>

      <Accordion title="9. Zero Matrix">
        <p>Exactly what it sounds like — every single entry is 0. Acts like the number "0" does in addition (adding it to any matrix changes nothing).</p>
        <MatrixDisplay data={[[0, 0], [0, 0]]} label="Zero matrix" />
      </Accordion>

      <Accordion title="10. Upper Triangular Matrix">
        <p>A square matrix where every entry <strong>below</strong> the main diagonal is 0. Entries on and above the diagonal can be anything.</p>
        <MatrixDisplay data={[[4, 7, 2], [0, 3, 5], [0, 0, 9]]} label="Upper triangular" />
      </Accordion>

      <Accordion title="11. Lower Triangular Matrix">
        <p>The mirror image — every entry <strong>above</strong> the main diagonal is 0.</p>
        <MatrixDisplay data={[[6, 0, 0], [2, 5, 0], [9, 1, 8]]} label="Lower triangular" />
      </Accordion>

      <RevealQuestion
        question="Is MATRIX:[[1,0],[0,1],[0,0]] a square matrix? What type is it instead?"
        answer="No — it's 3 rows × 2 columns, not equal, so it's not square. It's simply a rectangular matrix (no special diagonal-based type applies since it isn't square)."
      />

      <RevealQuestion
        question="What's the key difference between a diagonal matrix and an identity matrix?"
        answer="A diagonal matrix can have ANY values on its diagonal, with zeros elsewhere. An identity matrix is a stricter, special case — diagonal entries must specifically all be 1."
      />

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '16px 18px', marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📝 Long Question</p>
        <p style={{ fontSize: 13, marginBottom: 10 }}>
          Given matrix A = [[3,0,0],[0,7,0],[0,0,2]]: (a) What type(s) of matrix is A? List every type that correctly applies. (b) Find 4A. Is 4A still the same type(s)?
        </p>
        <details>
          <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal full solution</summary>
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7 }}>
            <p><strong>Part (a):</strong> A is square (3×3) ✓. It's diagonal (all off-diagonal entries are 0) ✓. It's also both upper triangular AND lower triangular at the same time (since everything off-diagonal is 0 either way) ✓. It is NOT an identity matrix, since diagonal entries are 3,7,2 — not all 1.</p>
            <p><strong>Part (b):</strong> 4A = [[12,0,0],[0,28,0],[0,0,8]]. Still square, still diagonal, still upper/lower triangular — scalar multiplication never breaks these structural properties, since multiplying 0 by anything stays 0.</p>
          </div>
        </details>
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(226,92,92,0.08), rgba(243,203,75,0.08))', border: '1px solid #e25c5c', borderRadius: 12, padding: '16px 18px', marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: '#e25c5c' }}>🔥 Challenge Question</p>
        <p style={{ fontSize: 13, marginBottom: 10 }}>
          Can a matrix be simultaneously a row matrix AND a column matrix? If yes, describe exactly what size it must be, and name this special case.
        </p>
        <details>
          <summary style={{ fontSize: 12, color: '#e25c5c', cursor: 'pointer', fontWeight: 700 }}>Click to reveal solution</summary>
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7 }}>
            <p><strong>Yes.</strong> A row matrix needs exactly 1 row. A column matrix needs exactly 1 column. The only way to satisfy both simultaneously is a matrix with exactly 1 row AND 1 column — meaning it's <strong>1×1</strong>.</p>
            <p>This is simply a single number treated as a matrix — and it's also automatically square (1=1), diagonal, upper triangular, AND lower triangular all at once, since there are no off-diagonal positions to violate any rule.</p>
          </div>
        </details>
      </div>
    </div>
  )
}