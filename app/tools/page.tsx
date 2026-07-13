'use client'

import { useState, useMemo } from 'react'
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
import SqlPlayground from '@/components/interactive/SqlPlayground'
import QueryTracer from '@/components/interactive/QueryTracer'
import HanoiVisualizer from '@/components/interactive/HanoiVisualizer'
import GaussianSolver from '@/components/interactive/GaussianSolver'

// Each tool carries a `subject`. The filter reads from this automatically —
// to add a future tool, just give it a subject and it appears under that filter.
type Tool = { emoji: string; title: string; subject: string; desc: string; C: React.ComponentType<any> }

const TOOLS: Tool[] = [
  // Linear Algebra
  { emoji: '🟰', title: 'Gaussian Solver', subject: 'Linear Algebra', desc: 'Enter any 2×2, 3×3 or 4×4 system. Watch it reduce row by row to a unique, infinite, or no-solution verdict.', C: GaussianSolver },
  { emoji: '🎯', title: 'Gauss-Jordan Solver', subject: 'Linear Algebra', desc: 'Goes further than Gaussian — reduces all the way to RREF so the answer reads straight off, no back-substitution.', C: (p: any) => <GaussianSolver {...p} method="rref" /> },
  // Database
  { emoji: '🗄️', title: 'SQL Playground', subject: 'Database', desc: 'Write real Oracle SQL and run it live. Click any table to see its columns and types.', C: SqlPlayground },
  { emoji: '🔎', title: 'Query Tracer', subject: 'Database', desc: 'See the order SQL ACTUALLY runs in — watch rows drop, multiply and collapse at each clause.', C: QueryTracer },
  // Data Structures & Algorithms
  { emoji: '🧪', title: 'Array Playground', subject: 'Data Structures', desc: 'Declare an array and watch boxes appear. Insert, delete, reverse — see every shift.', C: ArrayVisualizer },
  { emoji: '⏱', title: 'Complexity Lab', subject: 'Data Structures', desc: 'Paste any code and get an estimated Big-O with reasons and a growth table.', C: ComplexityLab },
  { emoji: '📊', title: 'Sorting Visualizer', subject: 'Data Structures', desc: 'Bubble, Selection and Insertion sort — animated bars with compare & swap counters.', C: SortVisualizer },
  { emoji: '🔍', title: 'Search Race', subject: 'Data Structures', desc: 'Linear vs Binary search on the same data. Watch BEG, MID, END do their thing.', C: SearchVisualizer },
  { emoji: '🥞', title: 'Stack Playground', subject: 'Data Structures', desc: 'Build a stack of your OWN size and watch a hand drop plates as code runs line by line.', C: StackPlayground },
  { emoji: '♻️', title: 'Circular Queue Ring', subject: 'Data Structures', desc: 'A true ring you can fill and empty — watch REAR wrap around and learn full vs empty.', C: CircularQueueRing },
  { emoji: '🧮', title: 'Infix ⇄ Postfix / Prefix', subject: 'Data Structures', desc: 'Type an expression and step (or auto-play) through the conversion chart, token by token.', C: InfixConvertLab },
  { emoji: '🖥️', title: 'Stack Machine', subject: 'Data Structures', desc: 'Push, pop and peek — and trigger real overflow & underflow errors safely.', C: StackVisualizer },
  { emoji: '🚶', title: 'Queue Simulator', subject: 'Data Structures', desc: 'Linear vs Circular queue with FRONT/REAR pointers. See why circular exists.', C: QueueVisualizer },
  { emoji: '🔗', title: 'Linked List Lab', subject: 'Data Structures', desc: 'Nodes and pointers you can actually see. Insert in O(1), search by walking the chain.', C: LinkedListVisualizer },
  { emoji: '⚙️', title: 'Infix ⇄ Postfix Machine', subject: 'Data Structures', desc: 'Type any expression, step through the stack algorithm — the exam classic.', C: InfixPostfixLab },
  { emoji: '🗼', title: 'Tower of Hanoi', subject: 'Data Structures', desc: 'Watch recursion solve the puzzle in exactly 2ⁿ − 1 moves.', C: HanoiVisualizer },
]

// subjects are derived from the tools — new subjects appear automatically
const SUBJECTS = ['All', ...Array.from(new Set(TOOLS.map(t => t.subject)))]

export default function ToolsPage() {
  const [subject, setSubject] = useState('All')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TOOLS.filter(t =>
      (subject === 'All' || t.subject === subject) &&
      (q === '' || t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q))
    )
  }, [subject, query])

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />
      <div style={{ padding: '32px 20px', maxWidth: 1080, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: -0.5 }}>🧰 Interactive Tools</h1>
        <p style={{ fontSize: 14, opacity: 0.65, margin: '0 0 20px' }}>
          Every tool from the lessons, in one playground. Filter by subject or search — no signup needed.
        </p>

        {/* search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: 15 }}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools…"
            style={{
              width: '100%', boxSizing: 'border-box', padding: '12px 14px 12px 40px',
              borderRadius: 12, border: '1px solid var(--card-border)',
              background: 'var(--card-bg)', color: 'var(--foreground)', fontSize: 14,
            }}
          />
        </div>

        {/* subject filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
          {SUBJECTS.map(s => {
            const active = subject === s
            const count = s === 'All' ? TOOLS.length : TOOLS.filter(t => t.subject === s).length
            return (
              <button key={s} onClick={() => setSubject(s)}
                style={{
                  fontSize: 12.5, fontWeight: 700, padding: '7px 15px', borderRadius: 999, cursor: 'pointer',
                  border: active ? '1px solid var(--accent)' : '1px solid var(--card-border)',
                  background: active ? 'var(--accent)' : 'var(--card-bg)',
                  color: active ? '#fff' : 'var(--foreground)',
                }}>
                {s} <span style={{ opacity: 0.55 }}>· {count}</span>
              </button>
            )
          })}
        </div>

        {/* card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {shown.map(({ emoji, title, subject: subj, desc, C }) => {
            const isOpen = open === title
            return (
              <div key={title}
                style={{
                  gridColumn: isOpen ? '1 / -1' : 'auto',
                  border: '1px solid var(--card-border)', borderRadius: 16,
                  background: 'var(--card-bg)', overflow: 'hidden',
                  transition: 'border-color .15s',
                }}>
                <button
                  onClick={() => setOpen(isOpen ? null : title)}
                  style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none',
                    background: 'none', color: 'var(--foreground)', padding: 18,
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ fontSize: 20 }}>{emoji}</span> {title}
                    </span>
                    <span style={{ fontSize: 20, opacity: 0.5, lineHeight: 1 }}>{isOpen ? '×' : '+'}</span>
                  </div>
                  <span style={{
                    fontSize: 10.5, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase',
                    color: 'var(--accent)', opacity: 0.9,
                  }}>{subj}</span>
                  <span style={{ fontSize: 12.5, opacity: 0.68, lineHeight: 1.55 }}>{desc}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 18px 18px', borderTop: '1px dashed var(--card-border)', marginTop: 2, paddingTop: 16 }}>
                    <C />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {shown.length === 0 && (
          <p style={{ textAlign: 'center', opacity: 0.5, fontSize: 14, padding: '40px 0' }}>
            No tools match "{query}". Try another search or subject.
          </p>
        )}

        <Footer />
      </div>
    </div>
  )
}
