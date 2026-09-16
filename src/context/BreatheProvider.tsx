import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { BreatheOverlay } from '@/components/ui-yashfeen/BreatheOverlay'
import { useLanguage } from '@/context/LanguageProvider'

interface BreatheContextValue {
  isOpen: boolean
  openBreathe: () => void
  closeBreathe: (completed?: boolean) => void
}

const BreatheContext = createContext<BreatheContextValue | null>(null)

/**
 * Global state for the 60s 4-7-8 breathing overlay (mind.md §Breathe Overlay —
 * global chrome, launched from the persistent Breathe button on every page).
 */
export function BreatheProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [endedEarly, setEndedEarly] = useState(false)
  const { t } = useLanguage()

  const openBreathe = useCallback(() => {
    setEndedEarly(false)
    setIsOpen(true)
  }, [])

  const closeBreathe = useCallback((completed = false) => {
    setIsOpen(false)
    if (!completed) {
      // Quiet "Session ended early" toast (3s) when closed mid-session (mind.md §5)
      setEndedEarly(true)
      window.setTimeout(() => setEndedEarly(false), 3000)
    }
  }, [])

  const value = useMemo<BreatheContextValue>(
    () => ({ isOpen, openBreathe, closeBreathe }),
    [isOpen, openBreathe, closeBreathe],
  )

  return (
    <BreatheContext.Provider value={value}>
      {children}
      <BreatheOverlay />
      {endedEarly && (
        <div
          role="status"
          className="fixed bottom-24 inset-x-0 z-[80] mx-auto w-fit rounded-pill bg-night px-5 py-2.5 text-small text-cream-text shadow-overlay"
        >
          {t.breathe.sessionEnded}
        </div>
      )}
    </BreatheContext.Provider>
  )
}

export function useBreathe(): BreatheContextValue {
  const ctx = useContext(BreatheContext)
  if (!ctx) throw new Error('useBreathe must be used inside <BreatheProvider>')
  return ctx
}
