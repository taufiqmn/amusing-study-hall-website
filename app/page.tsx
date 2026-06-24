'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ThemeToggle from '@/components/ThemeToggle'
import BrainGlow from '@/components/BrainGlow'
import StatBoxes from '@/components/StatBoxes'
import ContentBlocks from '@/components/ContentBlocks'
import RecommendedCourses from '@/components/RecommendedCourses'
import Footer from '@/components/Footer'

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
      }

      const { data: courseData } = await supabase.from('courses').select('*')
      setCourses(courseData || [])
      setLoading(false)
    }
    load()
  }, [])

  const isLoggedIn = !!user

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>

  return (
   <div style={{ padding: 20, maxWidth: 1100, width: '100%', margin: '0 auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img src="/logo.svg" alt="Amusing Study Hall logo" style={{ width: 32, height: 32 }} />
    <h1 style={{ margin: 0, fontSize: 22 }}>Amusing Study Hall</h1>
  </div>
  <ThemeToggle />
</div>

      {isLoggedIn ? (
        <p style={{ marginBottom: 16 }}>
          Welcome back, {profile?.name}! <Link href="/dashboard" style={{ color: 'var(--accent)' }}>Go to your dashboard</Link>
        </p>
      ) : (
        <p style={{ marginBottom: 16 }}>
          <Link href="/signup" style={{ color: 'var(--accent)' }}>Sign up</Link> or{' '}
          <Link href="/login" style={{ color: 'var(--accent)' }}>Log in</Link> to track your progress
        </p>
      )}

   <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', width: '100%' }}>
        <div style={{ flex: '1 1 240px' }}>
          <BrainGlow />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <StatBoxes isLoggedIn={isLoggedIn} />
        </div>
      </div>

     <div style={{ marginBottom: 24 }}>
  <ContentBlocks />
</div>

      <div style={{ marginBottom: 24 }}>
        <RecommendedCourses courses={courses} />
      </div>

      <Footer />
    </div>
  )
}