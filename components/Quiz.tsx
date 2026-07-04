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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [checking, setChecking] = useState(false)
  const [score, setScore] = useState(0)
  const [wrongTags, setWrongTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const answered = feedback !== null

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
    setCurrentIndex(0)
    setScore(0)
    setWrongTags([])
    setSelectedAnswer(null)
    setFeedback(null)
    setLoading(false)
    setStage(selected.length > 0 ? 'taking' : 'select')
  }

  const handleSelect = async (index: number) => {
    if (answered || checking) return
    setChecking(true)
    setSelectedAnswer(index)

    const current = questions[currentIndex]
    const { data, error } = await supabase.rpc('check_quiz_answer', {
      q_id: current.id,
      answer: index,
    })

    setChecking(false)
    if (error || !data || data.error) {
      setSelectedAnswer(null)
      return
    }

    const result = data as Feedback
    setFeedback(result)
    if (result.correct) {
      setScore((s) => s + 1)
    } else {
      setWrongTags((tags) => [...tags, result.topic_tag || current.topic_tag])
    }
  }

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setFeedback(null)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
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
      setStage('results')
    }
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
    const current = questions[currentIndex]
    return (
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 20 }}>
        <p style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>
          Question {currentIndex + 1} of {questions.length} — {difficulty}
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
                onClick={() => handleSelect(i)}
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

        {checking && <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 12 }}>Checking...</p>}

        {answered && feedback && (
          <div style={{ background: 'var(--background)', borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>
              {feedback.correct ? '✅ Correct! ' : '❌ Not quite. '}
              {feedback.explanation}
            </p>
          </div>
        )}

        {answered && (
          <button
            onClick={handleNext}
            style={{ fontSize: 13, fontWeight: 700, padding: '10px 20px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer' }}
          >
            {currentIndex < questions.length - 1 ? 'Next question →' : 'See results'}
          </button>
        )}
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
