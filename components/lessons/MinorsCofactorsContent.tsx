import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'

export default function MinorsCofactorsContent() {
  return (
    <div>
      <Accordion title="1. What is a Minor?">
        <p>The <strong>minor</strong> of an entry aᵢⱼ (written Mᵢⱼ) is simply the determinant of the smaller matrix you get after <strong>deleting row i and column j entirely</strong>.</p>
        <MatrixDisplay data={[[1, 2, 3], [4, 5, 6], [7, 8, 9]]} label="Matrix A" />
        <p>To find M₁₁ (minor of entry at row 1, col 1): delete row 1 and col 1, leaving:</p>
        <MatrixDisplay data={[[5, 6], [8, 9]]} label="Remaining 2×2" />
        <p>M₁₁ = det([[5,6],[8,9]]) = (5×9) − (6×8) = 45 − 48 = <strong>−3</strong></p>
      </Accordion>

      <Accordion title="2. What is a Cofactor?">
        <p>A <strong>cofactor</strong> (written Cᵢⱼ) is just the minor with the correct +/− sign applied from the checkerboard pattern:</p>
        <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 15 }}>Cᵢⱼ = (−1)^(i+j) × Mᵢⱼ</p>
        <p>If (i+j) is even → positive sign. If (i+j) is odd → negative sign.</p>
        <MatrixDisplay data={[[1, -1, 1], [-1, 1, -1], [1, -1, 1]]} label="Sign pattern" />
        <p>So C₁₁ = (+1) × M₁₁ = (+1) × (−3) = <strong>−3</strong></p>
        <p>C₁₂ = (−1) × M₁₂ — because 1+2=3 (odd) → negative.</p>
      </Accordion>

      <Accordion title="3. Why does this matter? Connection to determinant">
        <p>The determinant formula you already know IS cofactor expansion — just now with proper names. When you expand along row 1:</p>
        <p style={{ fontWeight: 600 }}>det(A) = a₁₁×C₁₁ + a₁₂×C₁₂ + a₁₃×C₁₃</p>
        <p>Each term is an entry multiplied by its cofactor — which is exactly what you've been doing, just now with a formal definition behind it.</p>
      </Accordion>

      <Accordion title="4. The Cofactor Matrix">
        <p>If you replace every entry aᵢⱼ of matrix A with its cofactor Cᵢⱼ, you get the <strong>cofactor matrix</strong> (sometimes called the matrix of cofactors). This is a key step toward finding the inverse, which we'll cover in the next lesson.</p>
      </Accordion>

      <Accordion title="5. Quick Properties Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Minor Mᵢⱼ = det of submatrix after deleting row i and col j</li>
          <li>Cofactor Cᵢⱼ = (−1)^(i+j) × Mᵢⱼ</li>
          <li>Positions where (i+j) is even get + sign; odd positions get − sign</li>
          <li>det(A) = sum of (entry × its cofactor) along any row or column</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="For a 3×3 matrix, what sign does cofactor C₂₃ get?"
        answer="(−1)^(2+3) = (−1)^5 = −1 → negative sign. So C₂₃ = −M₂₃."
      />

      <RevealQuestion
        question="What's the difference between a minor and a cofactor?"
        answer="A minor is just the determinant of the submatrix after deleting a row and column. A cofactor is that same minor with the +/− sign applied based on position — cofactor = (−1)^(i+j) × minor."
      />
    </div>
  )
}