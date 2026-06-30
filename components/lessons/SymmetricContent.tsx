import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'

export default function SymmetricContent() {
  return (
    <div>
      <Accordion title="1. What does 'Symmetric' mean here?">
        <p>Remember the transpose from a couple lessons ago? A matrix is called <strong>symmetric</strong> when transposing it changes nothing at all — A = Aᵀ exactly.</p>
        <MatrixDisplay data={[[1, 4, 7], [4, 5, 8], [7, 8, 9]]} label="Symmetric matrix — notice it mirrors across the diagonal" />
        <p>Look closely: the entry at (1,2) is 4, and the entry at (2,1) is also 4. Same for (1,3)/(3,1) = 7, and (2,3)/(3,2) = 8. Every pair mirrors perfectly across the main diagonal.</p>
      </Accordion>

      <Accordion title="2. The fast way to check symmetry (without computing the full transpose)">
        <p>You don't need to redraw the whole transposed matrix every time. Just check: does <strong>aᵢⱼ = aⱼᵢ</strong> for every pair of positions? If yes for all of them, it's symmetric.</p>
      </Accordion>

      <Accordion title="3. What about Skew-Symmetric?">
        <p>This is the opposite extreme: a matrix is <strong>skew-symmetric</strong> when Aᵀ = −A — meaning every mirrored pair has the exact same magnitude but <strong>opposite sign</strong>.</p>
        <MatrixDisplay data={[[0, 3, -2], [-3, 0, 5], [2, -5, 0]]} label="Skew-symmetric matrix" />
        <p>Check it: (1,2)=3, (2,1)=-3 — opposite signs, same number. (1,3)=-2, (3,1)=2 — same pattern.</p>
      </Accordion>

      <Accordion title="4. The giveaway clue: the diagonal">
        <p>Here's a shortcut that catches students off guard: in a skew-symmetric matrix, <strong>every diagonal entry must be exactly 0</strong>. Why? Because a diagonal entry aᵢᵢ paired with itself must satisfy aᵢᵢ = −aᵢᵢ — and the only number equal to its own negative is 0.</p>
      </Accordion>

      <Accordion title="5. Quick Properties Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Symmetric: A = Aᵀ (mirrors across the diagonal)</li>
          <li>Skew-symmetric: Aᵀ = −A (mirrors with opposite sign)</li>
          <li>Skew-symmetric matrices always have 0s on the entire main diagonal</li>
          <li>Both only apply to square matrices</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="Is MATRIX:[[2,5],[5,2]] symmetric?"
        answer="Yes. The off-diagonal pair (1,2)=5 and (2,1)=5 match exactly, satisfying A=Aᵀ."
      />

      <RevealQuestion
        question="Can a matrix be both symmetric AND skew-symmetric at the same time?"
        answer="Only the zero matrix can be both — since symmetric requires aᵢⱼ=aⱼᵢ, and skew-symmetric requires aᵢⱼ=−aⱼᵢ, the only way both can be true is if every entry equals its own negative, meaning every entry is 0."
      />
    </div>
  )
}