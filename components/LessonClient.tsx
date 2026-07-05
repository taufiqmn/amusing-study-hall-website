'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import BlockRenderer from '@/components/BlockRenderer'
import StoryLesson from '@/components/StoryLesson'
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
import SystemOfEquationsContent from '@/components/lessons/SystemOfEquationsContent'
import InverseMatrixMethodContent from '@/components/lessons/InverseMatrixMethodContent'

function getYouTubeEmbedUrl(url: string) {
  const match = (url || '').match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

const isStory = (lesson: any) =>
  Array.isArray(lesson?.sections) && lesson.sections[0]?.type === 'story'

// NEW LESSONS: store content in the `sections` jsonb column in Supabase
// and it renders automatically via <BlockRenderer /> — no code changes needed.
// The title-mapping below only remains for your existing hand-built lessons.
function LessonBody({ lesson }: { lesson: any }) {
  if (Array.isArray(lesson.sections) && lesson.sections.length > 0) {
    return <BlockRenderer sections={lesson.sections} />
  }

  return lesson.title === 'Matrix Notation, Elements, Size' ? (
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
  ) : lesson.title === 'Installing Code::Blocks' ? (
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
  ) : lesson.title === 'Inverse Matrix Method' ? (
    <InverseMatrixMethodContent lessonId={lesson.id} />
  ) : (
    <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.85 }}>{lesson.explanation || 'Explanation coming soon.'}</p>
  )
}

export default function LessonClient({
  initialLesson,
  initialSiblings,
}: {
  initialLesson: any
  initialSiblings: any[]
}) {
  const router = useRouter()
  const lesson = initialLesson
  const siblings = initialSiblings

  const [user, setUser] = useState<any>(null)
  const [marking, setMarking] = useState(false)
  const [completed, setCompleted] = useState(false)

  const startTimeRef = useRef<number>(Date.now())
  const userRef = useRef<any>(null)
  const tokenRef = useRef<string | null>(null)

  // Reliable time logging: fires on navigation AND on tab close /
  // app switch, using keepalive fetch so the browser finishes the
  // request even after the page dies. No more lost study minutes.
  const flushTime = () => {
    const u = userRef.current
    if (!u || !lesson) return
    const seconds = Math.round((Date.now() - startTimeRef.current) / 1000)
    if (seconds < 2) return
    const startedAt = new Date(startTimeRef.current).toISOString()
    startTimeRef.current = Date.now() // avoid double-counting
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/activity_logs`
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    try {
      fetch(url, {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/json',
          apikey: anon,
          Authorization: `Bearer ${tokenRef.current || anon}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          user_id: u.id,
          course_id: lesson.course_id,
          lesson_id: lesson.id,
          event_type: 'watched_lesson',
          started_at: startedAt,
          ended_at: new Date().toISOString(),
          duration_seconds: seconds,
        }),
      }).catch(() => {})
    } catch {}
  }

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      userRef.current = user
      const { data: { session } } = await supabase.auth.getSession()
      tokenRef.current = session?.access_token || null

      if (user && lesson) {
        const { data: progressData } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lesson.id)
          .eq('status', 'completed')
          .maybeSingle()
        setCompleted(!!progressData)
      }

      startTimeRef.current = Date.now()
    }
    load()

    const onHide = () => { if (document.visibilityState === 'hidden') flushTime() }
    window.addEventListener('pagehide', flushTime)
    document.addEventListener('visibilitychange', onHide)

    return () => {
      flushTime()
      window.removeEventListener('pagehide', flushTime)
      document.removeEventListener('visibilitychange', onHide)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id])

  const markComplete = async () => {
    if (!user) {
      return true // allow navigation, just skip recording progress
    }
    if (!completed) {
      setMarking(true)
      // upsert: works with the new unique constraint, never duplicates
      await supabase.from('progress').upsert(
        {
          user_id: user.id,
          course_id: lesson.course_id,
          lesson_id: lesson.id,
          status: 'completed',
        },
        { onConflict: 'user_id,lesson_id' }
      )
      setCompleted(true)
      setMarking(false)
    }
    return true
  }

  const goToNext = async () => {
    const ok = await markComplete()
    if (!ok) return
    flushTime()
    if (nextLesson) router.push(`/lessons/${nextLesson.id}`)
    else router.push(`/courses/${lesson.course_id}`)
  }

  const goToPrev = async () => {
    flushTime()
    if (prevLesson) router.push(`/lessons/${prevLesson.id}`)
  }

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

        {isStory(lesson) ? (
          <StoryLesson data={lesson.sections[0]} lessonId={lesson.id} />
        ) : (
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
            <LessonBody lesson={lesson} />
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

        </div>
        )}

          {!user && (
            <p style={{ fontSize: 11, opacity: 0.6, textAlign: 'center', margin: '14px 0 8px' }}>
              <a href="/signup" style={{ color: 'var(--accent)' }}>Sign up</a> to save your progress and track time spent
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
            <button
              onClick={goToPrev}
              disabled={!prevLesson}
              style={{
                fontSize: 13,
                padding: '10px 18px',
                background: 'transparent',
                border: '1px solid var(--card-border)',
                borderRadius: 10,
                color: 'var(--foreground)',
                opacity: prevLesson ? 1 : 0.35,
                cursor: prevLesson ? 'pointer' : 'not-allowed',
              }}
            >
              ← Previous lesson
            </button>

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
  )
}
