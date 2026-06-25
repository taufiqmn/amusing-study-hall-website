import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'

export default function MatrixNotationContent() {
  return (
    <div>
      <Accordion title="1. What is a Matrix?">
        <p>A matrix is just numbers arranged neatly in rows and columns, inside brackets. That's it.</p>
        <MatrixDisplay data={[[1, 2], [3, 0]]} label="Matrix A — a simple 2×2 example" />
        <p>Each number inside is called an <strong>entry</strong> (or element). Once arranged like this, we can do math on the whole table at once — which becomes powerful later on.</p>
      </Accordion>

      <Accordion title="2. Matrix Notation">
        <p>We name the whole matrix with a <strong>capital letter</strong> (A, B, C...) and individual numbers with <strong>lowercase letters</strong>. Numbers outside matrices are called scalars.</p>
      </Accordion>

      <Accordion title="3. Element Position (aᵢⱼ)">
        <p>Instead of saying "the number in row 2, column 3," we write it shorthand as <strong>a₂₃</strong>. The first small number is always the row, the second is always the column.</p>
        <MatrixDisplay data={[[11, 12, 13], [21, 22, 23]]} label="Each entry labeled aᵢⱼ (shown here as row-col for clarity)" />
      </Accordion>

      <Accordion title="4. Size of a Matrix">
        <p>Size means rows × columns — nothing to do with how big the numbers are.</p>
        <MatrixDisplay data={[[2, 0], [1, 4], [3, 8]]} label="3 rows, 2 columns → size 3×2" />
        <p><strong>Common trap:</strong> writing 2×3 instead of 3×2. Rows always come first.</p>
      </Accordion>

      <Accordion title="5. Valid vs Invalid Matrix">
        <p>For an arrangement of numbers to count as a real matrix, every row must have the exact same number of entries. If one row has 3 numbers and another has only 2 — that's not a valid matrix.</p>
      </Accordion>

      <Accordion title="6. Quick Properties Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Capital letters = whole matrix</li>
          <li>aᵢⱼ = entry at row i, column j</li>
          <li>Size = rows × columns, in that order</li>
          <li>Every row must have equal entries</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="What is the size of a matrix with 4 rows and 2 columns?"
        answer="Answer: 4×2. Remember — rows always come first, then columns."
      />
    </div>
  )
}