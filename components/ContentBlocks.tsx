const blocks = [
  { emoji: '📖', title: 'Easy explanation', desc: 'Every lesson explained in simple Bangla.' },
  { emoji: '🧩', title: 'Lesson quizzes', desc: 'Check your understanding after each lesson.' },
  { emoji: '✍️', title: 'Practice problems', desc: 'Sharpen your skills with real exercises.' },
]

export default function ContentBlocks() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
      {blocks.map((b) => (
        <div
          key={b.title}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 26, marginBottom: 6 }}>{b.emoji}</div>
          <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 4px' }}>{b.title}</p>
          <p style={{ fontSize: 11, opacity: 0.65, margin: 0 }}>{b.desc}</p>
        </div>
      ))}
    </div>
  )
}