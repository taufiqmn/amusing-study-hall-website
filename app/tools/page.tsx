'use client'

import { useState } from 'react'
import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import ArrayVisualizer from '@/components/interactive/ArrayVisualizer'
import ComplexityLab from '@/components/interactive/ComplexityLab'
import SortVisualizer from '@/components/interactive/SortVisualizer'
import SearchVisualizer from '@/components/interactive/SearchVisualizer'
import StackVisualizer from '@/components/interactive/StackVisualizer'
import StackPlayground from '@/components/interactive/StackPlayground'
import InfixConvertLab from '@/components/interactive/InfixConvertLab'
import CircularQueueRing from '@/components/interactive/CircularQueueRing'
import QueueVisualizer from '@/components/interactive/QueueVisualizer'
import LinkedListVisualizer from '@/components/interactive/LinkedListVisualizer'
import InfixPostfixLab from '@/components/interactive/InfixPostfixLab'
import HanoiVisualizer from '@/components/interactive/HanoiVisualizer'
import MatrixReducer from '@/components/interactive/MatrixReducer'

type Tool = { emoji: string; title: string; desc: string; subject: string; C: React.ComponentType<any> }

const TOOLS: Tool[] = [
  { emoji: '🧪', title: 'Array Playground', desc: 'Declare an array and watch boxes appear. Insert, delete, reverse — see every shift.', subject: 'DSA', C: ArrayVisualizer },
  { emoji: '⏱', title: 'Complexity Lab', desc: 'Paste any code and get an estimated Big-O with reasons and a growth table.', subject: 'DSA', C: ComplexityLab },
  { emoji: '📊', title: 'Sorting Visualizer', desc: 'Bubble, Selection and Insertion sort — animated bars with compare & swap counters.', subject: 'DSA', C: SortVisualizer },
  { emoji: '🔍', title: 'Search Race', desc: 'Linear vs Binary search on the same data. Watch BEG, MID, END do their thing.', subject: 'DSA', C: SearchVisualizer },
  { emoji: '🥞', title: 'Stack Playground', desc: 'Build a stack of your OWN size and watch a hand drop plates as code runs line by line.', subject: 'DSA', C: StackPlayground },
  { emoji: '🥞', title: 'Stack Machine', desc: 'Push, pop and peek — and trigger real overflow & underflow errors safely.', subject: 'DSA', C: StackVisualizer },
  { emoji: '♻️', title: 'Circular Queue Ring', desc: 'A true ring you can fill and empty — watch REAR wrap around and learn full vs empty.', subject: 'DSA', C: CircularQueueRing },
  { emoji: '🚶', title: 'Queue Simulator', desc: 'Linear vs Circular queue with FRONT/REAR pointers. See why circular exists.', subject: 'DSA', C: QueueVisualizer },
  { emoji: '🔗', title: 'Linked List Lab', desc: 'Nodes and pointers you can actually see. Insert in O(1), search by walking the chain.', subject: 'DSA', C: LinkedListVisualizer },
  { emoji: '🧮', title: 'Infix ⇄ Postfix / Prefix', desc: 'Type an expression and step (or auto-play) through the conversion chart, token by token.', subject: 'DSA', C: InfixConvertLab },
  { emoji: '🧮', title: 'Infix ⇄ Postfix Machine', desc: 'Type any expression, step through the stack algorithm — the exam classic.', subject: 'DSA', C: InfixPostfixLab },
  { emoji: '🗼', title: 'Tower of Hanoi', desc: 'Watch recursion solve the puzzle in exactly 2ⁿ − 1 moves.', subject: 'DSA', C: HanoiVisualizer },
  { emoji: '🔢', title: 'Matrix Row Reducer', desc: 'Enter any system and reduce to echelon or reduced form step-by-step, in exact fractions.', subject: 'Matrix', C: MatrixReducer },
]

const SUBJECTS = ['All', ...Array.from(new Set(TOOLS.map((t) => t.subject)))]

export default function ToolsPage() {
  const [subject, setSubject] = useState('All')
  const [open, setOpen] = useState<string | null>(null)

  const shown = subject === 'All' ? TOOLS : TOOLS.filter((t) => t.subject === subject)
  const active = TOOLS.find((t) => t.title === open)

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />
      <div style={{ padding: '32px 20px', maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: -0.5 }}>🧰 Interactive Tools</h1>
        <p style={{ fontSize: 14, opacity: 0.65, margin: '0 0 20px' }}>
          Every tool from the lessons, in one playground. Filter by subject, then open a card to start experimenting — no signup needed.
        </p>

        {/* subject filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {SUBJECTS.map((s) => (
            <button key={s} onClick={() => { setSubject(s); setOpen(null) }}
              style={{ fontSize: 12.5, fontWeight: 800, padding: '8px 16px', borderRadius: 999, cursor: 'pointer',
                border: '1px solid var(--card-border)',
                background: subject === s ? 'var(--accent-gradient)' : 'var(--card-bg)',
                color: subject === s ? 'white' : 'var(--foreground)',
                boxShadow: subject === s ? '0 4px 14px var(--glow-color)' : 'none' }}>
              {s}{s !== 'All' ? '' : ''} <span style={{ opacity: 0.7, fontWeight: 600 }}>({s === 'All' ? TOOLS.length : TOOLS.filter((t) => t.subject === s).length})</span>
            </button>
          ))}
        </div>

        {/* the opened tool */}
        {active && (
          <div style={{ marginBottom: 26, background: 'var(--card-bg)', border: '1px solid var(--accent)', borderRadius: 18, padding: 20, position: 'relative', overflow: 'hidden' }}>
            <span className="shine-overlay" aria-hidden="true" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <p style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{active.emoji} {active.title}</p>
                <p style={{ fontSize: 12.5, opacity: 0.65, margin: '2px 0 0' }}>{active.desc}</p>
              </div>
              <button onClick={() => setOpen(null)} style={{ fontSize: 12.5, fontWeight: 700, padding: '8px 16px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--foreground)', cursor: 'pointer' }}>✕ Close</button>
            </div>
            <active.C />
          </div>
        )}

        {/* card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14 }}>
          {shown.map((t) => (
            <button key={t.title} onClick={() => { setOpen(t.title); window.scrollTo({ top: 180, behavior: 'smooth' }) }}
              style={{ position: 'relative', overflow: 'hidden', textAlign: 'left', cursor: 'pointer',
                background: 'var(--card-bg)', border: `1px solid ${open === t.title ? 'var(--accent)' : 'var(--card-border)'}`,
                borderRadius: 16, padding: 18, color: 'var(--foreground)', transition: 'transform 0.2s, border-color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; if (open !== t.title) e.currentTarget.style.borderColor = 'var(--card-border)' }}>
              <span className="shine-overlay" aria-hidden="true" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 30 }}>{t.emoji}</span>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-2, var(--accent))', border: '1px solid var(--card-border)', borderRadius: 999, padding: '3px 9px' }}>{t.subject}</span>
              </div>
              <p style={{ fontSize: 14.5, fontWeight: 800, margin: '0 0 5px', lineHeight: 1.3 }}>{t.title}</p>
              <p style={{ fontSize: 12, opacity: 0.65, margin: '0 0 10px', lineHeight: 1.5 }}>{t.desc}</p>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)' }}>{open === t.title ? 'Open ↑' : 'Launch →'}</span>
            </button>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  )
}
