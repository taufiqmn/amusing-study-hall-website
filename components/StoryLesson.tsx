'use client'

import React from 'react'

// ============================================================
// StoryLesson — presentation-style lesson engine.
// Matches the SystemOfEquations chalkboard style:
//   hero → 📓 Class Notes | 🧩 Quizzes | 📝 Long Question tabs
//   (top AND bottom) → numbered story chapters with think-boxes,
//   comparison cards, clickable case explorers, inline checkpoints
//   and embedded interactive machines.
//
// Driven entirely by JSON in lessons.sections:
//   [{ "type": "story", "hero": {...}, "chapters": [...], "long": [...] }]
// ============================================================

import { useState } from 'react'
import Quiz from '@/components/Quiz'
import ArrayVisualizer from '@/components/interactive/ArrayVisualizer'
import ComplexityLab from '@/components/interactive/ComplexityLab'
import SortVisualizer from '@/components/interactive/SortVisualizer'
import SearchVisualizer from '@/components/interactive/SearchVisualizer'
import StackVisualizer from '@/components/interactive/StackVisualizer'
import StackPlayground from '@/components/interactive/StackPlayground'
import SqlPlayground from '@/components/interactive/SqlPlayground'
import RelAlgebra from '@/components/interactive/RelAlgebra'
import QueryTracer from '@/components/interactive/QueryTracer'
import CircularQueueRing from '@/components/interactive/CircularQueueRing'
import QueueTicketAnim from '@/components/interactive/QueueTicketAnim'
import InfixConvertLab from '@/components/interactive/InfixConvertLab'
import StackAutoPlay from '@/components/interactive/StackAutoPlay'
import StackOpDemo from '@/components/interactive/StackOpDemo'
import CircularQueueLab from '@/components/interactive/CircularQueueLab'
import CodeTryBox from '@/components/CodeTryBox'
import QueueVisualizer from '@/components/interactive/QueueVisualizer'
import LinkedListVisualizer from '@/components/interactive/LinkedListVisualizer'
import InfixPostfixLab from '@/components/interactive/InfixPostfixLab'
import HanoiVisualizer from '@/components/interactive/HanoiVisualizer'
import styles from './StoryLesson.module.css'

const INTERACTIVE: Record<string, React.ComponentType<any>> = {
  'array-visualizer': ArrayVisualizer,
  'complexity-lab': ComplexityLab,
  'sort-visualizer': SortVisualizer,
  'search-visualizer': SearchVisualizer,
  'stack-visualizer': StackVisualizer,
  'stack-playground': StackPlayground,
  'sql-playground': SqlPlayground,
  'rel-algebra': RelAlgebra,
  'query-tracer': QueryTracer,
  'circular-queue-ring': CircularQueueRing,
  'queue-ticket-anim': QueueTicketAnim,
  'infix-convert-lab': InfixConvertLab,
  'stack-autoplay': StackAutoPlay,
  'stack-op-demo': StackOpDemo,
  'circular-queue-lab': CircularQueueLab,
  'queue-visualizer': QueueVisualizer,
  'linkedlist-visualizer': LinkedListVisualizer,
  'infix-postfix-lab': InfixPostfixLab,
  'hanoi-visualizer': HanoiVisualizer,
}

const CASE_COLORS: Record<string, string> = { teal: '#4FC3A1', coral: '#e25c5c', gold: '#F3CB4B', accent: 'var(--accent)' }

// Mini markup: **gold highlight** __teal highlight__ `code chip`

// ---- Bengali toggle ----
// Class notes only. Every text field may carry a `bn` twin:
//    {"b":"p","text":"English…","bn":"বাংলা…"}
// Missing bn -> falls back to English, so migration can be lesson-by-lesson.
const LangCtx = React.createContext<'en' | 'bn'>('en')

function useT() {
  const lang = React.useContext(LangCtx)
  return (en?: string, bn?: string) => (lang === 'bn' && bn ? bn : en)
}

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

function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`)/g)
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('**')) return <strong key={i} className={styles.hl}>{p.slice(2, -2)}</strong>
        if (p.startsWith('__')) return <strong key={i} className={styles.hl2}>{p.slice(2, -2)}</strong>
        if (p.startsWith('`')) return <code key={i} className={styles.chip}>{p.slice(1, -1)}</code>
        return <span key={i}>{p}</span>
      })}
    </>
  )
}

function Checkpoint({ q, options, correct, explain }: { q: string; options: string[]; correct: number; explain: string }) {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  return (
    <div className={styles.check}>
      <p className={styles.checkTag}>✋ Quick check — answer before scrolling on!</p>
      <p className={styles.checkQ}><Rich text={q} /></p>
      <div className={styles.checkOpts}>
        {options.map((o, i) => (
          <button
            key={i}
            onClick={() => !answered && setPicked(i)}
            className={`${styles.checkOpt} ${answered && i === correct ? styles.optRight : ''} ${answered && i === picked && i !== correct ? styles.optWrong : ''}`}
          >
            {o}
          </button>
        ))}
      </div>
      {answered && (
        <p className={styles.checkExplain}>
          {picked === correct ? '✅ Exactly! ' : '❌ Not quite — '}
          <Rich text={explain} />
        </p>
      )}
    </div>
  )
}

function CasesExplorer({ items }: { items: { label: string; content: string; verdict: string; color?: string }[] }) {
  const [active, setActive] = useState(0)
  const cur = items[active]
  const color = CASE_COLORS[cur.color || 'accent'] || 'var(--accent)'
  return (
    <div className={styles.cases}>
      <div className={styles.caseBtns}>
        {items.map((it, i) => (
          <button key={i} onClick={() => setActive(i)} className={`${styles.caseBtn} ${i === active ? styles.caseBtnActive : ''}`}>
            {it.label}
          </button>
        ))}
      </div>
      <pre className={styles.caseContent} style={{ borderColor: color }}>{cur.content}</pre>
      <p className={styles.caseVerdict} style={{ color }}>▸ <Rich text={cur.verdict} /></p>
    </div>
  )
}

function ChapterBlock({ block }: { block: any }) {
  const t = useT()
  switch (block.b) {
    case 'p':
      return <p className={styles.p}><Rich text={t(block.text, block.bn)!} /></p>
    case 'eq': {
      // Single-line: centered math (matrix lessons).
      // Multi-line: preserve whitespace, left-align (ASCII tables, diagrams).
      const eqText = t(block.text, block.bn)!
      const multiline = typeof eqText === 'string' && eqText.includes('\n')
      return multiline
        ? <pre className={styles.eqBlock}>{eqText}</pre>
        : <div className={styles.eq}>{eqText}</div>
    }
    case 'code':
      return (
        <div>
          <pre className={styles.code}>{block.code}</pre>
          {block.caption && <p className={styles.caption}><Rich text={t(block.caption, block.captionBn)!} /></p>}
        </div>
      )
    case 'think':
      return (
        <div className={styles.think}>
          <span className={styles.who}>{block.who || 'Now think —'}</span> <Rich text={t(block.text, block.bn)!} />
        </div>
      )
    case 'cards':
      return (
        <div className={styles.cardsGrid}>
          {block.items.map((c: any, i: number) => (
            <div key={i} className={styles.progCard}>
              <div className={styles.cardLabel}>{c.label}</div>
              {c.body && <div className={styles.cardBody}><Rich text={c.body} /></div>}
              {c.verdict && <div className={styles.cardVerdict}><Rich text={c.verdict} /></div>}
            </div>
          ))}
        </div>
      )
    case 'list': {
      const bnActive = t('en','bn') === 'bn'
      const items = bnActive && block.itemsBn?.length ? block.itemsBn : block.items
      return (
        <ul className={styles.list}>
          {items.map((it: string, i: number) => <li key={i}><Rich text={it} /></li>)}
        </ul>
      )
    }
    case 'video': {
      const src = ytEmbed(block.url)
      if (!src) {
        return block.url
          ? <p className={styles.p}><a href={block.url} target="_blank" rel="noopener noreferrer">▶ Watch the video</a></p>
          : null
      }
      return (
        <div className={styles.videoWrap}>
          {block.title && <p className={styles.videoTitle}>🎬 <Rich text={block.title} /></p>}
          <div className={styles.videoFrame}>
            <iframe
              src={src}
              title={block.title || 'Lesson video'}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {block.caption && <p className={styles.videoCaption}><Rich text={block.caption} /></p>}
        </div>
      )
    }
    case 'note':
      return <div className={styles.note}>💡 <Rich text={t(block.text, block.bn)!} /></div>
    case 'cases':
      return <CasesExplorer items={block.items} />
    case 'check':
      return <Checkpoint q={block.q} options={block.options} correct={block.correct} explain={block.explain} />
    case 'interactive': {
      const Tool = INTERACTIVE[block.name]
      if (!Tool) return null
      return (
        <div className={styles.toolWrap}>
          {block.caption && <p className={styles.toolCaption}>🕹 <Rich text={block.caption} /></p>}
          <Tool {...(block.props || {})} />
        </div>
      )
    }
    default:
      return null
  }
}

function LongQuestions({ items }: { items: any[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const diffColor: Record<string, string> = { easy: '#4FC3A1', medium: '#F3CB4B', hard: '#e25c5c' }
  if (!items || items.length === 0) {
    return <p className={styles.p} style={{ textAlign: 'center', opacity: 0.6 }}>Long questions for this lesson are coming soon.</p>
  }
  return (
    <div>
      {items.map((lq, i) => (
        <div key={i} className={styles.longCard}>
          <div className={styles.longHead}>
            <span className={styles.longDiff} style={{ background: diffColor[lq.difficulty] || 'var(--accent)' }}>{lq.difficulty}</span>
            <p className={styles.longQ}><Rich text={lq.q} /></p>
          </div>
          {lq.tryCode !== false && (
            <CodeTryBox
              starter={lq.starter || ''}
              stdin={lq.stdin || ''}
              expected={lq.expected}
            />
          )}
          <button className={styles.revealBtn} onClick={() => setOpen(open === i ? null : i)}>
            {open === i ? 'Hide solution' : '💡 Reveal step-by-step solution'}
          </button>
          {open === i && (
            <div className={styles.longSolution}>
              {(lq.steps || []).map((st: string, j: number) => (
                <p key={j} className={styles.longStep}><b>Step {j + 1}.</b> <Rich text={st} /></p>
              ))}
              {lq.solutionCode && (
                <pre style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderLeft: '3px solid var(--accent)', padding: 12, borderRadius: 8, fontSize: 12.5, overflowX: 'auto', margin: '8px 0' }}>{lq.solutionCode}</pre>
              )}
              {lq.answer && <p className={styles.longAnswer}>✅ <Rich text={lq.answer} /></p>}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function StoryLesson({ data, lessonId }: { data: any; lessonId: string }) {
  const [lang, setLang] = useState<'en' | 'bn'>('en')
  const [tab, setTab] = useState<'notes' | 'quiz' | 'long'>('notes')

  const TabBar = () => (
    <div className={styles.tabbar}>
      <button className={`${styles.tabBtn} ${tab === 'notes' ? styles.tabActive : ''}`} onClick={() => { setTab('notes'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>📓 Class Notes</button>
      <button className={`${styles.tabBtn} ${tab === 'quiz' ? styles.tabActive : ''}`} onClick={() => { setTab('quiz'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>🧩 Quizzes</button>
      <button className={`${styles.tabBtn} ${tab === 'long' ? styles.tabActive : ''}`} onClick={() => { setTab('long'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>📝 Long Question</button>
    </div>
  )

  return (
    <LangCtx.Provider value={lang}>
    <div className={styles.wrap}>
      <div className={styles.hero}>
        <div className={styles.heroTop}>
          {data.hero?.eyebrow && <div className={styles.eyebrow}>{data.hero.eyebrow}</div>}
          <button
            className={styles.langBtn}
            onClick={() => setLang(l => (l === 'en' ? 'bn' : 'en'))}
            title="Switch class-note language"
          >
            {lang === 'en' ? '🇧🇩 বাংলা' : '🇬🇧 English'}
          </button>
        </div>
        <h1 className={styles.title}>{lang === 'bn' && data.hero?.titleBn ? data.hero.titleBn : data.hero?.title}</h1>
        {data.hero?.sub && <p className={styles.sub}><Rich text={data.hero.sub} /></p>}
        <div className={styles.rule} />
      </div>

      <TabBar />

      {tab === 'notes' && (
        <>
          {(data.chapters || []).map((ch: any, i: number) => (
            <div key={i}>
              <section className={styles.section}>
                <span className={styles.tag}>{lang === 'bn' && ch.tagBn ? ch.tagBn : ch.tag}</span>
                <h2 className={styles.h2}><Rich text={lang === 'bn' && ch.titleBn ? ch.titleBn : ch.title} /></h2>
                {(ch.blocks || []).map((b: any, j: number) => <ChapterBlock key={j} block={b} />)}
              </section>
              {i < data.chapters.length - 1 && <div className={styles.dots}>• • •</div>}
            </div>
          ))}
        </>
      )}

      {tab === 'quiz' && (
        <div className={styles.quizWrap}>
          <Quiz lessonId={lessonId} />
        </div>
      )}

      {tab === 'long' && <LongQuestions items={data.long} />}

      <TabBar />
    </div>
    </LangCtx.Provider>
  )
}
