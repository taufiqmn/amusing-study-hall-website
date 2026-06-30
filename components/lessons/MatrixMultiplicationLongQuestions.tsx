import MatrixDisplay from '@/components/MatrixDisplay'

export const matrixMultiplicationLongQuestions = {
  easy: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>Multiply: MATRIX_A × MATRIX_B</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        <MatrixDisplay data={[[2, 0], [1, 3]]} label="A" />
        <MatrixDisplay data={[[4, 1], [2, 5]]} label="B" />
      </div>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal full solution</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <p>Entry (1,1): row1 of A [2,0] · col1 of B [4,2] = 2×4 + 0×2 = 8</p>
          <p>Entry (1,2): row1 of A [2,0] · col2 of B [1,5] = 2×1 + 0×5 = 2</p>
          <p>Entry (2,1): row2 of A [1,3] · col1 of B [4,2] = 1×4 + 3×2 = 10</p>
          <p>Entry (2,2): row2 of A [1,3] · col2 of B [1,5] = 1×1 + 3×5 = 16</p>
          <MatrixDisplay data={[[8, 2], [10, 16]]} label="Result A×B" />
        </div>
      </details>
    </div>
  ),
  medium: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>
        Matrix A is 2×3 and matrix B is 3×2. Compute A×B given the matrices below, and explain why B×A would have a different size.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        <MatrixDisplay data={[[1, 2, 0], [3, 1, 4]]} label="A" />
        <MatrixDisplay data={[[2, 1], [0, 3], [1, 2]]} label="B" />
      </div>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal full solution</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <p><strong>Step 1 — check compatibility:</strong> A is 2×3, B is 3×2. A's columns (3) = B's rows (3) ✓. Result will be 2×2.</p>
          <p>Entry (1,1): [1,2,0]·[2,0,1] = 1×2+2×0+0×1 = 2</p>
          <p>Entry (1,2): [1,2,0]·[1,3,2] = 1×1+2×3+0×2 = 7</p>
          <p>Entry (2,1): [3,1,4]·[2,0,1] = 3×2+1×0+4×1 = 10</p>
          <p>Entry (2,2): [3,1,4]·[1,3,2] = 3×1+1×3+4×2 = 14</p>
          <MatrixDisplay data={[[2, 7], [10, 14]]} label="A×B (2×2)" />
          <p><strong>Why B×A differs in size:</strong> B is 3×2, A is 2×3. B's columns (2) = A's rows (2) ✓, so B×A IS valid too — but the result size follows B's rows × A's columns = 3×3, completely different from A×B's 2×2 result.</p>
        </div>
      </details>
    </div>
  ),
  hard: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>
        Given A = [[1,2],[3,4]] and the identity matrix I (2×2), compute A×I and I×A. Then compute A×A (this is called A², matrix "squared"). What do you notice about A×I vs I×A, and is A² the same as squaring each individual entry of A?
      </p>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal full solution</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <p><strong>A×I:</strong> row1[1,2]·col1[1,0]=1, row1[1,2]·col2[0,1]=2, row2[3,4]·col1[1,0]=3, row2[3,4]·col2[0,1]=4 → result is [[1,2],[3,4]] = A itself, unchanged.</p>
          <p><strong>I×A:</strong> by the same logic, also gives [[1,2],[3,4]] = A, unchanged.</p>
          <p><strong>Observation:</strong> A×I = I×A = A — the identity matrix is the one special case where order doesn't matter.</p>
          <p><strong>A² (A×A):</strong> row1[1,2]·col1[1,3]=1×1+2×3=7, row1[1,2]·col2[2,4]=1×2+2×4=10, row2[3,4]·col1[1,3]=3×1+4×3=15, row2[3,4]·col2[2,4]=3×2+4×4=22</p>
          <MatrixDisplay data={[[7, 10], [15, 22]]} label="A² = A×A" />
          <p><strong>Is this entry-by-entry squaring?</strong> No! Squaring each entry of A individually would give [[1,4],[9,16]] — completely different from the real A² = [[7,10],[15,22]]. This is a critical trap: matrix "squaring" follows the full row×column multiplication rule, never simple entry-by-entry squaring.</p>
        </div>
      </details>
    </div>
  ),
}