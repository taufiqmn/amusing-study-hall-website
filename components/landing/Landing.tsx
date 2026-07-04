'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Space_Grotesk } from 'next/font/google'
import styles from './Landing.module.css'

const grotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'] })

// The landing page IS the roadmap: a glowing path draws itself as you
// scroll, and each feature "stop" lights up like the bulbs in the
// course roadmap. Chapters slide in cinematically from the sides.

const TOPICS = [
  'Matrices', 'Determinants', 'Inverse Matrix', 'C Programming', 'Loops',
  'Big-O', 'Algorithms', 'SQL', 'Databases', 'Cofactors', 'Transpose',
]

function Marquee() {
  const items = [...TOPICS, ...TOPICS]
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.marqueeTrack}>
        {items.map((t, i) => (
          <span key={i}>
            {t} <em> ✦</em>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Landing({ courseCount }: { courseCount: number }) {
  const pathRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 1) Draw the path as the user scrolls through the roadmap section
    const onScroll = () => {
      const el = pathRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height - vh * 0.4
      const scrolled = Math.min(Math.max(vh * 0.6 - rect.top, 0), total)
      const progress = total > 0 ? scrolled / total : 0
      el.style.setProperty('--path-progress', progress.toFixed(4))
    }

    // 2) Light up each stop when it enters the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add(styles.lit)
        })
      },
      { threshold: 0.35 }
    )
    document.querySelectorAll(`.${styles.chapter}`).forEach((el) => observer.observe(el))

    if (!reduce) {
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
    } else if (pathRef.current) {
      pathRef.current.style.setProperty('--path-progress', '1')
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Free · Interactive · Built for students</span>
        <h1 className={`${styles.headline} ${grotesk.className}`}>
          <span className={styles.line}><span>Study like</span></span>
          <span className={styles.line}><span>it&apos;s a <em className={styles.gold} style={{ fontStyle: 'normal' }}>game</em>,</span></span>
          <span className={styles.line}><span>learn like a <em className={styles.accentText} style={{ fontStyle: 'normal' }}>pro</em>.</span></span>
        </h1>
        <p className={styles.sub}>
          Matrices, C programming, databases and algorithms — explained the easy way,
          with click-to-reveal answers, quizzes at three difficulty levels, and a roadmap
          that lights up as you learn. No fees. No ads. Just study.
        </p>
        <div className={styles.ctaRow}>
          <Link href="/courses" className={styles.ctaPrimary}>Start learning free →</Link>
          <Link href="/signup" className={styles.ctaGhost}>Create account</Link>
        </div>
        <p className={styles.scrollHint}>
          Scroll to walk the path
          <span className={styles.arrow}>▾</span>
        </p>
      </section>

      <Marquee />

      {/* ---------- THE PATH ---------- */}
      <div className={styles.pathWrap} ref={pathRef}>
        <div className={styles.pathLine}>
          <div className={styles.pathFill} />
        </div>
        <div className={styles.pathOrb} aria-hidden="true" />

        {/* STOP 1 — LEARN */}
        <section className={styles.chapter}>
          <div className={`${styles.panel} ${styles.fromLeft}`}>
            <p className={styles.stopTag}>Stop 1 — Learn</p>
            <h2 className={`${styles.chapterTitle} ${grotesk.className}`}>Lessons you can touch</h2>
            <p className={styles.chapterText}>
              Every topic is broken into small expandable steps. Confused about a line?
              Click it. Want to test yourself mid-lesson? Reveal-questions are waiting
              inside every section.
            </p>
          </div>
          <div className={styles.stopCol}>
            <div className={styles.bulb}>
              <div className={styles.bulbGlow} />
              💡
            </div>
          </div>
          <div className={`${styles.mock} ${styles.mockRight}`}>
            <div className={styles.card}>
              <div className={styles.mockRow}>▸ 1. What is a matrix?</div>
              <div className={styles.mockRow}>▾ 2. Rows, columns &amp; size</div>
              <div className={styles.mockRow} style={{ opacity: 0.75 }}>❓ What is the size of a 3×2 matrix? <span style={{ color: 'var(--accent)' }}>tap to reveal</span></div>
              <div className={styles.mockRow}>▸ 3. Try it yourself</div>
            </div>
          </div>
        </section>

        {/* STOP 2 — PRACTICE */}
        <section className={styles.chapter}>
          <div className={`${styles.mock} ${styles.mockLeft}`}>
            <div className={styles.card}>
              <p style={{ fontSize: 12, fontWeight: 800, margin: '0 0 10px' }}>Q3 · medium · determinants</p>
              <div className={`${styles.mockRow} ${styles.mockCorrect}`}>✓ det(A) = ad − bc</div>
              <div className={`${styles.mockRow} ${styles.mockWrong}`}>✗ det(A) = ab − cd</div>
              <div className={styles.mockRow}>det(A) = a + d</div>
              <p style={{ fontSize: 11.5, margin: '10px 0 0', opacity: 0.7 }}>📌 Weak topics are saved for review</p>
            </div>
          </div>
          <div className={styles.stopCol}>
            <div className={styles.bulb}>
              <div className={styles.bulbGlow} />
              🧩
            </div>
          </div>
          <div className={`${styles.panel} ${styles.fromRight}`}>
            <p className={styles.stopTag}>Stop 2 — Practice</p>
            <h2 className={`${styles.chapterTitle} ${grotesk.className}`}>Easy. Medium. Hard.</h2>
            <p className={styles.chapterText}>
              Quizzes on every lesson at three difficulty levels, covering normal cases,
              tricky cases and exceptions. Get one wrong? The topic is remembered so you
              can hunt it down later.
            </p>
          </div>
        </section>

        {/* STOP 3 — CODE LAB */}
        <section className={styles.chapter}>
          <div className={`${styles.panel} ${styles.fromLeft}`}>
            <p className={styles.stopTag}>Stop 3 — Code Lab</p>
            <h2 className={`${styles.chapterTitle} ${grotesk.className}`}>Watch code run, line by line</h2>
            <p className={styles.chapterText}>
              See exactly what a loop does on every iteration — which line runs,
              what each variable holds, what gets printed. Then write your own code
              and run it right in the browser.
            </p>
          </div>
          <div className={styles.stopCol}>
            <div className={styles.bulb}>
              <div className={styles.bulbGlow} />
              ⚙️
            </div>
          </div>
          <div className={`${styles.mock} ${styles.mockRight}`}>
            <div className={styles.terminal}>
              <div style={{ marginBottom: 10 }}>
                <span className={styles.dot} style={{ background: '#e25c5c' }} />
                <span className={styles.dot} style={{ background: '#f3cb4b' }} />
                <span className={styles.dot} style={{ background: '#4fc3a1' }} />
              </div>
              <div className={styles.termLine}><span className={styles.termAccent}>for</span> (int i = 0; i &lt; 3; i++) {'{'}</div>
              <div className={`${styles.termLine} ${styles.hlLine}`}>&nbsp;&nbsp;printf(&quot;%d &quot;, i); <span style={{ opacity: 0.55 }}>← i = 1</span></div>
              <div className={styles.termLine}>{'}'}</div>
              <div className={styles.termLine}>&nbsp;</div>
              <div className={styles.termLine}><span className={styles.termOk}>output:</span> 0 1 _</div>
            </div>
          </div>
        </section>

        {/* STOP 4 — TRACK */}
        <section className={styles.chapter}>
          <div className={`${styles.mock} ${styles.mockLeft}`}>
            <div className={styles.card}>
              <div className={styles.mockLabel}><span>Matrix Course</span><span>78%</span></div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ ['--w' as any]: '78%' }} /></div>
              <div className={styles.mockLabel}><span>C Programming</span><span>45%</span></div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ ['--w' as any]: '45%' }} /></div>
              <div className={styles.mockLabel}><span>Databases</span><span>20%</span></div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ ['--w' as any]: '20%' }} /></div>
              <p style={{ fontSize: 11.5, margin: '10px 0 0', opacity: 0.7 }}>⏱ Study time tracked automatically</p>
            </div>
          </div>
          <div className={styles.stopCol}>
            <div className={styles.bulb}>
              <div className={styles.bulbGlow} />
              📈
            </div>
          </div>
          <div className={`${styles.panel} ${styles.fromRight}`}>
            <p className={styles.stopTag}>Stop 4 — Track</p>
            <h2 className={`${styles.chapterTitle} ${grotesk.className}`}>Your progress, lit up</h2>
            <p className={styles.chapterText}>
              Every lesson you finish lights a bulb on your roadmap. Your dashboard shows
              study time per course, completed lessons and the topics you should revisit —
              across {courseCount > 0 ? `${courseCount} courses` : 'all courses'} and growing.
            </p>
          </div>
        </section>
      </div>

      {/* ---------- FINALE ---------- */}
      <section className={styles.finale}>
        <h2 className={`${styles.finaleTitle} ${grotesk.className}`}>
          The path is <span className={styles.gold}>lit</span>. Take the first step.
        </h2>
        <p className={styles.finaleSub}>Free forever. Made by a student, for students.</p>
        <div className={styles.ctaRow} style={{ opacity: 1, animation: 'none' }}>
          <Link href="/courses" className={styles.ctaPrimary}>Browse courses →</Link>
        </div>
      </section>
    </div>
  )
}
