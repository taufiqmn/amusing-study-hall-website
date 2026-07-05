'use client'

import { useRef, useState } from 'react'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<number[]>([10, 20, 30])
  const [input, setInput] = useState('5')
  const [hl, setHl] = useState<number | null>(null)
  const [msg, setMsg] = useState('Each node = [ data | next ]. START points to the first node; the last node points to NULL.')
  const busyRef = useRef(false)

  const insertFirst = () => {
    if (busyRef.current) return
    const v = parseInt(input); if (isNaN(v)) return
    if (nodes.length >= 7) { setMsg('List is long enough for the demo — delete some nodes first 🙂'); return }
    setNodes((n) => [v, ...n])
    setHl(0)
    setMsg(`✅ Insert ${v} at FRONT: new node's next → old START, then START → new node. No shifting — that's the magic of linked lists! O(1)`)
    setTimeout(() => setHl(null), 800)
  }

  const insertLast = () => {
    if (busyRef.current) return
    const v = parseInt(input); if (isNaN(v)) return
    if (nodes.length >= 7) { setMsg('List is long enough for the demo — delete some nodes first 🙂'); return }
    setNodes((n) => [...n, v])
    setHl(nodes.length)
    setMsg(`✅ Insert ${v} at END: walk to the last node, set its next → new node, new node's next → NULL.`)
    setTimeout(() => setHl(null), 800)
  }

  const deleteFirst = () => {
    if (busyRef.current) return
    if (nodes.length === 0) { setMsg('🚫 The list is empty (START = NULL) — nothing to delete.'); return }
    const v = nodes[0]
    setHl(0)
    setTimeout(() => { setNodes((n) => n.slice(1)); setHl(null) }, 400)
    setMsg(`✅ Delete first: START simply moves to the second node. Node with ${v} is gone. Again O(1)!`)
  }

  const search = async () => {
    if (busyRef.current) return
    const v = parseInt(input); if (isNaN(v)) return
    busyRef.current = true
    setMsg(`Searching for ${v}: PTR starts at START, follows the arrows one by one...`)
    for (let i = 0; i < nodes.length; i++) {
      setHl(i)
      await sleep(650)
      if (nodes[i] === v) {
        setMsg(`✅ Found ${v} at node ${i + 1}! Notice: unlike arrays, there's no jumping to index — we HAD to walk the chain. Sequential access only.`)
        busyRef.current = false
        setTimeout(() => setHl(null), 900)
        return
      }
    }
    setHl(null)
    setMsg(`❌ PTR reached NULL — ${v} is not in the list.`)
    busyRef.current = false
  }

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 16 }}>
      <p style={{ fontSize: 13, fontWeight: 800, margin: '0 0 10px' }}>🔗 Linked List Lab</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} style={{ width: 60, fontSize: 12, padding: '8px 10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)' }} />
        <button onClick={insertFirst} style={{ fontSize: 12, fontWeight: 700, padding: '8px 12px', borderRadius: 8, border: 'none', background: '#4FC3A1', color: 'white', cursor: 'pointer' }}>Insert first</button>
        <button onClick={insertLast} style={{ fontSize: 12, fontWeight: 700, padding: '8px 12px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: 'white', cursor: 'pointer' }}>Insert last</button>
        <button onClick={deleteFirst} style={{ fontSize: 12, fontWeight: 700, padding: '8px 12px', borderRadius: 8, border: 'none', background: '#e25c5c', color: 'white', cursor: 'pointer' }}>Delete first</button>
        <button onClick={search} style={{ fontSize: 12, fontWeight: 700, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--background)', color: 'var(--foreground)', cursor: 'pointer' }}>🔍 Search</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)' }}>START ➜</span>
        {nodes.map((v, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', border: `2px solid ${hl === i ? '#F3CB4B' : 'var(--card-border)'}`, borderRadius: 10, overflow: 'hidden', transition: 'all 0.3s', background: hl === i ? 'rgba(243,203,75,0.15)' : 'var(--background)' }}>
              <div style={{ padding: '10px 12px', fontSize: 13, fontWeight: 800, color: 'var(--foreground)' }}>{v}</div>
              <div style={{ padding: '10px 8px', fontSize: 11, borderLeft: '1.5px solid var(--card-border)', color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>●</div>
            </div>
            <span style={{ fontSize: 14, opacity: 0.6 }}>➜</span>
          </div>
        ))}
        <span style={{ fontSize: 11, fontWeight: 800, opacity: 0.5, border: '1.5px dashed var(--card-border)', padding: '8px 10px', borderRadius: 8 }}>NULL</span>
      </div>

      <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 10, padding: 10 }}>
        <p style={{ fontSize: 12, margin: 0, lineHeight: 1.6 }}>{msg}</p>
      </div>
    </div>
  )
}
