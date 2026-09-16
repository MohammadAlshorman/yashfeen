import { useState } from 'react'
import { Link } from 'react-router'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'

/**
 * Question for the show band (live.md §Section 4): one-line input + submit →
 * success UI state only. Nothing is sent; the mailbox wires in later.
 * Links the pattern to /connect for channels.
 */
export function AskBand() {
  const { t } = useLanguage()
  const ref = useReveal<HTMLElement>()
  const [question, setQuestion] = useState('')
  const [sent, setSent] = useState(false)

  // STUB: POST /show-questions when the mailbox backend exists — UI state only.
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    setSent(true)
  }

  return (
    <section ref={ref} className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
      <div
        data-reveal
        className="rounded-lg border border-line bg-raised p-6 shadow-card md:p-10"
      >
        <h2 className="max-w-prose font-display text-h2 text-ink">{t.live.askTitle}</h2>

        {sent ? (
          <div className="mt-6 flex items-start gap-3" role="status">
            <svg width="28" height="28" viewBox="0 0 72 72" className="mt-0.5 shrink-0" aria-hidden="true">
              <circle
                cx="36"
                cy="36"
                r="30"
                fill="none"
                stroke="var(--mood-accent)"
                strokeWidth="3"
                className="breathe-check-circle"
              />
              {/* success check draw 400ms (live.md §Section 4) */}
              <path
                d="M24 37l8 8 16-17"
                fill="none"
                stroke="var(--mood-accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="breathe-check-path"
              />
            </svg>
            <p className="text-body text-ink">{t.live.askSuccess}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="ask-input" className="sr-only">
              {t.live.askTitle}
            </label>
            <input
              id="ask-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.live.askPlaceholder}
              className="min-h-[48px] flex-1 rounded-pill border border-line bg-surface px-5 text-body text-ink placeholder:text-ink-muted"
            />
            <button
              type="submit"
              className="min-h-[48px] shrink-0 rounded-pill bg-interactive px-7 py-3 text-small font-semibold text-surface transition-transform duration-fast ease-soft hover:scale-[1.03] active:scale-[0.97]"
            >
              {t.live.askSubmit}
            </button>
          </form>
        )}

        <p className="mt-5 text-small text-ink-muted">
          <Link
            to="/connect"
            className="font-semibold text-interactive-accent underline decoration-dotted underline-offset-4 transition-colors duration-instant hover:text-ink"
          >
            {t.live.remindedCta}
          </Link>
        </p>
      </div>
    </section>
  )
}
