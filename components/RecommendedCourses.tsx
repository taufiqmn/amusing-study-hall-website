'use client'

import Link from 'next/link'

export default function RecommendedCourses({ courses }: { courses: any[] }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Recommended courses</p>
          <p style={{ fontSize: 12, opacity: 0.55, margin: '2px 0 0' }}>Picked based on your level and interests</p>
        </div>
        <Link href="/courses" style={{ fontSize: 12, fontWeight: 600, padding: '7px 14px', border: '1px solid var(--card-border)', color: 'var(--accent)', borderRadius: 10, textDecoration: 'none' }}>
          View all courses →
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 16,
              padding: 18,
              boxShadow: 'var(--card-shadow)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-color), transparent 70%)' }} />

            <p style={{ fontSize: 14, fontWeight: 700, margin: '4px 0 4px', color: 'var(--accent)', lineHeight: 1.3, position: 'relative' }}>
              {course.title}
            </p>
            <p style={{ fontSize: 11, opacity: 0.55, margin: '0 0 14px', fontWeight: 500, position: 'relative' }}>
              {course.category} — {course.subject}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, position: 'relative' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px dashed var(--card-border)' }} title="Badge — locked" />
              <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.5, margin: 0 }}>Grade: —</p>
            </div>

            <div style={{ background: 'rgba(128,128,128,0.15)', borderRadius: 6, height: 6, marginBottom: 14, position: 'relative' }}>
              <div style={{ background: 'var(--accent-gradient)', width: '0%', height: '100%', borderRadius: 6 }} />
            </div>

            <Link
              href={`/courses/${course.id}`}
              style={{
                display: 'block',
                textAlign: 'center',
                fontSize: 13,
                padding: '9px 14px',
                background: 'var(--accent-gradient)',
                color: 'white',
                borderRadius: 10,
                textDecoration: 'none',
                fontWeight: 700,
                position: 'relative',
              }}
            >
              Start now
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}