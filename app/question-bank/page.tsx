'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'

// QUESTION BANK — a live directory of every quiz on the platform,
// grouped by course. Counts come from the answer-free public view,
// so it updates automatically as you add questions.

export default function QuestionBankPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [lessons, setLessons] = useState<any[]>([])
  const [counts, setCounts] = useState<Record<string, { easy: number; medium: number; hard: number }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [{ data: cs }, { data: ls }, { data: qs }] = await Promise.all([
        supabase.from('courses').select('id, title').order('title'),
        supabase.from('lessons').select('id, title, course_id, order_index').order('order_index'),
        supabase.from('quiz_questions_public').select('lesson_id, difficulty'),
      ])
      const map: Record<string, { easy: number; medium: number; hard: number }> = {}
      for (const q of qs || []) {
        if (!map[q.lesson_id]) map[q.lesson_id] = { easy: 0, medium: 0, hard: 0 }
        const d = (q.difficulty || 'easy') as 'easy' | 'medium' | 'hard'
        if (map[q.lesson_id][d] !== undefined) map[q.lesson_id][d]++
      }
      setCourses(cs || [])
      setLessons(ls || [])
      setCounts(map)
      setLoading(false)
    }
    load()
  }, [])

  const chip = (n: number, label: string, color: string) =>
    n > 0 && (
      <span style={{ fontSize: 10.5, fontWeight: 800, color: 'white', background: color, borderRadius: 999, padding: '3px 9px' }}>
        {n} {label}
      </span>
    )

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: -0.5 }}>📚 Question Bank</h1>
        <p style={{ fontSize: 14, opacity: 0.65, margin: '0 0 26px' }}>
          Every quiz on the platform, in one place. Open a lesson and hit the 🧩 Quizzes tab to practice.
        </p>

        {loading && <p style={{ fontSize: 13, opacity: 0.6 }}>Counting the questions…</p>}

        {!loading &&
          courses.map((c) => {
            const courseLessons = lessons.filter((l) => String(l.course_id) === String(c.id) && counts[l.id])
            if (courseLessons.length === 0) return null
            const total = courseLessons.reduce((s, l) => {
              const k = counts[l.id]
              return s + k.easy + k.medium + k.hard
            }, 0)
            return (
              <div key={c.id} style={{ marginBottom: 26 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{c.title}</h2>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{total} questions</span>
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {courseLessons.map((l) => {
                    const k = counts[l.id]
                    return (
                      <Link key={l.id} href={`/lessons/${l.id}`} style={{ textDecoration: 'none', color: 'var(--foreground)' }}>
                        <div
                          style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '13px 16px', transition: 'transform 0.2s, border-color 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--card-border)' }}
                        >
                          <span className="shine-overlay" aria-hidden="true" />
                          <span style={{ fontSize: 13.5, fontWeight: 700 }}>{l.title}</span>
                          <span style={{ display: 'flex', gap: 6 }}>
                            {chip(k.easy, 'easy', '#4FC3A1')}
                            {chip(k.medium, 'medium', '#d99b06')}
                            {chip(k.hard, 'hard', '#e25c5c')}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}

        <Footer />
      </div>
    </div>
  )
}
