'use client'

import Link from 'next/link'

type Lesson = {
  id: string
  title: string
  order_index: number
}

function BulbNode({ status, size = 70 }: { status: 'locked' | 'unlocked' | 'completed'; size?: number }) {
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const bulbColor = isLocked ? '#5a6a7a' : '#F3CB4B'
  const glowOpacity = isLocked ? 0 : 0.45

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g transform="rotate(30 50 50)">
        {!isLocked && (
          <ellipse cx="50" cy="40" rx="34" ry="34" fill={bulbColor} opacity={glowOpacity}>
            <animate attributeName="opacity" values={`${glowOpacity * 0.7};${glowOpacity};${glowOpacity * 0.7}`} dur="2s" repeatCount="indefinite" />
          </ellipse>
        )}

        {!isLocked && (
          <>
            <circle cx="50" cy="38" r="30" fill="none" stroke="#F3CB4B" strokeWidth="1.5" opacity="0.5">
              <animate attributeName="r" values="26;34;26" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.55;0.1;0.55" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="38" r="22" fill="none" stroke="#4FC3A1" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="20;26;20" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.65;0.15;0.65" dur="2.4s" begin="0.4s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        <path
          d="M50 14
             C 65 14, 75 26, 75 40
             C 75 52, 67 58, 62 64
             C 60 66.5, 59 69, 59 72
             L 41 72
             C 41 69, 40 66.5, 38 64
             C 33 58, 25 52, 25 40
             C 25 26, 35 14, 50 14
             Z"
          fill={bulbColor}
        />

        <path d="M38 24 C 34 30, 32 36, 33 42" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity={isLocked ? 0.15 : 0.35} />

        <path d="M41 36 q4 -6 8 0" stroke="#1A1A2E" strokeWidth="2" fill="none" opacity={isLocked ? 0.4 : 0.7} strokeLinecap="round" />
        <path d="M53 36 q4 -6 8 0" stroke="#1A1A2E" strokeWidth="2" fill="none" opacity={isLocked ? 0.4 : 0.7} strokeLinecap="round" />
        <path d="M43 48 q7 6 14 0" stroke="#1A1A2E" strokeWidth="2" fill="none" opacity={isLocked ? 0.4 : 0.7} strokeLinecap="round" />

        <rect x="41" y="72" width="18" height="5" fill="#cfcfc8" opacity={isLocked ? 0.5 : 1} />
        <rect x="42" y="77" width="16" height="4" fill="#b5b5ad" opacity={isLocked ? 0.5 : 1} />
        <rect x="42.5" y="81" width="15" height="4" fill="#cfcfc8" opacity={isLocked ? 0.5 : 1} />
        <rect x="43" y="85" width="14" height="5" rx="2" fill="#9a9a92" opacity={isLocked ? 0.5 : 1} />

        {isCompleted && (
          <g>
            <path d="M20 12 L50 0 L80 12 L50 24 Z" fill="#1A1A2E" />
            <circle cx="50" cy="12" r="3" fill="#F3CB4B" />
            <line x1="72" y1="14" x2="72" y2="28" stroke="#F3CB4B" strokeWidth="1.8" />
            <circle cx="72" cy="30" r="3" fill="#F3CB4B" />
          </g>
        )}
      </g>
    </svg>
  )
}

export default function CourseRoadmap({
  lessons,
  completedCount,
}: {
  lessons: Lesson[]
  completedCount: number
}) {
  const sorted = [...lessons].sort((a, b) => a.order_index - b.order_index)

  const points = sorted.map((lesson, i) => {
    const zigzagX = i % 2 === 0 ? 120 : 480
    const y = 70 + i * 110
    return { ...lesson, x: zigzagX, y }
  })

  const status = (orderIndex: number): 'locked' | 'unlocked' | 'completed' => {
    if (orderIndex <= completedCount) return 'completed'
    if (orderIndex === completedCount + 1) return 'unlocked'
    return 'locked'
  }

  const segments = points.slice(1).map((p, i) => {
    const prev = points[i]
    const d = `M${prev.x} ${prev.y} C${prev.x} ${prev.y + 55}, ${p.x} ${p.y - 55}, ${p.x} ${p.y}`
    const reached = status(p.order_index) !== 'locked'
    return { d, reached, key: p.id }
  })

  const height = 70 + (points.length - 1) * 110 + 80

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

        {segments
          .filter((s) => s.reached)
          .map((seg) => (
            <path
              key={`current-${seg.key}`}
              d={seg.d}
              stroke="#4FACFE"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="10 8"
              filter="url(#glow)"
            >
              <animate attributeName="stroke-dashoffset" values="0;-36" dur="0.7s" repeatCount="indefinite" />
            </path>
          ))}
      </svg>

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {points.map((p) => {
          const s = status(p.order_index)
          const leftPct = (p.x / 600) * 100
          const topPx = p.y - 35
          return (
           <Link
              key={p.id}
              href={s === 'locked' ? '#' : `/lessons/${p.id}`}
              onClick={(e) => {
                if (s === 'locked') e.preventDefault()
              }}
              style={{
                position: 'absolute',
                left: `${leftPct}%`,
                top: topPx,
                transform: 'translateX(-50%)',
                textAlign: 'center',
                textDecoration: 'none',
                cursor: s === 'locked' ? 'not-allowed' : 'pointer',
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
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    margin: 0,
                    color: s === 'locked' ? 'var(--foreground)' : 'var(--accent)',
                    opacity: s === 'locked' ? 0.5 : 1,
                    lineHeight: 1.3,
                  }}
                >
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