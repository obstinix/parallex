'use client'

import { useEffect, useRef } from 'react'
import { MARQUEE_ROWS } from '@/lib/constants'

export function MarqueeWall() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Add scroll-based parallax speed modifier
    const rows = sectionRef.current?.querySelectorAll('.marquee-row')
    if (!rows) return

    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        if (!sectionRef.current) return
        const rect = sectionRef.current.getBoundingClientRect()
        const vh = window.innerHeight
        const progress = Math.max(0, Math.min(1, 1 - (rect.top + rect.height * 0.5) / (vh * 1.1)))

        rows.forEach((row, i) => {
          const speed = [0.3, 0.6, 1.0][i] || 0.5
          const offset = (progress - 0.5) * 100 * speed
          ;(row as HTMLElement).style.setProperty('--scroll-offset', `${offset}px`)
        })
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      style={{
        padding: 'clamp(4rem, 8vh, 8rem) 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Fade edges */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: '15%',
        background: 'linear-gradient(to right, var(--bg), transparent)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '15%',
        background: 'linear-gradient(to left, var(--bg), transparent)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />

      {MARQUEE_ROWS.map((row, i) => (
        <div
          key={i}
          className="marquee-row"
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            transform: `translateX(var(--scroll-offset, 0px))`,
            transition: 'transform 0.1s linear',
            padding: '0.5rem 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              animation: `${row.direction > 0 ? 'marquee-scroll' : 'marquee-scroll-reverse'} ${row.speed}s linear infinite`,
              fontFamily: 'var(--font-display)',
              fontSize: `clamp(${row.size * 0.5}px, ${row.size * 0.12}vw, ${row.size}px)`,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              opacity: row.opacity,
              gap: '0.2em',
            }}
          >
            {/* Duplicate for seamless loop */}
            {[0, 1, 2, 3].map((dup) => (
              <span key={dup} style={{ paddingRight: '0.4em' }}>
                {row.text}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
