"use client";

import { useState } from "react";
import Quiz from "@/components/Quiz";

/* ============================================================
   SystemOfEquationsContent.tsx
   Chalkboard-style lesson, navy/purple palette matching the
   site's dark accent, with its own Class Notes / Quizzes /
   Long Question tab bar built in.

   Paste into: components/lessons/SystemOfEquationsContent.tsx

   Usage in app/lessons/[id]/page.tsx for this lesson only:
     <SystemOfEquationsContent lessonId={lesson.id} />
   (replaces the separate "Explanation" block + <PracticeSection />
   for this specific lesson — see notes at the end of chat)
   ============================================================ */

type EchelonCase = {
  key: string;
  label: string;
  rows: string[][];
  verdict: string;
  color: string;
};

const ECHELON_CASES: EchelonCase[] = [
  {
    key: "consistent",
    label: "Full rank rows",
    rows: [
      ["1", "2", "1", "|", "6"],
      ["0", "1", "1", "|", "2"],
      ["0", "0", "1", "|", "1"],
    ],
    verdict: "Consistent — every row still carries real information. No contradictions.",
    color: "var(--loe-teal)",
  },
  {
    key: "inconsistent",
    label: "0 0 0 | 3",
    rows: [
      ["1", "2", "1", "|", "6"],
      ["0", "1", "1", "|", "2"],
      ["0", "0", "0", "|", "3"],
    ],
    verdict: "0 = 3? That's never true. Inconsistent — no solution exists.",
    color: "var(--loe-coral)",
  },
  {
    key: "infinite",
    label: "0 0 0 | 0",
    rows: [
      ["1", "2", "1", "|", "6"],
      ["0", "1", "1", "|", "2"],
      ["0", "0", "0", "|", "0"],
    ],
    verdict:
      "0 = 0 — always true, but useless. This row vanished, leaving a free variable → infinite solutions.",
    color: "var(--loe-gold)",
  },
];

const COEFF_MATRIX: string[][] = [
  ["1", "1", "1"],
  ["2", "−1", "1"],
  ["1", "2", "−1"],
];

const AUG_MATRIX: string[][] = [
  ["1", "1", "1", "|", "6"],
  ["2", "−1", "1", "|", "3"],
  ["1", "2", "−1", "|", "4"],
];

type Tab = "notes" | "quiz" | "long";

export default function SystemOfEquationsContent({
  lessonId,
}: {
  lessonId: string;
}) {
  const [tab, setTab] = useState<Tab>("notes");
  const [activeCase, setActiveCase] = useState("consistent");
  const [freeX, setFreeX] = useState(2);

  const current = ECHELON_CASES.find((c) => c.key === activeCase)!;
  const freeY = 5 - freeX;

  return (
    <div className="loe-lesson">
      <div className="wrap">
        {/* HERO */}
        <div className="hero">
          <div className="eyebrow">Amusing Study Hall · Linear Algebra</div>
          <h1 className="title">The System of Linear Equations</h1>
          <p className="sub">
            One equation you can solve in your head. Two, still easy. Five?
            That&apos;s where the real story — and the real power of matrices —
            begins.
          </p>
          <div className="chalk-rule" />
        </div>

        {/* TAB BAR */}
        <div className="loe-tabbar">
          <button
            type="button"
            className={`loe-tab${tab === "notes" ? " active" : ""}`}
            onClick={() => setTab("notes")}
          >
            📓 Class Notes
          </button>
          <button
            type="button"
            className={`loe-tab${tab === "quiz" ? " active" : ""}`}
            onClick={() => setTab("quiz")}
          >
            🧩 Quizzes
          </button>
          <button
            type="button"
            className={`loe-tab${tab === "long" ? " active" : ""}`}
            onClick={() => setTab("long")}
          >
            📝 Long Question
          </button>
        </div>

        {/* ================= CLASS NOTES ================= */}
        {tab === "notes" && (
          <>
            {/* SECTION 1: THE HOOK */}
            <section>
              <span className="tag">01 · The Warm-up</span>
              <h2>Start with something you already know</h2>
              <p>
                Suppose you need to find the value of <span className="hl">x</span>{" "}
                here:
              </p>
              <div className="eq">
                2<span className="var-x">x</span> + 3 = 5
              </div>
              <p style={{ textAlign: "center" }}>
                Easy — <span className="hl">x = 1</span>. You&apos;ve been doing
                this since school.
              </p>

              <div className="think">
                <span className="who">Now think —</span> what if I gave you{" "}
                <strong className="hl">two</strong> equations with{" "}
                <strong className="hl2">two</strong> unknowns instead of one?
              </div>

              <div className="progression">
                <div className="prog-card">
                  <div className="label">1 equation, 1 unknown</div>
                  <div className="eq" style={{ fontSize: "1.05rem" }}>
                    2<span className="var-x">x</span> + 3 = 5
                  </div>
                  <div className="verdict">Solve directly. No sweat.</div>
                </div>
                <div className="prog-card">
                  <div className="label">2 equations, 2 unknowns</div>
                  <div className="eq" style={{ fontSize: "1.05rem" }}>
                    <span className="var-x">x</span> + <span className="var-y">y</span> = 5
                    <br />
                    <span className="var-x">x</span> − <span className="var-y">y</span> = 1
                  </div>
                  <div className="verdict">Still manageable — substitution, elimination.</div>
                </div>
                <div className="prog-card">
                  <div className="label">3 equations, 3 unknowns</div>
                  <div className="eq" style={{ fontSize: "1.05rem" }}>
                    <span className="var-x">x</span>+<span className="var-y">y</span>+
                    <span className="var-z">z</span>=6
                    <br />
                    2<span className="var-x">x</span>−<span className="var-y">y</span>+
                    <span className="var-z">z</span>=3
                    <br />
                    <span className="var-x">x</span>+2<span className="var-y">y</span>−
                    <span className="var-z">z</span>=4
                  </div>
                  <div className="verdict">A calculator still saves you. Barely.</div>
                </div>
              </div>

              <p>
                But push it to <strong className="hl">4, 5, or 50 variables</strong>,
                and elimination-by-hand becomes a nightmare. That&apos;s exactly the
                problem a <strong className="hl2">system of linear equations</strong>{" "}
                — solved through matrices — was built to crush.
              </p>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 2: WHY LINEAR */}
            <section>
              <span className="tag">02 · Why &quot;Linear&quot;?</span>
              <h2>
                Before matrices — why do we call it <span className="accent">linear</span>?
              </h2>
              <p>
                Every equation in the system has variables raised to the power of{" "}
                <strong className="hl">1</strong> only — no{" "}
                <span className="var-x">x²</span>, no <span className="var-x">xy</span>,
                no √x. Plot any one of them and you get a straight{" "}
                <strong className="hl2">line</strong> (or a flat plane, in 3D). That
                straightness is where the name comes from.
              </p>
              <p>
                A <em>system</em> of linear equations is simply a collection of
                these lines that we solve <strong>together</strong> — we&apos;re
                looking for the point (or points) where all of them agree at once.
              </p>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 3: MATRIX FORM */}
            <section>
              <span className="tag">03 · Turning Equations into a Matrix</span>
              <h2>Same system, a cleaner outfit</h2>
              <p>Take this system:</p>
              <div className="eq">
                <span className="var-x">x</span> + <span className="var-y">y</span> +{" "}
                <span className="var-z">z</span> = 6
                <br />
                2<span className="var-x">x</span> − <span className="var-y">y</span> +{" "}
                <span className="var-z">z</span> = 3
                <br />
                <span className="var-x">x</span> + 2<span className="var-y">y</span> −{" "}
                <span className="var-z">z</span> = 4
              </div>

              <p>
                Strip away the variable names and keep only the{" "}
                <strong className="hl">coefficients</strong> — that&apos;s the{" "}
                <strong className="hl2">coefficient matrix</strong> form:
              </p>

              <div className="matrix-row">
                <div className="matrix">
                  <div className="bracket-l" />
                  <div
                    className="matrix-grid"
                    style={{ gridAutoFlow: "row", gridTemplateColumns: "repeat(3, auto)" }}
                  >
                    {COEFF_MATRIX.flatMap((row, ri) =>
                      row.map((cell, ci) => (
                        <div className="matrix-cell" key={`coeff-${ri}-${ci}`}>
                          {cell}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="bracket-r" />
                </div>
              </div>
              <p className="matrix-caption">
                — just the numbers multiplying x, y, z, arranged row by row
              </p>

              <p>
                Now here&apos;s the version we actually work with most — the{" "}
                <strong className="hl">augmented matrix</strong>. It tucks the
                right-hand side (the answers) in as one more column:
              </p>

              <div className="matrix-row">
                <div className="matrix">
                  <div className="bracket-l" />
                  <div
                    className="matrix-grid aug"
                    style={{ gridAutoFlow: "row", gridTemplateColumns: "repeat(5, auto)" }}
                  >
                    {AUG_MATRIX.flatMap((row, ri) =>
                      row.map((cell, ci) =>
                        cell === "|" ? (
                          <div className="aug-divider" key={`aug-${ri}-${ci}`} />
                        ) : (
                          <div className="matrix-cell" key={`aug-${ri}-${ci}`}>
                            {cell}
                          </div>
                        )
                      )
                    )}
                  </div>
                  <div className="bracket-r" />
                </div>
              </div>
              <p className="matrix-caption">the dashed line marks where &quot;= answer&quot; lives</p>

              <div className="think">
                <span className="who">Spot the difference —</span> what does that
                one extra column, sitting after the dashed line, actually
                represent? Why keep it separate instead of just adding it as a
                fourth variable column?
              </div>
              <details className="reveal">
                <summary>Tap to check your reasoning</summary>
                <div className="answer">
                  That last column isn&apos;t a coefficient of any variable — it&apos;s
                  the <strong className="hl">constant</strong> each row equals.
                  Keeping it visually separated (with the dashed line) reminds us
                  it plays a different role: everything to the left transforms
                  the variables; everything to the right is the target the row
                  must hit.
                </div>
              </details>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 4: ECHELON FORM & CONSISTENCY */}
            <section>
              <span className="tag">04 · Reading the Solved Matrix</span>
              <h2>What kind of answer are we even chasing?</h2>
              <p>
                Later we&apos;ll learn exactly <em>how</em> to reduce a matrix to{" "}
                <strong className="hl2">echelon form</strong> (that&apos;s its own
                lesson). For now, assume it&apos;s already done — and let&apos;s
                learn to <em>read</em> what the result is telling us.
              </p>
              <p>Try each row pattern below and see what it means:</p>

              <div className="echelon-demo">
                <div className="toggle-row">
                  {ECHELON_CASES.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      className={`toggle-btn${activeCase === c.key ? " active" : ""}`}
                      onClick={() => setActiveCase(c.key)}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="card" style={{ width: "100%", maxWidth: 420 }}>
                  <div className="matrix-row" style={{ margin: "0 0 10px" }}>
                    <div className="matrix">
                      <div className="bracket-l" />
                      <div
                        className="matrix-grid aug"
                        style={{ gridAutoFlow: "row", gridTemplateColumns: "repeat(5, auto)" }}
                      >
                        {current.rows.flatMap((row, ri) =>
                          row.map((cell, ci) =>
                            cell === "|" ? (
                              <div className="aug-divider" key={`${ri}-${ci}`} />
                            ) : (
                              <div className="matrix-cell" key={`${ri}-${ci}`}>
                                {cell}
                              </div>
                            )
                          )
                        )}
                      </div>
                      <div className="bracket-r" />
                    </div>
                  </div>
                  <div className="verdict-box" style={{ color: current.color }}>
                    {current.verdict}
                  </div>
                </div>
              </div>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 5: RANK */}
            <section>
              <span className="tag">05 · One Word You&apos;ll Hear Constantly — Rank</span>
              <h2>
                The <span className="accent">rank</span> of a matrix
              </h2>
              <p>
                The <strong className="hl">rank</strong> is simply the number of{" "}
                <em>non-zero rows</em> left once the matrix is reduced — in plain
                words, the number of equations that are still giving you real,
                independent information after you strip out the redundant or
                contradictory ones.
              </p>
           <p>Call the rank <strong className="hl2">r</strong> 
           and the number of unknowns 
           <strong className="hl2">n</strong>.
            Comparing them tells you almost everything about the solution before you even finish solving. 
            Note: r is the number of independent rows <em>after</em>
             reduction — you might start with n equations, but if one turns out to be a repeat of the others,
              r ends up smaller than n:</p>
              <div className="chip-row">
                <div className="chip off">r &lt; rank(augmented) → inconsistent, no solution</div>
               <div className="chip inf">r &lt; n → infinite solutions</div>
                <div className="chip on">r = n = number of equations → unique solution</div>
              </div>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 6: FREE VARIABLE */}
            <section>
              <span className="tag">06 · Infinite Solutions, Explained</span>
              <h2>
                How can a system have <span className="accent">infinite</span> answers?
              </h2>
              <p>
                Say reduction leaves you with 2 equations but 3 unknowns — rank 2,
                n = 3. You&apos;re short one equation, so one variable is free to
                be <strong className="hl">anything you choose</strong>. Everything
                else then depends on that choice. Here, let&apos;s make{" "}
                <span className="var-z">z</span> the free variable:
              </p>
              <div className="eq">
                <span className="var-x">x</span> + <span className="var-y">y</span> = 5
              </div>

              <div className="free-var-demo">
                <div className="slider-wrap">
                  <span style={{ fontFamily: "var(--loe-mono)" }}>
                    Pick a value for <span className="var-x">x</span>:
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={freeX}
                    onChange={(e) => setFreeX(parseInt(e.target.value, 10))}
                  />
                  <span className="result-eq">x = {freeX}</span>
                </div>
                <div className="result-eq">
                  then y = {freeY}, giving (x, y) = ({freeX}, {freeY})
                </div>
              </div>

              <p>
                Slide it — every single value gives a <em>different but equally
                valid</em> pair (x, y). That&apos;s the whole idea of infinite
                solutions: not &quot;no answer,&quot; but &quot;a whole family of
                answers,&quot; all traceable back to one free choice. And note —
                it didn&apos;t have to be <span className="var-x">x</span> we set
                free; we simply picked one. Any variable in a dependent system can
                play that role.
              </p>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 7: UNIQUE SOLUTION */}
            <section>
              <span className="tag">07 · The Clean Case</span>
              <h2>
                When you get exactly <span className="accent">one</span> answer
              </h2>
              <p>
                If you have <strong className="hl">3 equations and 3 unknowns</strong>,
                and the rank turns out to be a full <strong className="hl2">3</strong>{" "}
                — no zero rows, nothing redundant, nothing contradictory — the
                system pins down one exact point. One x, one y, one z. Nothing
                else fits.
              </p>
              <p>
                A fast shortcut, without doing full reduction: if the coefficient
                matrix is square and <strong className="hl">det(A) ≠ 0</strong>,
                you&apos;re guaranteed a unique solution. If det(A) = 0, the system
                is either inconsistent or has infinite solutions — you&apos;ll
                need to check the augmented matrix&apos;s rank to know which.
              </p>
            </section>

            <div className="divider-dots">• • •</div>

            {/* SECTION 8: METHODS TEASER */}
            <section>
              <span className="tag">08 · Coming Up</span>
              <h2>Four ways to actually solve one</h2>
              <p>
                Now that you can read <em>what kind</em> of answer a system has,
                the next lessons cover <em>how</em> to get there:
              </p>
              <div className="methods">
                <div className="method-card">
                  <div className="num">01</div>
                  <div className="name">Inverse Matrix</div>
                  <div className="soon">next lesson</div>
                </div>
                <div className="method-card">
                  <div className="num">02</div>
                  <div className="name">Cramer&apos;s Rule</div>
                  <div className="soon">next lesson</div>
                </div>
                <div className="method-card">
                  <div className="num">03</div>
                  <div className="name">Gaussian Elimination</div>
                  <div className="soon">next lesson</div>
                </div>
                <div className="method-card">
                  <div className="num">04</div>
                  <div className="name">Gauss-Jordan</div>
                  <div className="soon">next lesson</div>
                </div>
              </div>
            </section>

            <div className="footer-note">— Amusing Study Hall —</div>
          </>
        )}

        {/* ================= QUIZZES ================= */}
        {tab === "quiz" && (
          <div className="loe-panel">
            <Quiz lessonId={lessonId} />
          </div>
        )}

        {/* ================= LONG QUESTION ================= */}
        {tab === "long" && (
          <div className="loe-panel loe-long-empty">
            <div className="loe-long-icon">📝</div>
            <p className="loe-long-title">Long question practice isn&apos;t available for this lesson yet</p>
            <p className="loe-long-sub">We&apos;ll continue adding long questions starting from the next lessons.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,650&family=JetBrains+Mono:wght@400;600&display=swap");

        .loe-lesson {
          --loe-board: #131a33;
          --loe-board-2: #0d1226;
          --loe-chalk: #eef0f5;
          --loe-chalk-dim: #a9b1c9;
          --loe-gold: #e8b04b;
          --loe-teal: #4fb6a8;
          --loe-coral: #e07856;
          --loe-line: rgba(238, 240, 245, 0.14);
          --loe-card: #1a2242;
          --loe-card-border: rgba(124, 77, 255, 0.28);
          --loe-radius: 14px;
          --loe-serif: "Source Serif 4", Georgia, serif;
          --loe-hand: "Kalam", cursive;
          --loe-mono: "JetBrains Mono", "Courier New", monospace;

          background: radial-gradient(
            circle at 20% 10%,
            #241e4d 0%,
            var(--loe-board) 45%,
            var(--loe-board-2) 100%
          );
          color: var(--loe-chalk);
          font-family: var(--loe-serif);
          line-height: 1.65;
          padding: 0 0 60px 0;
          border-radius: 18px;
        }
        .loe-lesson * {
          box-sizing: border-box;
        }
        .loe-lesson .wrap {
          max-width: 880px;
          margin: 0 auto;
          padding: 0 22px;
        }
        .loe-lesson .hero {
          padding: 48px 22px 24px;
          text-align: center;
          position: relative;
        }
        .loe-lesson .hero::before {
          content: "";
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 320px;
          height: 200px;
          background: radial-gradient(circle, rgba(124, 77, 255, 0.35), transparent 70%);
          filter: blur(20px);
          z-index: 0;
          pointer-events: none;
        }
        .loe-lesson .eyebrow {
          font-family: var(--loe-hand);
          color: var(--loe-gold);
          font-size: 1.15rem;
          letter-spacing: 0.04em;
          position: relative;
        }
        .loe-lesson h1.title {
          font-size: clamp(1.9rem, 4.5vw, 2.9rem);
          margin: 8px 0 6px;
          font-weight: 650;
          color: var(--loe-chalk);
          position: relative;
        }
        .loe-lesson .sub {
          color: var(--loe-chalk-dim);
          font-size: 1.05rem;
          max-width: 620px;
          margin: 0 auto;
          position: relative;
        }
        .loe-lesson .chalk-rule {
          width: 140px;
          height: 3px;
          margin: 22px auto;
          background: repeating-linear-gradient(
            90deg,
            var(--loe-gold),
            var(--loe-gold) 8px,
            transparent 8px,
            transparent 14px
          );
          opacity: 0.8;
          border-radius: 2px;
        }

        /* ---------- TAB BAR ---------- */
        .loe-tabbar {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
          margin: 8px 0 36px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--loe-line);
        }
        .loe-tab {
          font-family: var(--loe-mono);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid var(--loe-line);
          background: var(--loe-board-2);
          color: var(--loe-chalk-dim);
          cursor: pointer;
          transition: all 0.2s;
        }
        .loe-tab:hover {
          border-color: var(--loe-gold);
          color: var(--loe-chalk);
        }
        .loe-tab.active {
          background: linear-gradient(135deg, var(--loe-gold), #f2c66b);
          color: var(--loe-board);
          border-color: var(--loe-gold);
          box-shadow: 0 0 16px rgba(232, 176, 75, 0.35);
        }

        .loe-panel {
          margin-top: 4px;
        }
        .loe-long-empty {
          text-align: center;
          padding: 60px 24px;
          background: linear-gradient(180deg, var(--loe-card), #141a3a);
          border: 1px dashed var(--loe-card-border);
          border-radius: var(--loe-radius);
        }
        .loe-long-icon {
          font-size: 2.2rem;
          margin-bottom: 12px;
        }
        .loe-long-title {
          font-family: var(--loe-hand);
          font-size: 1.2rem;
          color: var(--loe-gold);
          margin: 0 0 8px;
        }
        .loe-long-sub {
          color: var(--loe-chalk-dim);
          font-size: 0.95rem;
          margin: 0;
        }

        .loe-lesson section {
          margin: 46px 0;
        }
        .loe-lesson .tag {
          display: inline-block;
          font-family: var(--loe-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--loe-board);
          background: linear-gradient(135deg, var(--loe-gold), #f2c66b);
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 14px;
          box-shadow: 0 0 16px rgba(232, 176, 75, 0.35);
        }
        .loe-lesson h2 {
          font-size: 1.5rem;
          margin: 0 0 12px;
          color: var(--loe-chalk);
        }
        .loe-lesson h2 .accent {
          color: var(--loe-teal);
        }
        .loe-lesson p {
          color: var(--loe-chalk-dim);
          font-size: 1.02rem;
        }
        .loe-lesson strong.hl {
          color: var(--loe-gold);
          font-weight: 600;
        }
        .loe-lesson strong.hl2 {
          color: var(--loe-teal);
          font-weight: 600;
        }
        .loe-lesson .card {
          background: linear-gradient(180deg, var(--loe-card), #141a3a);
          border: 1px solid var(--loe-card-border);
          border-radius: var(--loe-radius);
          padding: 22px 24px;
          margin: 18px 0;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35), 0 0 24px rgba(124, 77, 255, 0.12);
        }
        .loe-lesson .eq {
          font-family: var(--loe-mono);
          font-size: 1.25rem;
          color: var(--loe-chalk);
          text-align: center;
          padding: 6px 0;
        }
        .loe-lesson .eq .var-x {
          color: var(--loe-gold);
        }
        .loe-lesson .eq .var-y {
          color: var(--loe-teal);
        }
        .loe-lesson .eq .var-z {
          color: var(--loe-coral);
        }
        .loe-lesson .var-x {
          color: var(--loe-gold);
        }
        .loe-lesson .var-y {
          color: var(--loe-teal);
        }
        .loe-lesson .var-z {
          color: var(--loe-coral);
        }
        .loe-lesson .progression {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          margin: 18px 0;
        }
        .loe-lesson .prog-card {
          flex: 1 1 240px;
          background: linear-gradient(180deg, #182050, var(--loe-board-2));
          border: 1px solid var(--loe-line);
          border-radius: 12px;
          padding: 16px 18px;
          opacity: 0;
          transform: translateY(14px);
          animation: loe-rise 0.6s ease forwards;
        }
        .loe-lesson .prog-card:nth-child(1) {
          animation-delay: 0.05s;
        }
        .loe-lesson .prog-card:nth-child(2) {
          animation-delay: 0.25s;
        }
        .loe-lesson .prog-card:nth-child(3) {
          animation-delay: 0.45s;
        }
        .loe-lesson .prog-card .label {
          font-family: var(--loe-hand);
          color: var(--loe-gold);
          font-size: 1rem;
          margin-bottom: 6px;
        }
        .loe-lesson .prog-card .verdict {
          font-size: 0.9rem;
          color: var(--loe-chalk-dim);
          margin-top: 8px;
        }
        @keyframes loe-rise {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .loe-lesson .matrix-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin: 26px 0;
          flex-wrap: wrap;
        }
        .loe-lesson .matrix {
          display: flex;
          align-items: stretch;
        }
        .loe-lesson .bracket-l,
        .loe-lesson .bracket-r {
          width: 10px;
          border-top: 3px solid var(--loe-chalk);
          border-bottom: 3px solid var(--loe-chalk);
          margin: 0;
        }
        .loe-lesson .bracket-l {
          border-left: 3px solid var(--loe-chalk);
          border-radius: 8px 0 0 8px;
        }
        .loe-lesson .bracket-r {
          border-right: 3px solid var(--loe-chalk);
          border-radius: 0 8px 8px 0;
        }
        .loe-lesson .matrix-grid {
          display: grid;
          grid-auto-flow: row;
          gap: 4px 18px;
          padding: 10px 14px;
          align-items: center;
        }
        .loe-lesson .matrix-grid.aug {
          position: relative;
        }
        .loe-lesson .matrix-cell {
          font-family: var(--loe-mono);
          font-size: 1.15rem;
          text-align: center;
          min-width: 30px;
        }
        .loe-lesson .aug-divider {
          border-left: 2px dashed var(--loe-gold);
          align-self: stretch;
          margin: 0 2px;
        }
        .loe-lesson .matrix-caption {
          text-align: center;
          font-family: var(--loe-hand);
          color: var(--loe-chalk-dim);
          font-size: 0.95rem;
          margin-top: -8px;
        }
        .loe-lesson .think {
          border-left: 3px solid var(--loe-coral);
          background: rgba(224, 120, 86, 0.08);
          padding: 14px 18px;
          border-radius: 0 10px 10px 0;
          margin: 18px 0;
          font-style: italic;
          color: var(--loe-chalk);
        }
        .loe-lesson .think .who {
          font-family: var(--loe-hand);
          color: var(--loe-coral);
          font-style: normal;
          margin-right: 6px;
        }
        .loe-lesson details.reveal {
          margin: 10px 0 18px;
          border: 1px dashed var(--loe-line);
          border-radius: 10px;
          padding: 4px 16px;
        }
        .loe-lesson details.reveal summary {
          cursor: pointer;
          color: var(--loe-gold);
          font-family: var(--loe-hand);
          font-size: 1.05rem;
          padding: 10px 0;
          list-style: none;
        }
        .loe-lesson details.reveal summary::-webkit-details-marker {
          display: none;
        }
        .loe-lesson details.reveal summary::before {
          content: "▸ ";
        }
        .loe-lesson details.reveal[open] summary::before {
          content: "▾ ";
        }
        .loe-lesson details.reveal .answer {
          padding: 0 0 14px 4px;
          color: var(--loe-chalk-dim);
        }
        .loe-lesson .chip-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin: 14px 0;
        }
        .loe-lesson .chip {
          font-family: var(--loe-mono);
          font-size: 0.85rem;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid var(--loe-line);
          color: var(--loe-chalk-dim);
        }
        .loe-lesson .chip.on {
          border-color: var(--loe-teal);
          color: var(--loe-teal);
        }
        .loe-lesson .chip.off {
          border-color: var(--loe-coral);
          color: var(--loe-coral);
        }
        .loe-lesson .chip.inf {
          border-color: var(--loe-gold);
          color: var(--loe-gold);
        }
        .loe-lesson .echelon-demo {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
          margin: 16px 0;
        }
        .loe-lesson .toggle-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .loe-lesson .toggle-btn {
          font-family: var(--loe-mono);
          font-size: 0.82rem;
          background: var(--loe-board-2);
          color: var(--loe-chalk);
          border: 1px solid var(--loe-line);
          border-radius: 8px;
          padding: 8px 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .loe-lesson .toggle-btn:hover {
          border-color: var(--loe-gold);
          color: var(--loe-gold);
        }
        .loe-lesson .toggle-btn.active {
          background: var(--loe-gold);
          color: var(--loe-board);
          border-color: var(--loe-gold);
          font-weight: 600;
        }
        .loe-lesson .verdict-box {
          font-family: var(--loe-hand);
          font-size: 1.15rem;
          text-align: center;
          padding: 10px 20px;
          border-radius: 10px;
          min-height: 30px;
          transition: all 0.25s;
        }
        .loe-lesson .free-var-demo {
          text-align: center;
          margin: 16px 0;
        }
        .loe-lesson .slider-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin: 14px 0;
          flex-wrap: wrap;
        }
        .loe-lesson input[type="range"] {
          accent-color: var(--loe-gold);
          width: 220px;
        }
        .loe-lesson .result-eq {
          font-family: var(--loe-mono);
          font-size: 1.15rem;
        }
        .loe-lesson .methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 14px;
          margin-top: 16px;
        }
        .loe-lesson .method-card {
          background: linear-gradient(180deg, #182050, var(--loe-board-2));
          border: 1px solid var(--loe-line);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          transition: transform 0.2s, border-color 0.2s;
        }
        .loe-lesson .method-card:hover {
          transform: translateY(-4px);
          border-color: var(--loe-gold);
        }
        .loe-lesson .method-card .num {
          font-family: var(--loe-mono);
          color: var(--loe-gold);
          font-size: 0.8rem;
        }
        .loe-lesson .method-card .name {
          font-family: var(--loe-hand);
          font-size: 1.1rem;
          margin-top: 4px;
        }
        .loe-lesson .method-card .soon {
          font-size: 0.78rem;
          color: var(--loe-chalk-dim);
          margin-top: 6px;
        }
        .loe-lesson .footer-note {
          text-align: center;
          color: var(--loe-chalk-dim);
          font-family: var(--loe-hand);
          font-size: 1rem;
          margin-top: 50px;
          opacity: 0.8;
        }
        .loe-lesson .divider-dots {
          text-align: center;
          letter-spacing: 10px;
          color: var(--loe-gold);
          opacity: 0.6;
          margin: 40px 0;
        }
        @media (max-width: 640px) {
          .loe-lesson .compare {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}