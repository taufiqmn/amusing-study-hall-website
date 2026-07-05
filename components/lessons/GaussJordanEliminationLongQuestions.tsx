import MatrixDisplay from '@/components/MatrixDisplay'

export const gaussJordanLongQuestions = {
  easy: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>Use Gauss-Jordan elimination (reduce all the way to identity form) to solve:</p>
      <p style={{ fontSize: 13, marginBottom: 10 }}>2x + y = 8<br />x − y = 1</p>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', margin: '10px 0' }}>
            <MatrixDisplay data={[[2, 1, 8], [1, -1, 1]]} label="[A | B]" />
            <MatrixDisplay data={[[1, 0, 3], [0, 1, 2]]} label="Reduced" />
          </div>
          <p>Swap rows for a clean pivot: R1 ↔ R2 → [1,−1,1] / [2,1,8]</p>
          <p>R2 := R2 − 2R1 → [0, 3, 6] → divide by 3 → [0, 1, 2]</p>
          <p>R1 := R1 + R2 → [1, 0, 3]</p>
          <p>x = <strong>3</strong>, y = <strong>2</strong></p>
        </div>
      </details>
    </div>
  ),
  medium: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>Find A⁻¹ using the Gauss-Jordan method [A | I] → [I | A⁻¹]:</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
        <MatrixDisplay data={[[2, 1], [1, 1]]} label="A" />
      </div>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', margin: '10px 0' }}>
            <MatrixDisplay data={[[2, 1, 1, 0], [1, 1, 0, 1]]} label="[A | I]" />
            <MatrixDisplay data={[[1, 0, 1, -1], [0, 1, -1, 2]]} label="[I | A⁻¹]" />
          </div>
          <p>Swap rows: [1,1,0,1] / [2,1,1,0]</p>
          <p>R2 := R2 − 2R1 → [0,−1,1,−2] → multiply by −1 → [0,1,−1,2]</p>
          <p>R1 := R1 − R2 → [1,0,1,−1]</p>
          <p>A⁻¹ = [[1,−1],[−1,2]]. <strong>Check:</strong> A·A⁻¹ should equal I — verify (2×1 + 1×−1, 2×−1 + 1×2) = (1, 0) ✓</p>
        </div>
      </details>
    </div>
  ),
  hard: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>
        <strong>Trap warning:</strong> Attempt Gauss-Jordan on this system. Something unusual happens with the pivot.
      </p>
      <p style={{ fontSize: 13, marginBottom: 10 }}>0x + 2y + z = 5<br />x + y − z = 0<br />2x + y + 3z = 10</p>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
            <MatrixDisplay data={[[0, 2, 1, 5], [1, 1, -1, 0], [2, 1, 3, 10]]} label="[A | B]" />
          </div>
          <p><strong>Trap:</strong> Row 1 has a 0 in the pivot position (column 1)! You CANNOT divide by 0 to normalize this pivot. You must swap rows first.</p>
          <p>Swap R1 and R2: [1,1,−1,0] / [0,2,1,5] / [2,1,3,10]</p>
          <p>R3 := R3 − 2R1 → [0,−1,5,10]</p>
          <p>R2 is already pivot-ready: divide by 2 → [0,1,0.5,2.5]</p>
          <p>R3 := R3 + R2 → [0,0,5.5,12.5] → divide by 5.5 → [0,0,1,2.27]</p>
          <p>Back-eliminate upward: R2 := R2 − 0.5·R3 → [0,1,0,1.36]; R1 := R1 − (−1)·R3 → [1,1,0,2.27]; R1 := R1 − R2 → [1,0,0,0.91]</p>
          <p>x ≈ 0.91, y ≈ 1.36, z ≈ 2.27</p>
          <p><strong>Lesson:</strong> Always scan for a zero pivot BEFORE dividing. If the pivot position is 0, swap with any row below that has a nonzero entry in that column — never skip this check.</p>
        </div>
      </details>
    </div>
  ),
}
