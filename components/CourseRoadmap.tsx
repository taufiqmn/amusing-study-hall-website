'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Lesson = {
  id: string
  title: string
  order_index: number
}

function BulbNode({ status, size = 70 }: { status: 'locked' | 'unlocked' | 'completed'; size?: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {status !== 'locked' && (
        <div
          style={{
            position: 'absolute',
            width: '130%',
            height: '130%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(243,203,75,0.45), transparent 70%)',
            animation: 'pulseBulbGlow 2s ease-in-out infinite',
          }}
        />
      )}

      <img
        src="/bulb-color.png"
        alt={status}
        style={{
          width: '78%',
          height: '78%',
          position: 'relative',
          zIndex: 1,
          transform: 'rotate(30deg)',
          filter: status === 'locked' ? 'grayscale(1) brightness(0.65)' : 'none',
          transition: 'filter 0.4s',
        }}
      />

      {status === 'completed' && (
        <svg width={size * 0.55} height={size * 0.4} viewBox="0 0 100 70" style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(0deg)', zIndex: 2 }}>
          <path d="M10 26 L50 6 L90 26 L50 46 Z" fill="#1A1A2E" stroke="#F3CB4B" strokeWidth="2" />
          <circle cx="50" cy="26" r="4" fill="#F3CB4B" />
          <line x1="78" y1="30" x2="78" y2="48" stroke="#F3CB4B" strokeWidth="2.5" />
          <circle cx="78" cy="52" r="4" fill="#F3CB4B" />
        </svg>
      )}

      <style>{`
        @keyframes pulseBulbGlow {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

export default function CourseRoadmap({
  lessons,
  completedLessonIds,
}: {
  lessons: Lesson[]
  completedLessonIds: string[]
}) {
  const router = useRouter()
  const sorted = [...lessons].sort((a, b) => a.order_index - b.order_index)

  const points = sorted.map((lesson, i) => {
    const zigzagX = i % 2 === 0 ? 120 : 480
    const y = 70 + i * 110
    return { ...lesson, x: zigzagX, y }
  })

  const status = (lesson: Lesson, index: number): 'locked' | 'unlocked' | 'completed' => {
    if (completedLessonIds.includes(lesson.id)) return 'completed'
    if (index === 0) return 'unlocked'
    const prev = sorted[index - 1]
    if (completedLessonIds.includes(prev.id)) return 'unlocked'
    return 'locked'
  }

  const segments = points.slice(1).map((p, i) => {
    const prev = points[i]
    const d = `M${prev.x} ${prev.y} C${prev.x} ${prev.y + 55}, ${p.x} ${p.y - 55}, ${p.x} ${p.y}`
    const reached = status(p, i + 1) !== 'locked'
    return { d, reached, key: p.id }
  })

  const height = 70 + (points.length - 1) * 110 + 80

  const handleLockedClick = (e: React.MouseEvent, lessonId: string) => {
    e.preventDefault()
    const proceed = window.confirm(
      'You haven\'t finished the previous lesson yet. Skipping ahead might make this harder to understand. Continue anyway?'
    )
    if (proceed) {
      router.push(`/lessons/${lessonId}`)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <svg width="100%" viewBox={`0 0 600 ${height}`} style={{ display: 'block' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {segments.map((seg) => (
          <path key={`base-${seg.key}`} d={seg.d} stroke="var(--card-border)" strokeWidth="6" fill="none" strokeLinecap="round" />
        ))}
        {segments.filter((s) => s.reached).map((seg) => (
          <path key={`current-${seg.key}`} d={seg.d} stroke="#4FACFE" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="10 8" filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" values="0;-36" dur="0.7s" repeatCount="indefinite" />
          </path>
        ))}
      </svg>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {points.map((p, i) => {
          const s = status(p, i)
          const leftPct = (p.x / 600) * 100
          const topPx = p.y - 35
          return (
            <Link
              key={p.id}
              href={`/lessons/${p.id}`}
              onClick={(e) => {
                if (s === 'locked') handleLockedClick(e, p.id)
              }}
              style={{
                position: 'absolute',
                left: `${leftPct}%`,
                top: topPx,
                transform: 'translateX(-50%)',
                textAlign: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                width: 120,
              }}
            >
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <BulbNode status={s} />
                <div
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: s === 'locked' ? 'var(--card-border)' : 'var(--accent)',
                    color: s === 'locked' ? 'var(--foreground)' : 'white',
                    fontSize: 10,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--card-bg)',
                  }}
                >
                  {p.order_index}
                </div>
              </div>
              <div
                style={{
                  marginTop: 6,
                  background: s === 'locked' ? 'transparent' : 'var(--background)',
                  border: s === 'locked' ? 'none' : '1px solid var(--card-border)',
                  borderRadius: 8,
                  padding: s === 'locked' ? '0' : '4px 8px',
                  display: 'inline-block',
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 600, margin: 0, color: s === 'locked' ? 'var(--foreground)' : 'var(--accent)', opacity: s === 'locked' ? 0.5 : 1, lineHeight: 1.3 }}>
                  {p.title}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}