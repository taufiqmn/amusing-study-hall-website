'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import MatrixDisplay from '@/components/MatrixDisplay'

// SECURITY: questions come from the `quiz_questions_public` view,
// which does NOT contain correct_index or explanation.
// Answers are checked by the `check_quiz_answer` database function,
// so the correct answer never reaches the browser before you answer.

type Question = {
  id: string
  topic_tag: string
  difficulty: string
  question: string
  options: string[]
}

type Feedback = {
  correct: boolean
  correct_index: number
  explanation: string
  topic_tag: string
}

export default function Quiz({ lessonId }: { lessonId: string }) {
  const [stage, setStage] = useState<'select' | 'taking' | 'results'>('select')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const [questions, setQuestions] = useState<Question[]>([])
  // answers/feedback are now keyed by question id, so all questions can be
  // shown and answered at once instead of one-at-a-time.
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [feedbackMap, setFeedbackMap] = useState<Record<string, Feedback>>({})
  const [checkingId, setCheckingId] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [wrongTags, setWrongTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const allAnswered =
    questions.length > 0 && questions.every((q) => feedbackMap[q.id] !== undefined)

  const startQuiz = async (diff: 'easy' | 'medium' | 'hard') => {
    setLoading(true)
    setDifficulty(diff)
    const { data } = await supabase
      .from('quiz_questions_public')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('difficulty', diff)

    const pool = data || []
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(10, shuffled.length))

    setQuestions(selected)
    setSelectedAnswers({})
    setFeedbackMap({})
    setScore(0)
    setWrongTags([])
    setLoading(false)
    setStage(selected.length > 0 ? 'taking' : 'select')
  }

  const handleSelect = async (question: Question, index: number) => {
    if (feedbackMap[question.id] || checkingId) return
    setCheckingId(question.id)
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: index }))

    const { data, error } = await supabase.rpc('check_quiz_answer', {
      q_id: question.id,
      answer: index,
    })

    setCheckingId(null)
    if (error || !data || data.error) {
      setSelectedAnswers((prev) => {
        const next = { ...prev }
        delete next[question.id]
        return next
      })
      return
    }

    const result = data as Feedback
    setFeedbackMap((prev) => ({ ...prev, [question.id]: result }))
    if (result.correct) {
      setScore((s) => s + 1)
    } else {
      setWrongTags((tags) => [...tags, result.topic_tag || question.topic_tag])
    }
  }

  const handleFinish = async () => {
    setSubmitting(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('quiz_attempts').insert({
        user_id: user.id,
        lesson_id: lessonId,
        difficulty,
        score,
        total_questions: questions.length,
        wrong_topic_tags: wrongTags,
      })
    }
    setSubmitting(false)
    setStage('results')
  }

  if (stage === 'select') {
    return (
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 20 }}>
        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Choose difficulty</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => startQuiz(d)}
              disabled={loading}
              style={{
                fontSize: 13,
                fontWeight: 700,
                padding: '10px 20px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: d === 'easy' ? '#4FC3A1' : d === 'medium' ? '#F3CB4B' : '#e25c5c',
                color: 'white',
                textTransform: 'capitalize',
              }}
            >
              {d}
            </button>
          ))}
        </div>
        {loading && <p style={{ fontSize: 12, opacity: 0.6, marginTop: 10 }}>Loading questions...</p>}
      </div>
    )
  }

  if (stage === 'taking') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 12, opacity: 0.6 }}>
          {questions.length} questions — {difficulty} · answer all, then submit
        </p>

        {questions.map((current, qIndex) => {
          const feedback = feedbackMap[current.id]
          const selectedAnswer = selectedAnswers[current.id]
          const answered = feedback !== undefined
          const checking = checkingId === current.id

          return (
            <div
              key={current.id}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 14,
                padding: 20,
              }}
            >
              <p style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>
                Question {qIndex + 1} of {questions.length}
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{current.question}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {current.options.map((opt, i) => {
                  let bg = 'var(--background)'
                  let border = 'var(--card-border)'
                  if (answered && feedback) {
                    if (i === feedback.correct_index) {
                      bg = 'rgba(79,195,161,0.15)'
                      border = '#4FC3A1'
                    } else if (i === selectedAnswer) {
                      bg = 'rgba(226,92,92,0.15)'
                      border = '#e25c5c'
                    }
                  } else if (checking && i === selectedAnswer) {
                    border = 'var(--accent)'
                  }
                  const isMatrixOption = /^\s*(MATRIX:)?\s*\[\s*\[/.test(opt)
                  let matrixData: number[][] | null = null
                  if (isMatrixOption) {
                    try {
                      matrixData = JSON.parse(opt.replace(/^MATRIX:/, '').trim())
                    } catch {
                      matrixData = null
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(current, i)}
                      disabled={answered || checking}
                      style={{
                        textAlign: 'left',
                        fontSize: 13,
                        padding: isMatrixOption ? '6px 14px' : '10px 14px',
                        borderRadius: 10,
                        border: `1.5px solid ${border}`,
                        background: bg,
                        cursor: answered ? 'default' : 'pointer',
                        color: 'var(--foreground)',
                      }}
                    >
                      {matrixData ? <MatrixDisplay data={matrixData} /> : opt}
                    </button>
                  )
                })}
              </div>

              {checking && <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>Checking...</p>}

              {answered && feedback && (
                <div style={{ background: 'var(--background)', borderRadius: 10, padding: 12 }}>
                  <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>
                    {feedback.correct ? '✅ Correct! ' : '❌ Not quite. '}
                    {feedback.explanation}
                  </p>
                </div>
              )}
            </div>
          )
        })}

        <button
          onClick={handleFinish}
          disabled={!allAnswered || submitting}
          style={{
            fontSize: 14,
            fontWeight: 700,
            padding: '12px 24px',
            background: allAnswered ? 'var(--accent)' : 'var(--card-border)',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            alignSelf: 'center',
          }}
        >
          {submitting
            ? 'Submitting...'
            : allAnswered
            ? `Submit Quiz (${score}/${questions.length} so far)`
            : `Answer all ${questions.length} questions to submit`}
        </button>
      </div>
    )
  }

  const pct = Math.round((score / questions.length) * 100)
  const weakTopics = Array.from(new Set(wrongTags))

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
      <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 4 }}>Quiz complete</p>
      <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)', margin: '0 0 8px' }}>{score}/{questions.length}</p>
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>{pct}% correct on {difficulty} difficulty</p>

      {weakTopics.length > 0 ? (
        <div style={{ background: 'var(--background)', borderRadius: 10, padding: 14, textAlign: 'left', marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>📌 Topics to review:</p>
          <p style={{ fontSize: 12, opacity: 0.8 }}>{weakTopics.join(', ')}</p>
        </div>
      ) : (
        <p style={{ fontSize: 13, color: '#4FC3A1', fontWeight: 600, marginBottom: 16 }}>Perfect score — great work!</p>
      )}

      <button
        onClick={() => setStage('select')}
        style={{ fontSize: 13, fontWeight: 700, padding: '10px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer' }}
      >
        Try another difficulty
      </button>
    </div>
  )
}
