'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    loadProfile()
  }, [router])

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {profile?.name}!</h1>
      <p>Level: {profile?.level}</p>
      <p>Dream: {profile?.dream}</p>
      <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}>
        Log out
      </button>
    </div>
  )
}