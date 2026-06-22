'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>

  return (
    <div style={{ padding: 20 }}>
      <h1>Amusing Study Hall</h1>

      {user ? (
        <div>
          <p>Welcome back, {profile?.name}!</p>
          <Link href="/dashboard">Go to your dashboard</Link>
        </div>
      ) : (
        <div>
          <p><Link href="/signup">Sign up</Link> or <Link href="/login">Log in</Link> to track your progress</p>
        </div>
      )}

      <h2 style={{ marginTop: 30 }}>Courses</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {courses.map((course) => (
          <div key={course.id} style={{ border: '1px solid #ccc', padding: 10 }}>
            <strong>{course.title}</strong>
            <p>{course.category} — {course.subject}</p>
            <a href={course.youtube_url} target="_blank">Watch on YouTube</a>
          </div>
        ))}
      </div>
    </div>
  )
}