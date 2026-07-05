'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AuthShell from '@/components/auth/AuthShell'
import styles from '@/components/auth/auth.module.css'

// REAL signup: creates the account (auth.signUp) with name + level
// metadata; the DB trigger turns it into a profiles row automatically.

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [level, setLevel] = useState('University')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [confirmSent, setConfirmSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name.trim(), level } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push('/dashboard')
    } else {
      // email confirmation is ON in Supabase
      setConfirmSent(true)
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create your account" sub="One minute, and the whole study hall is yours — free.">
      {confirmSent ? (
        <p className={styles.success}>
          🎉 Account created! We sent a confirmation link to <b>{email}</b>.<br />
          Click it, then <a href="/login" style={{ color: 'var(--accent)', fontWeight: 800 }}>log in</a> to enter your dashboard.
        </p>
      ) : (
        <form onSubmit={handleSignup} className={styles.form}>
          <div>
            <label className={styles.label} htmlFor="name">Your name</label>
            <input id="name" className={styles.input} placeholder="e.g. Taufiq" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className={styles.label} htmlFor="level">Study level</label>
            <select id="level" className={styles.select} value={level} onChange={(e) => setLevel(e.target.value)}>
              <option>University</option>
              <option>HSC</option>
              <option>Admission</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className={styles.label} htmlFor="email">Email</label>
            <input id="email" className={styles.input} placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className={styles.label} htmlFor="password">Password</label>
            <div className={styles.pwRow}>
              <input id="password" className={styles.input} placeholder="At least 6 characters" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className={styles.pwToggle} onClick={() => setShowPw(!showPw)} aria-label="Show password">{showPw ? '🙈' : '👁'}</button>
            </div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Creating your account…' : 'Create account →'}
          </button>
        </form>
      )}
      <p className={styles.swap}>Already have an account? <a href="/login">Log in</a></p>
    </AuthShell>
  )
}
