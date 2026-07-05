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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {courses.map((course) => (
          <div
            key={course.id}
            className="course-card"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 18,
              padding: 0,
              boxShadow: 'var(--card-shadow)',
              backdropFilter: 'blur(14px)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
          >
            <span className="shine-overlay" aria-hidden="true" />
            <div style={{ position: 'absolute', top: -30, right: -30, width: 110, height: 110, borderRadius: '50%', background: 'radial-gradient(circle, var(--glow-color), transparent 70%)', filter: 'blur(2px)' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: 'var(--accent-gradient)', opacity: 0.8 }} />

            <div style={{ padding: '20px 20px 18px' }}>
              <p style={{ fontSize: 15, fontWeight: 800, margin: '4px 0 5px', color: 'var(--foreground)', lineHeight: 1.3, position: 'relative' }}>
                {course.title}
              </p>
              <p style={{ fontSize: 11, opacity: 0.55, margin: '0 0 16px', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', position: 'relative' }}>
                {course.category} · {course.subject}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, position: 'relative' }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '2px dashed var(--card-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    opacity: 0.4,
                  }}
                  title="Badge — locked"
                >
                  🔒
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.5, margin: 0 }}>Grade: —</p>
              </div>

              <div style={{ background: 'rgba(128,128,128,0.15)', borderRadius: 6, height: 6, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
                <div style={{ background: 'var(--accent-gradient)', width: '0%', height: '100%', borderRadius: 6 }} />
              </div>

              <Link
                href={`/courses/${course.id}`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: 13,
                  padding: '11px 14px',
                  background: 'var(--accent-gradient)',
                  color: 'white',
                  borderRadius: 12,
                  textDecoration: 'none',
                  fontWeight: 700,
                  position: 'relative',
                  boxShadow: '0 4px 16px rgba(98,0,234,0.25)',
                }}
              >
                Start now →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(98,0,234,0.18) !important;
        }
      `}</style>
    </div>
  )
}