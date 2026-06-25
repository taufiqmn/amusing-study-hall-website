export default function MatrixDisplay({ data, label }: { data: number[][]; label?: string }) {
  const rows = data.length
  const cols = data[0]?.length || 0

  return (
    <div style={{ textAlign: 'center', margin: '16px 0' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <div style={{ borderLeft: '3px solid var(--foreground)', borderTop: '3px solid var(--foreground)', borderBottom: '3px solid var(--foreground)', width: 6, height: rows * 30 }} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 36px)`,
            gap: '6px 14px',
            padding: '8px 12px',
            fontSize: 16,
            fontFamily: 'Georgia, serif',
          }}
        >
          {data.flat().map((val, i) => (
            <span key={i} style={{ textAlign: 'center' }}>{val}</span>
          ))}
        </div>
        <div style={{ borderRight: '3px solid var(--foreground)', borderTop: '3px solid var(--foreground)', borderBottom: '3px solid var(--foreground)', width: 6, height: rows * 30 }} />
      </div>
      {label && <p style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>{label}</p>}
    </div>
  )
}