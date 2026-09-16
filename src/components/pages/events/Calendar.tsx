import { useEffect, useMemo, useRef, useState } from 'react'
import type { AfyaEvent } from '@/data'
import { useLanguage } from '@/context/LanguageProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { CATEGORY_DOT } from './categoryColors'
import { cn } from '@/lib/utils'

function toISO(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

interface CalendarProps {
  year: number
  /** 0-indexed month */
  month: number
  monthLabel: string
  selected: string | null
  onSelect: (iso: string | null) => void
  onNavigate: (dir: -1 | 1) => void
  onToday: () => void
  /** Direction of the last month navigation (drives the slide animation) */
  navDir: -1 | 1
  eventsByDate: Map<string, AfyaEvent[]>
}

/**
 * Monthly calendar (events.md §2): 7-column grid, week starts Sunday, stays
 * dir="ltr" with Western numerals inside RTL pages. Today = mood-accent ring,
 * selected = sand-soft fill, up to 3 category dots per day. Arrow-key roving
 * tabindex with role="grid"/"gridcell"; Enter selects, re-tap clears.
 */
export function Calendar({
  year,
  month,
  monthLabel,
  selected,
  onSelect,
  onNavigate,
  onToday,
  navDir,
  eventsByDate,
}: CalendarProps) {
  const { t, lang, dir } = useLanguage()
  const reduced = useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)
  const dayRefs = useRef<Map<number, HTMLButtonElement>>(new Map())

  const todayISO = useMemo(() => {
    const n = new Date()
    return toISO(n.getFullYear(), n.getMonth(), n.getDate())
  }, [])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = new Date(year, month, 1).getDay() // week starts Sunday
  const [focusDayRaw, setFocusDay] = useState(1)
  // Clamp during render so a shorter month never leaves an out-of-range focus day
  const focusDay = Math.min(focusDayRaw, daysInMonth)

  // Month change: grid slides ±40px + fade (300ms; direction mirrored in RTL)
  useEffect(() => {
    if (reduced || !gridRef.current) return
    const sign = navDir * (dir === 'rtl' ? -1 : 1)
    gridRef.current.animate(
      [
        { opacity: 0, transform: `translateX(${sign * 40}px)` },
        { opacity: 1, transform: 'translateX(0)' },
      ],
      { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' },
    )
    // Day-cell dots pop in, staggered 30ms
    gridRef.current.querySelectorAll('[data-dot]').forEach((dot, i) => {
      ;(dot as HTMLElement).animate(
        [
          { transform: 'scale(0)' },
          { transform: 'scale(1)' },
        ],
        { duration: 220, delay: i * 30, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
      )
    })
  }, [year, month, navDir, dir, reduced])

  const dayDateLabel = (day: number): string =>
    new Intl.DateTimeFormat(lang === 'ar' ? 'ar-JO-u-nu-latn' : 'en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date(year, month, day))

  const onGridKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null
    if (e.key === 'ArrowRight') next = Math.min(focusDay + 1, daysInMonth)
    else if (e.key === 'ArrowLeft') next = Math.max(focusDay - 1, 1)
    else if (e.key === 'ArrowDown') next = Math.min(focusDay + 7, daysInMonth)
    else if (e.key === 'ArrowUp') next = Math.max(focusDay - 7, 1)
    else if (e.key === 'Home') next = 1
    else if (e.key === 'End') next = daysInMonth
    if (next !== null) {
      e.preventDefault()
      setFocusDay(next)
      dayRefs.current.get(next)?.focus()
    }
  }

  const chevron = (points: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={points} />
    </svg>
  )

  return (
    <div dir="ltr" className="w-full">
      {/* Header bar: month + year, prev/next chevrons, Today pill */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">{monthLabel}</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onNavigate(-1)}
            aria-label={t.events.prevMonth}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-instant hover:bg-raised"
          >
            {chevron('M15 6l-6 6 6 6')}
          </button>
          <button
            type="button"
            onClick={onToday}
            className="inline-flex min-h-[44px] items-center rounded-pill border border-line px-4 text-small font-semibold text-ink transition-colors duration-instant hover:border-mood"
          >
            {t.events.today}
          </button>
          <button
            type="button"
            onClick={() => onNavigate(1)}
            aria-label={t.events.nextMonth}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-instant hover:bg-raised"
          >
            {chevron('M9 6l6 6-6 6')}
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="mt-4 grid grid-cols-7 gap-1" role="row">
        {t.events.weekdays.map((wd) => (
          <div key={wd} role="columnheader" className="py-1 text-center text-micro text-ink-muted">
            {wd}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div
        ref={gridRef}
        role="grid"
        aria-label={t.events.calendarLabel}
        onKeyDown={onGridKeyDown}
        className="grid grid-cols-7 gap-1"
      >
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div key={`blank-${i}`} aria-hidden="true" className="min-h-[44px] md:min-h-[72px]" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const iso = toISO(year, month, day)
          const dayEvents = eventsByDate.get(iso) ?? []
          const categories = [...new Set(dayEvents.map((e) => e.category))].slice(0, 3)
          const isToday = iso === todayISO
          const isSelected = iso === selected
          return (
            <button
              key={iso}
              ref={(el) => {
                if (el) dayRefs.current.set(day, el)
                else dayRefs.current.delete(day)
              }}
              type="button"
              role="gridcell"
              tabIndex={day === focusDay ? 0 : -1}
              aria-selected={isSelected}
              aria-label={
                dayEvents.length > 0
                  ? t.events.dayWithEvents(dayDateLabel(day), dayEvents.length)
                  : dayDateLabel(day)
              }
              onClick={() => onSelect(isSelected ? null : iso)}
              onFocus={() => setFocusDay(day)}
              className={cn(
                'flex min-h-[44px] flex-col items-center justify-start rounded-sm pt-1.5 text-ink transition-colors duration-fast ease-soft md:min-h-[72px]',
                isSelected ? 'bg-[var(--afya-rum-sand-soft)]' : 'hover:bg-raised',
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-small font-medium',
                  isToday && 'ring-2 ring-mood ring-offset-1 ring-offset-surface',
                )}
              >
                {day}
              </span>
              <span className="mt-1 flex h-1.5 items-center gap-1">
                {categories.map((c) => (
                  <span
                    key={c}
                    data-dot
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: CATEGORY_DOT[c] }}
                  />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-micro text-ink-muted">{t.events.sampleWindow}</p>
    </div>
  )
}
