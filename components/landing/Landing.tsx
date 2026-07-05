'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Space_Grotesk } from 'next/font/google'
import styles from './Landing.module.css'
import ToolsShowcase from './ToolsShowcase'

const grotesk = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'] })

// UNIVERSAL landing: nothing here is hardcoded to one course.
// Counts, topics and course cards come from the database via props —
// add a course or lesson in Supabase and this page updates itself.

type Stats = { courses: number; lessons: number; quizzes: number }

const FALLBACK_TOPICS = ['Matrices', 'C Programming', 'Databases', 'Data Structures', 'Algorithms', 'SQL']

const COURSE_EMOJI: [RegExp, string][] = [
  [/matrix|algebra|math/i, '📐'],
  [/\bc\b|programming|code/i, '💻'],
  [/data ?structure|dsa|algorithm/i, '🧠'],
  [/database|sql|oracle/i, '🗄️'],
]
const emojiFor = (title: string) => COURSE_EMOJI.find(([re]) => re.test(title))?.[1] || '📘'

function Marquee({ topics }: { topics: string[] }) {
  const list = topics.length >= 4 ? topics : FALLBACK_TOPICS
  const items = [...list, ...list]
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

function CourseHighlights({ courses, lessonCounts }: { courses: any[]; lessonCounts: Record<string, number> }) {
  if (!courses || courses.length === 0) return null
  return (
    <section className={styles.highlights}>
      <p className={styles.stopTag} style={{ textAlign: 'center' }}>Pick your path</p>
      <h2 className={`${styles.chapterTitle} ${grotesk.className}`} style={{ textAlign: 'center', margin: '0 auto 8px' }}>
        {courses.length} course{courses.length === 1 ? '' : 's'} — and growing
      </h2>
      <p className={styles.highlightsSub}>Every course: interactive lessons, three-level quizzes, and live tools.</p>
      <div className={styles.highlightGrid}>
        {courses.map((c) => (
          <Link key={c.id} href={`/courses/${c.id}`} className={styles.highlightCard}>
            <span className="shine-overlay" aria-hidden="true" />
            <span className={styles.hlEmoji}>{emojiFor(String(c.title || ''))}</span>
            <span className={styles.hlCat}>{c.category || c.subject || 'Course'}</span>
            <span className={styles.hlTitle}>{c.title}</span>
            <span className={styles.hlMeta}>
              {lessonCounts[c.id] ? `${lessonCounts[c.id]} lessons` : 'New'} · Free
            </span>
            <span className={styles.hlGo}>Start →</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Landing({
  courses = [],
  stats = { courses: 0, lessons: 0, quizzes: 0 },
  topics = [],
  lessonCounts = {},
}: {
  courses?: any[]
  stats?: Stats
  topics?: string[]
  lessonCounts?: Record<string, number>
}) {
  const pathRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add(styles.lit)),
      { threshold: 0.35 }
    )
    document.querySelectorAll(`.${styles.chapter}`).forEach((el) => observer.observe(el))

    if (!reduce) {
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
    } else if (pathRef.current) {
      pathRef.current.style.setProperty('--path-progress', '1')
    }

    const vid = videoRef.current
    let vObs: IntersectionObserver | null = null
    if (vid) {
      if (reduce) vid.pause()
      else {
        vObs = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting) vid.play().catch(() => {}); else vid.pause() },
          { threshold: 0.2 }
        )
        vObs.observe(vid)
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
      if (vObs) vObs.disconnect()
    }
  }, [])

  return (
    <div>
      {/* ---------- SPLIT HERO ---------- */}
      <section className={styles.heroSplit}>
        <div className={styles.heroLeft}>
          <span className={styles.eyebrow}>Free · Interactive · Built for students</span>
          <h1 className={`${styles.headline} ${styles.headlineLeft} ${grotesk.className}`}>
            <span className={styles.line}><span>Study like</span></span>
            <span className={styles.line}><span>it&apos;s a <em className={styles.gold} style={{ fontStyle: 'normal' }}>game</em>,</span></span>
            <span className={styles.line}><span>learn like a <em className={styles.accentText} style={{ fontStyle: 'normal' }}>pro</em>.</span></span>
          </h1>
          <p className={styles.subLeft}>
            Interactive lessons, live algorithm machines, and quizzes at three levels —
            across math, programming, databases and more. No fees. No ads. Just study.
          </p>
          <div className={styles.ctaRowLeft}>
            <Link href="/courses" className={styles.ctaPrimary}>Start learning free →</Link>
            <Link href="/signup" className={styles.ctaGhost}>Create account</Link>
          </div>
          <div className={styles.statChips}>
            <div className={styles.statChip}><b>{stats.courses}</b><span>courses</span></div>
            <div className={styles.statChip}><b>{stats.lessons}</b><span>lessons</span></div>
            <div className={styles.statChip}><b>{stats.quizzes}+</b><span>quiz questions</span></div>
            <div className={styles.statChip}><b>9</b><span>live machines</span></div>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.videoFrame} style={{ margin: 0 }}>
            <video
              ref={videoRef}
              className={styles.videoEl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/hero-poster.jpg"
              aria-label="Amusing Study Hall preview video"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
            <div className={styles.videoGlow} aria-hidden="true" />
          </div>
        </div>
      </section>

      <Marquee topics={topics} />

      <CourseHighlights courses={courses} lessonCounts={lessonCounts} />

      {/* ---------- THE PATH ---------- */}
      <div className={styles.pathWrap} ref={pathRef}>
        <div className={styles.pathLine}><div className={styles.pathFill} /></div>
        <div className={styles.pathOrb} aria-hidden="true" />

        <section className={styles.chapter}>
          <div className={`${styles.panel} ${styles.fromLeft}`}>
            <p className={styles.stopTag}>Stop 1 — Learn</p>
            <h2 className={`${styles.chapterTitle} ${grotesk.className}`}>Lessons you can touch</h2>
            <p className={styles.chapterText}>
              Every topic is a story with expandable steps, click-to-reveal answers,
              and quick checkpoints that clear confusion before you scroll on.
            </p>
          </div>
          <div className={styles.stopCol}><div className={styles.bulb}><div className={styles.bulbGlow} />💡</div></div>
          <div className={`${styles.mock} ${styles.mockRight}`}>
            <div className={styles.card}>
              <div className={styles.mockRow}>▸ 1. The hook</div>
              <div className={styles.mockRow}>▾ 2. The core idea</div>
              <div className={styles.mockRow} style={{ opacity: 0.75 }}>✋ Quick check <span style={{ color: 'var(--accent)' }}>answer to continue</span></div>
              <div className={styles.mockRow}>▸ 3. Try it yourself</div>
            </div>
          </div>
        </section>

        <section className={styles.chapter}>
          <div className={`${styles.mock} ${styles.mockLeft}`}>
            <div className={styles.card}>
              <p style={{ fontSize: 12, fontWeight: 800, margin: '0 0 10px' }}>Q3 · medium</p>
              <div className={`${styles.mockRow} ${styles.mockCorrect}`}>✓ Correct answer</div>
              <div className={`${styles.mockRow} ${styles.mockWrong}`}>✗ Close, but no</div>
              <div className={styles.mockRow}>Another option</div>
              <p style={{ fontSize: 11.5, margin: '10px 0 0', opacity: 0.7 }}>📌 Weak topics are saved for review</p>
            </div>
          </div>
          <div className={styles.stopCol}><div className={styles.bulb}><div className={styles.bulbGlow} />🧩</div></div>
          <div className={`${styles.panel} ${styles.fromRight}`}>
            <p className={styles.stopTag}>Stop 2 — Practice</p>
            <h2 className={`${styles.chapterTitle} ${grotesk.className}`}>Easy. Medium. Hard.</h2>
            <p className={styles.chapterText}>
              Quizzes on every lesson at three levels, plus long questions with
              step-by-step solutions — covering normal cases, tricky cases and exceptions.
            </p>
          </div>
        </section>

        <section className={styles.chapter}>
          <div className={`${styles.panel} ${styles.fromLeft}`}>
            <p className={styles.stopTag}>Stop 3 — Play</p>
            <h2 className={`${styles.chapterTitle} ${grotesk.className}`}>Machines, not just pages</h2>
            <p className={styles.chapterText}>
              Watch algorithms run line by line, race searches, overflow a stack on
              purpose. Nine live machines — and more arriving with every course.
            </p>
          </div>
          <div className={styles.stopCol}><div className={styles.bulb}><div className={styles.bulbGlow} />⚙️</div></div>
          <div className={`${styles.mock} ${styles.mockRight}`}>
            <div className={styles.terminal}>
              <div style={{ marginBottom: 10 }}>
                <span className={styles.dot} style={{ background: '#e25c5c' }} />
                <span className={styles.dot} style={{ background: '#fbbf24' }} />
                <span className={styles.dot} style={{ background: '#4FC3A1' }} />
              </div>
              <div className={styles.termLine}><span className={styles.termAccent}>for</span> (int i = 0; i &lt; 3; i++) {'{'}</div>
              <div className={`${styles.termLine} ${styles.hlLine}`}>&nbsp;&nbsp;printf(&quot;%d &quot;, i); <span style={{ opacity: 0.55 }}>← i = 1</span></div>
              <div className={styles.termLine}>{'}'}</div>
              <div className={styles.termLine}>&nbsp;</div>
              <div className={styles.termLine}><span className={styles.termOk}>output:</span> 0 1 _</div>
            </div>
          </div>
        </section>

        <section className={styles.chapter}>
          <div className={`${styles.mock} ${styles.mockLeft}`}>
            <div className={styles.card}>
              <div className={styles.mockLabel}><span>Course progress</span><span>78%</span></div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ ['--w' as any]: '78%' }} /></div>
              <div className={styles.mockLabel}><span>Another course</span><span>45%</span></div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ ['--w' as any]: '45%' }} /></div>
              <div className={styles.mockLabel}><span>Next course</span><span>20%</span></div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ ['--w' as any]: '20%' }} /></div>
              <p style={{ fontSize: 11.5, margin: '10px 0 0', opacity: 0.7 }}>⏱ Study time tracked automatically</p>
            </div>
          </div>
          <div className={styles.stopCol}><div className={styles.bulb}><div className={styles.bulbGlow} />📈</div></div>
          <div className={`${styles.panel} ${styles.fromRight}`}>
            <p className={styles.stopTag}>Stop 4 — Track</p>
            <h2 className={`${styles.chapterTitle} ${grotesk.className}`}>Your progress, lit up</h2>
            <p className={styles.chapterText}>
              Every finished lesson lights a bulb on your roadmap — across{' '}
              {stats.courses > 0 ? `all ${stats.courses} courses` : 'every course'}, with more bulbs
              appearing as new lessons arrive. The path never ends; it grows.
            </p>
          </div>
        </section>
      </div>

      <ToolsShowcase />

      {/* ---------- FINALE ---------- */}
      <section className={styles.finale}>
        <h2 className={`${styles.finaleTitle} ${grotesk.className}`}>
          The path is <span className={styles.gold}>lit</span> — and it keeps growing.
        </h2>
        <p className={styles.finaleSub}>Free forever. Made by a student, for students.</p>
        <div className={styles.ctaRow} style={{ opacity: 1, animation: 'none' }}>
          <Link href="/courses" className={styles.ctaPrimary}>Browse courses →</Link>
        </div>
      </section>
    </div>
  )
}
