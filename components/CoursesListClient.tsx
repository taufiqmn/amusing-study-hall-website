'use client'

import { useState } from 'react'
import SiteHeader from '@/components/SiteHeader'
import RecommendedCourses from '@/components/RecommendedCourses'

export default function CoursesListClient({ courses }: { courses: any[] }) {
  const [filter, setFilter] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(courses.map((c) => c.category)))]
  const filtered = filter === 'All' ? courses : courses.filter((c) => c.category === filter)

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />
      <div style={{ padding: '32px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px' }}>All courses</h1>
        <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 20 }}>Browse everything available on Amusing Study Hall.</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 20,
                border: filter === cat ? 'none' : '1px solid var(--card-border)',
                background: filter === cat ? 'var(--accent-gradient)' : 'transparent',
                color: filter === cat ? 'white' : 'var(--foreground)',
                cursor: 'pointer',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <RecommendedCourses courses={filtered} />
      </div>
    </div>
  )
}