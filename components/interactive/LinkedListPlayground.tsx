'use client'

import { useState, useRef, useEffect, useMemo } from 'react'

type Op = 'front' | 'end' | 'pos-insert' | 'delete-first' | 'delete-pos' | 'search'

type Step = {
  line: number
  nodes: number[]
  ptrIdx: number | null
  stagingIdx: number | null   // index in `nodes` that is a not-yet-linked-in new node (dashed gold)
  deleteIdx: number | null    // index in `nodes` about to be removed (red highlight)
  foundIdx: number | null     // index in `nodes` that matched a search (green highlight)
  note: string
}

const CODE: Record<Op, string[]> = {
  front: [
    'Node* newNode = malloc(sizeof(Node));',
    'newNode->data = item;',
    'newNode->next = start;',
    'start = newNode;',
  ],
  end: [
    'Node* newNode = malloc(sizeof(Node));',
    'newNode->data = item;',
    'newNode->next = NULL;',
    'if (start == NULL) { start = newNode; return; }',
    'Node* temp = start;',
    'while (temp->next != NULL)',
    '    temp = temp->next;',
    'temp->next = newNode;',
  ],
  'pos-insert': [
    'Node* newNode = malloc(sizeof(Node));',
    'newNode->data = item;',
    'Node* temp = start;',
    'for (i = 0; i < k-1; i++)',
    '    temp = temp->next;',
    'newNode->next = temp->next;',
    'temp->next = newNode;',
  ],
  'delete-first': [
    'Node* temp = start;',
    'start = start->next;',
    'free(temp);',
  ],
  'delete-pos': [
    'Node* temp = start;',
    'for (i = 0; i < k-1; i++)',
    '    temp = temp->next;',
    'Node* toDelete = temp->next;',
    'temp->next = toDelete->next;',
    'free(toDelete);',
  ],
  search: [
    'Node* ptr = start;',
    'int pos = 0;',
    'while (ptr != NULL) {',
    '    if (ptr->data == item) return pos;',
    '    ptr = ptr->next;',
    '    pos++;',
    '}',
    'return -1;',
  ],
}

function withStaging(nodes: number[], idx: number, val: number) {
  return [...nodes.slice(0, idx), val, ...nodes.slice(idx)]
}

function blankStep(partial: Partial<Step> & { line: number; nodes: number[]; note: string }): Step {
  return { ptrIdx: null, stagingIdx: null, deleteIdx: null, foundIdx: null, ...partial }
}

function buildFront(nodes: number[], val: number): Step[] {
  return [
    blankStep({ line: 0, nodes, note: 'Allocate memory for a brand-new node (malloc).' }),
    blankStep({ line: 1, nodes: withStaging(nodes, 0, val), stagingIdx: 0, note: `Set newNode->data = ${val}.` }),
    blankStep({ line: 2, nodes: withStaging(nodes, 0, val), stagingIdx: 0, note: 'newNode->next = START → point the new node at the current first node.' }),
    blankStep({ line: 3, nodes: [val, ...nodes], ptrIdx: 0, note: 'START = newNode → the new node is now officially first. No shifting needed — O(1)!' }),
  ]
}

function buildEnd(nodes: number[], val: number): Step[] {
  const steps: Step[] = [
    blankStep({ line: 0, nodes, note: 'Allocate memory for a brand-new node (malloc).' }),
    blankStep({ line: 1, nodes: withStaging(nodes, nodes.length, val), stagingIdx: nodes.length, note: `Set newNode->data = ${val}.` }),
    blankStep({ line: 2, nodes: withStaging(nodes, nodes.length, val), stagingIdx: nodes.length, note: 'newNode->next = NULL — it will become the new last node.' }),
  ]
  if (nodes.length === 0) {
    steps.push(blankStep({ line: 3, nodes: [val], ptrIdx: 0, note: 'start was NULL (empty list) → start = newNode directly.' }))
    return steps
  }
  steps.push(blankStep({ line: 3, nodes: withStaging(nodes, nodes.length, val), stagingIdx: nodes.length, note: 'List is not empty — continue walking to find the last node.' }))
  steps.push(blankStep({ line: 4, nodes: withStaging(nodes, nodes.length, val), stagingIdx: nodes.length, ptrIdx: 0, note: 'temp = start → begin at the first node.' }))
  for (let i = 0; i < nodes.length - 1; i++) {
    steps.push(blankStep({ line: 5, nodes: withStaging(nodes, nodes.length, val), stagingIdx: nodes.length, ptrIdx: i, note: 'temp->next is not NULL — keep walking.' }))
    steps.push(blankStep({ line: 6, nodes: withStaging(nodes, nodes.length, val), stagingIdx: nodes.length, ptrIdx: i + 1, note: 'temp = temp->next → move forward one node.' }))
  }
  steps.push(blankStep({ line: 5, nodes: withStaging(nodes, nodes.length, val), stagingIdx: nodes.length, ptrIdx: nodes.length - 1, note: "temp->next IS NULL now — we've found the last node." }))
  steps.push(blankStep({ line: 7, nodes: [...nodes, val], ptrIdx: nodes.length, note: "temp->next = newNode → attach it after the last node. Done!" }))
  return steps
}

function buildPosInsert(nodes: number[], val: number, k: number): Step[] {
  k = Math.max(0, Math.min(k, nodes.length))
  if (k === 0) return buildFront(nodes, val)
  const steps: Step[] = [
    blankStep({ line: 0, nodes, note: 'Allocate memory for a brand-new node (malloc).' }),
    blankStep({ line: 1, nodes: withStaging(nodes, k, val), stagingIdx: k, note: `Set newNode->data = ${val}.` }),
    blankStep({ line: 2, nodes: withStaging(nodes, k, val), stagingIdx: k, ptrIdx: 0, note: 'temp = start → begin walking from the front.' }),
  ]
  for (let i = 0; i < k - 1; i++) {
    steps.push(blankStep({ line: 3, nodes: withStaging(nodes, k, val), stagingIdx: k, ptrIdx: i, note: `i < k-1 (${i} < ${k - 1}) — keep advancing.` }))
    steps.push(blankStep({ line: 4, nodes: withStaging(nodes, k, val), stagingIdx: k, ptrIdx: i + 1, note: 'temp = temp->next.' }))
  }
  steps.push(blankStep({ line: 3, nodes: withStaging(nodes, k, val), stagingIdx: k, ptrIdx: k - 1, note: `Loop stops — temp now points to the node just before position ${k}.` }))
  steps.push(blankStep({ line: 5, nodes: withStaging(nodes, k, val), stagingIdx: k, ptrIdx: k - 1, note: "newNode->next = temp->next → point the new node at what comes after it." }))
  steps.push(blankStep({ line: 6, nodes: [...nodes.slice(0, k), val, ...nodes.slice(k)], ptrIdx: k, note: 'temp->next = newNode → officially link it in. Done!' }))
  return steps
}

function buildDeleteFirst(nodes: number[]): Step[] {
  if (nodes.length === 0) return [blankStep({ line: 0, nodes, note: '⚠️ List is already empty — nothing to delete.' })]
  return [
    blankStep({ line: 0, nodes, ptrIdx: 0, note: 'temp = start → keep a reference to the node we are about to remove.' }),
    blankStep({ line: 1, nodes: nodes.slice(1), note: 'start = start->next → START now skips the old first node. O(1)!' }),
    blankStep({ line: 2, nodes: nodes.slice(1), note: 'free(temp) → the old first node’s memory is released.' }),
  ]
}

function buildDeletePos(nodes: number[], k: number): Step[] {
  k = Math.max(0, Math.min(k, nodes.length - 1))
  if (k === 0) return buildDeleteFirst(nodes)
  const steps: Step[] = [blankStep({ line: 0, nodes, ptrIdx: 0, note: 'temp = start → begin walking from the front.' })]
  for (let i = 0; i < k - 1; i++) {
    steps.push(blankStep({ line: 1, nodes, ptrIdx: i, note: `i < k-1 (${i} < ${k - 1}) — keep advancing.` }))
    steps.push(blankStep({ line: 2, nodes, ptrIdx: i + 1, note: 'temp = temp->next.' }))
  }
  steps.push(blankStep({ line: 1, nodes, ptrIdx: k - 1, note: `Loop stops — temp points to the node just before position ${k}.` }))
  steps.push(blankStep({ line: 3, nodes, ptrIdx: k - 1, deleteIdx: k, note: 'toDelete = temp->next → mark the node we are about to remove.' }))
  steps.push(blankStep({ line: 4, nodes: nodes.filter((_, i) => i !== k), ptrIdx: k - 1, note: "temp->next = toDelete->next → the list now skips right over it." }))
  steps.push(blankStep({ line: 5, nodes: nodes.filter((_, i) => i !== k), ptrIdx: k - 1, note: 'free(toDelete) → memory released.' }))
  return steps
}

function buildSearch(nodes: number[], val: number): Step[] {
  const steps: Step[] = [blankStep({ line: 0, nodes, ptrIdx: nodes.length > 0 ? 0 : null, note: 'ptr = start, pos = 0 → begin at the front.' })]
  if (nodes.length === 0) {
    steps.push(blankStep({ line: 7, nodes, note: '⚠️ List is empty — ptr is already NULL. Return -1.' }))
    return steps
  }
  for (let i = 0; i < nodes.length; i++) {
    steps.push(blankStep({ line: 3, nodes, ptrIdx: i, note: `Compare ptr->data (${nodes[i]}) with target (${val}).` }))
    if (nodes[i] === val) {
      steps.push(blankStep({ line: 3, nodes, ptrIdx: i, foundIdx: i, note: `✅ Match! ptr->data == ${val} → return pos = ${i}.` }))
      return steps
    }
    steps.push(blankStep({ line: 4, nodes, ptrIdx: i, note: 'Not equal — ptr = ptr->next, pos++.' }))
  }
  steps.push(blankStep({ line: 7, nodes, note: `❌ ptr reached NULL — ${val} is not in the list. Return -1.` }))
  return steps
}

const OP_LABELS: Record<Op, string> = {
  front: 'Insert at Front',
  end: 'Insert at End',
  'pos-insert': 'Insert at Position K',
  'delete-first': 'Delete First',
  'delete-pos': 'Delete at Position K',
  search: 'Search',
}

export default function LinkedListPlayground() {
  const [baseNodes, setBaseNodes] = useState<number[]>([10, 25, 40])
  const [op, setOp] = useState<Op>('front')
  const [val, setVal] = useState('5')
  const [pos, setPos] = useState('1')
  const [steps, setSteps] = useState<Step[] | null>(null)
  const [stepIdx, setStepIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const run = () => {
    const v = parseInt(val) || 0
    const k = parseInt(pos) || 0
    let s: Step[]
    switch (op) {
      case 'front': s = buildFront(baseNodes, v); break
      case 'end': s = buildEnd(baseNodes, v); break
      case 'pos-insert': s = buildPosInsert(baseNodes, v, k); break
      case 'delete-first': s = buildDeleteFirst(baseNodes); break
      case 'delete-pos': s = buildDeletePos(baseNodes, k); break
      case 'search': s = buildSearch(baseNodes, v); break
    }
    setSteps(s)
    setStepIdx(0)
    setPlaying(false)
  }

  useEffect(() => {
    if (playing && steps) {
      timerRef.current = setInterval(() => {
        setStepIdx((i) => {
          if (i >= steps.length - 1) {
            setPlaying(false)
            return i
          }
          return i + 1
        })
      }, 1100)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [playing, steps])

  const commit = () => {
    if (!steps) return
    const finalNodes = steps[steps.length - 1].nodes
    setBaseNodes(finalNodes)
    setSteps(null)
  }

  const current = steps ? steps[stepIdx] : null
  const code = CODE[op]

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 18 }}>
      <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 12px' }}>🔗 Linked List Playground — code-synced</p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        <select value={op} onChange={(e) => { setOp(e.target.value as Op); setSteps(null) }} style={selStyle}>
          {(Object.keys(OP_LABELS) as Op[]).map((o) => <option key={o} value={o}>{OP_LABELS[o]}</option>)}
        </select>
        {(op === 'front' || op === 'end' || op === 'pos-insert' || op === 'search') && (
          <input value={val} onChange={(e) => setVal(e.target.value.replace(/[^0-9]/g, ''))} placeholder="value" style={inpStyle} />
        )}
        {(op === 'pos-insert' || op === 'delete-pos') && (
          <input value={pos} onChange={(e) => setPos(e.target.value.replace(/[^0-9]/g, ''))} placeholder="position K" style={inpStyle} />
        )}
        <button onClick={run} style={btnStyle('var(--accent)')}>Run</button>
      </div>

      {!steps ? (
        <p style={{ fontSize: 12, opacity: 0.6 }}>Pick an operation and click Run to see the code execute line by line.</p>
      ) : (
        <>
          {/* Code + Visual split */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 260px', background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 10, fontFamily: 'monospace', fontSize: 12 }}>
              {code.map((line, i) => (
                <div key={i} style={{
                  padding: '3px 8px', borderRadius: 4,
                  background: current?.line === i ? 'var(--accent)' : 'transparent',
                  color: current?.line === i ? '#fff' : 'var(--foreground)',
                  fontWeight: current?.line === i ? 700 : 400,
                  transition: 'all 0.25s', whiteSpace: 'pre',
                }}>
                  {line}
                </div>
              ))}
            </div>

            <div style={{ flex: '1 1 260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', minHeight: 60 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)' }}>START ➜</span>
                {current?.nodes.map((v, i) => {
                  const isStaging = current.stagingIdx === i
                  const isPtr = current.ptrIdx === i
                  const isDelete = current.deleteIdx === i
                  const isFound = current.foundIdx === i
                  const border = isDelete ? '#e05353' : isFound ? '#2e9e5b' : isStaging ? 'var(--accent)' : isPtr ? '#F3CB4B' : 'var(--card-border)'
                  const bg = isDelete ? 'rgba(224,83,83,0.15)' : isFound ? 'rgba(46,158,91,0.15)' : isStaging ? 'rgba(124,77,255,0.12)' : isPtr ? 'rgba(243,203,75,0.15)' : 'var(--background)'
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ display: 'flex', border: `2px ${isStaging ? 'dashed' : 'solid'} ${border}`, borderRadius: 10, overflow: 'hidden', background: bg, transition: 'all 0.3s' }}>
                        <div style={{ padding: '10px 12px', fontSize: 13, fontWeight: 800 }}>{v}</div>
                        <div style={{ padding: '10px 8px', fontSize: 11, borderLeft: '1.5px solid var(--card-border)', display: 'flex', alignItems: 'center' }}>●</div>
                      </div>
                      <span style={{ fontSize: 14, opacity: 0.6 }}>➜</span>
                    </div>
                  )
                })}
                <span style={{ fontSize: 11, fontWeight: 800, opacity: 0.5, border: '1.5px dashed var(--card-border)', padding: '8px 10px', borderRadius: 8 }}>NULL</span>
              </div>
              {current?.ptrIdx !== null && current?.ptrIdx !== undefined && (
                <p style={{ fontSize: 10, color: '#F3CB4B', margin: '2px 0 0', fontWeight: 700 }}>▲ ptr / temp is here</p>
              )}
            </div>
          </div>

          <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 10, marginTop: 12 }}>
            <p style={{ fontSize: 12, margin: 0, lineHeight: 1.6, color: 'var(--accent)', fontWeight: 600 }}>{current?.note}</p>
          </div>

          {/* Step controls */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => { setPlaying(false); setStepIdx((i) => Math.max(0, i - 1)) }} disabled={stepIdx === 0} style={btnStyle(true, stepIdx === 0)}>← Prev</button>
            <span style={{ fontSize: 12, opacity: 0.6 }}>Step {stepIdx + 1} / {steps.length}</span>
            <button onClick={() => { setPlaying(false); setStepIdx((i) => Math.min(steps.length - 1, i + 1)) }} disabled={stepIdx === steps.length - 1} style={btnStyle(true, stepIdx === steps.length - 1)}>Next →</button>
            <button onClick={() => setPlaying((p) => !p)} style={btnStyle('var(--accent)')}>{playing ? '⏸ Pause' : '▶ Auto-play'}</button>
            {stepIdx === steps.length - 1 && op !== 'search' && (
              <button onClick={commit} style={btnStyle('#2e9e5b')}>✓ Apply to list</button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function btnStyle(bgOrGhost: string | boolean, disabled = false): React.CSSProperties {
  const ghost = bgOrGhost === true
  return {
    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
    border: ghost ? '1px solid var(--card-border)' : 'none',
    background: ghost ? 'transparent' : (bgOrGhost as string),
    color: ghost ? 'var(--foreground)' : '#fff',
    opacity: disabled ? 0.4 : 1,
  }
}
const selStyle: React.CSSProperties = { padding: '7px 10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: 12 }
const inpStyle: React.CSSProperties = { width: 70, padding: '7px 10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: 12 }
