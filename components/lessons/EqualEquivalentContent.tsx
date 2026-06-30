import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'

export default function EqualEquivalentContent() {
  return (
    <div>
      <Accordion title="1. What does 'equal' mean for matrices?">
        <p>Your instinct might be "same numbers somewhere in there" — but matrix equality is much stricter. Two matrices are <strong>equal</strong> only if they have the <strong>exact same size</strong> AND <strong>every single corresponding entry matches exactly</strong>.</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <MatrixDisplay data={[[2, 5], [1, 9]]} label="A" />
          <span style={{ fontSize: 20, fontWeight: 700 }}>=</span>
          <MatrixDisplay data={[[2, 5], [1, 9]]} label="B" />
        </div>
        <p>A = B here because every position matches perfectly: position (1,1) is 2 in both, (1,2) is 5 in both, and so on.</p>
      </Accordion>

      <Accordion title="2. What breaks equality?">
        <p>Just <strong>one</strong> mismatched entry is enough to make two matrices unequal — even if every other entry is identical.</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <MatrixDisplay data={[[2, 5], [1, 9]]} label="A" />
          <span style={{ fontSize: 20, fontWeight: 700 }}>≠</span>
          <MatrixDisplay data={[[2, 5], [1, 8]]} label="C" />
        </div>
        <p>Only the bottom-right entry differs (9 vs 8) — but that's enough. A ≠ C.</p>
      </Accordion>

      <Accordion title="3. Different sizes are automatically unequal">
        <p>Even if every number you can see "matches," a 2×2 and a 2×3 matrix can <strong>never</strong> be equal — size mismatch alone settles it immediately, without even checking entries.</p>
      </Accordion>

      <Accordion title="4. So what is 'Equivalent' then? (This is the part students mix up most)">
        <p>This is genuinely the most common confusion point in this topic: "equal" and "equivalent" sound like synonyms in everyday English, but in matrix algebra they mean very different things.</p>
        <p><strong>Equivalent matrices</strong> usually refers to matrices that can be transformed into one another using <strong>row operations</strong> (swapping rows, scaling a row, adding a multiple of one row to another) — these are operations you'll use later when solving systems of equations. Two matrices can look completely different on the surface, yet still be "row equivalent" if one can be turned into the other through these legal operations.</p>
      </Accordion>

      <Accordion title="5. Quick Properties Recap">
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Equal matrices: same size + every entry matches exactly</li>
          <li>One mismatched entry = not equal, no matter how small the difference</li>
          <li>Different sizes = automatically not equal</li>
          <li>Equivalent matrices: connected through row operations, don't need identical entries</li>
        </ul>
      </Accordion>

      <RevealQuestion
        question="Are MATRIX:[[4,1],[0,7]] and MATRIX:[[4,1],[0,7]] equal?"
        answer="Yes. Same size (2×2), and every corresponding entry matches exactly."
      />

      <RevealQuestion
        question="Are MATRIX:[[3,2]] and MATRIX:[[3],[2]] equal?"
        answer="No — even though they contain the same numbers, their sizes differ (1×2 vs 2×1). Different sizes means automatically not equal, regardless of the numbers inside."
      />

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '16px 18px', marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>📝 Quick Answer Question</p>
        <p style={{ fontSize: 13, marginBottom: 10 }}>
          If matrix A = [[x, 4],[2, y]] and matrix B = [[7, 4],[2, 9]], and A = B, what are the values of x and y?
        </p>
        <details>
          <summary style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Click to reveal answer</summary>
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7 }}>
            <p><strong>Answer: x = 7, y = 9.</strong> For A = B, every corresponding position must match. Position (1,1): x = 7. Position (2,2): y = 9. The other entries (4 and 2) already matched, confirming equality once x and y are set correctly.</p>
          </div>
        </details>
      </div>

      <div style={{ background: 'linear-gradient(135deg, rgba(226,92,92,0.08), rgba(243,203,75,0.08))', border: '1px solid #e25c5c', borderRadius: 12, padding: '16px 18px', marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, color: '#e25c5c' }}>🔥 Challenge Question</p>
        <p style={{ fontSize: 13, marginBottom: 10 }}>
          Matrix A is 3×3 and matrix B is 3×3. You're told that Trace(A) = Trace(B), and every entry except one diagonal position matches exactly between A and B. Can you conclude A = B? Explain your reasoning.
        </p>
        <details>
          <summary style={{ fontSize: 12, color: '#e25c5c', cursor: 'pointer', fontWeight: 700 }}>Click to reveal solution</summary>
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7 }}>
            <p><strong>No, you cannot conclude A = B.</strong> Equal trace just means the diagonal sums match — it does NOT mean every individual diagonal entry matches. It's entirely possible for one diagonal entry in A to be, say, 5 higher than in B, while another diagonal entry in A is exactly 5 lower than in B — the totals (traces) would still be equal, but individual positions would differ, breaking strict matrix equality. Equality requires every single position to match exactly, which trace alone can never guarantee.</p>
          </div>
        </details>
      </div>
    </div>
  )
}