import MatrixDisplay from '@/components/MatrixDisplay'

export const minorsCofactorsLongQuestions = {
  easy: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>
        For the matrix below, find the minor M₁₂ and cofactor C₁₂:
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <MatrixDisplay data={[[2, 3, 1], [4, 0, 5], [1, 2, 6]]} label="A" />
      </div>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <p><strong>Step 1 — find M₁₂:</strong> delete row 1 and column 2, leaving:</p>
          <MatrixDisplay data={[[4, 5], [1, 6]]} label="Submatrix" />
          <p>M₁₂ = (4×6) − (5×1) = 24 − 5 = <strong>19</strong></p>
          <p><strong>Step 2 — find C₁₂:</strong> sign = (−1)^(1+2) = (−1)³ = −1</p>
          <p>C₁₂ = −1 × 19 = <strong>−19</strong></p>
        </div>
      </details>
    </div>
  ),
  medium: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>
        For the matrix below, find all three cofactors in the first row (C₁₁, C₁₂, C₁₃), then use them to verify the determinant using cofactor expansion:
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <MatrixDisplay data={[[1, 2, 3], [0, 4, 5], [1, 0, 6]]} label="A" />
      </div>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <p><strong>C₁₁:</strong> delete row1, col1 → [[4,5],[0,6]] → M₁₁ = 24−0 = 24. Sign (+1) → C₁₁ = 24</p>
          <p><strong>C₁₂:</strong> delete row1, col2 → [[0,5],[1,6]] → M₁₂ = 0−5 = −5. Sign (−1) → C₁₂ = 5</p>
          <p><strong>C₁₃:</strong> delete row1, col3 → [[0,4],[1,0]] → M₁₃ = 0−4 = −4. Sign (+1) → C₁₃ = −4</p>
          <p><strong>det(A)</strong> = a₁₁×C₁₁ + a₁₂×C₁₂ + a₁₃×C₁₃</p>
          <p>= 1×24 + 2×5 + 3×(−4) = 24 + 10 − 12 = <strong>22</strong></p>
        </div>
      </details>
    </div>
  ),
  hard: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>
        Build the full cofactor matrix for A, then find its transpose (called the adjugate/adjoint — needed for the inverse formula in the next lesson):
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <MatrixDisplay data={[[2, 1, 0], [0, 3, 1], [1, 0, 2]]} label="A" />
      </div>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <p><strong>All 9 cofactors:</strong></p>
          <p>C₁₁ = +det([[3,1],[0,2]]) = +(6−0) = 6</p>
          <p>C₁₂ = −det([[0,1],[1,2]]) = −(0−1) = 1</p>
          <p>C₁₃ = +det([[0,3],[1,0]]) = +(0−3) = −3</p>
          <p>C₂₁ = −det([[1,0],[0,2]]) = −(2−0) = −2</p>
          <p>C₂₂ = +det([[2,0],[1,2]]) = +(4−0) = 4</p>
          <p>C₂₃ = −det([[2,1],[1,0]]) = −(0−1) = 1</p>
          <p>C₃₁ = +det([[1,0],[3,1]]) = +(1−0) = 1</p>
          <p>C₃₂ = −det([[2,0],[0,1]]) = −(2−0) = −2</p>
          <p>C₃₃ = +det([[2,1],[0,3]]) = +(6−0) = 6</p>
          <p><strong>Cofactor matrix:</strong></p>
          <MatrixDisplay data={[[6, 1, -3], [-2, 4, 1], [1, -2, 6]]} label="Cofactor matrix" />
          <p><strong>Adjugate</strong> (transpose of cofactor matrix):</p>
          <MatrixDisplay data={[[6, -2, 1], [1, 4, -2], [-3, 1, 6]]} label="adj(A)" />
          <p>This adjugate is exactly what you divide by det(A) to get the inverse — preview of the next lesson!</p>
        </div>
      </details>
    </div>
  ),
}