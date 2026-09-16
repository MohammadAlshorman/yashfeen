import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import type { Doctor, Pharmacy, Service } from '@/data'
import { pick } from '@/data'
import { useCmsDoctors, useCmsPharmacies, useCmsServices } from '@/hooks/useCmsContent'
import { CmsNotice, CmsSkeleton } from '@/components/CmsState'
import { Card, Chip, Disclaimer } from '@/components/ui-yashfeen'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { DoctorCard, PharmacyCard, ServiceCard } from '@/components/pages/directory/cards'
import { BookingModal } from '@/components/pages/directory/BookingModal'
import type { BookingTarget, ConfirmedRequest } from '@/components/pages/directory/BookingModal'
import { initialsFor, localizeSlot } from '@/components/pages/directory/utils'
import { cn } from '@/lib/utils'

type TypeFilter = 'all' | 'doctors' | 'pharmacies' | 'services'
type CityKey = 'all' | 'amman' | 'irbid' | 'zarqa' | 'madaba' | 'aqaba' | 'karak'

const CITY_ORDER: Exclude<CityKey, 'all'>[] = ['amman', 'irbid', 'zarqa', 'madaba', 'aqaba', 'karak']
/** Canonical EN city names used to match the data layer's localized city field. */
const CITY_EN: Record<Exclude<CityKey, 'all'>, string> = {
  amman: 'Amman',
  irbid: 'Irbid',
  zarqa: 'Zarqa',
  madaba: 'Madaba',
  aqaba: 'Aqaba',
  karak: 'Karak',
}

/** Generic sample slots for services (which carry no slots[] in the data layer). */
const SERVICE_SLOTS = ['Sun 10:30', 'Mon 12:00', 'Wed 17:30']

/**
 * Wadi Night fix: the mood engine sets --mood-accent-soft inline on <html>, so the
 * dark color-mix remap never applies; give inactive chips a dark tint explicitly.
 */

type DirItem =
  | { kind: 'doctor'; id: string; doctor: Doctor }
  | { kind: 'pharmacy'; id: string; pharmacy: Pharmacy }
  | { kind: 'service'; id: string; service: Service }

interface OpenRequest extends ConfirmedRequest {
  status: 'open' | 'cancelled'
}

/**
 * Directory & Booking (directory.md): search + type chips + city select over the
 * sample doctors/pharmacies/services, results grid, 2-step booking-request modal
 * with client-side AF-… reference, pinned open-request card, coverage band.
 */
export default function Directory() {
  const ref = useReveal<HTMLElement>({ stagger: 0.06, y: 32 })
  const { t, lang } = useLanguage()
  const reduced = useReducedMotion()

  const [query, setQuery] = useState('')
  const [q, setQ] = useState('')
  const [type, setType] = useState<TypeFilter>('all')
  const [city, setCity] = useState<CityKey>('all')
  const [target, setTarget] = useState<BookingTarget | null>(null)
  const [request, setRequest] = useState<OpenRequest | null>(null)

  const searchRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLParagraphElement>(null)

  // Live CMS content (tRPC content API) — published doctors, pharmacies, services.
  const doctorsQuery = useCmsDoctors()
  const pharmaciesQuery = useCmsPharmacies()
  const servicesQuery = useCmsServices()
  const doctors = useMemo(() => doctorsQuery.data ?? [], [doctorsQuery.data])
  const pharmacies = useMemo(() => pharmaciesQuery.data ?? [], [pharmaciesQuery.data])
  const services = useMemo(() => servicesQuery.data ?? [], [servicesQuery.data])
  const cmsLoading = doctorsQuery.isLoading || pharmaciesQuery.isLoading || servicesQuery.isLoading
  const cmsError = doctorsQuery.isError || pharmaciesQuery.isError || servicesQuery.isError
  const refetchAll = () => {
    doctorsQuery.refetch()
    pharmaciesQuery.refetch()
    servicesQuery.refetch()
  }

  // Debounced live search (200ms — directory.md §1)
  useEffect(() => {
    const id = setTimeout(() => setQ(query.trim().toLowerCase()), 200)
    return () => clearTimeout(id)
  }, [query])

  // Search bar scales 0.98→1 on load (500ms)
  useEffect(() => {
    if (reduced || !searchRef.current) return
    searchRef.current.animate(
      [
        { transform: 'scale(.98)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 },
      ],
      { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
    )
  }, [reduced])

  const results = useMemo<DirItem[]>(() => {
    const items: DirItem[] = [
      // CMS ids are numeric per table — prefix with kind so grid keys stay unique.
      ...doctors.map((d) => ({ kind: 'doctor', id: `doctor-${d.id}`, doctor: d }) as const),
      ...pharmacies.map((p) => ({ kind: 'pharmacy', id: `pharmacy-${p.id}`, pharmacy: p }) as const),
      ...services.map((s) => ({ kind: 'service', id: `service-${s.id}`, service: s }) as const),
    ]
    return items.filter((item) => {
      const itemType: TypeFilter =
        item.kind === 'doctor' ? 'doctors' : item.kind === 'pharmacy' ? 'pharmacies' : 'services'
      if (type !== 'all' && itemType !== type) return false
      const cityLoc = item.kind === 'doctor' ? item.doctor.city : item.kind === 'pharmacy' ? item.pharmacy.city : item.service.city
      if (city !== 'all' && cityLoc.en !== CITY_EN[city]) return false
      if (!q) return true
      const haystacks: string[] =
        item.kind === 'doctor'
          ? [
              item.doctor.name.en, item.doctor.name.ar,
              item.doctor.specialty.en, item.doctor.specialty.ar,
              item.doctor.clinic.en, item.doctor.clinic.ar,
              item.doctor.city.en, item.doctor.city.ar,
              t.directory.types.doctors,
            ]
          : item.kind === 'pharmacy'
            ? [
                item.pharmacy.name.en, item.pharmacy.name.ar,
                item.pharmacy.area.en, item.pharmacy.area.ar,
                item.pharmacy.city.en, item.pharmacy.city.ar,
                t.directory.types.pharmacies,
              ]
            : [
                item.service.name.en, item.service.name.ar,
                item.service.provider.en, item.service.provider.ar,
                item.service.city.en, item.service.city.ar,
                item.service.type, t.directory.serviceTypes[item.service.type],
                t.directory.types.services,
              ]
      return haystacks.some((h) => h.toLowerCase().includes(q))
    })
  }, [q, type, city, t, doctors, pharmacies, services])

  const resultsKey = `${type}|${city}|${q}|${lang}`

  // Filter-change animation: new set staggers in (fade+scale, 60ms stagger)
  useEffect(() => {
    if (reduced) return
    const grid = gridRef.current
    if (grid) {
      Array.from(grid.children).forEach((child, i) => {
        ;(child as HTMLElement).animate(
          [
            { opacity: 0, transform: 'scale(.97)' },
            { opacity: 1, transform: 'scale(1)' },
          ],
          { duration: 240, delay: i * 60, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
        )
      })
    }
    // Result count crossfade (200ms)
    countRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out' })
  }, [resultsKey, reduced])

  const openDoctorBooking = (d: Doctor) =>
    setTarget({
      id: d.id,
      kind: 'doctor',
      name: pick(d.name, lang),
      subtitle: `${pick(d.specialty, lang)} · ${pick(d.clinic, lang)}`,
      initials: initialsFor(pick(d.name, lang)),
      slots: d.slots,
    })

  const openServiceBooking = (s: Service) =>
    setTarget({
      id: s.id,
      kind: 'service',
      name: pick(s.name, lang),
      subtitle: `${t.directory.serviceTypes[s.type]} · ${pick(s.provider, lang)}`,
      initials: '',
      serviceType: s.type,
      slots: SERVICE_SLOTS,
    })

  const clearFilters = () => {
    setQuery('')
    setQ('')
    setType('all')
    setCity('all')
  }

  return (
    <section ref={ref} className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
      {/* ——— Section 1: header + search ——— */}
      <header className="mx-auto max-w-[760px] text-center">
        <p data-reveal className="text-micro uppercase text-interactive-accent [html[lang=ar]_&]:normal-case">
          {t.directory.overline}
        </p>
        <h1 data-reveal className="mt-3 font-display text-h1 text-ink">
          {t.directory.h1}
        </h1>

        <div ref={searchRef} className="relative mt-8">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
            className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2 text-ink-muted"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            role="searchbox"
            aria-label={t.directory.searchLabel}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.directory.searchPlaceholder}
            className="h-14 w-full rounded-pill border border-line bg-raised pe-5 ps-12 text-body text-ink shadow-card placeholder:text-ink-muted"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <div role="group" aria-label={t.directory.typeFilterLabel} className="flex flex-wrap justify-center gap-2">
            {(['all', 'doctors', 'pharmacies', 'services'] as const).map((k) => (
              <Chip
                key={k}
                active={type === k}
                onClick={() => setType(k)}
                className={undefined}
              >
                {t.directory.types[k]}
              </Chip>
            ))}
          </div>
          <label className="inline-flex items-center gap-2">
            <span className="sr-only">{t.directory.cityLabel}</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value as CityKey)}
              aria-label={t.directory.cityLabel}
              className="min-h-[44px] rounded-pill border border-line bg-raised px-4 text-small text-ink"
            >
              <option value="all">{t.directory.cities.all}</option>
              {CITY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {t.directory.cities[c]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p ref={countRef} aria-live="polite" className="mt-5 text-small text-ink-muted">
          {cmsLoading ? t.cms.loading : t.directory.results(results.length)}
        </p>
      </header>

      {/* ——— Section 2: results grid ——— */}
      <div className="mt-8">
        {/* Pinned open request card (directory.md §3) */}
        {request && (
          <Card
            className={cn(
              'mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-teal p-5',
              request.status === 'cancelled' && 'opacity-75',
            )}
          >
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--afya-deadsea-teal-soft)] text-teal-deep">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="5" width="16" height="16" rx="2" />
                <path d="M8 3v4M16 3v4M4 10h16" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-small font-semibold text-ink">
                {request.status === 'open' ? t.directory.openRequest : t.directory.cancelledSample}
              </p>
              <p className={cn('mt-0.5 text-small text-ink-muted', request.status === 'cancelled' && 'line-through')}>
                {request.reference} · {request.provider} ·{' '}
                {localizeSlot(request.slot, lang, t.directory.daysShort)}
              </p>
            </div>
            {request.status === 'open' && (
              <button
                type="button"
                onClick={() => setRequest({ ...request, status: 'cancelled' })}
                className="inline-flex min-h-[44px] items-center rounded-pill border border-line px-4 text-small font-semibold text-danger transition-colors duration-instant hover:bg-surface"
              >
                {t.directory.cancelRequest}
              </button>
            )}
          </Card>
        )}

        {cmsLoading ? (
          <CmsSkeleton count={6} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" />
        ) : cmsError ? (
          <CmsNotice variant="error" onRetry={refetchAll} />
        ) : results.length > 0 ? (
          <div ref={gridRef} key={resultsKey} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {results.map((item) =>
              item.kind === 'doctor' ? (
                <DoctorCard key={item.id} doctor={item.doctor} onBook={openDoctorBooking} />
              ) : item.kind === 'pharmacy' ? (
                <PharmacyCard key={item.id} pharmacy={item.pharmacy} />
              ) : (
                <ServiceCard key={item.id} service={item.service} onBook={openServiceBooking} />
              ),
            )}
          </div>
        ) : (
          /* Empty state: salt-crystal lattice panel (directory.md §2) */
          <div className="relative overflow-hidden rounded-lg border border-line bg-raised p-10 text-center">
            <div aria-hidden="true" className="texture-salt-lattice absolute inset-0 text-teal opacity-30" />
            <div className="relative">
              <p className="font-display text-h3 text-ink">{t.directory.emptyTitle}</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex min-h-[44px] items-center rounded-pill bg-mood-deep px-6 text-small font-semibold text-cream-text transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97]"
              >
                {t.directory.clearFilters}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ——— Section 4: coverage note band ——— */}
      <div data-reveal className="mt-16">
        <Card className="flex flex-col items-start gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="max-w-prose text-body text-ink">{t.directory.coverage}</p>
          <Link
            to="/connect"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-pill border border-line px-5 text-small font-semibold text-interactive transition-colors duration-instant hover:border-mood"
          >
            {t.directory.coverageCta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </Card>
        <Disclaimer className="mt-4" />
      </div>

      <BookingModal
        target={target}
        onClose={() => setTarget(null)}
        onConfirmed={(req) => setRequest({ ...req, status: 'open' })}
      />
    </section>
  )
}
