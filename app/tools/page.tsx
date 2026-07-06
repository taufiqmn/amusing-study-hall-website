'use client'

import SiteHeader from '@/components/SiteHeader'
import Footer from '@/components/Footer'
import { Accordion } from '@/components/Accordion'
import ArrayVisualizer from '@/components/interactive/ArrayVisualizer'
import ComplexityLab from '@/components/interactive/ComplexityLab'
import SortVisualizer from '@/components/interactive/SortVisualizer'
import SearchVisualizer from '@/components/interactive/SearchVisualizer'
import StackVisualizer from '@/components/interactive/StackVisualizer'
import StackPlayground from '@/components/interactive/StackPlayground'
import QueueVisualizer from '@/components/interactive/QueueVisualizer'
import LinkedListVisualizer from '@/components/interactive/LinkedListVisualizer'
import InfixPostfixLab from '@/components/interactive/InfixPostfixLab'
import HanoiVisualizer from '@/components/interactive/HanoiVisualizer'

const TOOLS = [
  { emoji: '🧪', title: 'Array Playground', desc: 'Declare an array and watch boxes appear. Insert, delete, reverse — see every shift.', C: ArrayVisualizer },
  { emoji: '⏱', title: 'Complexity Lab', desc: 'Paste any code and get an estimated Big-O with reasons and a growth table.', C: ComplexityLab },
  { emoji: '📊', title: 'Sorting Visualizer', desc: 'Bubble, Selection and Insertion sort — animated bars with compare & swap counters.', C: SortVisualizer },
  { emoji: '🔍', title: 'Search Race', desc: 'Linear vs Binary search on the same data. Watch BEG, MID, END do their thing.', C: SearchVisualizer },
  { emoji: '🥞', title: 'Stack Playground', desc: 'Build a stack of your OWN size and watch a hand drop plates as code runs line by line.', C: StackPlayground },
  { emoji: '🥞', title: 'Stack Machine', desc: 'Push, pop and peek — and trigger real overflow & underflow errors safely.', C: StackVisualizer },
  { emoji: '🚶', title: 'Queue Simulator', desc: 'Linear vs Circular queue with FRONT/REAR pointers. See why circular exists.', C: QueueVisualizer },
  { emoji: '🔗', title: 'Linked List Lab', desc: 'Nodes and pointers you can actually see. Insert in O(1), search by walking the chain.', C: LinkedListVisualizer },
  { emoji: '🧮', title: 'Infix ⇄ Postfix Machine', desc: 'Type any expression, step through the stack algorithm — the exam classic.', C: InfixPostfixLab },
  { emoji: '🗼', title: 'Tower of Hanoi', desc: 'Watch recursion solve the puzzle in exactly 2ⁿ − 1 moves.', C: HanoiVisualizer },
]

export default function ToolsPage() {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <SiteHeader />
      <div style={{ padding: '32px 20px', maxWidth: 860, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', letterSpacing: -0.5 }}>🧰 Interactive Tools</h1>
        <p style={{ fontSize: 14, opacity: 0.65, margin: '0 0 24px' }}>
          Every tool from the lessons, in one playground. Open one and start experimenting — no signup needed.
        </p>

        {TOOLS.map(({ emoji, title, desc, C }, i) => (
          <Accordion key={title} title={`${emoji} ${title}`} defaultOpen={i === 0}>
            <p style={{ fontSize: 12.5, opacity: 0.7, margin: '0 0 12px' }}>{desc}</p>
            <C />
          </Accordion>
        ))}

        <Footer />
      </div>
    </div>
  )
}
