import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'
import MinorCofactorExplorer from '@/components/interactive/MinorCofactorExplorer'

export default function MinorsCofactorsContent() {
  return (
    <div>
      <Accordion title="1. What is a Minor?">
        <p>The <strong>minor</strong> of an entry aᵢⱼ (written Mᵢⱼ) is simply the determinant of the smaller matrix you get after <strong>deleting row i and column j entirely</strong>.</p>
        <MatrixDisplay data={[[1, 2, 3], [4, 5, 6], [7, 8, 9]]} label="Matrix A" />
        <p>To find M₁₁: delete row 1 and col 1, leaving [[5,6],[8,9]]. M₁₁ = (5×9)−(6×8) = 45−48 = <strong>−3</strong></p>
      </Accordion>

      <Accordion title="2. What is a Cofactor?">
        <p>A <strong>cofactor</strong> (Cᵢⱼ) is the minor with the correct +/− sign applied:</p>
        <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 15 }}>Cᵢⱼ = (−1)^(i+j) × Mᵢⱼ</p>
        <p>Even (i+j) → positive. Odd (i+j) → negative.</p>
      </Accordion>

      <Accordion title="3. Connection to determinant">
        <p>det(A) = a₁₁×C₁₁ + a₁₂×C₁₂ + a₁₃×C₁₃ along any row or column.</p>
      </Accordion>

      <Accordion title="4. The Cofactor Matrix and Adjugate">
        <p>Replace every entry with its cofactor → cofactor matrix. Transpose that → <strong>adjugate adj(A)</strong>. This is used in the inverse formula: A⁻¹ = adj(A)/det(A).</p>
      </Accordion>

      <Accordion title="5. Quick Properties Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Mᵢⱼ = det of submatrix after deleting row i, col j</li>
          <li>Cᵢⱼ = (−1)^(i+j) × Mᵢⱼ</li>
          <li>Even (i+j) → +, Odd → −</li>
          <li>adj(A) = transpose of cofactor matrix</li>
          <li>A⁻¹ = adj(A)/det(A) when det≠0</li>
        </ul>
      </Accordion>

      <MinorCofactorExplorer />

      <RevealQuestion
        question="For a 3×3 matrix, what sign does cofactor C₂₃ get?"
        answer="(−1)^(2+3) = (−1)^5 = −1 → negative sign. C₂₃ = −M₂₃."
      />

      <RevealQuestion
        question="What's the difference between the cofactor matrix and the adjugate?"
        answer="The cofactor matrix has every entry replaced by its cofactor. The adjugate is the TRANSPOSE of the cofactor matrix — they are different. The adjugate is what's used in the inverse formula."
      />
    </div>
  )
}