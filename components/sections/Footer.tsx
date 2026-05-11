'use client'

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem var(--gutter)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
      }}
    >
      <span>© 2026 obstinix — All rights reserved</span>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <a
          href="https://github.com/obstinix/parallex"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.color = 'var(--text-secondary)'
          }}
        >
          GITHUB
        </a>
        <a
          href="https://github.com/obstinix/parallex/tree/main"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.color = 'var(--accent)'
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.color = 'var(--text-secondary)'
          }}
        >
          SOURCE
        </a>
      </div>
    </footer>
  )
}
