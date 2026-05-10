'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { useCursor } from '@/components/providers/CursorProvider'

interface MagneticButtonProps {
  children: ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  href?: string
  onClick?: () => void
  className?: string
  strength?: number
}

export function MagneticButton({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  strength = 0.4,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const { setCursorType, resetCursor } = useCursor()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!isFine) return

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const threshold = Math.max(rect.width, rect.height) * 1.5

      if (dist < threshold) {
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.4,
          ease: 'power3.out',
        })
        if (textRef.current) {
          gsap.to(textRef.current, {
            x: dx * strength * 0.3,
            y: dy * strength * 0.3,
            duration: 0.4,
            ease: 'power3.out',
          })
        }
      }
    }

    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
      if (textRef.current) {
        gsap.to(textRef.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
      }
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength])

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: variant === 'ghost' ? '0.6rem 1rem' : '0.8rem 1.8rem',
    borderRadius: '999px',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '0.9rem',
    letterSpacing: '0.02em',
    lineHeight: 1,
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
    willChange: 'transform',
    transition: 'box-shadow 0.3s var(--ease-spring), background 0.3s, border-color 0.3s',
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--bg)',
      boxShadow: '0 0 0 1px rgba(var(--accent-rgb), 0.3), 0 8px 32px rgba(var(--accent-rgb), 0.2)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: 'none',
    },
  }

  const props = {
    ref: ref as React.Ref<HTMLAnchorElement & HTMLButtonElement>,
    style: { ...baseStyles, ...variantStyles[variant] },
    className,
    onMouseEnter: () => setCursorType('hover'),
    onMouseLeave: () => resetCursor(),
    onClick,
  }

  const inner = <span ref={textRef} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', pointerEvents: 'none' }}>{children}</span>

  if (href) {
    return <a href={href} {...props}>{inner}</a>
  }
  return <button type="button" {...props}>{inner}</button>
}
