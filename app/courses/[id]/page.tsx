'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import CourseRoadmapPath from '@/components/CourseRoadmapPath'

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: courseData } = await supabase.from('courses').select('*').eq('id', courseId).single()
      setCourse(courseData)

      const { data: lessonData } = await supabase
        .from('lessons')
        .select('id, title, explanation, order_index')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true })
      setLessons(lessonData || [])

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: progressData } = await supabase
          .from('progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .eq('status', 'completed')
        setCompletedLessonIds((progressData || []).map((p) => p.lesson_id))
      }
      setLoading(false)
    }
    load()
  }, [courseId])

  const totalLessons = lessons.length
  const progressPct = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />

      <div style={{ position: 'relative', padding: '28px 20px 40px', maxWidth: 900, margin: '0 auto' }}>
        {loading ? (
          <p style={{ fontSize: 13, opacity: 0.6 }}>Loading your path…</p>
        ) : (
          <>
            <div
              style={{
                position: 'relative',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 18,
                padding: '24px 28px',
                marginBottom: 30,
                overflow: 'hidden',
              }}
            >
              <span className="shine-overlay" aria-hidden="true" />
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: 'var(--accent)', textTransform: 'uppercase', margin: '0 0 6px' }}>
                {course?.category} — {course?.subject}
              </p>
              <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', lineHeight: 1.2 }}>{course?.title}</h1>
              <p style={{ fontSize: 13, opacity: 0.65, margin: '0 0 18px' }}>
                Complete lessons in order — each finished bulb lights the next one on your path.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, background: 'var(--pill-bg)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                  <div style={{ background: 'var(--accent-gradient)', width: `${progressPct}%`, height: '100%', borderRadius: 8, transition: 'width 1s cubic-bezier(0.16,1,0.3,1)' }} />
                </div>
                <p style={{ fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap', margin: 0 }}>
                  {completedLessonIds.length}/{totalLessons} lessons
                </p>
              </div>
            </div>

            <CourseRoadmapPath lessons={lessons} completedIds={completedLessonIds} />
          </>
        )}
      </div>
    </div>
  )
}
