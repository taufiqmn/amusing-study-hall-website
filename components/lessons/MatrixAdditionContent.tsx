import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'

export default function MatrixAdditionContent() {
  return (
    <div>
      <Accordion title="1. Can I add any two matrices together?">
        <p>Your first instinct is probably "just add the numbers" — and you're right, almost. But there's one rule that comes first: <strong>both matrices must be the exact same size.</strong></p>
        <p>You cannot add a 2×3 matrix to a 3×2 matrix, even if they happen to have the same total number of entries. Why? Because addition happens <strong>position by position</strong> — and if the shapes don't match, there's nothing to pair up correctly.</p>
      </Accordion>

      <Accordion title="2. How does it actually work?">
        <p>Add matching positions. Row 1, Column 1 of A pairs with Row 1, Column 1 of B. That's the whole idea.</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <MatrixDisplay data={[[1, 2], [3, 5]]} label="A" />
          <span style={{ fontSize: 20, fontWeight: 700 }}>+</span>
          <MatrixDisplay data={[[4, 0], [1, 2]]} label="B" />
          <span style={{ fontSize: 20, fontWeight: 700 }}>=</span>
          <MatrixDisplay data={[[5, 2], [4, 7]]} label="A + B" />
        </div>
      </Accordion>

      <Accordion title="3. What about subtraction?">
        <p>Exact same rule applies — matrices must be the same size, and you subtract matching positions instead of adding.</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <MatrixDisplay data={[[6, 4], [3, 8]]} label="A" />
          <span style={{ fontSize: 20, fontWeight: 700 }}>−</span>
          <MatrixDisplay data={[[2, 1], [3, 5]]} label="B" />
          <span style={{ fontSize: 20, fontWeight: 700 }}>=</span>
          <MatrixDisplay data={[[4, 3], [0, 3]]} label="A − B" />
        </div>
      </Accordion>

      <Accordion title="4. Common trap to avoid">
        <p>When matrices get bigger, it's tempting to rush and mismatch positions — adding row 1 to row 2 by accident, or losing track of which column you're on. <strong>Always work slowly, one position at a time</strong>, especially with 3×3 or larger matrices.</p>
      </Accordion>

      <Accordion title="5. Quick Properties Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Matrices must be the same size to add or subtract</li>
          <li>Operation happens position-by-position</li>
          <li>A + B = B + A (order doesn't matter for addition)</li>
          <li>A − B ≠ B − A (order matters for subtraction!)</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="What is [[2,3],[1,4]] + [[5,1],[0,2]]?"
        answer="Answer: [[7,4],[1,6]]. Add each matching position: 2+5=7, 3+1=4, 1+0=1, 4+2=6."
      />

      <RevealQuestion
        question="Can you add a 2×2 matrix to a 2×3 matrix? Why or why not?"
        answer="No. They are different sizes (different number of columns), so there are no matching positions to add. Addition requires identical size."
      />
    </div>
  )
}