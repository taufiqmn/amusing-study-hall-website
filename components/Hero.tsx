'use client'

import { useTheme } from '@/lib/theme-context'

export default function Hero() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div style={{ marginBottom: 32 }}>
      <svg width="100%" viewBox="0 0 680 360" role="img">
        <title>A student studying with a glowing brain connected to symbols of science, coding, and math</title>

        <defs>
          <linearGradient id="skyday" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#aee3f7" />
            <stop offset="100%" stopColor="#e8f7fb" />
          </linearGradient>
          <linearGradient id="skynight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0b1b30" />
            <stop offset="100%" stopColor="#142a45" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="680" height="360" fill="none" />

        <rect x="60" y="30" width="160" height="130" rx="4" fill={isDark ? 'url(#skynight)' : 'url(#skyday)'} />
        <rect x="60" y="30" width="160" height="130" rx="4" fill="none" stroke="#cfcfc8" strokeWidth="3" />
        <line x1="140" y1="30" x2="140" y2="160" stroke="#cfcfc8" strokeWidth="3" />
        <line x1="60" y1="95" x2="220" y2="95" stroke="#cfcfc8" strokeWidth="3" />

        {isDark ? (
          <>
            <circle cx="180" cy="60" r="14" fill="#e8e8e0" />
            <circle cx="80" cy="55" r="1.3" fill="white" />
            <circle cx="100" cy="120" r="1" fill="white" />
            <circle cx="130" cy="45" r="1.2" fill="white" />
            <circle cx="195" cy="100" r="1" fill="white" />
          </>
        ) : (
          <circle cx="100" cy="65" r="16" fill="#F3CB4B" />
        )}

        <rect x="250" y="240" width="220" height="20" rx="3" fill="#b08968" />
        <rect x="260" y="260" width="10" height="60" fill="#8a6647" />
        <rect x="450" y="260" width="10" height="60" fill="#8a6647" />

        <rect x="330" y="200" width="90" height="55" rx="4" fill="#3a3a3a" />
        {isDark && <rect x="336" y="206" width="78" height="38" rx="2" fill="#cfe8ff" />}
        <rect x="320" y="255" width="110" height="6" rx="2" fill="#555" />

        <ellipse cx="345" cy="240" rx="38" ry="42" fill="#F3CB4B" opacity="0.18" />
        <circle cx="345" cy="200" r="26" fill="#f1c27d" />
        <path d="M325 188 q20 -22 40 0" fill="none" stroke="#3a2a1a" strokeWidth="5" strokeLinecap="round" />
        <rect x="330" y="210" width="30" height="34" rx="10" fill="#5B5FEF" />

        <g>
          <ellipse cx="345" cy="150" rx="30" ry="24" fill="#F3CB4B" opacity="0.5">
            <animate attributeName="opacity" values="0.35;0.6;0.35" dur="2.4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="345" cy="150" rx="18" ry="14" fill="#F3CB4B" />
        </g>

        <g stroke="#4FC3A1" strokeWidth="1.5" fill="none" opacity="0.8">
          <path d="M345 138 C 380 110, 420 100, 450 80" />
          <path d="M345 140 C 390 130, 440 140, 480 150" />
          <path d="M345 145 C 300 110, 260 90, 230 70" />
          <path d="M345 148 C 310 160, 280 175, 250 190" />
        </g>

        <circle cx="450" cy="75" r="16" fill="none" stroke="#F3CB4B" strokeWidth="1.5" />
        <text x="450" y="80" textAnchor="middle" fill={isDark ? '#F5F5F0' : '#1A1A2E'} fontSize="14" fontWeight="500">C</text>

        <circle cx="480" cy="150" r="16" fill="none" stroke="#4FC3A1" strokeWidth="1.5" />
        <text x="480" y="155" textAnchor="middle" fill={isDark ? '#F5F5F0' : '#1A1A2E'} fontSize="11" fontWeight="500">DNA</text>

        <circle cx="230" cy="70" r="16" fill="none" stroke="#4FC3A1" strokeWidth="1.5" />
        <text x="230" y="75" textAnchor="middle" fill={isDark ? '#F5F5F0' : '#1A1A2E'} fontSize="14" fontWeight="500">∫</text>

        <circle cx="250" cy="190" r="16" fill="none" stroke="#F3CB4B" strokeWidth="1.5" />
        <text x="250" y="195" textAnchor="middle" fill={isDark ? '#F5F5F0' : '#1A1A2E'} fontSize="12" fontWeight="500">{'{ }'}</text>
      </svg>
    </div>
  )
}
