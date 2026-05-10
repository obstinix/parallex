'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react'

type CursorType = 'default' | 'hover' | 'drag' | 'view' | 'text'

interface CursorState {
  x: number
  y: number
  type: CursorType
  scale: number
  visible: boolean
  label: string
}

interface CursorContextType {
  setCursorType: (type: CursorType, label?: string) => void
  resetCursor: () => void
}

const CursorContext = createContext<CursorContextType>({
  setCursorType: () => {},
  resetCursor: () => {},
})

export function CursorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CursorState>({
    x: 0, y: 0, type: 'default', scale: 1, visible: false, label: '',
  })
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const outerPosRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(0)
  const isTouch = useRef(false)

  useEffect(() => {
    isTouch.current = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (isTouch.current) return

    document.body.classList.add('custom-cursor-active')

    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      setState(prev => ({ ...prev, x: e.clientX, y: e.clientY, visible: true }))
    }

    const handleLeave = () => {
      setState(prev => ({ ...prev, visible: false }))
    }

    const animate = () => {
      const lerp = 0.12
      outerPosRef.current.x += (posRef.current.x - outerPosRef.current.x) * lerp
      outerPosRef.current.y += (posRef.current.y - outerPosRef.current.y) * lerp

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerPosRef.current.x}px, ${outerPosRef.current.y}px) translate(-50%, -50%)`
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    document.body.addEventListener('mouseleave', handleLeave)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.body.removeEventListener('mouseleave', handleLeave)
      cancelAnimationFrame(rafRef.current)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [])

  const setCursorType = useCallback((type: CursorType, label = '') => {
    setState(prev => ({
      ...prev,
      type,
      label,
      scale: type === 'hover' ? 2.2 : type === 'drag' ? 0.8 : 1,
    }))
  }, [])

  const resetCursor = useCallback(() => {
    setState(prev => ({ ...prev, type: 'default', scale: 1, label: '' }))
  }, [])

  if (isTouch.current) {
    return (
      <CursorContext.Provider value={{ setCursorType, resetCursor }}>
        {children}
      </CursorContext.Provider>
    )
  }

  const outerSize = state.type === 'hover' ? 64 : 40
  const showLabel = state.type === 'drag' || state.type === 'view'

  return (
    <CursorContext.Provider value={{ setCursorType, resetCursor }}>
      {children}
      {/* Outer ring */}
      <div
        ref={outerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: outerSize,
          height: outerSize,
          borderRadius: '50%',
          border: `1.5px solid ${state.type === 'hover' ? 'var(--accent)' : 'var(--text-primary)'}`,
          background: state.type === 'hover' ? 'rgba(var(--accent-rgb), 0.08)' : 'transparent',
          pointerEvents: 'none',
          zIndex: 99990,
          opacity: state.visible ? (state.type === 'default' ? 0.5 : 0.9) : 0,
          transition: 'width 0.3s var(--ease-spring), height 0.3s var(--ease-spring), opacity 0.2s, border-color 0.2s, background 0.2s',
          mixBlendMode: 'difference',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {showLabel && (
          <span style={{
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
          }}>
            {state.label || state.type}
          </span>
        )}
      </div>

      {/* Inner dot */}
      <div
        ref={innerRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: state.type === 'hover' ? 0 : 6,
          height: state.type === 'hover' ? 0 : 6,
          borderRadius: '50%',
          background: 'var(--accent)',
          pointerEvents: 'none',
          zIndex: 99991,
          opacity: state.visible ? 1 : 0,
          transition: 'width 0.2s, height 0.2s, opacity 0.2s',
          boxShadow: '0 0 10px var(--accent-dim)',
        }}
      />
    </CursorContext.Provider>
  )
}

export const useCursor = () => useContext(CursorContext)
