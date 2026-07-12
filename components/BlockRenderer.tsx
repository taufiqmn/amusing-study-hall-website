'use client'

// Renders lesson content stored in the `lessons.sections` jsonb column.
// v2: adds "interactive" (live tools), "problem" (practice with reveal
// solution), and "link" (jump to another course/lesson) block types.

import { useState } from 'react'
import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'
import ArrayVisualizer from '@/components/interactive/ArrayVisualizer'
import ComplexityLab from '@/components/interactive/ComplexityLab'
import SortVisualizer from '@/components/interactive/SortVisualizer'
import SearchVisualizer from '@/components/interactive/SearchVisualizer'
import StackVisualizer from '@/components/interactive/StackVisualizer'
import StackPlayground from '@/components/interactive/StackPlayground'
import SqlPlayground from '@/components/interactive/SqlPlayground'
import SqlChallenge from '@/components/interactive/SqlChallenge'
import RelAlgebra from '@/components/interactive/RelAlgebra'
import QueryTracer from '@/components/interactive/QueryTracer'
import CircularQueueRing from '@/components/interactive/CircularQueueRing'
import QueueTicketAnim from '@/components/interactive/QueueTicketAnim'
import InfixConvertLab from '@/components/interactive/InfixConvertLab'
import StackAutoPlay from '@/components/interactive/StackAutoPlay'
import QueueVisualizer from '@/components/interactive/QueueVisualizer'
import LinkedListVisualizer from '@/components/interactive/LinkedListVisualizer'
import InfixPostfixLab from '@/components/interactive/InfixPostfixLab'
import HanoiVisualizer from '@/components/interactive/HanoiVisualizer'

// Registry: add new tools here, then use them from lesson JSON with
// { "type": "interactive", "name": "array-visualizer" }
const INTERACTIVE: Record<string, React.ComponentType<any>> = {
  'array-visualizer': ArrayVisualizer,
  'complexity-lab': ComplexityLab,
  'sort-visualizer': SortVisualizer,
  'search-visualizer': SearchVisualizer,
  'stack-visualizer': StackVisualizer,
  'stack-playground': StackPlayground,
  'sql-playground': SqlPlayground,
  'sql-challenge': SqlChallenge,
  'rel-algebra': RelAlgebra,
  'query-tracer': QueryTracer,
  'circular-queue-ring': CircularQueueRing,
  'queue-ticket-anim': QueueTicketAnim,
  'infix-convert-lab': InfixConvertLab,
  'stack-autoplay': StackAutoPlay,
  'queue-visualizer': QueueVisualizer,
  'linkedlist-visualizer': LinkedListVisualizer,
  'infix-postfix-lab': InfixPostfixLab,
  'hanoi-visualizer': HanoiVisualizer,
}

export type ContentBlock = { type: string; [key: string]: any }


// Accepts any YouTube URL form and returns a privacy-friendly embed URL.
//   youtu.be/ID · watch?v=ID · /embed/ID · /shorts/ID · already-an-embed
function ytEmbed(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{6,})/,
    /(?:youtu\.be\/)([\w-]{6,})/,
    /(?:youtube(?:-nocookie)?\.com\/embed\/)([\w-]{6,})/,
    /(?:youtube\.com\/shorts\/)([\w-]{6,})/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&modestbranding=1`
  }
  return null   // not a YouTube URL: caller falls back to a plain link
}

function Solution({ code, note }: { code?: string; note?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginTop: 10 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: '1px solid var(--card-border)', background: open ? 'var(--accent)' : 'var(--pill-bg)', color: open ? 'white' : 'var(--accent)', cursor: 'pointer' }}
      >
        {open ? 'Hide solution' : '💡 Reveal solution'}
      </button>
      {open && (
        <div style={{ marginTop: 10 }}>
          {code && (
            <pre style={{ background: 'var(--background)', border: '1px solid var(--card-border)', padding: 12, borderRadius: 8, fontSize: 12.5, overflowX: 'auto', margin: '0 0 8px' }}>{code}</pre>
          )}
          {note && <p style={{ fontSize: 12.5, lineHeight: 1.7, margin: 0, opacity: 0.85 }}>🧠 {note}</p>}
        </div>
      )}
    </div>
  )
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return <h3 style={{ fontSize: 15, fontWeight: 800, margin: '18px 0 8px' }}>{block.text}</h3>

    case 'text':
      return <p style={{ fontSize: 13, lineHeight: 1.75, margin: '0 0 10px' }}>{block.text}</p>

    case 'code':
      return (
        <pre style={{ background: 'var(--background)', border: '1px solid var(--card-border)', padding: 12, borderRadius: 8, fontSize: 13, overflowX: 'auto', margin: '0 0 10px' }}>{block.code}</pre>
      )

    case 'video': {
      const src = ytEmbed(block.url)
      if (!src) {
        return block.url
          ? <p style={{ fontSize: 13, margin: '0 0 10px' }}><a href={block.url} target="_blank" rel="noopener noreferrer">▶ Watch the video</a></p>
          : null
      }
      return (
        <div style={{ margin: '6px 0 16px' }}>
          {block.title && <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', margin: '0 0 8px' }}>🎬 {block.title}</p>}
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--card-border)', background: '#000' }}>
            <iframe
              src={src}
              title={block.title || 'Lesson video'}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          </div>
          {block.caption && <p style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.65, margin: '8px 2px 0' }}>{block.caption}</p>}
        </div>
      )
    }
    case 'note':
      return (
        <div style={{ borderLeft: '3px solid var(--accent)', background: 'var(--pill-bg)', padding: '10px 14px', borderRadius: '0 10px 10px 0', margin: '0 0 10px' }}>
          <p style={{ fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>💡 {block.text}</p>
        </div>
      )

    case 'reveal':
      return <RevealQuestion question={block.question} answer={block.answer} />

    case 'matrix':
      return (
        <div style={{ margin: '0 0 10px' }}>
          <MatrixDisplay data={block.data} />
        </div>
      )

    case 'list':
      return (
        <ul style={{ fontSize: 13, lineHeight: 1.8, margin: '0 0 10px', paddingLeft: 20 }}>
          {(block.items || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
        </ul>
      )

    case 'image':
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={block.src} alt={block.alt || ''} style={{ maxWidth: '100%', borderRadius: 10, margin: '0 0 10px' }} />

    case 'link':
      return (
        <a href={block.href} style={{ display: 'inline-block', fontSize: 13, fontWeight: 700, padding: '10px 18px', background: 'var(--pill-bg)', border: '1px solid var(--card-border)', color: 'var(--accent)', borderRadius: 10, textDecoration: 'none', margin: '0 0 10px' }}>
          {block.text || 'Open →'}
        </a>
      )

    case 'interactive': {
      const Tool = INTERACTIVE[block.name]
      if (!Tool) return <p style={{ fontSize: 12, opacity: 0.6 }}>Tool "{block.name}" not found.</p>
      return (
        <div style={{ margin: '0 0 14px' }}>
          <Tool {...(block.props || {})} />
        </div>
      )
    }

    case 'problem':
      return (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '14px 16px', margin: '0 0 12px' }}>
          <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>
            {block.n != null ? `Problem ${block.n}: ` : '📝 '}{block.question}
          </p>
          {(block.sampleInput || block.sampleOutput) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 4 }}>
              <div style={{ background: 'var(--background)', borderRadius: 8, padding: 10 }}>
                <p style={{ fontSize: 10.5, fontWeight: 800, opacity: 0.55, margin: '0 0 4px', textTransform: 'uppercase' }}>Sample input</p>
                <pre style={{ fontSize: 12, margin: 0, whiteSpace: 'pre-wrap' }}>{block.sampleInput}</pre>
              </div>
              <div style={{ background: 'var(--background)', borderRadius: 8, padding: 10 }}>
                <p style={{ fontSize: 10.5, fontWeight: 800, opacity: 0.55, margin: '0 0 4px', textTransform: 'uppercase' }}>Sample output</p>
                <pre style={{ fontSize: 12, margin: 0, whiteSpace: 'pre-wrap' }}>{block.sampleOutput}</pre>
              </div>
            </div>
          )}
          {block.hint && <p style={{ fontSize: 12, opacity: 0.7, margin: '6px 0 0' }}>💭 Hint: {block.hint}</p>}
          {(block.solutionCode || block.solutionNote) && <Solution code={block.solutionCode} note={block.solutionNote} />}
        </div>
      )

    case 'accordion':
      return (
        <Accordion title={block.title} defaultOpen={block.open}>
          {(block.blocks || []).map((b: ContentBlock, i: number) => <Block key={i} block={b} />)}
        </Accordion>
      )

    default:
      return null
  }
}

export default function BlockRenderer({ sections }: { sections: ContentBlock[] }) {
  if (!Array.isArray(sections) || sections.length === 0) return null
  return (
    <div>
      {sections.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}
