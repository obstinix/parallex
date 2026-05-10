'use client'

import dynamic from 'next/dynamic'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { CursorProvider } from '@/components/providers/CursorProvider'
import { ScrollProgressBar } from '@/components/ui/ScrollProgressBar'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { ScrollFilm } from '@/components/sections/ScrollFilm'
import { MarqueeWall } from '@/components/sections/MarqueeWall'
import { BentoGrid } from '@/components/sections/BentoGrid'
import { FeatureCTA } from '@/components/sections/FeatureCTA'
import { Footer } from '@/components/sections/Footer'

// Dynamic import for Three.js components (SSR disabled)
const BackgroundShader = dynamic(
  () => import('@/components/canvas/BackgroundShader').then((mod) => mod.BackgroundShader),
  { ssr: false }
)

export default function HomePage() {
  return (
    <ThemeProvider>
      <LenisProvider>
        <CursorProvider>
          {/* Skip to content */}
          <a
            href="#top"
            className="sr-only"
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 100000,
              padding: '0.5rem 1rem',
              background: 'var(--accent)',
              color: 'var(--bg)',
              borderRadius: 4,
              textDecoration: 'none',
              fontWeight: 600,
            }}
            onFocus={(e) => {
              (e.target as HTMLElement).style.position = 'fixed'
              ;(e.target as HTMLElement).style.clip = 'auto'
              ;(e.target as HTMLElement).style.width = 'auto'
              ;(e.target as HTMLElement).style.height = 'auto'
            }}
            onBlur={(e) => {
              (e.target as HTMLElement).style.position = 'absolute'
              ;(e.target as HTMLElement).style.clip = 'rect(0, 0, 0, 0)'
              ;(e.target as HTMLElement).style.width = '1px'
              ;(e.target as HTMLElement).style.height = '1px'
            }}
          >
            Skip to content
          </a>

          {/* Noise overlay */}
          <div className="noise-overlay" aria-hidden="true" />

          {/* Scroll progress */}
          <ScrollProgressBar />

          {/* WebGL Background */}
          <BackgroundShader />

          {/* Header */}
          <Header />

          {/* Main content */}
          <main>
            <Hero />
            <ScrollFilm />
            <MarqueeWall />
            <BentoGrid />
            <FeatureCTA />
          </main>

          <Footer />
        </CursorProvider>
      </LenisProvider>
    </ThemeProvider>
  )
}
