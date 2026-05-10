'use client'

import { useEffect, useRef, useState } from 'react'
import { NAVIGATION } from '@/lib/constants'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { useCursor } from '@/components/providers/CursorProvider'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const { setCursorType, resetCursor } = useCursor()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      ref={headerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 'var(--header-h)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--gutter)',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        background: scrolled ? 'rgba(var(--accent-rgb), 0.02)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(1.3)' : 'none',
        transition: 'background 0.35s var(--ease-spring), border-color 0.35s var(--ease-spring), backdrop-filter 0.35s',
      }}
    >
      {/* Logo */}
      <a
        href="#top"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.65rem',
          textDecoration: 'none',
          color: 'var(--text-primary)',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          letterSpacing: '-0.01em',
        }}
        onMouseEnter={() => setCursorType('hover')}
        onMouseLeave={() => resetCursor()}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 16px var(--accent-dim)',
            flexShrink: 0,
          }}
        />
        Depth
      </a>

      {/* Desktop Nav */}
      <nav
        aria-label="Primary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(1rem, 3vw, 2rem)',
        }}
        className="desktop-nav"
      >
        {NAVIGATION.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => resetCursor()}
            style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ThemeSwitcher compact />

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="mobile-toggle"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          <span style={{
            display: 'block',
            width: 20,
            height: 2,
            background: 'var(--text-primary)',
            borderRadius: 2,
            transition: 'transform 0.3s',
            transform: mobileOpen ? 'rotate(45deg) translateY(3.5px)' : 'none',
          }} />
          <span style={{
            display: 'block',
            width: 20,
            height: 2,
            background: 'var(--text-primary)',
            borderRadius: 2,
            transition: 'transform 0.3s',
            transform: mobileOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none',
          }} />
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div
          className="mobile-nav"
          style={{
            position: 'fixed',
            top: 'var(--header-h)',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(var(--accent-rgb), 0.02)',
            backdropFilter: 'blur(24px)',
            padding: '1.5rem var(--gutter)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            zIndex: 99,
          }}
        >
          {NAVIGATION.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '1.5rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                padding: '1rem 0',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  )
}
