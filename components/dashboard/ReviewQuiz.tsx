'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

// Weak-topic review quiz: questions come from get_review_questions()
// (answer-free), checking happens server-side via check_quiz_answer().

type Q = { id: string; lesson_id: string; topic_tag: string; difficulty: string; question: string; options: string[] }

export default function ReviewQuiz({ tags, onClose }: { tags: string[]; onClose: () => void }) {
  const [questions, setQuestions] = useState<Q[] | null>(null)
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<any>(null)
  const [checking, setChecking] = useState(false)
  const [results, setResults] = useState<{ topic: string; correct: boolean }[]>([])
  const [stage, setStage] = useState<'loading' | 'taking' | 'done' | 'empty'>('loading')

  useState(() => {
    supabase.rpc('get_review_questions', { tags, n: 8 }).then(({ data }) => {
      const qs = (data || []) as Q[]
      if (qs.length === 0) setStage('empty')
      else { setQuestions(qs); setStage('taking') }
    })
  })

  const choose = async (i: number) => {
    if (picked !== null || checking || !questions) return
    setChecking(true)
    setPicked(i)
    const q = questions[idx]
    const { data } = await supabase.rpc('check_quiz_answer', { q_id: q.id, answer: i })
    setChecking(false)
    if (!data || data.error) { setPicked(null); return }
    setFeedback(data)
    setResults((r) => [...r, { topic: q.topic_tag, correct: !!data.correct }])
  }

  const next = () => {
    if (!questions) return
    if (idx < questions.length - 1) { setIdx(idx + 1); setPicked(null); setFeedback(null) }
    else setStage('done')
  }

  const box: React.CSSProperties = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 20, marginTop: 14 }

  if (stage === 'loading') return <div style={box}><p style={{ fontSize: 13, opacity: 0.6, margin: 0 }}>Building your review paper…</p></div>
  if (stage === 'empty') return <div style={box}><p style={{ fontSize: 13, margin: 0 }}>No questions found for these topics yet. <button onClick={onClose} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Close</button></p></div>

  if (stage === 'done') {
    const score = results.filter((r) => r.correct).length
    const byTopic: Record<string, { ok: number; total: number }> = {}
    results.forEach((r) => {
      byTopic[r.topic] = byTopic[r.topic] || { ok: 0, total: 0 }
      byTopic[r.topic].total++
      if (r.correct) byTopic[r.topic].ok++
    })
    return (
      <div style={box}>
        <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 4px' }}>Review complete 🎯</p>
        <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--accent)', margin: '0 0 12px' }}>{score}/{results.length}</p>
        {Object.entries(byTopic).map(([t, v]) => (
          <p key={t} style={{ fontSize: 12.5, margin: '0 0 6px' }}>
            {v.ok === v.total ? '✅' : '📌'} <b>{t}</b>: {v.ok}/{v.total} {v.ok === v.total ? '— fixed!' : '— keep reviewing this one'}
          </p>
        ))}
        <button onClick={onClose} style={{ marginTop: 10, fontSize: 12.5, fontWeight: 800, padding: '9px 18px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer' }}>Done</button>
      </div>
    )
  }

  const q = questions![idx]
  return (
    <div style={box}>
      <p style={{ fontSize: 11, opacity: 0.6, margin: '0 0 6px' }}>Review {idx + 1}/{questions!.length} · topic: {q.topic_tag} · {q.difficulty}</p>
      <p style={{ fontSize: 14.5, fontWeight: 700, margin: '0 0 12px' }}>{q.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.options.map((o, i) => {
          let border = 'var(--card-border)', bg = 'transparent'
          if (feedback) {
            if (i === feedback.correct_index) { border = '#4FC3A1'; bg = 'rgba(79,195,161,0.14)' }
            else if (i === picked) { border = '#e25c5c'; bg = 'rgba(226,92,92,0.12)' }
          }
          return (
            <button key={i} onClick={() => choose(i)} disabled={picked !== null}
              style={{ textAlign: 'left', fontSize: 13, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${border}`, background: bg, color: 'var(--foreground)', cursor: picked === null ? 'pointer' : 'default' }}>
              {o}
            </button>
          )
        })}
      </div>
      {feedback && (
        <>
          <p style={{ fontSize: 12.5, margin: '12px 0 12px', opacity: 0.85 }}>
            {feedback.correct ? '✅ ' : '❌ '}{feedback.explanation}
          </p>
          <button onClick={next} style={{ fontSize: 12.5, fontWeight: 800, padding: '9px 18px', borderRadius: 9, border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer' }}>
            {idx < questions!.length - 1 ? 'Next →' : 'See breakdown'}
          </button>
        </>
      )}
    </div>
  )
}
