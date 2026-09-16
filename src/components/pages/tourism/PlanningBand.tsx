import { Link } from 'react-router'
import { Card, Disclaimer } from '@/components/ui-yashfeen'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { destinations } from '@/data/destinations'
import { cn } from '@/lib/utils'

/** Oct–Apr indices in a Jan-first strip (medical-tourism.md §Section 2) */
const HIGHLIGHT_MONTHS = new Set([9, 10, 11, 0, 1, 2, 3])

/**
 * Planning band (medical-tourism.md §Section 2): H2 + 3 info tiles (best-season
 * month strip with Oct–Apr in sand, drive-time chips from Amman, care links) +
 * directory CTA + disclaimer/sample-facts footer. Standard reveal; tiles lift on hover.
 * 360: stacked · 768/1440: 3 columns, max 1200px.
 */
export function PlanningBand() {
  const { t } = useLanguage()
  const ref = useReveal<HTMLElement>()
  const p = t.tourism.planning

  return (
    <section ref={ref} aria-labelledby="mt-planning-title" className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
      <h2 id="mt-planning-title" data-reveal className="text-center font-display text-h2 text-ink">
        {p.title}
      </h2>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {/* Best seasons — mini month strip, Oct–Apr highlighted in sand */}
        <Card hover data-reveal className="p-5 md:p-6">
          <h3 className="text-h3 text-ink">{p.seasonsTitle}</h3>
          <p className="mt-2 text-small text-ink-muted">{p.seasonsText}</p>
          {/* month strip stays LTR inside RTL pages (calendar convention, §2.9) */}
          <div dir="ltr" className="mt-4 grid grid-cols-4 gap-1 sm:grid-cols-6">
            {p.months.map((m, i) => (
              <span
                key={i}
                className={cn(
                  'rounded-sm px-1 py-1.5 text-center text-[10px] font-semibold leading-tight',
                  HIGHLIGHT_MONTHS.has(i) ? 'bg-sand-soft text-sand-deep' : 'text-ink-muted',
                )}
              >
                {m}
              </span>
            ))}
          </div>
          <p className="mt-3 text-micro font-semibold uppercase tracking-[0.08em] text-sand-deep [html[lang=ar]_&]:normal-case [html[lang=ar]_&]:tracking-normal">
            {p.seasonHighlight}
          </p>
        </Card>

        {/* Getting there — drive-time chips from Amman per destination */}
        <Card hover data-reveal className="p-5 md:p-6">
          <h3 className="text-h3 text-ink">{p.gettingTitle}</h3>
          <p className="mt-2 text-small text-ink-muted">{p.gettingText}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {destinations.map((d) => (
              <span
                key={d.id}
                className="inline-flex items-center gap-2 rounded-pill border border-line bg-surface px-3 py-1.5 text-small text-ink"
              >
                <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: d.palette[0] }} />
                {t.tourism.rail[d.id]}
                <span className="font-semibold text-ink-muted">{t.tourism.chapters[d.id].drive}</span>
              </span>
            ))}
          </div>
        </Card>

        {/* Care while you travel — directory + verified links */}
        <Card hover data-reveal className="p-5 md:p-6">
          <h3 className="text-h3 text-ink">{p.careTitle}</h3>
          <p className="mt-2 text-small text-ink-muted">{p.careText}</p>
          <ul className="mt-4 space-y-1">
            <li>
              <Link
                to="/directory"
                className="inline-flex min-h-[44px] items-center gap-2 py-1 text-small font-semibold text-interactive underline decoration-dotted underline-offset-4 transition-colors duration-instant hover:decoration-solid"
              >
                {p.careDirectory}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
            <li>
              <Link
                to="/verified"
                className="inline-flex min-h-[44px] items-center gap-2 py-1 text-small font-semibold text-interactive-accent underline decoration-dotted underline-offset-4 transition-colors duration-instant hover:decoration-solid"
              >
                {p.careVerified}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          </ul>
        </Card>
      </div>

      <div data-reveal className="mt-10 flex justify-center">
        <Link
          to="/directory"
          className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill bg-interactive px-7 py-3 text-small font-semibold text-cream-text shadow-lift transition-all duration-fast ease-soft hover:brightness-110 active:scale-[0.97]"
        >
          {p.cta}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip transition-transform duration-fast group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>

      <div data-reveal className="mx-auto mt-10 max-w-[52ch]">
        <Disclaimer className="justify-center" />
        <p className="mt-2 text-center text-small text-ink-muted">{p.note}</p>
      </div>
    </section>
  )
}
