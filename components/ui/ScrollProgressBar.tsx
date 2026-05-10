'use client'

import { useScrollProgress } from '@/hooks/useScrollProgress'

export function ScrollProgressBar() {
  const progress = useScrollProgress()

  return (
    <div className="scroll-progress" role="presentation" aria-hidden="true">
      <span
        className="scroll-progress__bar"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
}
