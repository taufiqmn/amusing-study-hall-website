import MatrixDisplay from '@/components/MatrixDisplay'

export const gaussianEliminationLongQuestions = {
  easy: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>Use Gaussian elimination to solve:</p>
      <p style={{ fontSize: 13, marginBottom: 10 }}>x + y = 5<br />2x − y = 1</p>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', margin: '10px 0' }}>
            <MatrixDisplay data={[[1, 1, 5], [2, -1, 1]]} label="[A | B]" />
            <MatrixDisplay data={[[1, 1, 5], [0, -3, -9]]} label="R2 := R2 − 2R1" />
          </div>
          <p>From row 2: −3y = −9 → y = 3</p>
          <p>From row 1: x + 3 = 5 → x = <strong>2</strong>, y = <strong>3</strong></p>
        </div>
      </details>
    </div>
  ),
  medium: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>Reduce to row-echelon form and solve:</p>
      <p style={{ fontSize: 13, marginBottom: 10 }}>2x + y − z = 3<br />x − y + 2z = 4<br />3x + 2y + z = 10</p>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
            <MatrixDisplay data={[[2, 1, -1, 3], [1, -1, 2, 4], [3, 2, 1, 10]]} label="[A | B]" />
          </div>
          <p><strong>Trap:</strong> the pivot in row 1 is 2, not 1 — students often forget to divide or track fractions carefully. Swap R1 and R2 first for a cleaner pivot of 1:</p>
          <p>New R1: [1, −1, 2, 4]. Then R2 := R2 − 2R1 → [0, 3, −5, −5]. R3 := R3 − 3R1 → [0, 5, −5, −2].</p>
          <p>R3 := R3 − (5/3)R2 → [0, 0, (−5 + 25/3), (−2 + 25/3)] = [0, 0, 10/3, 19/3]</p>
          <p>z = (19/3)/(10/3) = 19/10 = 1.9</p>
          <p>From R2: 3y − 5(1.9) = −5 → 3y = 4.5 → y = 1.5</p>
          <p>From R1: x − 1.5 + 2(1.9) = 4 → x = 4 + 1.5 − 3.8 = <strong>1.7</strong></p>
          <p>Solution: x = 1.7, y = 1.5, z = 1.9</p>
        </div>
      </details>
    </div>
  ),
  hard: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>
        <strong>Trap warning:</strong> Attempt Gaussian elimination on this system. Watch closely what happens during elimination.
      </p>
      <p style={{ fontSize: 13, marginBottom: 10 }}>x + 2y − z = 3<br />2x + 4y − 2z = 6<br />x − y + z = 2</p>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
            <MatrixDisplay data={[[1, 2, -1, 3], [2, 4, -2, 6], [1, -1, 1, 2]]} label="[A | B]" />
          </div>
          <p>R2 := R2 − 2R1 → [0, 0, 0, 0]. The entire second row vanishes! This is the trap: Row 2 was simply <strong>2×Row 1</strong> in disguise — not an independent equation.</p>
          <p>Continue: R3 := R3 − R1 → [0, −3, 2, −1]</p>
          <p>Now the system reduces to only 2 independent equations for 3 unknowns:</p>
          <p>x + 2y − z = 3</p>
          <p>−3y + 2z = −1</p>
          <p>This means there are <strong>infinitely many solutions</strong> — one free variable (say z = t), giving y = (2t+1)/3 and x = 3 − 2y + z, parameterized by t.</p>
          <p><strong>Lesson:</strong> If a row reduces entirely to zeros (including the constant), it means that equation was redundant — the system has fewer independent equations than variables, leading to infinite solutions rather than an error.</p>
        </div>
      </details>
    </div>
  ),
}
