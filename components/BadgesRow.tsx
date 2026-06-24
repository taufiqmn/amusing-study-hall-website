'use client'

import { useState } from 'react'

const placeholderBadges = [
  { emoji: '🥉', label: 'First Lesson' },
  { emoji: '🥈', label: 'Quick Learner' },
  { emoji: '🥇', label: 'Course Master' },
]

export default function BadgesRow({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [tab, setTab] = useState<'badges' | 'analytics'>('badges')

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button
          onClick={() => setTab('badges')}
          style={{
            fontSize: 12,
            padding: '5px 14px',
            borderRadius: 20,
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            background: tab === 'badges' ? 'var(--accent)' : 'transparent',
            color: tab === 'badges' ? 'white' : 'var(--foreground)',
          }}
        >
          Badges
        </button>
        <button
          onClick={() => setTab('analytics')}
          style={{
            fontSize: 12,
            padding: '5px 14px',
            borderRadius: 20,
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            background: tab === 'analytics' ? 'var(--accent)' : 'transparent',
            color: tab === 'analytics' ? 'white' : 'var(--foreground)',
          }}
        >
          Analytics
        </button>
      </div>

      {tab === 'badges' ? (
        !isLoggedIn ? (
          <p style={{ fontSize: 13, opacity: 0.6 }}>🔒 Login to see your earned badges</p>
        ) : (
          <div style={{ display: 'flex', gap: 16 }}>
            {placeholderBadges.map((b) => (
              <div key={b.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, opacity: 0.3 }}>{b.emoji}</div>
                <p style={{ fontSize: 10, opacity: 0.6, margin: '4px 0 0' }}>{b.label}</p>
              </div>
            ))}
          </div>
        )
      ) : (
        <p style={{ fontSize: 13, opacity: 0.6 }}>
          {isLoggedIn ? 'Your full performance breakdown will appear here once you start a course.' : '🔒 Login to view analytics'}
        </p>
      )}
    </div>
  )
}