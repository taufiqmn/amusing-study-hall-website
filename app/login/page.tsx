'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AuthShell from '@/components/auth/AuthShell'
import styles from '@/components/auth/auth.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setError(
        loginError.message === 'Email not confirmed'
          ? 'Please confirm your email first — check your inbox for our link.'
          : loginError.message
      )
      setLoading(false)
      return
    }

    // safety net: make sure a profile row exists (for accounts created
    // before the auto-profile trigger was added)
    const u = data.user
    if (u) {
      await supabase.from('profiles').upsert(
        {
          id: u.id,
          name: (u.user_metadata?.name as string) || u.email?.split('@')[0] || 'Student',
          level: (u.user_metadata?.level as string) || 'University',
        },
        { onConflict: 'id', ignoreDuplicates: true }
      )
    }

    router.push('/dashboard')
  }

  return (
    <AuthShell title="Welcome back" sub="Log in to continue your streak.">
      <form onSubmit={handleLogin} className={styles.form}>
        <div>
          <label className={styles.label} htmlFor="email">Email</label>
          <input id="email" className={styles.input} placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className={styles.label} htmlFor="password">Password</label>
          <div className={styles.pwRow}>
            <input id="password" className={styles.input} placeholder="Your password" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className={styles.pwToggle} onClick={() => setShowPw(!showPw)} aria-label="Show password">{showPw ? '🙈' : '👁'}</button>
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? 'Logging in…' : 'Log in →'}
        </button>
      </form>
      <p className={styles.swap}>New here? <a href="/signup">Create a free account</a></p>
    </AuthShell>
  )
}
