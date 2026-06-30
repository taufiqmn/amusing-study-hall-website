'use client'

import Link from 'next/link'

export default function LessonCard({
  lesson,
  status,
  index,
}: {
  lesson: { id: string; title: string; explanation?: string }
  status: 'locked' | 'unlocked' | 'completed'
  index: number
}) {
  const accentColor = status === 'completed' ? '#F3CB4B' : status === 'unlocked' ? '#00e5ff' : 'var(--card-border)'

  return (
    <Link
      href={status === 'locked' ? '#' : `/lessons/${lesson.id}`}
      onClick={(e) => {
        if (status === 'locked') {
          e.preventDefault()
          const proceed = window.confirm(
            "You haven't finished the previous lesson yet. Skipping ahead might make this harder to understand. Continue anyway?"
          )
          if (proceed) window.location.href = `/lessons/${lesson.id}`
        }
      }}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderLeft: `3px solid ${accentColor}`,
          borderRadius: 16,
          padding: '1.4rem',
          marginBottom: 12,
          position: 'relative',
          backdropFilter: 'blur(10px)',
          transition: 'transform 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <div style={{ position: 'absolute', top: 18, right: 18, width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {status !== 'locked' && (
            <div
              style={{
                position: 'absolute',
                width: '160%',
                height: '160%',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${status === 'completed' ? 'rgba(243,203,75,0.4)' : 'rgba(0,229,255,0.35)'}, transparent 70%)`,
                animation: 'pulseCard 2s ease-in-out infinite',
              }}
            />
          )}
          <img
            src="/bulb-color.png"
            alt={status}
            style={{
              width: '70%',
              height: '70%',
              position: 'relative',
              zIndex: 1,
              transform: 'rotate(30deg)',
              filter: status === 'locked' ? 'grayscale(1) brightness(0.6)' : 'none',
            }}
          />
          {status === 'locked' && (
            <span style={{ position: 'absolute', fontSize: 14, zIndex: 2 }}>🔒</span>
          )}
          {status === 'completed' && (
            <svg width={22} height={17} viewBox="0 0 100 70" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
              <path d="M10 26 L50 6 L90 26 L50 46 Z" fill="#1A1A2E" stroke="#F3CB4B" strokeWidth="3" />
              <circle cx="50" cy="26" r="5" fill="#F3CB4B" />
            </svg>
          )}
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px', color: accentColor }}>
          {String(index + 1).padStart(2, '0')} · {status === 'completed' ? 'Completed' : status === 'unlocked' ? 'Up next' : 'Locked'}
        </p>
        <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 8px', paddingRight: 50, color: 'var(--foreground)' }}>
          {lesson.title}
        </h3>
        <p style={{ fontSize: 13, opacity: 0.7, margin: 0, lineHeight: 1.5, paddingRight: 50 }}>
          {lesson.explanation || 'Content coming soon.'}
        </p>

        <style>{`
          @keyframes pulseCard {
            0%, 100% { opacity: 0.4; transform: scale(0.9); }
            50% { opacity: 0.8; transform: scale(1.15); }
          }
        `}</style>
      </div>
    </Link>
  )
}