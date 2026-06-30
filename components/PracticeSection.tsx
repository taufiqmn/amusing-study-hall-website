'use client'

import { useState } from 'react'
import Quiz from '@/components/Quiz'

export default function PracticeSection({
  lessonId,
  longQuestions,
}: {
  lessonId: string
  longQuestions?: { easy?: React.ReactNode; medium?: React.ReactNode; hard?: React.ReactNode }
}) {
  const [tab, setTab] = useState<'quiz' | 'long'>('quiz')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy')
  const hasLongQuestions = !!longQuestions

  return (
    <div>
      {hasLongQuestions && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button
            onClick={() => setTab('quiz')}
            style={{ fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', background: tab === 'quiz' ? 'var(--accent)' : 'var(--card-bg)', color: tab === 'quiz' ? 'white' : 'var(--foreground)' }}
          >
            🧩 Quiz
          </button>
          <button
            onClick={() => setTab('long')}
            style={{ fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', background: tab === 'long' ? 'var(--accent)' : 'var(--card-bg)', color: tab === 'long' ? 'white' : 'var(--foreground)' }}
          >
            📝 Long Question
          </button>
        </div>
      )}

      {tab === 'quiz' ? (
        <Quiz lessonId={lessonId} />
      ) : (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 20 }}>
          <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Choose difficulty</p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {(['easy', 'medium', 'hard'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                style={{
                  fontSize: 13, fontWeight: 700, padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', textTransform: 'capitalize',
                  background: difficulty === d ? (d === 'easy' ? '#4FC3A1' : d === 'medium' ? '#F3CB4B' : '#e25c5c') : 'var(--background)',
                  color: difficulty === d ? 'white' : 'var(--foreground)',
                }}
              >
                {d}
              </button>
            ))}
          </div>
          <div>{longQuestions?.[difficulty] || <p style={{ fontSize: 13, opacity: 0.6 }}>No long question available for this difficulty yet.</p>}</div>
        </div>
      )}
    </div>
  )
}