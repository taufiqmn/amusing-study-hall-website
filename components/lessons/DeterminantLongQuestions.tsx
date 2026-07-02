import MatrixDisplay from '@/components/MatrixDisplay'

export const determinantLongQuestions = {
  easy: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>Find the determinant of this 2×2 matrix:</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <MatrixDisplay data={[[6, 2], [3, 5]]} label="A" />
      </div>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <p>det(A) = (6×5) − (2×3) = 30 − 6 = <strong>24</strong></p>
          <p>Since det ≠ 0, this matrix has an inverse.</p>
        </div>
      </details>
    </div>
  ),
  medium: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>Find the determinant of this 3×3 matrix using cofactor expansion along the first row:</p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <MatrixDisplay data={[[2, 1, 3], [0, 4, 1], [5, 2, 0]]} label="A" />
      </div>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <p>Expand along row 1 with signs +, −, +:</p>
          <p>= 2 × det([[4,1],[2,0]]) − 1 × det([[0,1],[5,0]]) + 3 × det([[0,4],[5,2]])</p>
          <p>= 2×(0−2) − 1×(0−5) + 3×(0−20)</p>
          <p>= 2×(−2) − 1×(−5) + 3×(−20)</p>
          <p>= −4 + 5 − 60 = <strong>−59</strong></p>
          <p>Since det ≠ 0, this matrix is invertible.</p>
        </div>
      </details>
    </div>
  ),
  hard: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>
        Given the matrix below, find its determinant. Then determine: (a) does an inverse exist? (b) what is det(Aᵀ)?
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <MatrixDisplay data={[[3, 0, 2], [1, 4, 0], [0, 1, 5]]} label="A" />
      </div>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <p>Expand along row 1:</p>
          <p>= 3 × det([[4,0],[1,5]]) − 0 × det([[1,0],[0,5]]) + 2 × det([[1,4],[0,1]])</p>
          <p>= 3×(20−0) − 0 + 2×(1−0)</p>
          <p>= 3×20 + 2×1 = 60 + 2 = <strong>62</strong></p>
          <p><strong>(a)</strong> Since det = 62 ≠ 0, the inverse exists ✓</p>
          <p><strong>(b)</strong> det(Aᵀ) = det(A) = <strong>62</strong> — transposing never changes the determinant.</p>
        </div>
      </details>
    </div>
  ),
}