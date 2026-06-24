'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StatBoxes({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    if (!isLoggedIn) {
      setShowModal(true)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          onClick={handleClick}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 10,
            padding: '10px 14px',
            cursor: isLoggedIn ? 'default' : 'pointer',
          }}
        >
          <p style={{ fontSize: 11, opacity: 0.6, margin: '0 0 2px' }}>Time spent</p>
          <p style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--accent)' }}>
            {isLoggedIn ? '0h' : '🔒 —'}
          </p>
        </div>

        <div
          onClick={handleClick}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 10,
            padding: '10px 14px',
            cursor: isLoggedIn ? 'default' : 'pointer',
          }}
        >
          <p style={{ fontSize: 11, opacity: 0.6, margin: '0 0 2px' }}>Awards</p>
          <p style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            {isLoggedIn ? '0' : '🔒 —'}
          </p>
        </div>

        <div
          onClick={handleClick}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 10,
            padding: '10px 14px',
            cursor: isLoggedIn ? 'default' : 'pointer',
          }}
        >
          <p style={{ fontSize: 11, opacity: 0.6, margin: '0 0 2px' }}>Self analysis</p>
          <p style={{ fontSize: 13, margin: 0 }}>
            {isLoggedIn ? 'View report →' : '🔒 Login to view'}
          </p>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 14,
              padding: 24,
              textAlign: 'center',
              maxWidth: 260,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>🔒 Sign up to track this</p>
            <p style={{ fontSize: 12, opacity: 0.7, margin: '0 0 16px' }}>
              See your time spent, awards, and progress analysis.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button
                onClick={() => router.push('/signup')}
                style={{ fontSize: 12, padding: '6px 14px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600 }}
              >
                Sign up
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{ fontSize: 12, padding: '6px 14px', background: 'transparent', border: '1px solid var(--card-border)', borderRadius: 8 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}