'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ThemeToggle from '@/components/ThemeToggle'

export default function SiteHeader() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 20px',
        borderBottom: '1px solid var(--card-border)',
        position: 'sticky',
        top: 0,
        background: 'var(--background)',
        zIndex: 20,
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <img src="/logo.svg" alt="Amusing Study Hall logo" style={{ width: 28, height: 28 }} />
        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground)' }}>Amusing Study Hall</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <ThemeToggle />
        {user ? (
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--accent)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {user.email?.[0]?.toUpperCase() || '?'}
            </div>
          </Link>
        ) : (
          <Link href="/login" style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>
            Log in
          </Link>
        )}
      </div>
    </div>
  )
}
