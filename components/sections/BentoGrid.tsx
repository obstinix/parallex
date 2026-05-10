'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher'
import { useCursor } from '@/components/providers/CursorProvider'

function FPSCounter() {
  const [fps, setFps] = useState(60)
  const frameRef = useRef(0)
  const lastRef = useRef(performance.now())
  const countRef = useRef(0)

  useEffect(() => {
    const tick = () => {
      countRef.current++
      const now = performance.now()
      if (now - lastRef.current >= 1000) {
        setFps(countRef.current)
        countRef.current = 0
        lastRef.current = now
      }
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 'clamp(3rem, 6vw, 5rem)',
      fontWeight: 700,
      color: fps >= 55 ? 'var(--accent)' : fps >= 30 ? '#F59E0B' : '#EF4444',
      lineHeight: 1,
      transition: 'color 0.3s',
    }}>
      {fps}<span style={{ fontSize: '0.3em', color: 'var(--text-muted)', marginLeft: '0.2em' }}>FPS</span>
    </div>
  )
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number }>>([])

  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const count = 80
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width * window.devicePixelRatio
        canvas.height = rect.height * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
      initParticles(canvas)
    }
    resize()

    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    let raf = 0

    const animate = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      ctx.clearRect(0, 0, w, h)

      particlesRef.current.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = accentColor || '#00FFF0'
        ctx.globalAlpha = 0.4
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Draw connections
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i]
          const b = particlesRef.current[j]
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
          if (dist < 80) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = accentColor || '#00FFF0'
            ctx.globalAlpha = (1 - dist / 80) * 0.15
            ctx.lineWidth = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      particlesRef.current.forEach((p) => {
        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 3
          p.vy += (dy / dist) * force * 3
        }
      })
    }

    canvas.addEventListener('click', handleClick)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('click', handleClick)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
    />
  )
}

export function BentoGrid() {
  const { setCursorType, resetCursor } = useCursor()

  const cardHover = {
    onMouseEnter: () => setCursorType('hover'),
    onMouseLeave: () => resetCursor(),
  }

  return (
    <section
      id="showcase"
      aria-labelledby="showcase-heading"
      style={{
        padding: 'var(--section-padding) var(--gutter)',
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p className="text-caption" style={{ marginBottom: '1rem' }}>Showcase</p>
        <h2 id="showcase-heading" className="text-display-lg" style={{ color: 'var(--text-primary)' }}>
          Interactive <span className="gradient-text">features</span>
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'auto auto',
        gap: '1rem',
      }}>
        {/* Card 1 — Large: Particle Playground */}
        <div
          {...cardHover}
          style={{
            gridColumn: '1 / 3',
            gridRow: '1',
            minHeight: '360px',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(12px)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            cursor: 'crosshair',
          }}
          onMouseEnter={(e) => {
            setCursorType('drag', 'Click')
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-dim)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px var(--glow)'
          }}
          onMouseLeave={(e) => {
            resetCursor()
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
            ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
          }}
        >
          <div style={{ position: 'absolute', inset: 0 }}>
            <ParticleField />
          </div>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span className="text-caption" style={{ marginBottom: '0.5rem', display: 'block' }}>Interactive</span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.8rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}>
              Particle Field
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Click anywhere to disturb particles
            </p>
          </div>
        </div>

        {/* Card 2 — FPS Counter */}
        <div
          {...cardHover}
          style={{
            gridColumn: '3',
            gridRow: '1 / 3',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            background: 'linear-gradient(135deg, var(--surface-glass), rgba(var(--accent-rgb), 0.03))',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={(e) => {
            setCursorType('hover')
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-dim)'
          }}
          onMouseLeave={(e) => {
            resetCursor()
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
          }}
        >
          <div>
            <span className="text-caption" style={{ display: 'block', marginBottom: '0.5rem' }}>Performance</span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}>
              Live FPS
            </h3>
          </div>
          <FPSCounter />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            requestAnimationFrame
          </p>
        </div>

        {/* Card 3 — Theme Switcher */}
        <div
          style={{
            gridColumn: '1',
            gridRow: '2',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
        >
          <div>
            <span className="text-caption" style={{ display: 'block', marginBottom: '0.5rem' }}>Customise</span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}>
              Themes
            </h3>
          </div>
          <ThemeSwitcher />
        </div>

        {/* Card 4 — Tech Stack Ticker */}
        <div
          {...cardHover}
          style={{
            gridColumn: '2',
            gridRow: '2',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(var(--accent-2-rgb), 0.04), var(--surface-glass))',
            backdropFilter: 'blur(12px)',
            overflow: 'hidden',
            position: 'relative',
            transition: 'border-color 0.3s',
          }}
          onMouseEnter={(e) => {
            setCursorType('hover')
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-dim)'
          }}
          onMouseLeave={(e) => {
            resetCursor()
            ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
          }}
        >
          <span className="text-caption" style={{ display: 'block', marginBottom: '0.5rem' }}>Tech</span>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1rem',
          }}>
            Stack
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}>
            {['Next.js', 'GSAP', 'Three.js', 'GLSL', 'Lenis', 'Framer'].map((tech) => (
              <span
                key={tech}
                style={{
                  padding: '0.35rem 0.7rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border)',
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive override */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-column: 1 / 3"] {
            grid-column: 1 !important;
          }
          div[style*="grid-column: 3"] {
            grid-column: 1 !important;
            grid-row: auto !important;
          }
        }
      `}</style>
    </section>
  )
}
