import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { useLanguage } from '@/context/LanguageProvider'

interface ShareModalProps {
  onClose: () => void
}

/**
 * "Share yours" modal (stories.md §4): a UI-state-only note — submissions open
 * with the full platform; links to /connect. Never promises publishing.
 * Rises 420ms (mood-modal-in), Esc/scrim/× close, focus trapped, scroll locked.
 */
export function ShareModal({ onClose }: ShareModalProps) {
  const { t } = useLanguage()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const prevActive = document.activeElement instanceof HTMLElement ? document.activeElement : null
    panel.querySelector<HTMLElement>('button, a[href]')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = panel.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')
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

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevActive?.focus()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0"
        style={{ background: 'rgba(27,22,17,.5)' }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.stories.invite.modalTitle}
        className="mood-modal-in relative w-full max-w-[440px] rounded-lg border border-line bg-raised p-6 shadow-overlay md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-h3 text-ink">{t.stories.invite.modalTitle}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.stories.invite.close}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-instant hover:bg-surface hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <p className="mt-3 text-body text-ink-muted">{t.stories.invite.modalText}</p>
        <Link
          to="/connect"
          onClick={onClose}
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-pill bg-interactive px-6 text-small font-semibold text-cream-text transition-all duration-fast ease-soft hover:opacity-90 active:scale-[.97] [html[data-theme=wadi-night]_&]:text-[#1B1611]"
        >
          {t.stories.invite.modalCta}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
