'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import LessonCard from '@/components/LessonCard'

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
        .select('*')
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

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>

  const totalLessons = lessons.length
  const completedCount = completedLessonIds.length
  const progressPct = totalLessons > 0 ? Math.round((completedLessonIds.length / totalLessons) * 100) : 0
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--background)', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(243,203,75,0.06), transparent 35%), radial-gradient(circle at 80% 0%, rgba(79,195,161,0.06), transparent 35%)',
          pointerEvents: 'none',
        }}
      />

     <div style={{ position: 'relative', padding: '32px 20px', maxWidth: 760, margin: '0 auto' }}>
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 18,
            padding: '24px 28px',
            marginBottom: 28,
          }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: 'var(--accent)', textTransform: 'uppercase', margin: '0 0 6px' }}>
            {course?.category} — {course?.subject}
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', lineHeight: 1.2 }}>{course?.title}</h1>
          <p style={{ fontSize: 13, opacity: 0.65, margin: '0 0 18px' }}>
            Complete lessons in order to unlock the next one on your path.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, background: 'rgba(128,128,128,0.15)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
              <div
                style={{
                  background: 'linear-gradient(90deg, #F3CB4B, #4FC3A1)',
                  width: `${progressPct}%`,
                  height: '100%',
                  borderRadius: 8,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', margin: 0 }}>
              {completedLessonIds.length}/{totalLessons} lessons
            </p>
          </div>
        </div>

        <div>
          {lessons.map((lesson, i) => {
            const status = completedLessonIds.includes(lesson.id)
              ? 'completed'
              : i === 0 || completedLessonIds.includes(lessons[i - 1]?.id)
              ? 'unlocked'
              : 'locked'
            return <LessonCard key={lesson.id} lesson={lesson} status={status} index={i} />
          })}
        </div>
      </div>
    </div>
  )
}
     
