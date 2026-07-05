'use client'

import Link from 'next/link'

// Drop-in showcase section for the landing page:
// a grid of the live interactive tools, linking to /tools.

const TOOLS = [
  { emoji: '🧪', name: 'Array Playground', line: 'Declare it, watch the boxes appear' },
  { emoji: '⏱', name: 'Complexity Lab', line: 'Paste code → get its Big-O' },
  { emoji: '📊', name: 'Sorting Visualizer', line: 'Bubble vs Selection vs Insertion' },
  { emoji: '🔍', name: 'Search Race', line: 'Linear 🐢 vs Binary 🐇' },
  { emoji: '🥞', name: 'Stack Machine', line: 'Push, pop, overflow!' },
  { emoji: '🚶', name: 'Queue Simulator', line: 'Why circular queues exist' },
  { emoji: '🔗', name: 'Linked List Lab', line: 'Nodes and pointers, visible' },
  { emoji: '🧮', name: 'Infix ⇄ Postfix', line: 'The exam classic, automated' },
  { emoji: '🗼', name: 'Tower of Hanoi', line: 'Recursion solves it live' },
]

export default function ToolsShowcase() {
  return (
    <section style={{ maxWidth: 1050, margin: '0 auto', padding: '30px 20px 70px', textAlign: 'center' }}>
      <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 8px' }}>
        The Toolbox
      </p>
      <h2 style={{ fontSize: 'clamp(24px, 3.4vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
        9 machines you can actually play with
      </h2>
      <p style={{ fontSize: 14, color: 'var(--foreground-muted)', maxWidth: 520, margin: '0 auto 26px', lineHeight: 1.7 }}>
        Not videos. Not pictures. Real interactive algorithms — press the buttons, break them, learn.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 26 }}>
        {TOOLS.map((t) => (
          <Link key={t.name} href="/tools" style={{ textDecoration: 'none', color: 'var(--foreground)' }}>
            <div
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '16px 14px', textAlign: 'left', transition: 'transform 0.2s, border-color 0.2s', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--card-border)' }}
            >
              <p style={{ fontSize: 22, margin: '0 0 6px' }}>{t.emoji}</p>
              <p style={{ fontSize: 13.5, fontWeight: 800, margin: '0 0 3px' }}>{t.name}</p>
              <p style={{ fontSize: 11.5, opacity: 0.6, margin: 0 }}>{t.line}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/tools" style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 12, background: 'var(--accent-gradient)', color: 'white', textDecoration: 'none', boxShadow: '0 8px 30px var(--glow-color)' }}>
        Open the toolbox →
      </Link>
    </section>
  )
}
