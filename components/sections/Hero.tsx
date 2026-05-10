'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { MagneticButton } from '@/components/ui/MagneticButton'

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })

      // Eyebrow fade in
      if (eyebrowRef.current) {
        tl.fromTo(eyebrowRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          0
        )
      }

      // Letter-by-letter animation for line 1
      if (line1Ref.current) {
        const chars1 = line1Ref.current.querySelectorAll('.char')
        tl.fromTo(chars1,
          { y: 120, opacity: 0, rotateX: -80 },
          {
            y: 0, opacity: 1, rotateX: 0,
            duration: 1.2, stagger: 0.04,
            ease: 'power4.out',
          },
          0.1
        )
      }

      // Letter-by-letter animation for line 2
      if (line2Ref.current) {
        const chars2 = line2Ref.current.querySelectorAll('.char')
        tl.fromTo(chars2,
          { y: 120, opacity: 0, rotateX: -80 },
          {
            y: 0, opacity: 1, rotateX: 0,
            duration: 1.2, stagger: 0.04,
            ease: 'power4.out',
          },
          0.35
        )
      }

      // Sub text
      if (subRef.current) {
        tl.fromTo(subRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          0.8
        )
      }

      // Actions
      if (actionsRef.current) {
        tl.fromTo(actionsRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
          1.0
        )
      }

      // Scroll-driven exit
      if (containerRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          onUpdate: (self) => {
            if (!containerRef.current) return
            const p = self.progress
            gsap.set(containerRef.current, {
              scale: 1 - p * 0.1,
              opacity: 1 - p * 0.85,
              filter: `blur(${p * 8}px)`,
            })
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  const splitText = (text: string) => {
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="char"
        style={{
          display: 'inline-block',
          willChange: 'transform, opacity',
          perspective: '500px',
          ...(char === ' ' ? { width: '0.3em' } : {}),
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  return (
    <section
      ref={containerRef}
      id="top"
      aria-label="Introduction"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: `calc(var(--header-h) + 2rem) var(--gutter) 4rem`,
        overflow: 'hidden',
        willChange: 'transform, opacity, filter',
      }}
    >
      {/* Background effects */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-20%',
          background: `
            radial-gradient(ellipse 60% 50% at 20% 50%, rgba(var(--accent-rgb), 0.08), transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 30%, rgba(var(--accent-2-rgb), 0.06), transparent 50%),
            radial-gradient(ellipse 80% 60% at 50% 80%, rgba(var(--accent-rgb), 0.04), transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Grid pattern */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(var(--accent-rgb), 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb), 0.03) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 70% 55% at 50% 45%, black 15%, transparent 65%)',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: '70vw' }}>
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="text-caption"
          style={{
            marginBottom: '1.5rem',
            opacity: loaded ? undefined : 0,
          }}
        >
          <span style={{
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            border: '1px solid var(--accent-dim)',
            background: 'rgba(var(--accent-rgb), 0.06)',
          }}>
            Cinematic scroll experience
          </span>
        </p>

        {/* Headline */}
        <h1
          ref={headlineRef}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 11vw, 11rem)',
            fontWeight: 800,
            lineHeight: 0.88,
            letterSpacing: '-0.05em',
            margin: '0 0 2rem',
            color: 'var(--text-primary)',
          }}
        >
          <span
            ref={line1Ref}
            style={{ display: 'block', overflow: 'hidden', perspective: '600px' }}
          >
            {splitText('Motion')}
          </span>
          <span
            ref={line2Ref}
            style={{
              display: 'block',
              overflow: 'hidden',
              perspective: '600px',
              marginTop: '0.05em',
            }}
          >
            {splitText('in ')}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
              {splitText('depth')}
            </span>
          </span>
        </h1>

        {/* Subtext */}
        <p
          ref={subRef}
          style={{
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            margin: '0 0 2.5rem',
            opacity: loaded ? undefined : 0,
          }}
        >
          An interactive cinematic scroll experience — every pixel choreographed,
          every transition intentional.
        </p>

        {/* CTAs */}
        <div ref={actionsRef} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <MagneticButton variant="primary" href="#experience">
            Explore
            <span style={{ fontSize: '1.1em' }}>↓</span>
          </MagneticButton>
          <MagneticButton variant="outline" href="https://github.com/obstinix/parallex" >
            View Source
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          opacity: 0.5,
        }}
      >
        <span style={{
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          fontWeight: 600,
        }}>
          Scroll
        </span>
        <div style={{
          width: 1,
          height: 48,
          background: 'linear-gradient(to bottom, var(--accent), transparent)',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.85); }
          50% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </section>
  )
}
