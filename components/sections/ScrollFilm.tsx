'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { TECH_STACK, STATS } from '@/lib/constants'

export function ScrollFilm() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      // Scene A: "The Stack" — tech reveal cards
      const sceneA = document.querySelector('.scene-stack')
      if (sceneA) {
        const cards = sceneA.querySelectorAll('.stack-card')
        const headline = sceneA.querySelector('.scene-headline')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sceneA,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 1.5,
            anticipatePin: 1,
          },
        })

        if (headline) {
          tl.fromTo(headline,
            { yPercent: 30, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.3 },
            0
          )
        }

        cards.forEach((card, i) => {
          tl.fromTo(card,
            { xPercent: 80, opacity: 0, rotateY: -15 },
            { xPercent: 0, opacity: 1, rotateY: 0, duration: 0.25 },
            0.15 + i * 0.15
          )
        })
      }

      // Scene B: "The Process" — horizontal timeline
      const sceneB = document.querySelector('.scene-process')
      if (sceneB) {
        const track = sceneB.querySelector('.process-track')
        if (track) {
          gsap.timeline({
            scrollTrigger: {
              trigger: sceneB,
              start: 'top top',
              end: '+=300%',
              pin: true,
              scrub: 1.5,
              anticipatePin: 1,
            },
          }).fromTo(track,
            { xPercent: 0 },
            { xPercent: -60, duration: 1 },
            0
          )
        }
      }

      // Scene C: "The Result" — counters
      const sceneC = document.querySelector('.scene-result')
      if (sceneC) {
        const counters = sceneC.querySelectorAll('[data-counter]')

        gsap.timeline({
          scrollTrigger: {
            trigger: sceneC,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              counters.forEach((counter) => {
                const target = Number(counter.getAttribute('data-counter') || 0)
                const val = Math.round(target * Math.min(self.progress * 2, 1))
                counter.textContent = String(val)
              })
            },
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" aria-label="Scroll Experience">
      {/* Scene A: The Stack */}
      <div
        className="scene-stack"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--gutter)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(var(--accent-rgb), 0.04), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3rem',
          maxWidth: '1200px',
          width: '100%',
          position: 'relative',
        }}>
          <div className="scene-headline" style={{ textAlign: 'center' }}>
            <p className="text-caption" style={{ marginBottom: '1rem' }}>The Stack</p>
            <h2 className="text-display-lg" style={{ color: 'var(--text-primary)' }}>
              Built with <span className="gradient-text">precision</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            width: '100%',
            perspective: '1000px',
          }}>
            {TECH_STACK.map((tech, i) => (
              <div
                key={tech.name}
                className="stack-card"
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-glass)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  willChange: 'transform, opacity',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-dim)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px var(--glow)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <span style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  fontWeight: 700,
                }}>
                  {tech.category}
                </span>
                <span style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                }}>
                  {tech.name}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scene B: The Process — Horizontal Timeline */}
      <div
        className="scene-process"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 1,
          background: 'var(--border)',
          transform: 'translateY(-50%)',
        }} />

        <div
          className="process-track"
          style={{
            display: 'flex',
            gap: '4rem',
            padding: '0 var(--gutter)',
            alignItems: 'center',
            willChange: 'transform',
          }}
        >
          {[
            { step: '01', title: 'Discover', desc: 'Understanding the existing codebase, identifying opportunities for cinematic enhancement.' },
            { step: '02', title: 'Architect', desc: 'Designing the scroll choreography, mapping every section to a unique visual identity.' },
            { step: '03', title: 'Animate', desc: 'Building GSAP timelines, scroll triggers, and GPU-accelerated transforms.' },
            { step: '04', title: 'Render', desc: 'Implementing WebGL shaders, particle systems, and Three.js scenes.' },
            { step: '05', title: 'Polish', desc: 'Performance optimization, accessibility audit, and cross-device testing.' },
            { step: '06', title: 'Launch', desc: 'Deploy to production with Lighthouse 90+ across all metrics.' },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                minWidth: '340px',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                background: 'var(--surface-glass)',
                backdropFilter: 'blur(16px)',
                flexShrink: 0,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--accent)',
                fontWeight: 600,
              }}>
                Step {item.step}
              </span>
              <h3 className="text-display-md" style={{ margin: '0.75rem 0', color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scene C: The Result — Counters */}
      <div
        className="scene-result"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--gutter)',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(var(--accent-2-rgb), 0.05), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4rem',
          position: 'relative',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p className="text-caption" style={{ marginBottom: '1rem' }}>The Result</p>
            <h2 className="text-display-lg" style={{ color: 'var(--text-primary)' }}>
              Motion by the <span className="gradient-text">numbers</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            width: '100%',
            maxWidth: '900px',
          }}>
            {STATS.map((stat) => (
              <div
                key={stat.label}
                style={{
                  padding: '2rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-glass)',
                  backdropFilter: 'blur(12px)',
                  textAlign: 'center',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  fontWeight: 800,
                  color: 'var(--accent)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}>
                  <span data-counter={stat.value}>0</span>
                  <span style={{ fontSize: '0.5em', color: 'var(--text-muted)' }}>{stat.suffix}</span>
                </div>
                <p style={{
                  marginTop: '0.75rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
