'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import styles from './CourseRoadmapPath.module.css'

// ZIGZAG ROADMAP v2:
// - the bulb (with cap / lock state) sits in the CORNER of each lesson card
// - the center line carries ONLY the glowing sun/orb that rides down on scroll
// - cards still alternate right / left and slide in with a shine

type Lesson = { id: string; title: string; explanation?: string }
type Status = 'completed' | 'unlocked' | 'locked'

function GradCap() {
  return (
    <svg width={24} height={20} viewBox="0 0 100 86" className={styles.cap} aria-hidden="true">
      <path d="M30 42 L30 54 Q30 66 50 66 Q70 66 70 54 L70 42 Z" fill="#1A1A2E" stroke="#F3CB4B" strokeWidth="4" strokeLinejoin="round" />
      <path d="M6 32 L6 40 L50 60 L94 40 L94 32 L50 52 Z" fill="#0f0e22" stroke="#F3CB4B" strokeWidth="3" strokeLinejoin="round" />
      <path d="M6 32 L50 12 L94 32 L50 52 Z" fill="#1A1A2E" stroke="#F3CB4B" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="50" cy="32" r="4.5" fill="#F3CB4B" />
      <path d="M50 32 Q72 34 76 44 L76 60" fill="none" stroke="#F3CB4B" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M71 60 L81 60 L79 74 Q76 78 73 74 Z" fill="#F3CB4B" />
    </svg>
  )
}

// corner bulb badge that lives on the card
function CornerBulb({ status }: { status: Status }) {
  return (
    <div className={`${styles.corner} ${styles['corner_' + status]}`}>
      {status === 'completed' && <GradCap />}
      <span className={styles.bulb}>💡</span>
      {status === 'locked' && <span className={styles.lock}>🔒</span>}
      <div className={styles.cornerGlow} aria-hidden="true" />
    </div>
  )
}

export default function CourseRoadmapPath({ lessons, completedIds }: { lessons: Lesson[]; completedIds: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onScroll = () => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height - vh * 0.35
      const scrolled = Math.min(Math.max(vh * 0.65 - rect.top, 0), Math.max(total, 1))
      el.style.setProperty('--rp', (total > 0 ? scrolled / total : 1).toFixed(4))
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add(styles.lit)),
      { threshold: 0.3 }
    )
    wrapRef.current?.querySelectorAll(`.${styles.row}`).forEach((el) => io.observe(el))

    if (reduce) {
      wrapRef.current?.style.setProperty('--rp', '1')
      wrapRef.current?.querySelectorAll(`.${styles.row}`).forEach((el) => el.classList.add(styles.lit))
    } else {
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
    }
  }, [lessons.length])

  const statusOf = (i: number): Status =>
    completedIds.includes(lessons[i].id)
      ? 'completed'
      : i === 0 || completedIds.includes(lessons[i - 1]?.id)
      ? 'unlocked'
      : 'locked'

  const STATUS_TEXT: Record<Status, string> = { completed: 'Completed', unlocked: 'Up next', locked: 'Locked' }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.line}><div className={styles.fill} /></div>
      <div className={styles.sun} aria-hidden="true">☀️</div>

      {lessons.map((lesson, i) => {
        const status = statusOf(i)
        const right = i % 2 === 0
        const card = (
          <div className={`${styles.card} ${styles['card_' + status]}`}>
            <span className="shine-overlay" aria-hidden="true" />
            <CornerBulb status={status} />
            <p className={`${styles.tag} ${styles['tag_' + status]}`}>
              {String(i + 1).padStart(2, '0')} · {STATUS_TEXT[status]}
            </p>
            <h3 className={styles.title}>{lesson.title}</h3>
            {lesson.explanation && <p className={styles.desc}>{lesson.explanation}</p>}
            {status !== 'locked' && <span className={styles.go}>{status === 'completed' ? 'Revisit →' : 'Start lesson →'}</span>}
          </div>
        )
        return (
          <div key={lesson.id} className={styles.row}>
            <div className={`${styles.slot} ${right ? styles.slotRight : styles.slotLeft}`}>
              {status === 'locked' ? card : (
                <Link href={`/lessons/${lesson.id}`} className={styles.cardLink}>{card}</Link>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
