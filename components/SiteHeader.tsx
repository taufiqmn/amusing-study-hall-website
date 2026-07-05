'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ThemeToggle from '@/components/ThemeToggle'
import styles from './SiteHeader.module.css'

const TABS: { href: string; label: string; external?: boolean }[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/courses', label: 'Courses' },
  { href: '/question-bank', label: 'Question Bank' },
  { href: '/tools', label: '🧰 Tools' },
  { href: '/compiler', label: 'Compiler' },
  { href: 'https://www.youtube.com/@amusingstudyhall', label: 'YouTube ↗', external: true },
]

export default function SiteHeader() {
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <div className={styles.header}>
      <Link href="/" className={styles.brand}>
        <div className={styles.logoWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Amusing Study Hall logo" className={styles.logoImg} />
        </div>
        <span className={styles.brandText}>Amusing Study Hall</span>
      </Link>

      <nav className={styles.nav} aria-label="Main navigation">
        {TABS.map((t) =>
          t.external ? (
            <a key={t.href} href={t.href} target="_blank" rel="noopener noreferrer" className={styles.tab}>
              {t.label}
            </a>
          ) : (
            <Link key={t.href} href={t.href} className={`${styles.tab} ${isActive(t.href) ? styles.active : ''}`}>
              {t.label}
            </Link>
          )
        )}
      </nav>

      <div className={styles.right}>
        <ThemeToggle />
        {user ? (
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div className={styles.avatar}>{user.email?.[0]?.toUpperCase() || '?'}</div>
          </Link>
        ) : (
          <>
            <Link href="/login" className={styles.loginBtn}>Log in</Link>
            <Link href="/signup" className={styles.signupBtn}>Sign up</Link>
          </>
        )}
      </div>
    </div>
  )
}
