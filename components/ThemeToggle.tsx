'use client'

import { useTheme } from '@/lib/theme-context'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      style={{
        width: 56,
        height: 28,
        borderRadius: 20,
        border: '1px solid var(--card-border)',
        background: isDark ? '#13314f' : '#cfe8ff',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.4s',
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: isDark ? 30 : 2,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: isDark ? '#e8e8e0' : '#F3CB4B',
          transition: 'left 0.4s, background 0.4s',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 4,
          left: isDark ? 8 : 32,
          fontSize: 10,
          opacity: 0.7,
        }}
      >
        {isDark ? '✦' : '☁'}
      </span>
    </button>
  )
}