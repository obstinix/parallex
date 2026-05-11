import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Depth — Cinematic Parallax Experience',
  description: 'An interactive cinematic scroll experience — every pixel choreographed, every transition intentional. Built with Next.js 15, GSAP, Three.js, and GLSL shaders.',
  keywords: ['parallax', 'cinematic', 'scroll', 'webgl', 'gsap', 'three.js', 'interactive', 'experience'],
  authors: [{ name: 'obstinix' }],
  openGraph: {
    title: 'Depth — Cinematic Parallax Experience',
    description: 'An interactive cinematic scroll experience built with Next.js, GSAP, and Three.js.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="void" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
