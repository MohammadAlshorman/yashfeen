import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useLanguage } from '@/context/LanguageProvider'
import { cn } from '@/lib/utils'

interface VerificationModalProps {
  onClose: () => void
}

const FIELDS = ['name', 'license', 'workplace'] as const
type FieldKey = (typeof FIELDS)[number]

/**
 * "Request verification" modal (verified.md §4): 3-field form (name, license no.,
 * workplace) that on submit shows a confirmation UI state only — nothing is sent.
 * Rises 420ms; Esc/scrim/× close; focus trapped; body scroll locked.
 */
export function VerificationModal({ onClose }: VerificationModalProps) {
  const { t } = useLanguage()
  const panelRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Record<FieldKey, string>>({ name: '', license: '', workplace: '' })
  const [state, setState] = useState<'idle' | 'error' | 'success'>('idle')

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const prevActive = document.activeElement instanceof HTMLElement ? document.activeElement : null
    panel.querySelector<HTMLElement>('input, button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
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

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevActive?.focus()
    }
  }, [onClose])

  // STUB: POST /verification-requests — wire to the real backend when it exists.
  // This UI state only; no data leaves the device.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (FIELDS.some((f) => values[f].trim() === '')) {
      setState('error')
      return
    }
    setState('success')
  }

  const labelFor: Record<FieldKey, string> = {
    name: t.verified.become.name,
    license: t.verified.become.license,
    workplace: t.verified.become.workplace,
  }

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
        aria-label={t.verified.become.modalTitle}
        className="mood-modal-in relative w-full max-w-[480px] rounded-lg border border-line bg-raised p-6 shadow-overlay md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-h3 text-ink">{t.verified.become.modalTitle}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.verified.become.close}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-instant hover:bg-surface hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {state === 'success' ? (
          <div className="mt-6 flex flex-col items-center gap-4 text-center">
            <svg width="56" height="56" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <circle
                cx="32"
                cy="32"
                r="30"
                stroke="var(--afya-deadsea-teal)"
                strokeWidth="3"
                className="breathe-check-circle"
              />
              <path
                d="M20 33l8 8 16-17"
                stroke="var(--afya-deadsea-teal)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="breathe-check-path"
              />
            </svg>
            <p className="font-display text-h3 text-ink">{t.verified.become.successTitle}</p>
            <p role="status" className="text-body text-interactive-accent">
              {t.verified.become.success}
            </p>
            <p className="text-small text-ink-muted">{t.verified.become.privacy}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
            {FIELDS.map((field) => (
              <div key={field}>
                <label htmlFor={`verify-${field}`} className="mb-1 block text-small font-semibold text-ink">
                  {labelFor[field]}
                </label>
                <input
                  id={`verify-${field}`}
                  type="text"
                  value={values[field]}
                  onChange={(e) => {
                    setValues((v) => ({ ...v, [field]: e.target.value }))
                    if (state === 'error') setState('idle')
                  }}
                  aria-invalid={state === 'error' && values[field].trim() === ''}
                  aria-describedby={state === 'error' ? 'verify-error' : undefined}
                  className={cn(
                    'min-h-[44px] w-full rounded-md border bg-surface px-4 text-body text-ink',
                    'transition-colors duration-fast focus-visible:outline-none',
                    state === 'error' && values[field].trim() === ''
                      ? 'border-danger'
                      : 'border-line hover:border-mood',
                  )}
                />
              </div>
            ))}
            {state === 'error' && (
              <p id="verify-error" role="alert" className="text-small text-danger">
                {t.verified.become.required}
              </p>
            )}
            <button
              type="submit"
              className="min-h-[44px] w-full rounded-pill bg-interactive px-6 text-small font-semibold text-cream-text transition-all duration-fast ease-soft hover:opacity-90 active:scale-[.97] [html[data-theme=wadi-night]_&]:text-[#1B1611]"
            >
              {t.verified.become.submit}
            </button>
            <p className="text-center text-small text-ink-muted">{t.verified.become.privacy}</p>
          </form>
        )}
      </div>
    </div>
  )
}
