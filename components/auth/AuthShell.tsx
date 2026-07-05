'use client'

import Link from 'next/link'
import styles from './auth.module.css'

// Shared split-screen shell for /login and /signup:
// left = aurora brand panel (hidden on mobile), right = form card.

export default function AuthShell({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className={styles.screen}>
      <div className={styles.brandPanel}>
        <Link href="/" className={styles.brandRow}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Amusing Study Hall" className={styles.logo} />
          <span>Amusing Study Hall</span>
        </Link>
        <div>
          <h2 className={styles.brandTitle}>
            Study like it&apos;s a <em className={styles.gold}>game</em>,<br />
            learn like a <em className={styles.cyan}>pro</em>.
          </h2>
          <ul className={styles.brandList}>
            <li>💡 Interactive lessons with click-to-reveal answers</li>
            <li>🧩 Quizzes at three levels + weak-topic tracking</li>
            <li>⚙️ Nine live algorithm machines to play with</li>
            <li>📈 Streaks, badges and a personal study cockpit</li>
          </ul>
        </div>
        <p className={styles.brandFoot}>Free forever · Made by a student, for students</p>
      </div>

      <div className={styles.formSide}>
        <div className={styles.formCard}>
          <span className="shine-overlay" aria-hidden="true" />
          <Link href="/" className={styles.mobileBrand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" className={styles.logoSm} /> Amusing Study Hall
          </Link>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.sub}>{sub}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
