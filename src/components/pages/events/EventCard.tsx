import type { AfyaEvent } from '@/data'
import { pick } from '@/data'
import { Card, SourceLine } from '@/components/ui-yashfeen'
import { useLanguage } from '@/context/LanguageProvider'
import { CATEGORY_DOT } from './categoryColors'

/**
 * Event card (events.md §3): sand-soft date block (Fraunces day numeral + month
 * micro), title, category chip with matching dot, time/city/venue, host, Free
 * pill or price, "Reserve a spot" CTA, source micro-line at the foot.
 */
export function EventCard({ event, onReserve }: { event: AfyaEvent; onReserve: (e: AfyaEvent) => void }) {
  const { t, lang } = useLanguage()
  const d = new Date(`${event.date}T00:00:00`)
  const day = d.getDate()
  const monthShort = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-JO-u-nu-latn' : 'en-GB', {
    month: 'short',
  }).format(d)

  return (
    <Card hover className="flex h-full flex-col p-5">
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-sm bg-[var(--afya-rum-sand-soft)]"
        >
          <span className="font-display text-2xl font-semibold leading-none text-sand-deep">{day}</span>
          <span className="mt-1 text-micro leading-none text-sand-deep">{monthShort}</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-h3 text-ink">{pick(event.title, lang)}</h3>
          <p className="mt-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface px-3 py-0.5 text-micro text-ink ring-1 ring-line">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: CATEGORY_DOT[event.category] }} />
              {t.events.categories[event.category]}
            </span>
          </p>
        </div>
      </div>

      <p className="mt-3 text-small text-ink-muted">
        <span dir="ltr" className="inline-block">{pick(event.time, lang)}</span> · {pick(event.city, lang)} · {pick(event.venue, lang)}
      </p>
      <p className="mt-1 text-small text-ink-muted">
        {t.events.hostedBy} {pick(event.host, lang)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {event.free ? (
          <span className="inline-flex items-center rounded-pill bg-[var(--afya-deadsea-teal-soft)] px-3 py-1 text-micro font-semibold text-teal-deep">
            {t.events.free}
          </span>
        ) : (
          event.price != null && (
            <span className="inline-flex items-center rounded-pill bg-[var(--afya-rum-sand-soft)] px-3 py-1 text-micro font-semibold text-sand-deep">
              {t.events.priceLabel(event.price)}
            </span>
          )
        )}
      </div>

      <div className="mt-4 flex-1" />
      <button
        type="button"
        onClick={() => onReserve(event)}
        className="inline-flex min-h-[44px] items-center justify-center rounded-pill bg-mood-deep px-5 text-small font-semibold text-cream-text transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97]"
      >
        {t.events.reserve}
      </button>
      <div className="mt-4 border-t border-line pt-3">
        <SourceLine source={event.source} />
      </div>
    </Card>
  )
}
