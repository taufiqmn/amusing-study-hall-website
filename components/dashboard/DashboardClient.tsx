'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ReviewQuiz from './ReviewQuiz'
import RecommendedCourses from '@/components/RecommendedCourses'
import styles from './dashboard.module.css'

// ============================================================
// STUDY COCKPIT — every number is real:
//   activity_logs → time, streak, weekly bars, continue card
//   progress      → lessons done, course rings
//   quiz_attempts → quizzes, avg score, weak topics
// ============================================================

const DAILY_GOAL_MIN = 30
const RING_COLORS = ['var(--gold, #fbbf24)', 'var(--accent)', 'var(--accent-2, #22d3ee)']

function useCountUp(target: number, ms = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(target); return }
    let raf: number
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min((t - t0) / ms, 1)
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return val
}

function fmtTime(totalSec: number) {
  const h = Math.floor(totalSec / 3600)
  const m = Math.round((totalSec % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function Ring({ pct, color, label }: { pct: number; color: string; label: string }) {
  const C = 2 * Math.PI * 26
  const [off, setOff] = useState(C)
  useEffect(() => {
    const t = setTimeout(() => setOff(C * (1 - Math.min(pct, 100) / 100)), 60)
    return () => clearTimeout(t)
  }, [pct, C])
  return (
    <div className={styles.ringBox}>
      <div style={{ position: 'relative', width: 64, height: 64, margin: '0 auto' }}>
        <svg width={64} height={64} viewBox="0 0 64 64" className={styles.ringSvg}>
          <circle cx={32} cy={32} r={26} stroke="var(--pill-bg)" strokeWidth={7} fill="none" />
          <circle cx={32} cy={32} r={26} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 32 32)" />
        </svg>
        <span className={styles.ringPct} style={{ color }}>{Math.round(pct)}%</span>
      </div>
      <p className={styles.ringLbl}>{label}</p>
    </div>
  )
}

const BADGES = [
  { emoji: '💡', name: 'First lesson', test: (s: any) => s.lessonsDone >= 1 },
  { emoji: '📚', name: '5 lessons', test: (s: any) => s.lessonsDone >= 5 },
  { emoji: '🧩', name: 'First quiz', test: (s: any) => s.quizzes >= 1 },
  { emoji: '🎯', name: 'Perfect quiz', test: (s: any) => s.perfect },
  { emoji: '🔥', name: '3-day streak', test: (s: any) => s.streak >= 3 },
  { emoji: '🌋', name: '7-day streak', test: (s: any) => s.streak >= 7 },
  { emoji: '⏰', name: '10 hours', test: (s: any) => s.totalSec >= 36000 },
  { emoji: '🏆', name: 'Course done', test: (s: any) => s.courseDone },
]

export default function DashboardClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [d, setD] = useState<any>(null)
  const [showReview, setShowReview] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [recCourses, setRecCourses] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // GUEST MODE: no redirect — show the dashboard shell with
        // recommended courses and locked progress sections instead.
        setIsGuest(true)
        const { data: courses } = await supabase.from('courses').select('*').limit(4)
        setRecCourses(courses || [])
        setLoading(false)
        return
      }

      const [{ data: profileData }, { data: logs }, { data: prog }, { data: attempts }, { data: lessons }, { data: courses }] =
        await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).single(),
          supabase.from('activity_logs').select('lesson_id, course_id, duration_seconds, ended_at, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(600),
          supabase.from('progress').select('lesson_id, course_id, created_at').eq('user_id', user.id).eq('status', 'completed'),
          supabase.from('quiz_attempts').select('score, total_questions, wrong_topic_tags, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(60),
          supabase.from('lessons').select('id, title, course_id, order_index'),
          supabase.from('courses').select('id, title'),
        ])

      setProfile(profileData)
      setRecCourses((courses || []).slice(0, 4))

      const L = logs || [], P = prog || [], A = attempts || [], LS = lessons || [], CS = courses || []
      const dayKey = (x: string | Date) => { const dt = new Date(x); return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}` }

      // time
      const totalSec = L.reduce((s, r) => s + (r.duration_seconds || 0), 0)
      const todayKey = dayKey(new Date())
      const todaySec = L.filter((r) => dayKey(r.created_at) === todayKey).reduce((s, r) => s + (r.duration_seconds || 0), 0)

      // streak (consecutive days with activity, counting today or starting yesterday)
      const days = new Set(L.map((r) => dayKey(r.created_at)))
      let streak = 0
      const cursor = new Date()
      if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
      while (days.has(dayKey(cursor))) { streak++; cursor.setDate(cursor.getDate() - 1) }

      // weekly bars (last 7 days, oldest → newest)
      const week: { label: string; min: number; isToday: boolean }[] = []
      for (let i = 6; i >= 0; i--) {
        const day = new Date(); day.setDate(day.getDate() - i)
        const k = dayKey(day)
        const sec = L.filter((r) => dayKey(r.created_at) === k).reduce((s, r) => s + (r.duration_seconds || 0), 0)
        week.push({ label: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][day.getDay()], min: Math.round(sec / 60), isToday: i === 0 })
      }

      // quiz stats
      const quizzes = A.length
      const sumScore = A.reduce((s, a) => s + (a.score || 0), 0)
      const sumTotal = A.reduce((s, a) => s + (a.total_questions || 0), 0)
      const avgPct = sumTotal > 0 ? Math.round((sumScore / sumTotal) * 100) : 0
      const perfect = A.some((a) => a.total_questions > 0 && a.score === a.total_questions)

      // weak topics (recent attempts)
      const tagCount: Record<string, number> = {}
      A.slice(0, 20).forEach((a) => (a.wrong_topic_tags || []).forEach((t: string) => { if (t) tagCount[t] = (tagCount[t] || 0) + 1 }))
      const weakTopics = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([t]) => t)

      // course rings
      const totalByCourse: Record<string, number> = {}
      LS.forEach((l) => { totalByCourse[l.course_id] = (totalByCourse[l.course_id] || 0) + 1 })
      const doneByCourse: Record<string, number> = {}
      P.forEach((p) => { doneByCourse[p.course_id] = (doneByCourse[p.course_id] || 0) + 1 })
      const rings = Object.entries(doneByCourse)
        .map(([cid, done]) => ({
          label: CS.find((c) => String(c.id) === String(cid))?.title || 'Course',
          pct: totalByCourse[cid] ? (done / totalByCourse[cid]) * 100 : 0,
          done, total: totalByCourse[cid] || 0,
        }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 3)
      const courseDone = rings.some((r) => r.total > 0 && r.done >= r.total)

      // continue card
      const lastLog = L.find((r) => r.lesson_id)
      let cont: any = null
      if (lastLog) {
        const lesson = LS.find((l) => l.id === lastLog.lesson_id)
        if (lesson) {
          const course = CS.find((c) => String(c.id) === String(lesson.course_id))
          const done = doneByCourse[lesson.course_id] || 0
          const total = totalByCourse[lesson.course_id] || 0
          cont = { lessonId: lesson.id, title: lesson.title, course: course?.title || '', idx: lesson.order_index, total, pct: total ? Math.round((done / total) * 100) : 0 }
        }
      }

      setD({ totalSec, todaySec, streak, week, quizzes, avgPct, perfect, weakTopics, rings, courseDone, cont, lessonsDone: P.length })
      setLoading(false)
    }
    load()
  }, [router])

  const totalMin = useCountUp(d ? Math.round(d.totalSec / 60) : 0)
  const lessonsUp = useCountUp(d?.lessonsDone || 0)
  const quizzesUp = useCountUp(d?.quizzes || 0)
  const avgUp = useCountUp(d?.avgPct || 0)

  if (loading) {
    return <div className={styles.wrap}><p style={{ fontSize: 13, opacity: 0.6 }}>Loading your cockpit…</p></div>
  }

  if (isGuest) {
    return (
      <div className={styles.wrap}>
        <div className={`${styles.headRow} ${styles.enter}`}>
          <div>
            <h1 className={styles.hello}>Welcome to Amusing Study Hall! 👋</h1>
            <p className={styles.helloSub}>Browse courses below, or log in to unlock your progress, streaks and badges.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/courses" className={styles.resumeBtn} style={{ padding: '8px 16px' }}>Browse courses</Link>
            <Link href="/login" className={styles.resumeBtn} style={{ padding: '8px 16px' }}>Log in</Link>
          </div>
        </div>

        <div className={`${styles.card} ${styles.enter}`} style={{ marginTop: 14 }}>
          <p className={styles.cardTag}>Recommended courses</p>
          {recCourses.length > 0 ? (
            <RecommendedCourses courses={recCourses} />
          ) : (
            <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Courses are loading — check back in a moment.</p>
          )}
        </div>

        <div
          className={`${styles.card} ${styles.enter}`}
          style={{ marginTop: 14, textAlign: 'center', filter: 'blur(2.5px)', opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}
        >
          <p className={styles.cardTag}>Your progress</p>
          <div className={styles.rings}>
            <Ring pct={0} color={RING_COLORS[0]} label="Course" />
            <Ring pct={0} color={RING_COLORS[1]} label="Course" />
            <Ring pct={0} color={RING_COLORS[2]} label="Course" />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: -10 }}>
          <Link
            href="/login"
            style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}
          >
            🔒 Log in to see your full progress →
          </Link>
        </div>
      </div>
    )
  }

  if (!d) {
    return <div className={styles.wrap}><p style={{ fontSize: 13, opacity: 0.6 }}>Loading your cockpit…</p></div>
  }

  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const todayMin = Math.round(d.todaySec / 60)
  const todayPct = Math.min((todayMin / DAILY_GOAL_MIN) * 100, 100)
  const CT = 2 * Math.PI * 18
  const maxWeek = Math.max(...d.week.map((w: any) => w.min), 1)
  const delay = (i: number) => ({ animationDelay: `${i * 90}ms` } as React.CSSProperties)

  return (
    <div className={styles.wrap}>
      {/* header */}
      <div className={`${styles.headRow} ${styles.enter}`} style={delay(0)}>
        <div>
          <h1 className={styles.hello}>{greet}, {profile?.name || 'student'}!</h1>
          <p className={styles.helloSub}>
            {todayMin > 0 ? `You studied ${todayMin} min today — goal ${DAILY_GOAL_MIN} min` : `Daily goal: ${DAILY_GOAL_MIN} min. The first minute is the hardest!`}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/courses" className={styles.streakChip} style={{ textDecoration: 'none' }}>
            📚 Courses
          </Link>
          <div className={styles.streakChip}>
            <span className={styles.flame}>🔥</span>
            {d.streak > 0 ? `${d.streak}-day streak` : 'Start a streak today'}
          </div>
          <div style={{ position: 'relative', width: 46, height: 46 }} title={`Today: ${todayMin}/${DAILY_GOAL_MIN} min`}>
            <svg width={46} height={46} viewBox="0 0 46 46" className={styles.ringSvg}>
              <circle cx={23} cy={23} r={18} stroke="var(--pill-bg)" strokeWidth={6} fill="none" />
              <circle cx={23} cy={23} r={18} stroke="var(--accent-2, #22d3ee)" strokeWidth={6} fill="none" strokeLinecap="round"
                strokeDasharray={CT} strokeDashoffset={CT * (1 - todayPct / 100)} transform="rotate(-90 23 23)" />
            </svg>
            <span className={styles.ringPct} style={{ color: 'var(--accent-2, #22d3ee)', fontSize: 10 }}>{Math.round(todayPct)}%</span>
          </div>
        </div>
      </div>

      {/* continue + weekly */}
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.enter}`} style={{ flex: 1.4, minWidth: 260, ...delay(1) }}>
          <span className="shine-overlay" aria-hidden="true" />
          <p className={styles.cardTag}>Continue where you left off</p>
          {d.cont ? (
            <>
              <p style={{ fontSize: 16, fontWeight: 800, margin: '0 0 3px' }}>{d.cont.title}</p>
              <p style={{ fontSize: 12, color: 'var(--foreground-muted)', margin: 0 }}>
                {d.cont.course}{d.cont.total ? ` · lesson ${d.cont.idx} of ${d.cont.total}` : ''}
              </p>
              <div className={styles.pbar}><div className={styles.pfill} style={{ width: `${d.cont.pct}%` }} /></div>
              <Link href={`/lessons/${d.cont.lessonId}`} className={styles.resumeBtn}>Resume lesson →</Link>
            </>
          ) : (
            <>
              <p style={{ fontSize: 15, fontWeight: 800, margin: '0 0 10px' }}>Your journey starts here 🚀</p>
              <Link href="/courses" className={styles.resumeBtn}>Pick a course →</Link>
            </>
          )}
        </div>

        <div className={`${styles.card} ${styles.enter}`} style={{ flex: 1, minWidth: 230, ...delay(2) }}>
          <p className={styles.cardTag} style={{ color: 'var(--foreground-muted)' }}>This week</p>
          <div className={styles.bars}>
            {d.week.map((w: any, i: number) => (
              <div key={i} className={styles.barCol}>
                <div
                  className={w.isToday ? styles.barToday : styles.bar}
                  style={{ height: Math.max((w.min / maxWeek) * 64, w.min > 0 ? 8 : 3), animationDelay: `${0.3 + i * 0.08}s` }}
                  title={`${w.min} min`}
                />
                <p className={styles.barLbl} style={w.isToday ? { color: 'var(--accent-2)', fontWeight: 800 } : undefined}>{w.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* count-up stats */}
      <div className={styles.grid}>
        {[
          { v: fmtTime(totalMin * 60), l: 'total study time', c: 'var(--gold, #fbbf24)' },
          { v: String(lessonsUp), l: 'lessons completed', c: 'var(--accent-2, #22d3ee)' },
          { v: String(quizzesUp), l: 'quizzes taken', c: 'var(--accent)' },
          { v: `${avgUp}%`, l: 'avg quiz score', c: '#4FC3A1' },
        ].map((s, i) => (
          <div key={s.l} className={`${styles.card} ${styles.enter}`} style={{ flex: 1, minWidth: 130, ...delay(3 + i) }}>
            <p className={styles.statVal} style={{ color: s.c }}>{s.v}</p>
            <p className={styles.statLbl}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* rings + weak topics */}
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.enter}`} style={{ flex: 1.2, minWidth: 260, ...delay(7) }}>
          <p className={styles.cardTag} style={{ color: 'var(--foreground-muted)' }}>Course progress</p>
          {d.rings.length > 0 ? (
            <div className={styles.rings}>
              {d.rings.map((r: any, i: number) => <Ring key={r.label} pct={r.pct} color={RING_COLORS[i % 3]} label={r.label} />)}
            </div>
          ) : (
            <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Complete your first lesson and rings appear here.</p>
          )}
        </div>

        <div className={`${styles.card} ${styles.fixCard} ${styles.enter}`} style={{ flex: 1, minWidth: 240, ...delay(8) }}>
          <p className={styles.cardTag} style={{ color: 'var(--gold, #fbbf24)' }}>🎯 Topics to fix</p>
          {d.weakTopics.length > 0 ? (
            <>
              <p style={{ fontSize: 12, color: 'var(--foreground-muted)', margin: '0 0 10px' }}>From your wrong quiz answers:</p>
              <div className={styles.chipRow}>
                {d.weakTopics.map((t: string) => <span key={t} className={styles.topicChip}>{t}</span>)}
              </div>
              <button className={styles.fixBtn} onClick={() => setShowReview(true)}>Start review quiz</button>
            </>
          ) : (
            <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>No weak topics yet — take some quizzes and I&apos;ll track what to review. 💪</p>
          )}
        </div>
      </div>

      {showReview && <ReviewQuiz tags={d.weakTopics} onClose={() => setShowReview(false)} />}

      {/* recommended courses */}
      <div className={`${styles.card} ${styles.enter}`} style={{ marginTop: 14 }}>
        <p className={styles.cardTag} style={{ color: 'var(--foreground-muted)' }}>Recommended for you</p>
        {recCourses.length > 0 ? (
          <RecommendedCourses courses={recCourses} />
        ) : (
          <p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>
            <Link href="/courses" style={{ color: 'var(--accent)' }}>Browse all courses →</Link>
          </p>
        )}
      </div>

      {/* badges */}
      <div className={`${styles.card} ${styles.enter}`} style={{ marginTop: 14, ...delay(9) }}>
        <p className={styles.cardTag} style={{ color: 'var(--foreground-muted)' }}>Badges</p>
        <div className={styles.badgeRow}>
          {BADGES.map((b, i) => {
            const unlocked = b.test(d)
            return (
              <div key={b.name} className={`${styles.badge} ${unlocked ? '' : styles.badgeLocked}`} style={{ animationDelay: `${0.5 + i * 0.07}s` }}>
                {unlocked && <span className="shine-overlay" aria-hidden="true" />}
                {b.emoji}
                <span className={styles.badgeTip}>{b.name}{unlocked ? ' ✓' : ' 🔒'}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
