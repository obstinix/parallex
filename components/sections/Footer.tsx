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
      <p style={{
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        fontWeight: 500,
      }}>
        © {new Date().getFullYear()} Depth — Built with{' '}
        <span style={{ color: 'var(--accent)' }}>Antigravity</span>
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {[
          { label: 'GitHub', href: 'https://github.com/obstinix/parallex' },
          { label: 'Source', href: 'https://github.com/obstinix/parallex' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
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
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
