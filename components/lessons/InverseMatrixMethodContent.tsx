"use client";

import { useState } from "react";
import Quiz from "@/components/Quiz";

/* ============================================================
   InverseMatrixMethodContent.tsx
   Chalkboard-style lesson matching SystemOfEquationsContent.tsx
   palette and structure exactly.

   Usage in app/lessons/[id]/page.tsx:
     <InverseMatrixMethodContent lessonId={lesson.id} />
   ============================================================ */

// ── Working example system ──────────────────────────────────
// 2x + y + z = 8
// x + 3y + 2z = 14
// x + y + 4z = 14
// A = [[2,1,1],[1,3,2],[1,1,4]], B = [[8],[14],[14]]
// det(A) = 2(12-2) - 1(4-2) + 1(1-3) = 20 - 2 - 2 = 16
// Cofactors, adj, A⁻¹, solution: x=1, y=2, z=3 (clean answer)

const A = [[2, 1, 1], [1, 3, 2], [1, 1, 4]];
const B = [8, 14, 14];

function det2(m: number[][]): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

/* ── Generic N×N helpers (used by the Long Question trap set, incl. 4×4) ── */
function genericDet(m: number[][]): number {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return det2(m);
  let sum = 0;
  for (let c = 0; c < n; c++) {
    sum += Math.pow(-1, c) * m[0][c] * genericDet(genericMinor(m, 0, c));
  }
  return sum;
}
function genericMinor(m: number[][], i: number, j: number): number[][] {
  return m.filter((_, r) => r !== i).map(row => row.filter((_, c) => c !== j));
}
function genericCofactor(m: number[][], i: number, j: number): number {
  return Math.pow(-1, i + j) * genericDet(genericMinor(m, i, j));
}
function genericCofactorMatrix(m: number[][]): number[][] {
  return m.map((row, i) => row.map((_, j) => genericCofactor(m, i, j)));
}
function genericTranspose(m: number[][]): number[][] {
  return m[0].map((_, j) => m.map(row => row[j]));
}
function genericMultiplyMatVec(m: number[][], v: number[]): number[] {
  return m.map(row => row.reduce((s, val, j) => s + val * v[j], 0));
}
function gcd(a: number, b: number): number { return b === 0 ? (a || 1) : gcd(b, a % b); }
function fracStr(num: number, den: number): string {
  if (den === 0) return "undef";
  const g = gcd(Math.round(Math.abs(num)), Math.round(Math.abs(den))) || 1;
  const n = Math.round(num) / g;
  const d = Math.round(den) / g;
  if (d === 1) return String(n);
  return (d < 0 ? -n : n) + "/" + Math.abs(d);
}

function getMinor(i: number, j: number): number[][] {
  return A.filter((_, r) => r !== i).map(row => row.filter((_, c) => c !== j));
}

function getCofactor(i: number, j: number): number {
  return Math.pow(-1, i + j) * det2(getMinor(i, j));
}

function buildCofactorMatrix(): number[][] {
  return A.map((row, i) => row.map((_, j) => getCofactor(i, j)));
}

function transpose(m: number[][]): number[][] {
  return m[0].map((_, j) => m.map(row => row[j]));
}

function multiplyMatVec(m: number[][], v: number[]): number[] {
  return m.map(row => row.reduce((s, val, j) => s + val * v[j], 0));
}

function det3(m: number[][]): number {
  return (
    m[0][0] * (m[1][1]*m[2][2] - m[1][2]*m[2][1]) -
    m[0][1] * (m[1][0]*m[2][2] - m[1][2]*m[2][0]) +
    m[0][2] * (m[1][0]*m[2][1] - m[1][1]*m[2][0])
  );
}

const DET_A = det3(A);
const COF = buildCofactorMatrix();
const ADJ = transpose(COF);
const INV = ADJ.map(row => row.map(v => v / DET_A));
const SOL = multiplyMatVec(INV, B);

type Tab = "notes" | "quiz" | "long";
type DetStep = "idle" | "expanding";

const VARS = ["x", "y", "z"];
const VAR_COLORS = ["var(--loe-gold)", "var(--loe-teal)", "var(--loe-coral)"];

function fmt(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const f = Math.round(n * 1000) / 1000;
  return String(f);
}

function Bracket({ children }: { children: React.ReactNode }) {
  return (
    <div className="matrix">
      <div className="bracket-l" />
      {children}
      <div className="bracket-r" />
    </div>
  );
}

function MatGrid({ data, highlightRow, highlightCol, caption }: {
  data: (number | string)[][];
  highlightRow?: number;
  highlightCol?: number;
  caption?: string;
}) {
  const cols = data[0].length;
  return (
    <div>
      <Bracket>
        <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}>
          {data.map((row, i) =>
            row.map((val, j) => (
              <div
                key={`${i}-${j}`}
                className="matrix-cell"
                style={{
                  color:
                    i === highlightRow && j === highlightCol
                      ? "var(--loe-gold)"
                      : i === highlightRow
                      ? "var(--loe-coral)"
                      : j === highlightCol
                      ? "var(--loe-teal)"
                      : "var(--loe-chalk)",
                  fontWeight: (i === highlightRow || j === highlightCol) ? 700 : 400,
                  background:
                    i === highlightRow && j === highlightCol
                      ? "rgba(255,200,50,0.15)"
                      : i === highlightRow
                      ? "rgba(224,120,86,0.12)"
                      : j === highlightCol
                      ? "rgba(84,209,194,0.12)"
                      : "transparent",
                  borderRadius: 4,
                  padding: "2px 4px",
                  transition: "all 0.2s",
                }}
              >
                {fmt(typeof val === "number" ? val : Number(val))}
              </div>
            ))
          )}
        </div>
      </Bracket>
      {caption && <div className="matrix-caption">{caption}</div>}
    </div>
  );
}

/* ── Long Question tab: 6 trap questions (easy → 4×4 challenge) ── */

type LongQuestion = {
  tag: string;
  tagColor: string;
  title: string;
  eq: React.ReactNode;
  trap: string;
  A: number[][];
  B: number[];
  singular?: boolean;
};

const LONG_QUESTIONS: LongQuestion[] = [
  {
    tag: "warm-up",
    tagColor: "var(--loe-gold)",
    title: "Q1 · Classic sign trap",
    eq: <>2x + y − z = 3<br />x − y + z = 0<br />x + 2y + z = 6</>,
    trap: "C₁₂ and C₂₁ both carry an extra minus sign from the checkerboard. Easy to drop.",
    A: [[2, 1, -1], [1, -1, 1], [1, 2, 1]],
    B: [3, 0, 6],
  },
  {
    tag: "no-inverse trap",
    tagColor: "var(--loe-coral)",
    title: "Q2 · det(A) = 0 — inverse doesn't exist",
    eq: <>x + 2y + 3z = 6<br />2x + 4y + 6z = 12<br />x + y + z = 3</>,
    trap: "Row 2 = 2×Row 1, so det(A) = 0. There's no unique solution — check det BEFORE building cofactors.",
    A: [[1, 2, 3], [2, 4, 6], [1, 1, 1]],
    B: [6, 12, 3],
    singular: true,
  },
  {
    tag: "fractions",
    tagColor: "var(--loe-coral)",
    title: "Q3 · Messy determinant, fraction answers",
    eq: <>4x + 3y − 2z = 5<br />2x − y + 3z = 1<br />x + 2y + z = 4</>,
    trap: "det(A) won't divide evenly into the adjugate — expect fractions. That's not an arithmetic mistake.",
    A: [[4, 3, -2], [2, -1, 3], [1, 2, 1]],
    B: [5, 1, 4],
  },
  {
    tag: "transpose trap",
    tagColor: "var(--loe-coral)",
    title: "Q4 · Forgetting to transpose (A is NOT symmetric)",
    eq: <>x + 2y + 0z = 5<br />0x + y + 3z = 10<br />2x + 0y + z = 5</>,
    trap: "adj(A) = Cᵀ, and here C is not symmetric — skipping the transpose gives the wrong answer.",
    A: [[1, 2, 0], [0, 1, 3], [2, 0, 1]],
    B: [5, 10, 5],
  },
  {
    tag: "zero-entry trap",
    tagColor: "var(--loe-coral)",
    title: "Q5 · Zeros in A tempt you to skip the sign",
    eq: <>0x + 2y + z = 5<br />3x + 0y − z = 1<br />x + y + 0z = 3</>,
    trap: "A zero coefficient can make a cofactor collapse to a single product — but the (+/−) sign still applies.",
    A: [[0, 2, 1], [3, 0, -1], [1, 1, 0]],
    B: [5, 1, 3],
  },
  {
    tag: "4×4 challenge",
    tagColor: "var(--loe-teal)",
    title: "Q6 · CHALLENGE — 4×4 system",
    eq: <>x₁ + x₂ + 2x₄ = 6<br />2x₁ − x₂ + 3x₃ + x₄ = 4<br />x₂ + x₃ − x₄ = 0<br />x₁ + 2x₃ + x₄ = 5</>,
    trap: "Every cofactor is a full 3×3 determinant now. Row-1 signs are (+,−,+,−). Don't rush the sub-determinants.",
    A: [[1, 1, 0, 2], [2, -1, 3, 1], [0, 1, 1, -1], [1, 0, 2, 1]],
    B: [6, 4, 0, 5],
  },
];

function SimpleMat({ data, cols, color = "var(--loe-chalk)" }: { data: (number | string)[]; cols: number; color?: string }) {
  return (
    <Bracket>
      <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}>
        {data.map((v, i) => (
          <div key={i} className="matrix-cell" style={{ color }}>{v}</div>
        ))}
      </div>
    </Bracket>
  );
}

/* Stacked fraction: n over d, like handwritten math (not "0.625") */
function Frac({ num, den, color = "var(--loe-gold)" }: { num: number; den: number; color?: string }) {
  const g = gcd(Math.round(Math.abs(num)), Math.round(Math.abs(den))) || 1;
  let n = Math.round(num) / g;
  let d = Math.round(den) / g;
  if (d < 0) { n = -n; d = -d; }
  if (d === 1) return <span style={{ color, fontFamily: "var(--loe-mono)" }}>{n}</span>;
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", margin: "0 4px", fontFamily: "var(--loe-mono)", lineHeight: 1.1, color }}>
      <span>{n}</span>
      <span style={{ borderTop: `1.5px solid ${color}`, width: "100%", minWidth: 14 }} />
      <span>{d}</span>
    </span>
  );
}

/* Matrix built from Frac cells instead of plain numbers */
function FracMat({ data, den, cols, color = "var(--loe-gold)" }: { data: number[]; den: number; cols: number; color?: string }) {
  return (
    <Bracket>
      <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}>
        {data.map((v, i) => (
          <div key={i} className="matrix-cell"><Frac num={v} den={den} color={color} /></div>
        ))}
      </div>
    </Bracket>
  );
}

function LongStep({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="reveal">
      <summary>▸ {label}</summary>
      <div className="answer">{children}</div>
    </details>
  );
}

function LongQuestionCard({ q }: { q: LongQuestion }) {
  const [showSteps, setShowSteps] = useState(false);
  const n = q.A.length;
  const d = genericDet(q.A);

  let C: number[][] = [], Adj: number[][] = [], X: number[] = [];
  if (!q.singular) {
    C = genericCofactorMatrix(q.A);
    Adj = genericTranspose(C);
    X = genericMultiplyMatVec(Adj, q.B);
  }
  const varLabels = n === 4 ? ["x₁", "x₂", "x₃", "x₄"] : ["x", "y", "z"];
  const rowColors = ["var(--loe-gold)", "var(--loe-teal)", "var(--loe-coral)", "var(--loe-gold)"];

  return (
    <div style={{ border: "1px solid var(--loe-line)", borderRadius: 14, padding: "18px 20px", marginBottom: 20, background: "var(--loe-board-2)" }}>
      <span className="tag" style={{ color: q.tagColor }}>{q.tag}</span>
      <h3 style={{ margin: "6px 0 12px", fontSize: "1.1rem", color: "var(--loe-chalk)" }}>{q.title}</h3>
      <p>Solve the system using the inverse matrix method.</p>
      <div className="eq">{q.eq}</div>

      <button type="button" className={`toggle-btn${showSteps ? " active" : ""}`} onClick={() => setShowSteps(!showSteps)}>
        {showSteps ? "Hide" : "Show"} Steps
      </button>

      {showSteps && (
        <div style={{ marginTop: 14 }}>
          <LongStep label={`Step 1 — Find det(A) ${n === 4 ? "(4×4 expansion along row 1)" : ""}`}>
            <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
              <SimpleMat data={q.A.flat()} cols={n} />
            </div>
            <p style={{ fontFamily: "var(--loe-mono)", fontSize: "0.85rem" }}>
              {n === 3
                ? <>det(A) = {q.A[0][0]}×det(minor 1,1) − {q.A[0][1]}×det(minor 1,2) + {q.A[0][2]}×det(minor 1,3)</>
                : <>det(A) = Σ (−1)^(1+j) · a₁ⱼ · det(3×3 minor of column j)</>}
            </p>
            <p><strong style={{ color: "var(--loe-gold)" }}>det(A) = {d}</strong></p>
            {q.singular && (
              <p style={{ color: "var(--loe-coral)" }}>
                ⚠ det(A) = 0 → <strong>no inverse exists</strong>. The system is either inconsistent or has infinitely
                many solutions.
              </p>
            )}
          </LongStep>

          {!q.singular && (
            <>
              <LongStep label={`Step 2 — Build the ${n * n} cofactors`}>
                <p style={{ fontFamily: "var(--loe-mono)", fontSize: "0.82rem", lineHeight: 1.9 }}>
                  {C.map((row, i) => row.map((v, j) => (
                    <span key={`${i}-${j}`}>
                      C{i + 1}{j + 1} = {(i + j) % 2 === 0 ? "+" : "−"}det(minor {i + 1},{j + 1}) = <span style={{ color: "var(--loe-teal)" }}>{v}</span>
                      {j < n - 1 ? ",  " : <br />}
                    </span>
                  )))}
                </p>
                <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
                  <SimpleMat data={C.flat()} cols={n} color="var(--loe-teal)" />
                </div>
                <div className="matrix-caption">Cofactor matrix C</div>
              </LongStep>

              <LongStep label="Step 3 — Transpose: adj(A) = Cᵀ">
                <div style={{ display: "flex", gap: 20, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                  <SimpleMat data={C.flat()} cols={n} color="var(--loe-teal)" />
                  <span style={{ fontFamily: "var(--loe-mono)", fontSize: "1.4rem" }}>→ Cᵀ →</span>
                  <SimpleMat data={Adj.flat()} cols={n} color="var(--loe-gold)" />
                </div>
                <p style={{ marginTop: 10 }}>
                  Swap every C<sub>ij</sub> with C<sub>ji</sub>.
                </p>
              </LongStep>

              <LongStep label="Step 4 — A⁻¹ = adj(A) / det(A)">
                <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
                  <FracMat data={Adj.flat()} den={d} cols={n} />
                </div>
                <div className="matrix-caption">A⁻¹ — every entry written as a fraction, not a decimal</div>
              </LongStep>

              <LongStep label="Step 5 — Multiply X = A⁻¹B (row × column, term by term)">
                <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center", margin: "12px 0", flexWrap: "wrap" }}>
                  <FracMat data={Adj.flat()} den={d} cols={n} />
                  <span style={{ fontFamily: "var(--loe-mono)", fontSize: "1.4rem" }}>×</span>
                  <Bracket>
                    <div className="matrix-grid" style={{ gridTemplateColumns: "auto" }}>
                      {q.B.map((v, j) => (
                        <div key={j} className="matrix-cell" style={{ color: rowColors[j] }}>{v}</div>
                      ))}
                    </div>
                  </Bracket>
                </div>

                {Adj.map((row, i) => {
                  const terms = row.map((v, j) => v * q.B[j]);
                  const sum = terms.reduce((s, v) => s + v, 0);
                  return (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--loe-line)", borderRadius: 8, padding: "10px 14px", margin: "10px 0" }}>
                      <div style={{ fontFamily: "var(--loe-mono)", fontSize: "0.85rem", marginBottom: 6 }}>
                        <strong style={{ color: rowColors[i] }}>{varLabels[i]}</strong>{" row of adj(A) · B  ="}
                      </div>
                      <div style={{ fontFamily: "var(--loe-mono)", fontSize: "0.88rem" }}>
                        {row.map((v, j) => (
                          <span key={j}>
                            (<Frac num={v} den={d} color="var(--loe-gold)" />{" × "}<span style={{ color: rowColors[j] }}>{q.B[j]}</span>)
                            {j < n - 1 ? " + " : ""}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontFamily: "var(--loe-mono)", fontSize: "0.88rem", marginTop: 4 }}>
                        = {terms.map((t, j) => (
                          <span key={j}>
                            <Frac num={t} den={d} color="var(--loe-chalk)" />{j < n - 1 ? " + " : ""}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontFamily: "var(--loe-mono)", fontSize: "0.95rem", marginTop: 6 }}>
                        {varLabels[i]} = <Frac num={sum} den={d} color={rowColors[i]} />
                      </div>
                    </div>
                  );
                })}

                <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
                  <FracMat data={X} den={d} cols={1} color="var(--loe-teal)" />
                </div>
                <div className="matrix-caption">X — the final solution matrix</div>

                <div className="verdict-box" style={{ background: "rgba(84,209,194,0.08)", border: "1px solid var(--loe-teal)", color: "var(--loe-teal)" }}>
                  {varLabels.map((v, i) => <span key={i}>{v} = {fracStr(X[i], d)}{i < n - 1 ? "   " : ""}</span>)}
                </div>
              </LongStep>

              <LongStep label="Verify — plug back into every equation">
                {q.A.map((row, i) => {
                  const val = row.reduce((s, coef, j) => s + coef * (X[j] / d), 0);
                  return (
                    <p key={i} style={{ fontFamily: "var(--loe-mono)", fontSize: "0.85rem" }}>
                      {row.map((coef, j) => `${coef}(${fracStr(X[j], d)})`).join(" + ")} = {Math.round(val * 1000) / 1000}{" "}
                      <span style={{ color: "var(--loe-teal)" }}>≈ {q.B[i]} ✓</span>
                    </p>
                  );
                })}
              </LongStep>

              <LongStep label="What made this one tricky">
                <p style={{ color: "var(--loe-coral)" }}>{q.trap}</p>
              </LongStep>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function LongQuestionsSection() {
  return (
    <section>
      <span className="tag">Worked problems</span>
      <h2>Six problems — easy to brutal</h2>
      <p>
        Solve each system using the inverse matrix method on paper first. Then click{" "}
        <strong className="hl">Show Steps</strong>, then any individual step to see the full
        working — including what made that particular question tricky, revealed only at the end.
      </p>
      {LONG_QUESTIONS.map((q, i) => (
        <LongQuestionCard key={i} q={q} />
      ))}
    </section>
  );
}

export default function InverseMatrixMethodContent({ lessonId }: { lessonId: string }) {
  const [tab, setTab] = useState<Tab>("notes");
  const [detRow, setDetRow] = useState<number | null>(null);
  const [detCol, setDetCol] = useState<number | null>(null);
  const [expandRow, setExpandRow] = useState<number>(0);
  const [cofSel, setCofSel] = useState<[number,number] | null>(null);
  const [showAdj, setShowAdj] = useState(false);
  const [showInv, setShowInv] = useState(false);
  const [showSol, setShowSol] = useState(false);

  const cofSelected = cofSel ? getCofactor(cofSel[0], cofSel[1]) : null;
  const minorSelected = cofSel ? det2(getMinor(cofSel[0], cofSel[1])) : null;
  const signSelected = cofSel ? Math.pow(-1, cofSel[0] + cofSel[1]) : null;

  return (
    <div className="loe-lesson">
      <div className="wrap">

        {/* HERO */}
        <div className="hero">
          <div className="eyebrow">Amusing Study Hall · Linear Algebra</div>
          <h1 className="title">The Inverse Matrix Method</h1>
          <p className="sub">
            You already know how to flip a number — dividing by 5 is multiplying by ⅕.
            Matrices have their own version of "flipping," and it's the key to solving
            any system in one elegant sweep.
          </p>
          <div className="chalk-rule" />
        </div>

        {/* TAB BAR */}
        <div className="loe-tabbar">
          <button type="button" className={`loe-tab${tab==="notes"?" active":""}`} onClick={()=>setTab("notes")}>📓 Class Notes</button>
          <button type="button" className={`loe-tab${tab==="quiz"?" active":""}`} onClick={()=>setTab("quiz")}>🧩 Quizzes</button>
          <button type="button" className={`loe-tab${tab==="long"?" active":""}`} onClick={()=>setTab("long")}>📝 Long Question</button>
        </div>

        {/* ═══════════════ CLASS NOTES ═══════════════ */}
        {tab === "notes" && (
          <>
            {/* SECTION 1 */}
            <section>
              <span className="tag">01 · The Big Idea</span>
              <h2>From <span className="accent">AX = B</span> to <span className="accent">X = A⁻¹B</span></h2>
              <p>In ordinary arithmetic, if <strong className="hl">5x = 20</strong>, you divide both sides by 5 — or equivalently, multiply by <strong className="hl">⅕</strong>, the inverse of 5.</p>
              <p>Matrices work the same way. Our system of equations becomes a single matrix equation:</p>
              <div className="eq">
                <span className="var-x">A</span>
                <span className="var-y">X</span>
                {" = "}
                <span className="var-z">B</span>
              </div>
              <p>We "divide" by A — by multiplying both sides by <strong className="hl">A⁻¹</strong> (if it exists):</p>

              <div className="progression">
                <div className="prog-card">
                  <div className="label">Step 1</div>
                  <div className="eq" style={{fontSize:"1rem"}}>
                    <span className="var-x">A</span>
                    <span className="var-y">X</span> = <span className="var-z">B</span>
                  </div>
                  <div className="verdict">Original equation</div>
                </div>
                <div className="prog-card">
                  <div className="label">Step 2</div>
                  <div className="eq" style={{fontSize:"1rem"}}>
                    <span className="var-x">A⁻¹</span>
                    <span className="var-x">A</span>
                    <span className="var-y">X</span> = <span className="var-x">A⁻¹</span>
                    <span className="var-z">B</span>
                  </div>
                  <div className="verdict">Multiply both sides by A⁻¹ on the left</div>
                </div>
                <div className="prog-card">
                  <div className="label">Step 3</div>
                  <div className="eq" style={{fontSize:"1rem"}}>
                    <strong>I</strong>
                    <span className="var-y">X</span> = <span className="var-x">A⁻¹</span>
                    <span className="var-z">B</span>
                  </div>
                  <div className="verdict">A⁻¹A = I (identity)</div>
                </div>
                <div className="prog-card">
                  <div className="label">Step 4</div>
                  <div className="eq" style={{fontSize:"1rem"}}>
                    <span className="var-y">X</span> = <span className="var-x">A⁻¹</span>
                    <span className="var-z">B</span>
                  </div>
                  <div className="verdict">IX = X. Done. ✓</div>
                </div>
              </div>

              <div className="think">
                <span className="who">Key condition —</span> A⁻¹ only exists when{" "}
                <strong className="hl">det(A) ≠ 0</strong>. Always check the determinant first.
                If det = 0, the system either has no solution or infinitely many — the inverse method won't work.
              </div>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 2: THE EXAMPLE SYSTEM */}
            <section>
              <span className="tag">02 · Our Working Example</span>
              <h2>A 3×3 system we'll solve completely</h2>
              <p>We'll carry this one example all the way through — every step, every number, nothing hidden:</p>
              <div className="eq">
                2<span className="var-x">x</span> + <span className="var-y">y</span> + <span className="var-z">z</span> = 8<br/>
                <span className="var-x">x</span> + 3<span className="var-y">y</span> + 2<span className="var-z">z</span> = 14<br/>
                <span className="var-x">x</span> + <span className="var-y">y</span> + 4<span className="var-z">z</span> = 14
              </div>
              <p>In matrix form <span className="var-x">A</span><span className="var-y">X</span> = <span className="var-z">B</span>:</p>

              <div style={{display:"flex", gap:16, alignItems:"center", justifyContent:"center", flexWrap:"wrap", margin:"20px 0"}}>
                <div>
                  <Bracket>
                    <div className="matrix-grid" style={{gridTemplateColumns:"repeat(3,auto)"}}>
                      {A.map((row,i)=>row.map((v,j)=>(
                        <div key={`${i}-${j}`} className="matrix-cell" style={{color:VAR_COLORS[j]}}>{v}</div>
                      )))}
                    </div>
                  </Bracket>
                  <div className="matrix-caption">A (coefficient matrix)</div>
                </div>
                <div style={{fontFamily:"var(--loe-mono)", fontSize:"1.5rem", color:"var(--loe-chalk)"}}>×</div>
                <div>
                  <Bracket>
                    <div className="matrix-grid" style={{gridTemplateColumns:"auto"}}>
                      {VARS.map((v,i)=>(
                        <div key={v} className="matrix-cell" style={{color:VAR_COLORS[i]}}>{v}</div>
                      ))}
                    </div>
                  </Bracket>
                  <div className="matrix-caption">X (unknowns)</div>
                </div>
                <div style={{fontFamily:"var(--loe-mono)", fontSize:"1.5rem", color:"var(--loe-chalk)"}}>=</div>
                <div>
                  <Bracket>
                    <div className="matrix-grid" style={{gridTemplateColumns:"auto"}}>
                      {B.map((v,i)=>(
                        <div key={i} className="matrix-cell" style={{color:"var(--loe-chalk)"}}>{v}</div>
                      ))}
                    </div>
                  </Bracket>
                  <div className="matrix-caption">B (constants)</div>
                </div>
              </div>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 3: DETERMINANT */}
            <section>
              <span className="tag">03 · Finding det(A)</span>
              <h2>Step 1 — The determinant check</h2>
              <p>
                Before anything else, we check whether A⁻¹ even exists.
                Click any <strong className="hl">row button</strong> below to expand along that row.
                The highlighted entries are the ones being used.
              </p>

              <div className="toggle-row" style={{marginBottom:16}}>
                {[0,1,2].map(r=>(
                  <button key={r} type="button"
                    className={`toggle-btn${expandRow===r?" active":""}`}
                    onClick={()=>setExpandRow(r)}>
                    Expand row {r+1}
                  </button>
                ))}
              </div>

              <div style={{display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center", alignItems:"flex-start"}}>
                <div>
                  <div className="matrix">
                    <div className="bracket-l"/>
                    <div className="matrix-grid" style={{gridTemplateColumns:"repeat(3,auto)"}}>
                      {A.map((row,i)=>row.map((v,j)=>(
                        <div key={`${i}-${j}`} className="matrix-cell"
                          style={{
                            color: i===expandRow ? "var(--loe-gold)" : "var(--loe-chalk)",
                            fontWeight: i===expandRow ? 700 : 400,
                            background: i===expandRow ? "rgba(255,200,50,0.1)" : "transparent",
                            borderRadius: 4, padding:"2px 6px", transition:"all 0.2s"
                          }}>
                          {v}
                        </div>
                      )))}
                    </div>
                    <div className="bracket-r"/>
                  </div>
                  <div className="matrix-caption">A — row {expandRow+1} highlighted</div>
                </div>

                <div style={{maxWidth:320}}>
                  <p style={{fontFamily:"var(--loe-mono)", fontSize:"0.95rem", color:"var(--loe-chalk-dim)", lineHeight:1.8}}>
                    {A[expandRow].map((v,j)=>{
                      const sign = Math.pow(-1, expandRow+j);
                      const minor = getMinor(expandRow, j);
                      const mVal = det2(minor);
                      return (
                        <span key={j}>
                          <span style={{color:"var(--loe-gold)"}}>{sign>=0?"+":"-"}{Math.abs(v)}</span>
                          {" × "}
                          <span style={{color:"var(--loe-teal)"}}>({minor[0][0]}×{minor[1][1]} − {minor[0][1]}×{minor[1][0]})</span>
                          {" = "}
                          <span style={{color:"var(--loe-coral)"}}>{sign*v*mVal}</span>
                          {j<2?" + ":""}
                          <br/>
                        </span>
                      );
                    })}
                  </p>
                  <div className="verdict-box" style={{background:"rgba(255,200,50,0.1)", border:"1px solid var(--loe-gold)", color:"var(--loe-gold)", marginTop:8}}>
                    det(A) = {DET_A}
                  </div>
                  <p style={{fontSize:"0.85rem", color:"var(--loe-teal)", marginTop:8}}>
                    ✓ det ≠ 0 — inverse exists!
                  </p>
                </div>
              </div>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 4: COFACTORS */}
            <section>
              <span className="tag">04 · Building the Cofactor Matrix</span>
              <h2>Step 2 — Click any cell to see its cofactor</h2>
              <p>
                For each position (i,j): delete its row and column, find the 2×2 determinant,
                apply the sign (−1)^(i+j). Click any cell below to see the full calculation.
              </p>

              <div style={{display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center", alignItems:"flex-start"}}>
                <div>
                  <p style={{fontSize:"0.85rem", color:"var(--loe-chalk-dim)", textAlign:"center", marginBottom:8}}>Click a cell →</p>
                  <div style={{display:"grid", gridTemplateColumns:"repeat(3,52px)", gap:4}}>
                    {A.map((row,i)=>row.map((v,j)=>{
                      const isSelected = cofSel?.[0]===i && cofSel?.[1]===j;
                      const isCrossed = cofSel && (cofSel[0]===i || cofSel[1]===j) && !isSelected;
                      return (
                        <div key={`${i}-${j}`} onClick={()=>setCofSel([i,j])}
                          style={{
                            width:52, height:52, borderRadius:8, display:"flex",
                            alignItems:"center", justifyContent:"center",
                            fontFamily:"var(--loe-mono)", fontSize:"1rem", fontWeight:700,
                            cursor:"pointer", transition:"all 0.2s",
                            background: isSelected?"rgba(124,77,255,0.3)":isCrossed?"rgba(224,120,86,0.15)":"rgba(255,255,255,0.04)",
                            border: `2px solid ${isSelected?"#7c4dff":isCrossed?"var(--loe-coral)":"var(--loe-line)"}`,
                            color: isSelected?"var(--loe-chalk)":isCrossed?"var(--loe-coral)":"var(--loe-chalk)",
                            textDecoration: isCrossed?"line-through":"none",
                            opacity: isCrossed?0.5:1,
                          }}>
                          {v}
                        </div>
                      );
                    }))}
                  </div>
                  <div className="matrix-caption">Matrix A</div>
                </div>

                {cofSel && (
                  <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid var(--loe-line)", borderRadius:12, padding:16, maxWidth:280}}>
                    <p style={{color:"var(--loe-gold)", fontFamily:"var(--loe-hand)", fontSize:"1.05rem", margin:"0 0 10px"}}>
                      Position ({cofSel[0]+1},{cofSel[1]+1})
                    </p>
                    <p style={{fontSize:"0.88rem", color:"var(--loe-chalk-dim)", marginBottom:8}}>
                      After deleting row {cofSel[0]+1} & col {cofSel[1]+1}:
                    </p>
                    <div style={{display:"grid", gridTemplateColumns:"repeat(2,44px)", gap:3, marginBottom:12}}>
                      {getMinor(cofSel[0],cofSel[1]).map((row,i)=>row.map((v,j)=>(
                        <div key={`${i}-${j}`}
                          style={{width:44,height:44,borderRadius:6,background:"rgba(84,209,194,0.12)",
                            border:"1px solid var(--loe-teal)",display:"flex",alignItems:"center",
                            justifyContent:"center",color:"var(--loe-teal)",fontWeight:700,
                            fontFamily:"var(--loe-mono)",fontSize:"1rem"}}>
                          {v}
                        </div>
                      )))}
                    </div>
                    <p style={{fontFamily:"var(--loe-mono)", fontSize:"0.9rem", lineHeight:1.8, color:"var(--loe-chalk)"}}>
                      M{cofSel[0]+1}{cofSel[1]+1} = {getMinor(cofSel[0],cofSel[1])[0][0]}×{getMinor(cofSel[0],cofSel[1])[1][1]} − {getMinor(cofSel[0],cofSel[1])[0][1]}×{getMinor(cofSel[0],cofSel[1])[1][0]} = <span style={{color:"var(--loe-gold)",fontWeight:700}}>{minorSelected}</span>
                      <br/>
                      Sign = (−1)^{cofSel[0]+1+cofSel[1]+1} = <span style={{color:signSelected!>=0?"var(--loe-teal)":"var(--loe-coral)"}}>{signSelected!>=0?"+1":"−1"}</span>
                      <br/>
                      C{cofSel[0]+1}{cofSel[1]+1} = {signSelected!>=0?"+":""}{signSelected} × {minorSelected} = <span style={{color:cofSelected!>=0?"var(--loe-teal)":"var(--loe-coral)",fontWeight:700,fontSize:"1.1rem"}}>{cofSelected}</span>
                    </p>
                    <p style={{fontSize:"0.78rem",color:"var(--loe-chalk-dim)",marginTop:6}}>
                      {cofSel[0]+1}+{cofSel[1]+1}={cofSel[0]+cofSel[1]+2} → {(cofSel[0]+cofSel[1])%2===0?"even → + ✓":"odd → − ✓"}
                    </p>
                  </div>
                )}
              </div>

              <div style={{marginTop:20}}>
                <button type="button" className={`toggle-btn${showAdj?" active":""}`}
                  onClick={()=>setShowAdj(!showAdj)}>
                  {showAdj?"Hide":"Show"} full cofactor matrix & adjugate →
                </button>
              </div>

              {showAdj && (
                <div style={{display:"flex", gap:24, flexWrap:"wrap", marginTop:16, alignItems:"flex-start"}}>
                  <div>
                    <p style={{fontSize:"0.85rem", color:"var(--loe-chalk-dim)", marginBottom:8}}>Cofactor matrix:</p>
                    <Bracket>
                      <div className="matrix-grid" style={{gridTemplateColumns:"repeat(3,auto)"}}>
                        {COF.map((row,i)=>row.map((v,j)=>(
                          <div key={`${i}-${j}`} className="matrix-cell"
                            style={{color:v>=0?"var(--loe-teal)":"var(--loe-coral)"}}>{v}</div>
                        )))}
                      </div>
                    </Bracket>
                    <div className="matrix-caption">C</div>
                  </div>
                  <div style={{fontFamily:"var(--loe-mono)",fontSize:"1.5rem",color:"var(--loe-chalk-dim)",alignSelf:"center"}}>→ transpose →</div>
                  <div>
                    <p style={{fontSize:"0.85rem", color:"var(--loe-chalk-dim)", marginBottom:8}}>Adjugate adj(A):</p>
                    <Bracket>
                      <div className="matrix-grid" style={{gridTemplateColumns:"repeat(3,auto)"}}>
                        {ADJ.map((row,i)=>row.map((v,j)=>(
                          <div key={`${i}-${j}`} className="matrix-cell"
                            style={{color:v>=0?"var(--loe-gold)":"var(--loe-coral)"}}>{v}</div>
                        )))}
                      </div>
                    </Bracket>
                    <div className="matrix-caption">adj(A) = Cᵀ</div>
                  </div>
                </div>
              )}
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 5: INVERSE */}
            <section>
              <span className="tag">05 · Computing A⁻¹</span>
              <h2>Step 3 — Divide adjugate by determinant</h2>
              <p>
                A⁻¹ means "1 divided by A" for matrices. We already have adj(A) from Step 2, and
                det(A) = <strong className="hl">{DET_A}</strong> from Step 1. To get A⁻¹, divide{" "}
                <strong className="hl2">every single entry</strong> of adj(A) by {DET_A} — nine
                small divisions, one for each cell:
              </p>
              <div className="eq">
                A⁻¹ = adj(A) / det(A) = adj(A) / {DET_A}
              </div>

              <button type="button" className={`toggle-btn${showInv?" active":""}`}
                onClick={()=>setShowInv(!showInv)}>
                {showInv?"Hide":"Reveal"} A⁻¹
              </button>

              {showInv && (
                <div style={{marginTop:16}}>
                  <p style={{fontFamily:"var(--loe-mono)", fontSize:"0.82rem", lineHeight:2}}>
                    {ADJ.flat().map((v,idx)=>(
                      <span key={idx}>
                        <Frac num={v} den={DET_A} color="var(--loe-gold)" />
                        {idx < ADJ.flat().length-1 ? ",  " : ""}
                        {(idx+1)%3===0 ? <br/> : null}
                      </span>
                    ))}
                  </p>
                  <div style={{display:"flex", justifyContent:"center", marginTop:12}}>
                    <FracMat data={ADJ.flat()} den={DET_A} cols={3} />
                  </div>
                  <div className="matrix-caption">A⁻¹ — every entry left as a fraction, never rounded to a decimal</div>
                </div>
              )}
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 6: MULTIPLY */}
            <section>
              <span className="tag">06 · The Final Multiply</span>
              <h2>Step 4 — X = A⁻¹B</h2>
              <p>
                This is the payoff step. To find x, y, and z, multiply A⁻¹ by B using{" "}
                <strong className="hl">row × column</strong>: take Row 1 of A⁻¹, multiply each of
                its 3 numbers by the matching number in B (1st×1st, 2nd×2nd, 3rd×3rd), then add
                the three results together. That sum is x. Row 2 gives y, Row 3 gives z — same
                process, three times.
              </p>

              <div style={{display:"flex", gap:16, alignItems:"center", justifyContent:"center", margin:"16px 0", flexWrap:"wrap"}}>
                <FracMat data={ADJ.flat()} den={DET_A} cols={3} />
                <span style={{fontFamily:"var(--loe-mono)", fontSize:"1.4rem"}}>×</span>
                <Bracket>
                  <div className="matrix-grid" style={{gridTemplateColumns:"auto"}}>
                    {B.map((v,j)=>(
                      <div key={j} className="matrix-cell" style={{color:VAR_COLORS[j]}}>{v}</div>
                    ))}
                  </div>
                </Bracket>
              </div>

              {ADJ.map((row,i)=>{
                const terms = row.map((v,j)=>v*B[j]);
                const sum = terms.reduce((s,v)=>s+v,0);
                return (
                  <div key={i} style={{background:"rgba(255,255,255,0.03)", border:"1px solid var(--loe-line)", borderRadius:10, padding:"14px 16px", margin:"14px 0"}}>
                    <p style={{margin:"0 0 8px", fontFamily:"var(--loe-mono)", fontSize:"0.85rem"}}>
                      <strong style={{color:VAR_COLORS[i]}}>{VARS[i]}</strong> = Row {i+1} of A⁻¹ · B
                    </p>
                    <p style={{fontFamily:"var(--loe-mono)", fontSize:"0.9rem", margin:"0 0 6px"}}>
                      {row.map((v,j)=>(
                        <span key={j}>
                          (<Frac num={v} den={DET_A} color="var(--loe-gold)" />
                          {" × "}
                          <span style={{color:VAR_COLORS[j]}}>{B[j]}</span>)
                          {j<2?" + ":""}
                        </span>
                      ))}
                    </p>
                    <p style={{fontFamily:"var(--loe-mono)", fontSize:"0.9rem", margin:"0 0 6px", color:"var(--loe-chalk-dim)"}}>
                      = {terms.map((t,j)=>(
                        <span key={j}>
                          <Frac num={t} den={DET_A} color="var(--loe-chalk)" />
                          {j<2?" + ":""}
                        </span>
                      ))}
                    </p>
                    <p style={{fontFamily:"var(--loe-mono)", fontSize:"1rem", margin:0}}>
                      {VARS[i]} = <Frac num={sum} den={DET_A} color={VAR_COLORS[i]} />
                    </p>
                  </div>
                );
              })}

              <div style={{display:"flex", justifyContent:"center", margin:"16px 0"}}>
                <FracMat data={SOL.map(v=>Math.round(v*DET_A))} den={DET_A} cols={1} color="var(--loe-teal)" />
              </div>
              <div className="matrix-caption">X — the answer matrix, in the same order as x, y, z</div>

              <button type="button" className={`toggle-btn${showSol?" active":""}`}
                style={{marginTop:12}}
                onClick={()=>setShowSol(!showSol)}>
                {showSol?"Hide":"Confirm"} solution
              </button>

              {showSol && (
                <div className="verdict-box" style={{background:"rgba(84,209,194,0.08)",border:"1px solid var(--loe-teal)",color:"var(--loe-teal)",marginTop:12}}>
                  ✓ x = {fmt(SOL[0])}, y = {fmt(SOL[1])}, z = {fmt(SOL[2])}
                </div>
              )}

              <div className="think" style={{marginTop:20}}>
                <span className="who">Verify —</span> plug x, y, z back into the 3 original equations.
                If every line balances, the answer is correct:<br/>
                2({fmt(SOL[0])}) + {fmt(SOL[1])} + {fmt(SOL[2])} = {2*SOL[0]+SOL[1]+SOL[2]} ✓&nbsp;&nbsp;
                {fmt(SOL[0])} + 3({fmt(SOL[1])}) + 2({fmt(SOL[2])}) = {SOL[0]+3*SOL[1]+2*SOL[2]} ✓&nbsp;&nbsp;
                {fmt(SOL[0])} + {fmt(SOL[1])} + 4({fmt(SOL[2])}) = {SOL[0]+SOL[1]+4*SOL[2]} ✓
              </div>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 7: LIMITATIONS */}
            <section>
              <span className="tag">07 · When does this method fail?</span>
              <h2>The inverse method has limits</h2>
              <div className="progression">
                <div className="prog-card">
                  <div className="label" style={{color:"var(--loe-coral)"}}>det(A) = 0</div>
                  <div className="verdict">No inverse exists. System is either inconsistent or has infinitely many solutions. Use Gaussian elimination instead.</div>
                </div>
                <div className="prog-card">
                  <div className="label" style={{color:"var(--loe-gold)"}}>Large matrices</div>
                  <div className="verdict">Computing cofactors for 10×10+ matrices by hand is practically impossible. Gaussian elimination is more efficient at scale.</div>
                </div>
                <div className="prog-card">
                  <div className="label" style={{color:"var(--loe-teal)"}}>Best case</div>
                  <div className="verdict">3×3 square systems where det≠0. Clean, exact, elegant — and the working is straightforward to present and verify.</div>
                </div>
              </div>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 8: 2×2 SHORTCUT */}
            <section>
              <span className="tag">08 · The 2×2 Shortcut</span>
              <h2>Two equations, two unknowns — no cofactors needed</h2>
              <p>
                For a 2×2 matrix, skip cofactors and the adjugate build-up entirely — there's a direct
                shortcut. Given any A = [[a,b],[c,d]]: <strong className="hl">swap the main diagonal</strong>
                {" "}(a and d trade places), <strong className="hl2">negate the other diagonal</strong>
                {" "}(b and c flip sign), then divide the whole matrix by det(A).
              </p>

              <div className="eq">
                a<span className="var-x">x</span> + b<span className="var-y">y</span> = e<br/>
                c<span className="var-x">x</span> + d<span className="var-y">y</span> = f
              </div>

              <div style={{display:"flex", gap:16, alignItems:"center", justifyContent:"center", flexWrap:"wrap", margin:"20px 0"}}>
                <div>
                  <Bracket>
                    <div className="matrix-grid" style={{gridTemplateColumns:"repeat(2,auto)"}}>
                      <div className="matrix-cell" style={{color:"var(--loe-gold)"}}>a</div>
                      <div className="matrix-cell" style={{color:"var(--loe-teal)"}}>b</div>
                      <div className="matrix-cell" style={{color:"var(--loe-teal)"}}>c</div>
                      <div className="matrix-cell" style={{color:"var(--loe-gold)"}}>d</div>
                    </div>
                  </Bracket>
                  <div className="matrix-caption">A</div>
                </div>
                <div style={{fontFamily:"var(--loe-mono)", fontSize:"1.5rem"}}>⁻¹ =</div>
                <div style={{fontFamily:"var(--loe-mono)", fontSize:"1.1rem"}}>1 / (ad − bc) ×</div>
                <div>
                  <Bracket>
                    <div className="matrix-grid" style={{gridTemplateColumns:"repeat(2,auto)"}}>
                      <div className="matrix-cell" style={{color:"var(--loe-gold)"}}>d</div>
                      <div className="matrix-cell" style={{color:"var(--loe-coral)"}}>−b</div>
                      <div className="matrix-cell" style={{color:"var(--loe-coral)"}}>−c</div>
                      <div className="matrix-cell" style={{color:"var(--loe-gold)"}}>a</div>
                    </div>
                  </Bracket>
                  <div className="matrix-caption">A⁻¹</div>
                </div>
              </div>

              <div className="think">
                <span className="who">The rule —</span> <strong className="hl">swap</strong> a and d
                (the main diagonal), <strong className="hl2">flip the sign</strong> of b and c
                (the other diagonal), then divide the whole matrix by <strong className="hl">det(A) = ad − bc</strong>.
                No minors, no cofactor signs, no transpose — this shortcut only works for 2×2.
              </div>

              <p>Quick example: 2x + 3y = 8, x + 4y = 9 → A = [[2,3],[1,4]], det = 2(4) − 3(1) = 5</p>
              <div style={{display:"flex", gap:16, alignItems:"center", justifyContent:"center", flexWrap:"wrap", margin:"16px 0"}}>
                <FracMat data={[4,-3,-1,2]} den={5} cols={2} />
                <span style={{fontFamily:"var(--loe-mono)", fontSize:"1.4rem"}}>×</span>
                <Bracket>
                  <div className="matrix-grid" style={{gridTemplateColumns:"auto"}}>
                    <div className="matrix-cell" style={{color:"var(--loe-teal)"}}>8</div>
                    <div className="matrix-cell" style={{color:"var(--loe-coral)"}}>9</div>
                  </div>
                </Bracket>
                <span style={{fontFamily:"var(--loe-mono)", fontSize:"1.4rem"}}>=</span>
                <Bracket>
                  <div className="matrix-grid" style={{gridTemplateColumns:"auto"}}>
                    <div className="matrix-cell" style={{color:"var(--loe-gold)"}}>1</div>
                    <div className="matrix-cell" style={{color:"var(--loe-gold)"}}>2</div>
                  </div>
                </Bracket>
              </div>
              <p style={{color:"var(--loe-teal)", textAlign:"center"}}>✓ x = 1, y = 2 — solved in two lines, no cofactor matrix required.</p>
            </section>

            <div className="footer-note">
              Next up: Cramer&apos;s Rule — another determinant-based method, faster for 2×2 and 3×3 ✦
            </div>
          </>
        )}

        {/* ═══════════════ QUIZZES ═══════════════ */}
        {tab === "quiz" && (
          <section>
            <span className="tag">Test your understanding</span>
            <h2>Quiz — Inverse Matrix Method</h2>
            <Quiz lessonId={lessonId} />
          </section>
        )}

        {/* ═══════════════ LONG QUESTION ═══════════════ */}
        {tab === "long" && <LongQuestionsSection />}
      </div>

      <style>{`
        .loe-lesson {
          --loe-board:   #111827;
          --loe-board-2: #1a2438;
          --loe-chalk:   #e8e6d9;
          --loe-chalk-dim: #a09e94;
          --loe-gold:    #f5c842;
          --loe-teal:    #54d1c2;
          --loe-coral:   #e07856;
          --loe-line:    rgba(255,255,255,0.10);
          --loe-hand:    'Kalam', cursive;
          --loe-mono:    'Courier New', monospace;
          font-family: 'Georgia', serif;
          background: var(--loe-board);
          color: var(--loe-chalk);
          border-radius: 18px;
          padding: 0;
          overflow: hidden;
        }
        .loe-lesson .wrap { max-width: 720px; margin: 0 auto; padding: 32px 24px 48px; }
        .loe-lesson .hero { text-align: center; padding: 20px 0 10px; }
        .loe-lesson .eyebrow { font-family: var(--loe-mono); font-size: 0.8rem; color: var(--loe-teal); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px; }
        .loe-lesson .title { font-size: clamp(1.6rem,4vw,2.4rem); font-weight: 700; color: var(--loe-chalk); margin: 0 0 14px; }
        .loe-lesson .sub { font-size: 1rem; color: var(--loe-chalk-dim); max-width: 560px; margin: 0 auto 24px; line-height: 1.7; }
        .loe-lesson .chalk-rule { border: none; border-top: 2px dashed rgba(255,255,255,0.12); margin: 0 0 32px; }
        .loe-lesson .loe-tabbar { display: flex; gap: 0; border-bottom: 1px solid var(--loe-line); margin-bottom: 32px; }
        .loe-lesson .loe-tab { flex: 1; background: transparent; border: none; color: var(--loe-chalk-dim); padding: 12px 6px; font-size: 0.9rem; cursor: pointer; font-family: inherit; transition: all 0.2s; border-bottom: 2px solid transparent; }
        .loe-lesson .loe-tab.active { color: var(--loe-gold); border-bottom-color: var(--loe-gold); }
        .loe-lesson section { margin-bottom: 36px; animation: rise 0.35s ease both; }
        @keyframes rise { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
        .loe-lesson .tag { display: inline-block; font-family: var(--loe-mono); font-size: 0.72rem; color: var(--loe-teal); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
        .loe-lesson h2 { font-size: 1.4rem; font-weight: 600; color: var(--loe-chalk); margin: 0 0 16px; line-height: 1.3; }
        .loe-lesson .accent { color: var(--loe-gold); }
        .loe-lesson p { color: var(--loe-chalk-dim); line-height: 1.75; margin: 0 0 14px; }
        .loe-lesson .hl  { color: var(--loe-gold);  font-weight: 600; }
        .loe-lesson .hl2 { color: var(--loe-teal);  font-weight: 600; }
        .loe-lesson .var-x { color: var(--loe-gold);  font-family: var(--loe-mono); font-weight: 700; }
        .loe-lesson .var-y { color: var(--loe-teal);  font-family: var(--loe-mono); font-weight: 700; }
        .loe-lesson .var-z { color: var(--loe-coral); font-family: var(--loe-mono); font-weight: 700; }
        .loe-lesson .eq { font-family: var(--loe-mono); font-size: 1.15rem; text-align: center; background: var(--loe-board-2); border: 1px solid var(--loe-line); border-radius: 10px; padding: 18px 24px; margin: 16px 0; line-height: 2.1; }
        .loe-lesson .progression { display: grid; grid-template-columns: repeat(auto-fit,minmax(140px,1fr)); gap: 12px; margin: 20px 0; }
        .loe-lesson .prog-card { background: var(--loe-board-2); border: 1px solid var(--loe-line); border-radius: 12px; padding: 16px 12px; text-align: center; }
        .loe-lesson .prog-card .label { font-family: var(--loe-mono); font-size: 0.78rem; color: var(--loe-teal); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
        .loe-lesson .prog-card .verdict { font-size: 0.82rem; color: var(--loe-chalk-dim); margin-top: 10px; line-height: 1.5; }
        .loe-lesson .think { border-left: 3px solid var(--loe-coral); background: rgba(224,120,86,0.08); padding: 14px 18px; border-radius: 0 10px 10px 0; margin: 18px 0; font-style: italic; color: var(--loe-chalk); }
        .loe-lesson .think .who { font-family: var(--loe-hand); color: var(--loe-coral); font-style: normal; margin-right: 6px; }
        .loe-lesson .matrix { display: flex; align-items: stretch; }
        .loe-lesson .bracket-l,.loe-lesson .bracket-r { width:10px; border-top:3px solid var(--loe-chalk); border-bottom:3px solid var(--loe-chalk); }
        .loe-lesson .bracket-l { border-left:3px solid var(--loe-chalk); border-radius:8px 0 0 8px; }
        .loe-lesson .bracket-r { border-right:3px solid var(--loe-chalk); border-radius:0 8px 8px 0; }
        .loe-lesson .matrix-grid { display:grid; gap:4px 18px; padding:10px 14px; align-items:center; }
        .loe-lesson .matrix-cell { font-family:var(--loe-mono); font-size:1.1rem; text-align:center; min-width:28px; }
        .loe-lesson .matrix-caption { text-align:center; font-family:var(--loe-hand); color:var(--loe-chalk-dim); font-size:0.9rem; margin-top:4px; }
        .loe-lesson details.reveal { margin:10px 0 18px; border:1px dashed var(--loe-line); border-radius:10px; padding:4px 16px; }
        .loe-lesson details.reveal summary { cursor:pointer; color:var(--loe-gold); font-family:var(--loe-hand); font-size:1.05rem; padding:10px 0; list-style:none; }
        .loe-lesson details.reveal summary::-webkit-details-marker { display:none; }
        .loe-lesson details.reveal .answer { padding:0 0 14px 4px; color:var(--loe-chalk-dim); line-height:1.8; }
        .loe-lesson .toggle-row { display:flex; gap:10px; flex-wrap:wrap; }
        .loe-lesson .toggle-btn { font-family:var(--loe-mono); font-size:0.82rem; background:var(--loe-board-2); color:var(--loe-chalk); border:1px solid var(--loe-line); border-radius:8px; padding:8px 14px; cursor:pointer; transition:all 0.2s; }
        .loe-lesson .toggle-btn:hover { border-color:var(--loe-gold); color:var(--loe-gold); }
        .loe-lesson .toggle-btn.active { background:var(--loe-gold); color:var(--loe-board); border-color:var(--loe-gold); font-weight:600; }
        .loe-lesson .verdict-box { font-family:var(--loe-hand); font-size:1.1rem; text-align:center; padding:10px 20px; border-radius:10px; margin-top:12px; }
        .loe-lesson .divider-dots { text-align:center; letter-spacing:10px; color:var(--loe-gold); opacity:0.6; margin:40px 0; }
        .loe-lesson .footer-note { text-align:center; color:var(--loe-chalk-dim); font-family:var(--loe-hand); font-size:1rem; margin-top:50px; opacity:0.8; }
        @media (max-width:640px) { .loe-lesson .progression { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}