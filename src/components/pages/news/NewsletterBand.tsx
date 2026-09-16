import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { cn } from '@/lib/utils'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Newsletter stub band (news.md §3): "Weekly digest, when it matters."
 * Front-end only — validates format, then shows a success UI state with a check
 * path draw (400ms) and a band tint shift to teal-soft (600ms). Never promises
 * real delivery.
 */
export function NewsletterBand() {
  const { t } = useLanguage()
  const ref = useReveal<HTMLElement>()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'success'>('idle')

  // STUB: wire to newsletter provider (double-opt-in) when the backend exists.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setState('error')
      return
    }
    setState('success')
  }

  const success = state === 'success'

  return (
    <section ref={ref} aria-labelledby="newsletter-title" className="px-4 pb-16 md:px-6 md:pb-24">
      <div
        data-reveal
        className={cn(
          'mx-auto max-w-[720px] rounded-lg border border-line p-6 text-center shadow-card transition-colors duration-slow ease-soft md:p-10',
          // Success: band tint → teal-soft (600ms); on Wadi Night an 18% teal overlay on night-raised
          success
            ? 'bg-teal-soft [html[data-theme=wadi-night]_&]:bg-[color-mix(in_oklab,var(--afya-deadsea-teal)_18%,var(--afya-night-raised))]'
            : 'bg-raised',
        )}
      >
        {success ? (
          <div className="flex flex-col items-center gap-4">
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
            <p className="font-display text-h3 text-ink">{t.news.newsletter.title}</p>
            <p role="status" className="text-body text-interactive-accent">
              {t.news.newsletter.success}
            </p>
          </div>
        ) : (
          <>
            <h2 id="newsletter-title" className="font-display text-h3 text-ink">
              {t.news.newsletter.title}
            </h2>
            <p className="mx-auto mt-2 max-w-prose text-body text-ink-muted">{t.news.newsletter.text}</p>
            <form onSubmit={onSubmit} noValidate className="mx-auto mt-6 flex max-w-[560px] flex-col gap-3 md:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                {t.news.newsletter.emailLabel}
              </label>
              <input
                id="newsletter-email"
                type="email"
                dir="ltr"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (state === 'error') setState('idle')
                }}
                placeholder={t.news.newsletter.placeholder}
                aria-invalid={state === 'error'}
                aria-describedby={state === 'error' ? 'newsletter-error' : undefined}
                className={cn(
                  'min-h-[44px] flex-1 rounded-pill border bg-surface px-5 text-body text-ink placeholder:text-ink-muted',
                  'transition-colors duration-fast focus-visible:outline-none',
                  state === 'error' ? 'border-danger' : 'border-line hover:border-mood',
                )}
              />
              <button
                type="submit"
                className="min-h-[44px] rounded-pill bg-interactive px-6 text-small font-semibold text-cream-text transition-all duration-fast ease-soft hover:opacity-90 active:scale-[.97] [html[data-theme=wadi-night]_&]:text-[#1B1611]"
              >
                {t.news.newsletter.cta}
              </button>
            </form>
            {state === 'error' && (
              <p id="newsletter-error" role="alert" className="mt-3 text-small text-danger">
                {t.news.newsletter.invalid}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
