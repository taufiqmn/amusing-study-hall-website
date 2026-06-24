export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--card-border)',
        marginTop: 40,
        padding: '24px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>
        © {new Date().getFullYear()} Amusing Study Hall
      </p>

      <div style={{ display: 'flex', gap: 12 }}>
        <a href="https://www.youtube.com/@amusingstudyhall" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--accent)' }}>
          YouTube
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--accent)' }}>
          Facebook
        </a>
      </div>

      <button
        style={{
          fontSize: 12,
          padding: '6px 14px',
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 8,
          cursor: 'pointer',
        }}
      >
        Help / Query
      </button>
    </footer>
  )
}