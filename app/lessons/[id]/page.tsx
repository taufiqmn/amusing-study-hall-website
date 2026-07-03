'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import MatrixNotationContent from '@/components/lessons/MatrixNotationContent'
import Quiz from '@/components/Quiz'
import MatrixAdditionContent from '@/components/lessons/MatrixAdditionContent'
import TraceContent from '@/components/lessons/TraceContent'
import TransposeContent from '@/components/lessons/TransposeContent'
import MatrixTypesContent from '@/components/lessons/MatrixTypesContent'
import EqualEquivalentContent from '@/components/lessons/EqualEquivalentContent'
import PracticeSection from '@/components/PracticeSection'
import SymmetricContent from '@/components/lessons/SymmetricContent'
import MatrixMultiplicationContent from '@/components/lessons/MatrixMultiplicationContent'
import { matrixMultiplicationLongQuestions } from '@/components/lessons/MatrixMultiplicationLongQuestions'
import CInstallContent from '@/components/lessons/CInstallContent'
import WhatIsDatabaseContent from '@/components/lessons/WhatIsDatabaseContent'
import WhatIsAlgorithmContent from '@/components/lessons/WhatIsAlgorithmContent'
import OracleInstallContent from '@/components/lessons/OracleInstallContent'
import CBasicSyntaxContent from '@/components/lessons/CBasicSyntaxContent'
import BigOContent from '@/components/lessons/BigOContent'
import DeterminantContent from '@/components/lessons/DeterminantContent'
import { determinantLongQuestions } from '@/components/lessons/DeterminantLongQuestions'
import MinorsCofactorsContent from '@/components/lessons/MinorsCofactorsContent'
import { minorsCofactorsLongQuestions } from '@/components/lessons/MinorsCofactorsLongQuestions'
import SystemOfEquationsContent from "@/components/lessons/SystemOfEquationsContent";

function getYouTubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.id as string

  const [lesson, setLesson] = useState<any>(null)
  const [siblings, setSiblings] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [completed, setCompleted] = useState(false)

  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    const load = async () => {
      const { data: lessonData } = await supabase.from('lessons').select('*').eq('id', lessonId).single()
      setLesson(lessonData)

      if (lessonData) {
        const { data: allLessons } = await supabase
          .from('lessons')
          .select('*')
          .eq('course_id', lessonData.course_id)
          .order('order_index', { ascending: true })
        setSiblings(allLessons || [])
      }

      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user && lessonData) {
        const { data: progressData } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .eq('status', 'completed')
          .maybeSingle()
        setCompleted(!!progressData)
      }

      setLoading(false)
      startTimeRef.current = Date.now()
    }
    load()

    return () => {
      logTimeSpent()
    }
  }, [lessonId])

  const logTimeSpent = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !lesson) return
    const seconds = Math.round((Date.now() - startTimeRef.current) / 1000)
    if (seconds < 2) return
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      course_id: lesson.course_id,
      lesson_id: lesson.id,
      event_type: 'watched_lesson',
      started_at: new Date(startTimeRef.current).toISOString(),
      ended_at: new Date().toISOString(),
      duration_seconds: seconds,
    })
  }

const markComplete = async () => {
    if (!user) {
      return true // allow navigation, just skip recording progress
    }
    if (!completed) {
      setMarking(true)
      await supabase.from('progress').insert({
        user_id: user.id,
        course_id: lesson.course_id,
        lesson_id: lesson.id,
        status: 'completed',
      })
      setCompleted(true)
      setMarking(false)
    }
    return true
  }

  const goToNext = async () => {
    const ok = await markComplete()
    if (!ok) return
    await logTimeSpent()
    if (nextLesson) router.push(`/lessons/${nextLesson.id}`)
    else router.push(`/courses/${lesson.course_id}`)
  }

  const goToPrev = async () => {
    await logTimeSpent()
    if (prevLesson) router.push(`/lessons/${prevLesson.id}`)
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>
  if (!lesson) return <p style={{ padding: 20 }}>Lesson not found.</p>

  const currentIndex = siblings.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? siblings[currentIndex - 1] : null
  const nextLesson = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null

  const embedUrl = getYouTubeEmbedUrl(lesson.video_url)
  const isInstallLesson = lesson.title.toLowerCase().includes('install')

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />

      <div style={{ padding: '28px 20px', maxWidth: 760, margin: '0 auto' }}>
        <button
          onClick={() => router.push(`/courses/${lesson.course_id}`)}
          style={{ fontSize: 12, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginBottom: 16, padding: 0 }}
        >
          ← Back to course
        </button>

        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 18,
            padding: '24px 28px',
          }}
        >
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 18 }}>{lesson.title}</h1>

          {embedUrl ? (
            <div style={{ position: 'relative', paddingBottom: '56.25%', marginBottom: 20, borderRadius: 14, overflow: 'hidden' }}>
              <iframe src={embedUrl} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} allowFullScreen />
            </div>
          ) : (
            <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 20, marginBottom: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 13, opacity: 0.6 }}>📹 Video coming soon</p>
            </div>
          )}

          {isInstallLesson && (
            <a href="https://www.codeblocks.org/downloads/binaries/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, padding: '10px 20px', background: 'var(--accent)', color: 'white', borderRadius: 10, textDecoration: 'none', marginBottom: 24 }}>
              ⬇ Download Code::Blocks
            </a>
          )}

          <div style={{ marginBottom: 24 }}>
  <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Explanation</h2>
{lesson.title === 'Matrix Notation, Elements, Size' ? (
    <MatrixNotationContent />
  ) : lesson.title === 'Matrix Addition and Subtraction' ? (
    <MatrixAdditionContent />
  ) : lesson.title === 'Trace of a Matrix' ? (
    <TraceContent />
  ) : lesson.title === 'Transpose of a Matrix' ? (
    <TransposeContent />
  ) : lesson.title === 'Different Types of Matrices' ? (
    <MatrixTypesContent />
  ) : lesson.title === 'Equal and Equivalent Matrices' ? (
    <EqualEquivalentContent />
  ) : lesson.title === 'Symmetric Matrix and Skew-Symmetric Matrix' ? (
    <SymmetricContent />
  ) : lesson.title === 'Matrix Multiplication' ? (
    <MatrixMultiplicationContent />
  ) :  lesson.title === 'Installing Code::Blocks' ? (
    <CInstallContent />
  ) : lesson.title === 'What is a Database?' ? (
    <WhatIsDatabaseContent />
  ) : lesson.title === 'What is an Algorithm?' ? (
    <WhatIsAlgorithmContent />
  ) : lesson.title === 'Installing Oracle Database & SQL Developer' ? (
    <OracleInstallContent />
  ) : lesson.title === 'Basic Code Syntax' ? (
    <CBasicSyntaxContent />
  ) : lesson.title === 'Time & Space Complexity (Big-O)' ? (
    <BigOContent />
 ) : lesson.title === 'Determinant of a Matrix' ? (
    <DeterminantContent />
  ) : lesson.title === 'Minors and Cofactors' ? (
    <MinorsCofactorsContent />
  ) : lesson.title === 'System of Linear Equations' ? (
    <SystemOfEquationsContent lessonId={lesson.id} />
  ) : (
    <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.85 }}>{lesson.explanation || 'Explanation coming soon.'}</p>
  )}
</div>

          {lesson.examples && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Examples</h2>
              <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 13, opacity: 0.85 }}>{lesson.examples}</p>
              </div>
            </div>
          )}

          {lesson.practice && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Practice</h2>
              <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 16 }}>
                <p style={{ fontSize: 13, opacity: 0.85 }}>{lesson.practice}</p>
              </div>
            </div>
          )}
{lesson.title !== 'System of Linear Equations' && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Practice</h2>
            <PracticeSection
  lessonId={lesson.id}
  longQuestions={
    lesson.title === 'Matrix Multiplication' ? matrixMultiplicationLongQuestions
    : lesson.title === 'Determinant of a Matrix' ? determinantLongQuestions
    : lesson.title === 'Minors and Cofactors' ? minorsCofactorsLongQuestions
    : undefined
  }
/>
          </div>
        )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <button
              onClick={goToPrev}
              disabled={!prevLesson}
              style={{
                fontSize: 13,
                padding: '10px 18px',
                background: 'transparent',
                border: '1px solid var(--card-border)',
                borderRadius: 10,
                color: prevLesson ? 'var(--foreground)' : 'var(--foreground)',
                opacity: prevLesson ? 1 : 0.35,
                cursor: prevLesson ? 'pointer' : 'not-allowed',
              }}
            >
              ← Previous lesson
            </button>
{!user && (
            <p style={{ fontSize: 11, opacity: 0.6, textAlign: 'center', marginBottom: 8 }}>
              <a href="/signup" style={{ color: 'var(--accent)' }}>Sign up</a> to save your progress and track time spent
            </p>
          )}
            <button
              onClick={goToNext}
              disabled={marking}
              style={{
                fontSize: 13,
                fontWeight: 700,
                padding: '10px 22px',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              {marking ? 'Saving...' : nextLesson ? 'Next lesson →' : 'Finish course ✓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}