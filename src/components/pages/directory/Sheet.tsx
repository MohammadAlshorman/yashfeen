import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  /** Called on Esc / backdrop click — the parent decides whether to guard first. */
  onRequestClose: () => void
  /** id of the element labelling the dialog */
  labelledBy: string
  children: ReactNode
  className?: string
}

/**
 * Accessible modal shell shared by the Directory/Events flows (directory.md §3,
 * events.md §3): bottom sheet on <768px (slides up 420ms), centered dialog on
 * ≥768px (scale .96→1 + fade 380ms). Focus trap, Esc, backdrop, scroll lock,
 * focus restore. Entrance uses WAAPI so prefers-reduced-motion can skip it.
 */
export function Sheet({ open, onRequestClose, labelledBy, children, className }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const restoreRef = useRef<HTMLElement | null>(null)

  // Entrance animation + initial focus + scroll lock + focus restore
  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    if (panel && !reduced) {
      const desktop = window.matchMedia('(min-width: 768px)').matches
      panel.animate(
        desktop
          ? [
              { opacity: 0, transform: 'scale(.96)' },
              { opacity: 1, transform: 'scale(1)' },
            ]
          : [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }],
        { duration: desktop ? 380 : 420, easing: 'cubic-bezier(.16,1,.3,1)' },
      )
    }
    const target = panel?.querySelector<HTMLElement>('[data-autofocus]') ?? panel
    target?.focus()
    return () => {
      document.body.style.overflow = ''
      restoreRef.current?.focus?.()
    }
  }, [open, reduced])

  // Esc + Tab focus trap
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onRequestClose()
        return
      }
      if (e.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [open, onRequestClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6" role="presentation">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'rgba(27,22,17,.45)' }}
        onClick={onRequestClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          'relative max-h-[88dvh] w-full max-w-[520px] overflow-y-auto rounded-t-lg border border-line bg-raised p-6 shadow-overlay md:rounded-lg',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
