'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Lesson = {
  id: string
  title: string
  order_index: number
}

const topicIcons: Record<string, string> = {
  install: '🔧',
  syntax: '{ }',
  execution: '⚙️',
  'data types': '🔢',
  variable: '🔢',
  operator: '➕',
  conditional: '🔀',
  loop: '🔁',
  function: 'ƒ',
  array: '📊',
  notation: '🔢',
  types: '📐',
  transpose: '🔄',
  trace: '∑',
  symmetric: '⚖️',
  addition: '➕',
  subtraction: '➖',
}

function getTopicIcon(title: string): string | null {
  const lower = title.toLowerCase()
  for (const key in topicIcons) {
    if (lower.includes(key)) return topicIcons[key]
  }
  return null
}

function BulbNode({ status, icon }: { status: 'locked' | 'unlocked' | 'completed'; icon: string | null }) {
  return (
    <div style={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {status !== 'locked' && (
        <div
          style={{
            position: 'absolute',
            width: '160%',
            height: '160%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(243,203,75,0.45), transparent 70%)',
            animation: 'pulseGlow 2s ease-in-out infinite',
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
          transition: 'filter 0.4s',
        }}
      />

      {status === 'locked' && (
        <span style={{ position: 'absolute', fontSize: 14, zIndex: 2 }}>🔒</span>
      )}

      {icon && status !== 'locked' && (
        <div
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'var(--card-bg)',
            border: `1.5px solid ${status === 'completed' ? '#F3CB4B' : '#00e5ff'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 700,
            color: status === 'completed' ? '#F3CB4B' : '#00e5ff',
            zIndex: 2,
          }}
        >
          {icon}
        </div>
      )}

      {status === 'completed' && (
        <svg width={30} height={26} viewBox="0 0 100 86" style={{ position: 'absolute', top: -17, left: '50%', transform: 'translateX(-50%) rotate(-8deg)', zIndex: 2, filter: 'drop-shadow(0 2px 4px rgba(243,203,75,0.45))' }}>
          {/* cap base (rounded head part, behind the board) */}
          <path d="M30 42 L30 54 Q30 66 50 66 Q70 66 70 54 L70 42 Z" fill="#1A1A2E" stroke="#F3CB4B" strokeWidth="4" strokeLinejoin="round" />
          {/* board underside (3D thickness) */}
          <path d="M6 32 L6 40 L50 60 L94 40 L94 32 L50 52 Z" fill="#0f0e22" stroke="#F3CB4B" strokeWidth="3" strokeLinejoin="round" />
          {/* board top */}
          <path d="M6 32 L50 12 L94 32 L50 52 Z" fill="#1A1A2E" stroke="#F3CB4B" strokeWidth="4" strokeLinejoin="round" />
          {/* center button */}
          <circle cx="50" cy="32" r="4.5" fill="#F3CB4B" />
          {/* tassel cord + tip */}
          <path d="M50 32 Q72 34 76 44 L76 60" fill="none" stroke="#F3CB4B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M71 60 L81 60 L79 74 Q76 78 73 74 Z" fill="#F3CB4B" />
        </svg>
      )}

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 0.85; transform: scale(1.15); }
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

  const spacing = 160
  const startX = 60
  const midY = 90
  const ampY = 40

  const points = sorted.map((lesson, i) => ({
    ...lesson,
    x: startX + i * spacing,
    y: midY + (i % 2 === 0 ? -ampY : ampY) - (i % 2 === 0 ? -ampY : ampY) * (i === 0 ? 1 : 0),
  }))

  // simpler wave: alternate up/down consistently
  points.forEach((p, i) => {
    p.y = i % 2 === 0 ? midY - ampY + ampY : midY
  })
  // Actually compute a clean sine-like wave
  for (let i = 0; i < points.length; i++) {
    points[i].y = midY + (i % 2 === 0 ? -ampY : ampY)
  }
  points[0].y = midY

  const status = (lesson: Lesson, index: number): 'locked' | 'unlocked' | 'completed' => {
    if (completedLessonIds.includes(lesson.id)) return 'completed'
    if (index === 0) return 'unlocked'
    const prev = sorted[index - 1]
    if (completedLessonIds.includes(prev.id)) return 'unlocked'
    return 'locked'
  }

  const width = startX * 2 + (points.length - 1) * spacing
  const height = 220

  const pathD = points
    .map((p, i) => {
      if (i === 0) return `M${p.x} ${p.y}`
      const prev = points[i - 1]
      const midX = (prev.x + p.x) / 2
      return `C${midX} ${prev.y}, ${midX} ${p.y}, ${p.x} ${p.y}`
    })
    .join(' ')

  const reachedSegments = points.slice(1).map((p, i) => {
    const prev = points[i]
    const midX = (prev.x + p.x) / 2
    const d = `M${prev.x} ${prev.y} C${midX} ${prev.y}, ${midX} ${p.y}, ${p.x} ${p.y}`
    const reached = status(p, i + 1) !== 'locked'
    return { d, reached, key: p.id }
  })

  const handleLockedClick = (e: React.MouseEvent, lessonId: string) => {
    e.preventDefault()
    const proceed = window.confirm(
      "You haven't finished the previous lesson yet. Skipping ahead might make this harder to understand. Continue anyway?"
    )
    if (proceed) router.push(`/lessons/${lessonId}`)
  }

  return (
    <div style={{ position: 'relative' }}>
      <p style={{ fontSize: 11, color: 'var(--foreground-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        👉 Swipe to see all lessons
      </p>

      <div
        style={{
          position: 'relative',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: 16,
          background:
            'radial-gradient(circle at 10px 10px, rgba(255,255,255,0.04) 1.5px, transparent 1.5px) 0 0/24px 24px, var(--card-bg)',
        }}
      >
        <div style={{ position: 'relative', width, minWidth: width }}>
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
            <defs>
              <filter id="roadGlow">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path d={pathD} stroke="var(--card-border)" strokeWidth="6" fill="none" strokeLinecap="round" />

            {reachedSegments
              .filter((s) => s.reached)
              .map((seg) => (
                <path
                  key={seg.key}
                  d={seg.d}
                  stroke="#00e5ff"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="10 8"
                  filter="url(#roadGlow)"
                >
                  <animate attributeName="stroke-dashoffset" values="0;-36" dur="0.7s" repeatCount="indefinite" />
                </path>
              ))}
          </svg>

          {points.map((p, i) => {
            const s = status(p, i)
            const icon = getTopicIcon(p.title)
            return (
              <Link
                key={p.id}
                href={`/lessons/${p.id}`}
                onClick={(e) => {
                  if (s === 'locked') handleLockedClick(e, p.id)
                }}
                style={{
                  position: 'absolute',
                  left: p.x,
                  top: p.y,
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  textDecoration: 'none',
                  width: 110,
                }}
              >
                <BulbNode status={s} icon={icon} />
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    marginTop: 4,
                    color: s === 'locked' ? 'var(--foreground-muted)' : s === 'completed' ? '#F3CB4B' : '#00e5ff',
                    opacity: s === 'locked' ? 0.6 : 1,
                    lineHeight: 1.2,
                  }}
                >
                  {p.order_index}. {p.title}
                </p>
              </Link>
            )
          })}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 0,
          width: 40,
          height: 'calc(100% - 24px)',
          background: 'linear-gradient(to right, transparent, var(--background))',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}