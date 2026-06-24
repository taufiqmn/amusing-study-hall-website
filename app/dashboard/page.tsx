'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SiteHeader from '@/components/SiteHeader'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const [completedLessons, setCompletedLessons] = useState(0)
  const [courseBreakdown, setCourseBreakdown] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profileData)

      const { data: logs } = await supabase.from('activity_logs').select('duration_seconds, course_id').eq('user_id', user.id)
      const total = (logs || []).reduce((sum, l) => sum + (l.duration_seconds || 0), 0)
      setTotalSeconds(total)

      const { data: progressRows } = await supabase.from('progress').select('id, course_id').eq('user_id', user.id).eq('status', 'completed')
      setCompletedLessons(progressRows?.length || 0)

      const { data: courses } = await supabase.from('courses').select('id, title')
      const breakdown = (courses || []).map((course) => {
        const courseSeconds = (logs || []).filter((l) => l.course_id === course.id).reduce((sum, l) => sum + (l.duration_seconds || 0), 0)
        const courseCompleted = (progressRows || []).filter((p) => p.course_id === course.id).length
        return { title: course.title, seconds: courseSeconds, completed: courseCompleted }
      }).filter((c) => c.seconds > 0 || c.completed > 0)
      setCourseBreakdown(breakdown)

      setLoading(false)
    }
    load()
  }, [router])

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />
      <div style={{ padding: '32px 20px', maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>{profile?.name}'s Dashboard</h1>
        <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 24 }}>
          {profile?.level} • Dreaming to become a {profile?.dream}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 18 }}>
            <p style={{ fontSize: 11, opacity: 0.6, margin: '0 0 4px' }}>Total time spent</p>
            <p style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--accent)' }}>
              {hours}h {minutes}m
            </p>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 18 }}>
            <p style={{ fontSize: 11, opacity: 0.6, margin: '0 0 4px' }}>Lessons completed</p>
            <p style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{completedLessons}</p>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 18 }}>
            <p style={{ fontSize: 11, opacity: 0.6, margin: '0 0 4px' }}>Badges earned</p>
            <p style={{ fontSize: 22, fontWeight: 800, margin: 0, opacity: 0.4 }}>0</p>
          </div>
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Course breakdown</h2>
        {courseBreakdown.length === 0 ? (
          <p style={{ fontSize: 13, opacity: 0.6 }}>Start a lesson to see your breakdown here.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {courseBreakdown.map((c) => {
              const h = Math.floor(c.seconds / 3600)
              const m = Math.floor((c.seconds % 3600) / 60)
              return (
                <div key={c.title} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 2px' }}>{c.title}</p>
                    <p style={{ fontSize: 11, opacity: 0.6, margin: 0 }}>{c.completed} lessons completed</p>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', margin: 0 }}>{h}h {m}m</p>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
          style={{ marginTop: 28, fontSize: 13, padding: '10px 20px', background: 'transparent', border: '1px solid var(--card-border)', borderRadius: 10, cursor: 'pointer' }}
        >
          Log out
        </button>
      </div>
    </div>
  )
}