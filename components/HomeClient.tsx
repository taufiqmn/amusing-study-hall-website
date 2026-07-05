'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import StatBoxes from '@/components/StatBoxes'
import RecommendedCourses from '@/components/RecommendedCourses'
import Footer from '@/components/Footer'
import Landing from '@/components/landing/Landing'

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
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(profileData)
      }
      setLoading(false)
    }
    load()
  }, [])

  const isLoggedIn = !!user

  // Visitors get the cinematic landing page.
  // Logged-in students get straight to their courses.
  if (!loading && !isLoggedIn) {
    return (
      <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <SiteHeader />
        <Landing courses={courses} stats={stats} topics={topics} lessonCounts={lessonCounts} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 32px' }}>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />

      <div style={{ padding: '32px 20px', maxWidth: 1100, width: '100%', margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 6px', letterSpacing: -0.5 }}>
            {loading ? 'Amusing Study Hall' : `Welcome back, ${profile?.name}!`}
          </h1>
          <p style={{ fontSize: 14, opacity: 0.6, margin: 0 }}>
            {!loading && 'Pick up where you left off below.'}
          </p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <StatBoxes isLoggedIn={isLoggedIn} />
        </div>

        <div style={{ marginBottom: 32 }}>
          <RecommendedCourses courses={courses} />
        </div>

        <Footer />
      </div>
    </div>
  )
}
