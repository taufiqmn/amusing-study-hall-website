import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'

export default function DeterminantContent() {
  return (
    <div>
      <Accordion title="1. What is a determinant, and why does it matter?">
        <p>The determinant is a <strong>single number</strong> you can calculate from any square matrix. It sounds simple, but this one number reveals crucial information: most importantly, whether the matrix has an inverse (which you'll use constantly in later topics). If the determinant is 0, the matrix has no inverse — that's called a <strong>singular matrix</strong>. If it's nonzero, an inverse exists.</p>
      </Accordion>

   <Accordion title="2. The 2×2 determinant — the simplest case">
        <p>For a 2×2 matrix, the rule is beautifully simple: <strong>multiply the main diagonal, subtract the product of the other diagonal</strong>.</p>
        <p style={{ textAlign: 'center', fontWeight: 600, fontSize: 15 }}>det([[a, b],[c, d]]) = ad − bc</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          <MatrixDisplay data={[[3, 2], [1, 4]]} label="Example: A" />
        </div>
        <p style={{ textAlign: 'center' }}>det(A) = (3×4) − (2×1) = 12 − 2 = <strong>10</strong></p>
      </Accordion>

      <Accordion title="3. The 3×3 determinant — cofactor expansion">
        <p>For 3×3 matrices, we use <strong>cofactor expansion along the first row</strong>. Each entry in the top row multiplies a 2×2 "sub-determinant" formed by hiding its own row and column, with alternating +/− signs.</p>
        <MatrixDisplay data={[[1, 2, 3], [4, 5, 6], [7, 8, 9]]} label="A" />
        <p>det(A) = 1 × det([[5,6],[8,9]]) − 2 × det([[4,6],[7,9]]) + 3 × det([[4,5],[7,8]])</p>
        <p>= 1×(45−48) − 2×(36−42) + 3×(32−35)</p>
        <p>= 1×(−3) − 2×(−6) + 3×(−3)</p>
        <p>= −3 + 12 − 9 = <strong>0</strong></p>
        <p style={{ color: 'var(--accent)', fontWeight: 600 }}>Notice: det = 0 means this specific matrix has no inverse.</p>
      </Accordion>

      <Accordion title="4. The sign pattern — easy to remember">
        <p>When expanding along any row or column, the signs alternate in a checkerboard pattern:</p>
        <MatrixDisplay data={[[1, -1, 1], [-1, 1, -1], [1, -1, 1]]} label="Sign pattern for 3×3" />
        <p>So the top row always uses: +, −, + (which is why we had +1×..., −2×..., +3×... above).</p>
      </Accordion>

      <Accordion title="5. Quick Properties Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Determinant only exists for square matrices</li>
          <li>det = 0 → singular (no inverse)</li>
          <li>det ≠ 0 → invertible (inverse exists)</li>
          <li>det(Aᵀ) = det(A) — transposing doesn't change the determinant</li>
          <li>Swapping two rows flips the sign of the determinant</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="Find the determinant of MATRIX:[[5,3],[2,4]]"
        answer="det = (5×4) − (3×2) = 20 − 6 = 14"
      />

      <RevealQuestion
        question="If det(A) = 0, what does this tell you about the matrix?"
        answer="The matrix is singular — it has no inverse. This is a crucial check before attempting to find any inverse."
      />
    </div>
  )
}