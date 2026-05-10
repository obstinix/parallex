'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { THEMES, type Theme } from '@/lib/constants'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'void',
  setTheme: () => {},
  cycleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('void')
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('depth-theme') as Theme | null
    if (saved && THEMES.includes(saved)) {
      setThemeState(saved)
      document.documentElement.setAttribute('data-theme', saved)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    // Create wipe overlay
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 99999;
      background: var(--accent);
      transform: scaleX(0); transform-origin: left;
      pointer-events: none;
    `
    document.body.appendChild(overlay)
    overlayRef.current = overlay

    // Animate wipe
    const duration = 0.35
    overlay.style.transition = `transform ${duration}s cubic-bezier(0.76, 0, 0.24, 1)`
    requestAnimationFrame(() => {
      overlay.style.transform = 'scaleX(1)'
      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', newTheme)
        setThemeState(newTheme)
        localStorage.setItem('depth-theme', newTheme)

        overlay.style.transformOrigin = 'right'
        overlay.style.transform = 'scaleX(0)'

        setTimeout(() => {
          overlay.remove()
          overlayRef.current = null
        }, duration * 1000)
      }, duration * 1000)
    })
  }

  const cycleTheme = () => {
    const idx = THEMES.indexOf(theme)
    const next = THEMES[(idx + 1) % THEMES.length]
    setTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
