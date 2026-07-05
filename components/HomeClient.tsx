'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import Landing from '@/components/landing/Landing'

// ONE homepage for everyone: the cinematic landing.
// Logged-in students see a floating "Continue in your dashboard" pill;
// their real home base is /dashboard (login already redirects there).

export default function HomeClient({
  courses,
  stats,
  topics,
  lessonCounts,
}: {
  courses: any[]
  stats?: { courses: number; lessons: number; quizzes: number }
  topics?: string[]
  lessonCounts?: Record<string, number>
}) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />

      {user && (
        <div style={{ position: 'sticky', top: 64, zIndex: 20, display: 'flex', justifyContent: 'center', padding: '10px 16px 0' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 800,
              padding: '10px 20px',
              borderRadius: 999,
              background: 'var(--accent-gradient)',
              color: 'white',
              textDecoration: 'none',
              boxShadow: '0 8px 26px var(--glow-color)',
            }}
          >
            🚀 Continue in your dashboard →
          </Link>
        </div>
      )}

      <Landing courses={courses} stats={stats} topics={topics} lessonCounts={lessonCounts} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 32px' }}>
        <Footer />
      </div>
    </div>
  )
}
