'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'
import StatBoxes from '@/components/StatBoxes'
import RecommendedCourses from '@/components/RecommendedCourses'
import Footer from '@/components/Footer'

export default function HomeClient({ courses }: { courses: any[] }) {
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

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />

      <div style={{ padding: '32px 20px', maxWidth: 1100, width: '100%', margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 6px', letterSpacing: -0.5 }}>
            {loading ? 'Amusing Study Hall' : isLoggedIn ? `Welcome back, ${profile?.name}!` : 'Your dream starts here.'}
          </h1>
          <p style={{ fontSize: 14, opacity: 0.6, margin: 0 }}>
            {!loading && (isLoggedIn ? 'Pick up where you left off below.' : 'Sign up or log in to track your progress as you learn.')}
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