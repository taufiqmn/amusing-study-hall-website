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
        position: 'sticky',
        top: 0,
        background: 'var(--background)',
        backdropFilter: 'blur(10px)',
        zIndex: 20,
        borderBottom: '1px solid var(--card-border)',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--accent-gradient)',
            flexShrink: 0,
          }}
        >
          <img src="/logo.svg" alt="Amusing Study Hall logo" style={{ width: '85%', height: '85%', objectFit: 'cover', borderRadius: '50%' }} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--foreground)', letterSpacing: -0.3, whiteSpace: 'nowrap' }}>
          Amusing Study Hall
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ThemeToggle />
        {user ? (
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
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
          <>
            <Link href="/login" style={{ fontSize: 12, fontWeight: 600, padding: '8px 14px', borderRadius: 20, background: 'var(--pill-bg)', color: 'var(--accent)', textDecoration: 'none' }}>
              Log in
            </Link>
            <Link href="/signup" style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 20, background: 'var(--accent-gradient)', color: 'white', textDecoration: 'none' }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  )
}