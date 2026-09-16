import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { AfyaEvent, EventCategory } from '@/data'
import { formatDate } from '@/data'
import { useCmsEvents } from '@/hooks/useCmsContent'
import { CmsLoadingLine, CmsNotice, CmsSkeleton } from '@/components/CmsState'
import { Card, Chip } from '@/components/ui-yashfeen'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Calendar } from '@/components/pages/events/Calendar'
import { EventCard } from '@/components/pages/events/EventCard'
import { ReservationModal } from '@/components/pages/events/ReservationModal'
import { Sheet } from '@/components/pages/directory/Sheet'
import { cn } from '@/lib/utils'

type CatFilter = 'all' | EventCategory

/** Sample-data month (events.md §3): the calendar opens where the samples live. */
const INITIAL_VIEW = { year: 2025, month: 4 } // May 2025

/** Wadi Night fix for inactive chips (see Directory.tsx — inline mood soft var). */

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/**
 * Events (events.md): filter chips (category + free-only) driving both the
 * monthly calendar dots and the event list; LTR calendar grid with Sunday week
 * start, day selection, reservation modal via the booking stub, host band.
 */
export default function Events() {
  const ref = useReveal<HTMLElement>({ stagger: 0.06, y: 32 })
  const { t, lang } = useLanguage()
  const reduced = useReducedMotion()
  const isLg = useMediaQuery('(min-width: 1024px)')

  const [view, setView] = useState(INITIAL_VIEW)
  const [navDir, setNavDir] = useState<-1 | 1>(1)
  const [selected, setSelected] = useState<string | null>(null)
  const [cat, setCat] = useState<CatFilter>('all')
  const [freeOnly, setFreeOnly] = useState(false)
  const [reserveTarget, setReserveTarget] = useState<AfyaEvent | null>(null)
  const [hostOpen, setHostOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // Live CMS content (tRPC content API) — published events.
  const { data: eventsData, isLoading, isError, refetch } = useCmsEvents()
  const allEvents = useMemo(() => eventsData ?? [], [eventsData])

  const filtered = useMemo(
    () =>
      allEvents.filter(
        (e) => (cat === 'all' || e.category === cat) && (!freeOnly || e.free),
      ),
    [cat, freeOnly, allEvents],
  )

  const eventsByDate = useMemo(() => {
    const map = new Map<string, AfyaEvent[]>()
    for (const e of filtered) {
      const list = map.get(e.date) ?? []
      list.push(e)
      map.set(e.date, list)
    }
    return map
  }, [filtered])

  const monthPrefix = `${view.year}-${String(view.month + 1).padStart(2, '0')}`
  const monthEvents = useMemo(
    () =>
      filtered
        .filter((e) => e.date.startsWith(monthPrefix))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [filtered, monthPrefix],
  )

  const dayEvents = selected ? (eventsByDate.get(selected) ?? []) : []
  // Below lg the list filters to the selected day; on lg the side panel shows it.
  const listEvents = selected && !isLg ? dayEvents : monthEvents

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(lang === 'ar' ? 'ar-JO-u-nu-latn' : 'en-GB', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(view.year, view.month, 1)),
    [view, lang],
  )

  const navigate = (dir: -1 | 1) => {
    setNavDir(dir)
    setSelected(null)
    setView((v) => {
      const m = v.month + dir
      return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 }
    })
  }

  const goToday = () => {
    const n = new Date()
    setNavDir(1)
    setView({ year: n.getFullYear(), month: n.getMonth() })
    setSelected(toISO(n.getFullYear(), n.getMonth(), n.getDate()))
  }

  // List stagger on filter/selection change (60ms)
  const listKey = `${cat}|${freeOnly}|${selected}|${view.year}-${view.month}|${isLg}|${lang}`
  useEffect(() => {
    if (reduced || !listRef.current) return
    Array.from(listRef.current.children).forEach((child, i) => {
      ;(child as HTMLElement).animate(
        [
          { opacity: 0, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 300, delay: i * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
      )
    })
  }, [listKey, reduced])

  const selectedLabel = selected ? formatDate(selected, lang) : ''

  return (
    <section ref={ref} className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
      {/* ——— Section 1: header + filter chips ——— */}
      <header>
        <p data-reveal className="text-micro uppercase text-interactive-accent [html[lang=ar]_&]:normal-case">
          {t.events.overline}
        </p>
        <h1 data-reveal className="mt-3 font-display text-h1 text-ink">
          {t.events.h1}
        </h1>
        <div
          data-reveal
          role="group"
          aria-label={t.events.filtersLabel}
          className="mt-6 flex flex-nowrap gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible"
        >
          {(['all', 'screening', 'workshop', 'walk', 'talk'] as const).map((c) => (
            <Chip
              key={c}
              active={cat === c}
              onClick={() => setCat(c)}
              className={cn('shrink-0')}
            >
              {t.events.categories[c]}
            </Chip>
          ))}
          <Chip
            active={freeOnly}
            onClick={() => setFreeOnly((v) => !v)}
            className={cn('shrink-0')}
          >
            {t.events.freeOnly}
          </Chip>
        </div>
      </header>

      {/* ——— Section 2: calendar + selected-day side panel ——— */}
      <div data-reveal className="mt-10 lg:grid lg:grid-cols-[minmax(0,720px)_360px] lg:items-start lg:gap-8">
        <Card className="p-4 md:p-6">
          <Calendar
            year={view.year}
            month={view.month}
            monthLabel={monthLabel}
            selected={selected}
            onSelect={setSelected}
            onNavigate={navigate}
            onToday={goToday}
            navDir={navDir}
            eventsByDate={eventsByDate}
          />
          {isLoading && <CmsLoadingLine className="mt-3 text-center" />}
          {isError && <p role="alert" className="mt-3 text-center text-small text-ink-muted">{t.cms.unavailable}</p>}
        </Card>

        {/* Persistent selected-day panel (lg+) */}
        <aside className="sticky top-24 mt-6 hidden lg:mt-0 lg:block" aria-label={t.events.dayLabel}>
          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-h3 text-ink">
                {selected ? selectedLabel : t.events.dayLabel}
              </h2>
              {selected && (
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="inline-flex min-h-[44px] items-center rounded-pill border border-line px-3 text-micro font-semibold text-ink-muted transition-colors duration-instant hover:text-ink"
                >
                  {t.events.clearDay}
                </button>
              )}
            </div>
            {!selected ? (
              <p className="mt-3 text-small text-ink-muted">{t.events.selectDayHint}</p>
            ) : dayEvents.length === 0 ? (
              <p className="mt-3 text-small text-ink-muted">{t.events.noEventsOn(selectedLabel)}</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {dayEvents.map((e) => (
                  <li key={e.id}>
                    <EventCard event={e} onReserve={setReserveTarget} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>

      {/* ——— Section 3: event list ——— */}
      <div className="mt-12">
        <h2 data-reveal className="font-display text-h2 text-ink" aria-live="polite">
          {selected && !isLg
            ? dayEvents.length > 0
              ? t.events.eventsOn(dayEvents.length, selectedLabel)
              : t.events.noEventsOn(selectedLabel)
            : t.events.listTitle}
        </h2>
        {isLoading ? (
          <CmsSkeleton count={4} className="mt-6 grid gap-5 md:grid-cols-2" />
        ) : isError ? (
          <CmsNotice variant="error" onRetry={() => refetch()} className="mt-6" />
        ) : listEvents.length > 0 ? (
          <div ref={listRef} key={listKey} className="mt-6 grid gap-5 md:grid-cols-2">
            {listEvents.map((e) => (
              <EventCard key={e.id} event={e} onReserve={setReserveTarget} />
            ))}
          </div>
        ) : (
          <Card className="mt-6 p-8 text-center">
            <p className="text-body text-ink-muted">{t.events.emptyMonth}</p>
          </Card>
        )}
      </div>

      {/* ——— Section 4: host an event band ——— */}
      <div data-reveal className="mt-16">
        <Card className="texture-dune-contours flex flex-col items-start gap-5 p-6 text-sand-deep md:flex-row md:items-center md:justify-between md:p-8">
          <p className="font-display text-h3 text-ink">{t.events.host.title}</p>
          <button
            type="button"
            onClick={() => setHostOpen(true)}
            className="inline-flex min-h-[44px] shrink-0 items-center rounded-pill border border-line px-5 text-small font-semibold text-interactive transition-colors duration-instant hover:border-mood"
          >
            {t.events.host.cta}
          </button>
        </Card>
      </div>

      <ReservationModal event={reserveTarget} onClose={() => setReserveTarget(null)} />

      {/* Host-event modal: UI state only, links to /connect (events.md §4) */}
      <Sheet open={hostOpen} onRequestClose={() => setHostOpen(false)} labelledBy="host-title">
        <h2 id="host-title" className="font-display text-h3 text-ink">
          {t.events.host.modalTitle}
        </h2>
        <p className="mt-3 text-body text-ink-muted">{t.events.host.modalBody}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to="/connect"
            onClick={() => setHostOpen(false)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-pill bg-mood-deep px-6 text-small font-semibold text-cream-text transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97]"
          >
            {t.events.host.modalCta}
          </Link>
          <button
            type="button"
            onClick={() => setHostOpen(false)}
            className="inline-flex min-h-[44px] items-center justify-center rounded-pill border border-line px-6 text-small font-semibold text-ink transition-colors duration-instant hover:bg-surface"
          >
            {t.events.host.close}
          </button>
        </div>
      </Sheet>
    </section>
  )
}
