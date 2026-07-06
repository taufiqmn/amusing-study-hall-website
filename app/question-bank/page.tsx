'use client'

import { useEffect, useState } from 'react'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import ExamQuiz from '@/components/ExamQuiz'
import { supabase } from '@/lib/supabase'

// QUESTION BANK flow:
// 1) pick a COURSE (color blocks)
// 2) pick a mode: a specific LESSON's quiz, or the FULL COURSE exam
// 3) pick difficulty → exam runs (30 random Qs for full course), scored & saved

type Course = { id: number; title: string; category?: string; subject?: string }
type Lesson = { id: string; title: string; course_id: number; order_index: number }

const THEMES: [RegExp, { emoji: string; from: string; to: string }][] = [
  [/matrix|algebra|math/i, { emoji: '📐', from: '#7c3aed', to: '#a855f7' }],
  [/java/i, { emoji: '☕', from: '#ea580c', to: '#f59e0b' }],
  [/\bc\b|programming/i, { emoji: '💻', from: '#0284c7', to: '#22d3ee' }],
  [/database|sql/i, { emoji: '🗄️', from: '#0d9488', to: '#4FC3A1' }],
  [/data ?structure|dsa|algorithm/i, { emoji: '🧠', from: '#db2777', to: '#f472b6' }],
]
const themeFor = (t: string) => THEMES.find(([re]) => re.test(t))?.[1] || { emoji: '📘', from: '#6d28d9', to: '#8b5cf6' }

export default function QuestionBankPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  const [course, setCourse] = useState<Course | null>(null)
  const [exam, setExam] = useState<null | { courseId?: number; lessonId?: string; difficulty: string; count: number; title: string }>(null)
  const [diffPick, setDiffPick] = useState<{ mode: 'course' } | { mode: 'lesson'; lesson: Lesson } | null>(null)

  useEffect(() => {
    const load = async () => {
      const [{ data: cs }, { data: ls }, { data: qs }] = await Promise.all([
        supabase.from('courses').select('id, title, category, subject').order('title'),
        supabase.from('lessons').select('id, title, course_id, order_index').order('order_index'),
        supabase.from('quiz_questions_public').select('lesson_id'),
      ])
      const map: Record<string, number> = {}
      for (const q of qs || []) map[q.lesson_id] = (map[q.lesson_id] || 0) + 1
      setCourses(cs || [])
      setLessons(ls || [])
      setCounts(map)
      setLoading(false)
    }
    load()
  }, [])

  // ---- exam running ----
  if (exam) {
    return (
      <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <SiteHeader />
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 20px 40px' }}>
          <ExamQuiz {...exam} onExit={() => { setExam(null); setDiffPick(null) }} />
        </div>
      </div>
    )
  }

  // ---- difficulty picker ----
  if (course && diffPick) {
    const isCourse = diffPick.mode === 'course'
    const title = isCourse ? `${course.title} — Full Exam` : (diffPick as any).lesson.title
    return (
      <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <SiteHeader />
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 20px' }}>
          <button onClick={() => setDiffPick(null)} style={{ fontSize: 12, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginBottom: 16 }}>← Back</button>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 12, opacity: 0.6, margin: '0 0 4px' }}>{isCourse ? 'Full-course exam' : 'Lesson quiz'}</p>
            <h2 style={{ fontSize: 19, fontWeight: 800, margin: '0 0 6px' }}>{title}</h2>
            <p style={{ fontSize: 13, opacity: 0.65, margin: '0 0 20px' }}>
              {isCourse ? '30 random questions from across the whole course.' : 'Random questions from this lesson.'} Choose your difficulty:
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { d: 'easy', c: '#4FC3A1' },
                { d: 'medium', c: '#d99b06' },
                { d: 'hard', c: '#e25c5c' },
                { d: 'all', c: 'var(--accent)' },
              ].map(({ d, c }) => (
                <button key={d} onClick={() => setExam({
                  courseId: isCourse ? course.id : undefined,
                  lessonId: isCourse ? undefined : (diffPick as any).lesson.id,
                  difficulty: d,
                  count: isCourse ? 30 : 12,
                  title,
                })}
                  style={{ fontSize: 13, fontWeight: 800, padding: '11px 22px', borderRadius: 10, border: 'none', background: c, color: 'white', cursor: 'pointer', textTransform: 'capitalize' }}>
                  {d === 'all' ? 'Mixed' : d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---- lesson list for a chosen course ----
  if (course) {
    const t = themeFor(course.title)
    const courseLessons = lessons.filter((l) => String(l.course_id) === String(course.id) && counts[l.id])
    const total = courseLessons.reduce((s, l) => s + (counts[l.id] || 0), 0)
    return (
      <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <SiteHeader />
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px' }}>
          <button onClick={() => setCourse(null)} style={{ fontSize: 12, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginBottom: 16 }}>← All courses</button>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>{t.emoji} {course.title}</h1>
          <p style={{ fontSize: 13, opacity: 0.6, margin: '0 0 20px' }}>{total} questions available</p>

          <button onClick={() => setDiffPick({ mode: 'course' })}
            style={{ position: 'relative', overflow: 'hidden', width: '100%', textAlign: 'left', border: 'none', borderRadius: 16, padding: '18px 20px', marginBottom: 20, cursor: 'pointer', color: 'white', background: `linear-gradient(135deg, ${t.from}, ${t.to})` }}>
            <span className="shine-overlay" aria-hidden="true" />
            <p style={{ fontSize: 16, fontWeight: 800, margin: '0 0 3px' }}>🎯 Take the Full Course Exam</p>
            <p style={{ fontSize: 12.5, opacity: 0.9, margin: 0 }}>30 random questions from every lesson · timed · graded · saved</p>
          </button>

          <p style={{ fontSize: 12, fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Or practice one lesson</p>
          <div style={{ display: 'grid', gap: 8 }}>
            {courseLessons.map((l) => (
              <button key={l.id} onClick={() => setDiffPick({ mode: 'lesson', lesson: l })}
                style={{ position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, textAlign: 'left', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '13px 16px', cursor: 'pointer', color: 'var(--foreground)' }}>
                <span className="shine-overlay" aria-hidden="true" />
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>{l.title}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: t.from, whiteSpace: 'nowrap' }}>{counts[l.id]} Qs →</span>
              </button>
            ))}
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  // ---- course selection blocks ----
  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: -0.5 }}>📚 Question Bank</h1>
        <p style={{ fontSize: 14, opacity: 0.65, margin: '0 0 26px' }}>Pick a course, then practice a single lesson or take the full-course exam.</p>

        {loading && <p style={{ fontSize: 13, opacity: 0.6 }}>Loading…</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {courses.map((c) => {
            const t = themeFor(c.title)
            const n = lessons.filter((l) => String(l.course_id) === String(c.id) && counts[l.id]).reduce((s, l) => s + counts[l.id], 0)
            if (n === 0) return null
            return (
              <button key={c.id} onClick={() => setCourse(c)}
                style={{ position: 'relative', overflow: 'hidden', textAlign: 'left', border: '1px solid var(--card-border)', borderRadius: 18, padding: 0, cursor: 'pointer', background: 'var(--card-bg)', color: 'var(--foreground)' }}>
                <span className="shine-overlay" aria-hidden="true" />
                <div style={{ height: 4, background: `linear-gradient(135deg, ${t.from}, ${t.to})` }} />
                <div style={{ padding: '18px 18px 16px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${t.from}, ${t.to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12 }}>{t.emoji}</div>
                  <p style={{ fontSize: 15, fontWeight: 800, margin: '0 0 4px', lineHeight: 1.3 }}>{c.title}</p>
                  <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>{n} questions →</p>
                </div>
              </button>
            )
          })}
        </div>
        <Footer />
      </div>
    </div>
  )
}
