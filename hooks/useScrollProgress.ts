'use client'

import { useEffect, useState } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || document.body.scrollTop
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? scrollTop / max : 0)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return progress
}
