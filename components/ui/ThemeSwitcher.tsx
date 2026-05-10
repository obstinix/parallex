'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { THEMES, THEME_LABELS, THEME_COLORS, type Theme } from '@/lib/constants'
import { useCursor } from '@/components/providers/CursorProvider'

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, cycleTheme } = useTheme()
  const { setCursorType, resetCursor } = useCursor()

  if (compact) {
    return (
      <button
        type="button"
        onClick={cycleTheme}
        onMouseEnter={() => setCursorType('hover')}
        onMouseLeave={() => resetCursor()}
        aria-label={`Theme: ${THEME_LABELS[theme]}. Click for next.`}
        title={`Theme: ${THEME_LABELS[theme]}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.4rem 0.75rem 0.4rem 0.45rem',
          borderRadius: '999px',
          border: '1px solid var(--border)',
          background: 'var(--surface-glass)',
          backdropFilter: 'blur(12px)',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'border-color 0.25s, box-shadow 0.25s',
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: `conic-gradient(from 210deg, ${THEME_COLORS[theme].accent}, ${THEME_COLORS[theme].accent2}, ${THEME_COLORS[theme].accent})`,
            boxShadow: `0 0 12px ${THEME_COLORS[theme].accent}40`,
            flexShrink: 0,
          }}
        />
        <span>{THEME_LABELS[theme]}</span>
      </button>
    )
  }

  return (
    <div style={{
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
    }}>
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTheme(t)}
          onMouseEnter={() => setCursorType('hover')}
          onMouseLeave={() => resetCursor()}
          aria-label={`Switch to ${THEME_LABELS[t]} theme`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: theme === t ? '1.5px solid var(--accent)' : '1px solid var(--border)',
            background: theme === t ? 'rgba(var(--accent-rgb), 0.08)' : 'var(--surface-glass)',
            cursor: 'pointer',
            transition: 'all 0.3s var(--ease-spring)',
            minWidth: 80,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: THEME_COLORS[t].bg,
              border: `2px solid ${THEME_COLORS[t].accent}`,
              boxShadow: theme === t ? `0 0 20px ${THEME_COLORS[t].accent}50` : 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at 30% 30%, ${THEME_COLORS[t].accent}40, transparent)`,
              }}
            />
          </div>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: theme === t ? 'var(--accent)' : 'var(--text-muted)',
          }}>
            {THEME_LABELS[t]}
          </span>
        </button>
      ))}
    </div>
  )
}
