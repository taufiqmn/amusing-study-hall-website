'use client'

export default function BrainGlow() {
  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 20,
        padding: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        height: '100%',
        minHeight: 220,
      }}
    >
      <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            position: 'absolute',
            width: '140%',
            height: '140%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(243,203,75,0.55), rgba(243,203,75,0) 70%)',
            animation: 'pulse-glow 2.6s ease-in-out infinite',
          }}
        />
        <img src="/brain.svg" alt="A glowing brain, representing knowledge and learning" style={{ width: '70%', height: '70%', position: 'relative', zIndex: 1 }} />
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
      `}</style>
    </div>
  )
}