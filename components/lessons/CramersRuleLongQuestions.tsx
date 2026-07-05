import MatrixDisplay from '@/components/MatrixDisplay'

export const cramersRuleLongQuestions = {
  easy: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>Solve using Cramer's Rule:</p>
      <p style={{ fontSize: 13, marginBottom: 10 }}><strong>3x + 2y = 12</strong><br />x − y = 1</p>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', margin: '10px 0' }}>
            <MatrixDisplay data={[[3, 2], [1, -1]]} label="A" />
            <MatrixDisplay data={[[12, 2], [1, -1]]} label="Dx matrix" />
            <MatrixDisplay data={[[3, 12], [1, 1]]} label="Dy matrix" />
          </div>
          <p>D = (3×−1) − (2×1) = −3 − 2 = −5</p>
          <p>Dx = (12×−1) − (2×1) = −12 − 2 = −14</p>
          <p>Dy = (3×1) − (12×1) = 3 − 12 = −9</p>
          <p>x = Dx/D = −14/−5 = <strong>14/5 = 2.8</strong></p>
          <p>y = Dy/D = −9/−5 = <strong>9/5 = 1.8</strong></p>
        </div>
      </details>
    </div>
  ),
  medium: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>Solve this 3×3 system using Cramer's Rule:</p>
      <p style={{ fontSize: 13, marginBottom: 10 }}>x + y + z = 6<br />2x − y + z = 3<br />x + 2y − z = 2</p>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
            <MatrixDisplay data={[[1, 1, 1], [2, -1, 1], [1, 2, -1]]} label="A" />
          </div>
          <p>D = 1(1−2) − 1(−2−1) + 1(4+1) = −1 + 3 + 5 = 7</p>
          <p>Dx: replace col 1 with [6,3,2] → Dx = 6(1−2) − 1(−3−2) + 1(6+2) = −6 + 5 + 8 = 7</p>
          <p>Dy: replace col 2 with [6,3,2] → Dy = 1(−3−2) − 6(−2−1) + 1(4−3) = −5 + 18 + 1 = 14</p>
          <p>Dz: replace col 3 with [6,3,2] → Dz = 1(−2−6) − 1(4−3) + 6(4+1) = −8 − 1 + 30 = 21</p>
          <p>x = 7/7 = <strong>1</strong>, y = 14/7 = <strong>2</strong>, z = 21/7 = <strong>3</strong></p>
        </div>
      </details>
    </div>
  ),
  hard: (
    <div>
      <p style={{ fontSize: 13, marginBottom: 10 }}>
        <strong>Trap warning:</strong> Solve the following system using Cramer's Rule. Before computing Dx and Dy, first check whether Cramer's Rule can even give a unique solution.
      </p>
      <p style={{ fontSize: 13, marginBottom: 10 }}>4x + 6y = 10<br />2x + 3y = 5</p>
      <details>
        <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
        <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
            <MatrixDisplay data={[[4, 6], [2, 3]]} label="A" />
          </div>
          <p>D = (4×3) − (6×2) = 12 − 12 = <strong>0</strong></p>
          <p>⚠️ Since D = 0, Cramer's Rule cannot produce a unique solution — many students wrongly rush ahead and compute Dx, Dy anyway.</p>
          <p>Checking Dx: replace col 1 with [10,5] → Dx = (10×3)−(6×5) = 30−30 = 0. Also Dy = (4×5)−(10×2) = 20−20 = 0.</p>
          <p>Since D = 0 AND Dx = Dy = 0, the system has <strong>infinitely many solutions</strong> (the second equation is just the first divided by 2 — they're the same line).</p>
          <p><strong>Lesson:</strong> Always compute D first. If D=0, stop and check Dx/Dy to classify the system (infinite solutions vs no solution) — don't just divide blindly, since 0/0 is undefined, not "no solution."</p>
        </div>
      </details>
    </div>
  ),
}
