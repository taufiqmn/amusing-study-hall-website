'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Exam engine: shows every question, running timer, NO answer reveal
// until "Submit". Then grades server-side, shows score + grade + time +
// weak topics, and saves the attempt to quiz_attempts.

type Q = { id: string; lesson_id: string; topic_tag: string; difficulty: string; question: string; options: string[] }

function grade(pct: number) {
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B'
  if (pct >= 60) return 'C'
  if (pct >= 50) return 'D'
  return 'F'
}

export default function ExamQuiz({
  courseId,
  lessonId,
  difficulty,
  count,
  title,
  onExit,
}: {
  courseId?: number
  lessonId?: string
  difficulty: string
  count: number
  title: string
  onExit: () => void
}) {
  const [questions, setQuestions] = useState<Q[] | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [stage, setStage] = useState<'loading' | 'taking' | 'grading' | 'done' | 'empty'>('loading')
  const [seconds, setSeconds] = useState(0)
  const [result, setResult] = useState<any>(null)
  const timerRef = useRef<any>(null)

  useEffect(() => {
    const load = async () => {
      let data: any[] | null = null
      if (courseId != null) {
        const r = await supabase.rpc('get_course_questions', { cid: courseId, diff: difficulty, n: count })
        data = r.data
      } else if (lessonId) {
        const r = await supabase.from('quiz_questions_public').select('*').eq('lesson_id', lessonId).eq('difficulty', difficulty)
        data = (r.data || []).sort(() => Math.random() - 0.5).slice(0, count)
      }
      const qs = (data || []) as Q[]
      if (qs.length === 0) { setStage('empty'); return }
      setQuestions(qs)
      setStage('taking')
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    }
    load()
    return () => clearInterval(timerRef.current)
  }, [courseId, lessonId, difficulty, count])

  const pick = (qid: string, i: number) => {
    if (stage !== 'taking') return
    setAnswers((a) => ({ ...a, [qid]: i }))
  }

  const submit = async () => {
    if (!questions) return
    clearInterval(timerRef.current)
    setStage('grading')

    let correct = 0
    const wrongTags: string[] = []
    const perQ: { q: Q; picked: number; correctIndex: number; explanation: string; ok: boolean }[] = []

    for (const q of questions) {
      const picked = answers[q.id]
      const { data } = await supabase.rpc('check_quiz_answer', { q_id: q.id, answer: picked ?? -1 })
      const ok = !!data?.correct
      if (ok) correct++
      else wrongTags.push(q.topic_tag)
      perQ.push({ q, picked: picked ?? -1, correctIndex: data?.correct_index ?? -1, explanation: data?.explanation || '', ok })
    }

    const pct = Math.round((correct / questions.length) * 100)
    const uniqueWeak = Array.from(new Set(wrongTags))

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('quiz_attempts').insert({
        user_id: user.id,
        lesson_id: lessonId || questions[0].lesson_id,
        difficulty,
        score: correct,
        total_questions: questions.length,
        wrong_topic_tags: uniqueWeak,
      })
    }

    setResult({ correct, total: questions.length, pct, seconds, weak: uniqueWeak, perQ })
    setStage('done')
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  const box: React.CSSProperties = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 20 }

  if (stage === 'loading') return <div style={box}><p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Preparing your exam…</p></div>
  if (stage === 'empty') return <div style={box}><p style={{ fontSize: 13, margin: 0 }}>No {difficulty !== 'all' ? difficulty + ' ' : ''}questions available here yet. <button onClick={onExit} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>← Back</button></p></div>

  if (stage === 'done' && result) {
    return (
      <div>
        <div style={{ ...box, textAlign: 'center', marginBottom: 16 }}>
          <p style={{ fontSize: 12, opacity: 0.6, margin: '0 0 4px' }}>{title} · {difficulty}</p>
          <p style={{ fontSize: 40, fontWeight: 800, color: 'var(--accent)', margin: '0 0 2px' }}>{result.pct}%</p>
          <p style={{ fontSize: 15, fontWeight: 800, margin: '0 0 10px' }}>Grade {grade(result.pct)} · {result.correct}/{result.total} correct · ⏱ {mm}:{ss}</p>
          {result.weak.length > 0 ? (
            <div style={{ background: 'var(--background)', borderRadius: 10, padding: 12, textAlign: 'left', margin: '0 0 12px' }}>
              <p style={{ fontSize: 12, fontWeight: 800, margin: '0 0 6px' }}>📌 Topics to review:</p>
              <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>{result.weak.join(', ')}</p>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#4FC3A1', fontWeight: 700, margin: '0 0 12px' }}>Flawless — every topic solid! 🎉</p>
          )}
          <button onClick={onExit} style={{ fontSize: 13, fontWeight: 800, padding: '10px 22px', borderRadius: 10, border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer' }}>Done</button>
        </div>

        <p style={{ fontSize: 12, fontWeight: 800, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Review answers</p>
        {result.perQ.map((r: any, i: number) => (
          <div key={r.q.id} style={{ ...box, marginBottom: 10 }}>
            <p style={{ fontSize: 13.5, fontWeight: 700, margin: '0 0 8px' }}>{i + 1}. {r.q.question}</p>
            {r.q.options.map((o: string, oi: number) => {
              let c = 'var(--card-border)', bg = 'transparent'
              if (oi === r.correctIndex) { c = '#4FC3A1'; bg = 'rgba(79,195,161,0.14)' }
              else if (oi === r.picked) { c = '#e25c5c'; bg = 'rgba(226,92,92,0.12)' }
              return <div key={oi} style={{ fontSize: 12.5, padding: '7px 12px', borderRadius: 8, border: `1.5px solid ${c}`, background: bg, marginBottom: 6 }}>{o}</div>
            })}
            {r.explanation && <p style={{ fontSize: 12, opacity: 0.8, margin: '6px 0 0' }}>{r.ok ? '✅ ' : '❌ '}{r.explanation}</p>}
          </div>
        ))}
      </div>
    )
  }

  const answeredCount = Object.keys(answers).length

  return (
    <div>
      <div style={{ position: 'sticky', top: 60, zIndex: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '10px 16px', marginBottom: 14, backdropFilter: 'blur(10px)' }}>
        <span style={{ fontSize: 12.5, fontWeight: 800 }}>{title} · {difficulty}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>⏱ {mm}:{ss}</span>
        <span style={{ fontSize: 12, opacity: 0.7 }}>{answeredCount}/{questions!.length} answered</span>
      </div>

      {questions!.map((q, i) => (
        <div key={q.id} style={{ ...box, marginBottom: 10 }}>
          <p style={{ fontSize: 11, opacity: 0.55, margin: '0 0 4px' }}>Q{i + 1} · {q.difficulty}</p>
          <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px' }}>{q.question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {q.options.map((o, oi) => (
              <button key={oi} onClick={() => pick(q.id, oi)}
                style={{ textAlign: 'left', fontSize: 13, padding: '9px 13px', borderRadius: 9, cursor: 'pointer', color: 'var(--foreground)',
                  border: `1.5px solid ${answers[q.id] === oi ? 'var(--accent)' : 'var(--card-border)'}`,
                  background: answers[q.id] === oi ? 'var(--pill-bg)' : 'transparent' }}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button onClick={submit} disabled={stage === 'grading'} style={{ fontSize: 14, fontWeight: 800, padding: '12px 28px', borderRadius: 12, border: 'none', background: 'var(--accent-gradient)', color: 'white', cursor: 'pointer', boxShadow: '0 8px 26px var(--glow-color)' }}>
          {stage === 'grading' ? 'Grading…' : `Submit all (${answeredCount}/${questions!.length})`}
        </button>
        <button onClick={onExit} style={{ fontSize: 13, fontWeight: 700, padding: '12px 22px', borderRadius: 12, border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--foreground)', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}
