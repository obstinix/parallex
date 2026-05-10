'use client'

import { useEffect, useRef, useState } from 'react'
import { MagneticButton } from '@/components/ui/MagneticButton'

const PHRASES = ['something real.', 'something cinematic.', 'something interactive.', 'something intentional.']

export function FeatureCTA() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setDisplayText(PHRASES[0])
      return
    }

    const phrase = PHRASES[phraseIndex]
    const typeSpeed = isDeleting ? 30 : 60
    const pauseTime = isDeleting ? 200 : 2000

    if (!isDeleting && displayText === phrase) {
      const timer = setTimeout(() => setIsDeleting(true), pauseTime)
      return () => clearTimeout(timer)
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false)
      setPhraseIndex((prev) => (prev + 1) % PHRASES.length)
      return
    }

    const timer = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(phrase.slice(0, displayText.length - 1))
      } else {
        setDisplayText(phrase.slice(0, displayText.length + 1))
      }
    }, typeSpeed)

    return () => clearTimeout(timer)
  }, [displayText, isDeleting, phraseIndex])

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="cta-heading"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--section-padding) var(--gutter)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '60vw',
          height: '60vw',
          maxWidth: '700px',
          maxHeight: '700px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(var(--accent-rgb), 0.08), transparent 60%)`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
        <h2
          id="cta-heading"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            marginBottom: '2rem',
          }}
        >
          Let&apos;s build<br />
          <span className="gradient-text" style={{ minHeight: '1.2em', display: 'inline-block' }}>
            {displayText}
            <span style={{
              display: 'inline-block',
              width: '3px',
              height: '0.9em',
              background: 'var(--accent)',
              marginLeft: '2px',
              animation: 'blink 1s step-end infinite',
              verticalAlign: 'text-bottom',
            }} />
          </span>
        </h2>

        <p style={{
          fontSize: '1.1rem',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          maxWidth: '540px',
          margin: '0 auto 3rem',
        }}>
          Every great experience starts with a conversation. Use this page as a template
          — adjust, remix, and make it yours.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <MagneticButton variant="primary" href="#top">
            Back to top ↑
          </MagneticButton>
          <MagneticButton variant="outline" href="https://github.com/obstinix/parallex">
            View on GitHub
          </MagneticButton>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  )
}
