'use client'

// Renders lesson content stored in the `lessons.sections` jsonb column.
// From now on, new lessons need ZERO code changes — just insert a row
// in Supabase with a `sections` array like:
//
// [
//   { "type": "accordion", "title": "1. What is a loop?", "blocks": [
//     { "type": "text", "text": "A loop repeats code..." },
//     { "type": "code", "code": "for (int i = 0; i < 5; i++) {\n  printf(\"%d\", i);\n}" },
//     { "type": "note", "text": "The condition is checked BEFORE every iteration." },
//     { "type": "reveal", "question": "How many times does it print?", "answer": "5 times: i = 0,1,2,3,4" },
//     { "type": "matrix", "data": [[1,2],[3,4]] }
//   ]}
// ]

import { Accordion, RevealQuestion } from '@/components/Accordion'
import MatrixDisplay from '@/components/MatrixDisplay'

export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'text'; text: string }
  | { type: 'code'; code: string; language?: string }
  | { type: 'note'; text: string }
  | { type: 'reveal'; question: string; answer: string }
  | { type: 'matrix'; data: number[][] }
  | { type: 'list'; items: string[] }
  | { type: 'image'; src: string; alt?: string }
  | { type: 'accordion'; title: string; blocks: ContentBlock[]; open?: boolean }

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return <h3 style={{ fontSize: 15, fontWeight: 800, margin: '18px 0 8px' }}>{block.text}</h3>

    case 'text':
      return <p style={{ fontSize: 13, lineHeight: 1.75, margin: '0 0 10px' }}>{block.text}</p>

    case 'code':
      return (
        <pre
          style={{
            background: 'var(--background)',
            border: '1px solid var(--card-border)',
            padding: 12,
            borderRadius: 8,
            fontSize: 13,
            overflowX: 'auto',
            margin: '0 0 10px',
          }}
        >
          {block.code}
        </pre>
      )

    case 'note':
      return (
        <div
          style={{
            borderLeft: '3px solid var(--accent)',
            background: 'var(--pill-bg)',
            padding: '10px 14px',
            borderRadius: '0 10px 10px 0',
            margin: '0 0 10px',
          }}
        >
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
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )

    case 'image':
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={block.src} alt={block.alt || ''} style={{ maxWidth: '100%', borderRadius: 10, margin: '0 0 10px' }} />

    case 'accordion':
      return (
        <Accordion title={block.title} defaultOpen={block.open}>
          {block.blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}
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
