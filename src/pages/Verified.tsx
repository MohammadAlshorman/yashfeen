import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCmsDoctors, useCmsPharmacies } from '@/hooks/useCmsContent'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { CmsNotice, CmsSkeleton } from '@/components/CmsState'
import { Chip } from '@/components/ui-yashfeen/Chip'
import { Disclaimer } from '@/components/ui-yashfeen/Disclaimer'
import { SectionHead } from '@/components/ui-yashfeen/SectionHead'
import { UpdateCard } from '@/components/pages/verified/UpdateCard'
import type { TopicKey, UpdateItem } from '@/components/pages/verified/UpdateCard'
import { VerificationModal } from '@/components/pages/verified/VerificationModal'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'doctors' | 'pharmacies' | TopicKey

/**
 * Topic tags per update (verified.md §2 filter topics) — page-local mapping,
 * keyed by `kind-index` in the published CMS list order (the seed order
 * matches the original doc-01…/ph-01… sample ids).
 */
const TOPICS: Record<string, TopicKey[]> = {
  'doctor-0': ['fluSeason'],
  'doctor-1': ['chronicCare'],
  'doctor-2': ['wellness'],
  'pharmacy-0': ['medicationSafety'],
  'doctor-3': ['fluSeason'],
  'pharmacy-1': ['medicationSafety', 'chronicCare'],
}

/**
 * The six verified updates, in the order specified by verified.md §3 —
 * expressed as indices into the published doctors/pharmacies lists so it
 * works with the CMS API's numeric ids.
 */
const UPDATE_ORDER: { kind: 'doctor' | 'pharmacy'; index: number }[] = [
  { kind: 'doctor', index: 0 },
  { kind: 'doctor', index: 1 },
  { kind: 'doctor', index: 2 },
  { kind: 'pharmacy', index: 0 },
  { kind: 'doctor', index: 3 },
  { kind: 'pharmacy', index: 1 },
]

const FILTER_ORDER: Filter[] = ['all', 'doctors', 'pharmacies', 'fluSeason', 'medicationSafety', 'chronicCare', 'wellness']

/** See News.tsx — inactive shared-Chip text needs the deep mood tone on Wadi Night. */

/**
 * Verified (/verified) — trust layer: updates from licensed Jordanian doctors &
 * pharmacies, each with a Verified badge and a source-cited card (verified.md).
 */
export default function Verified() {
  const { t } = useLanguage()
  const headerRef = useReveal<HTMLElement>({ stagger: 0.2 })
  const chipsRef = useReveal<HTMLDivElement>({ stagger: 0.04, y: 16, duration: 0.5 })
  const becomeRef = useReveal<HTMLElement>()

  const [active, setActive] = useState<Filter>('all')
  const [modalOpen, setModalOpen] = useState(false)

  // Live CMS content (tRPC content API) — published doctors & pharmacies.
  const doctorsQuery = useCmsDoctors()
  const pharmaciesQuery = useCmsPharmacies()
  const isLoading = doctorsQuery.isLoading || pharmaciesQuery.isLoading
  const isError = doctorsQuery.isError || pharmaciesQuery.isError
  const refetch = () => {
    doctorsQuery.refetch()
    pharmaciesQuery.refetch()
  }

  const items = useMemo<UpdateItem[]>(() => {
    const doctors = doctorsQuery.data ?? []
    const pharmacies = pharmaciesQuery.data ?? []
    return UPDATE_ORDER.flatMap(({ kind, index }): UpdateItem[] => {
      const key = `${kind}-${index}`
      if (kind === 'doctor') {
        const d = doctors[index]
        if (!d) return []
        return [
          {
            kind,
            id: key,
            name: d.name,
            role: { en: `${d.specialty.en}, ${d.city.en}`, ar: `${d.specialty.ar}، ${d.city.ar}` },
            onDuty: false,
            update: d.update,
            updateSource: d.updateSource,
            updateDate: d.updateDate,
            topics: TOPICS[key] ?? [],
          },
        ]
      }
      const p = pharmacies[index]
      if (!p) return []
      return [
        {
          kind,
          id: key,
          name: p.name,
          role: { en: `${p.area.en}, ${p.city.en}`, ar: `${p.area.ar}، ${p.city.ar}` },
          onDuty: p.onDuty,
          update: p.update,
          updateSource: p.updateSource,
          updateDate: p.updateDate,
          topics: TOPICS[key] ?? [],
        },
      ]
    })
  }, [doctorsQuery.data, pharmaciesQuery.data])

  const filtered = useMemo(() => {
    if (active === 'all') return items
    if (active === 'doctors') return items.filter((i) => i.kind === 'doctor')
    if (active === 'pharmacies') return items.filter((i) => i.kind === 'pharmacy')
    return items.filter((i) => i.topics.includes(active))
  }, [active, items])

  // Filtering changes page height — keep reveal trigger positions accurate.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 450)
    return () => window.clearTimeout(id)
  }, [active])

  return (
    <>
      {/* Section 1 — Header + trust explainer strip */}
      <section ref={headerRef} className="px-4 pt-16 md:px-6 md:pt-24">
        <div className="mx-auto max-w-content">
          <SectionHead as="h1" overline={t.verified.overline} title={t.verified.h1} lede={t.verified.lede} className="md:max-w-[720px]" />
        </div>
        {/* Trust strip: badge glyph + what it means + disclaimer (teal-soft band) */}
        <div
          data-reveal
          className="mt-10 border-y border-line bg-teal-soft [html[data-theme=wadi-night]_&]:bg-[color-mix(in_oklab,var(--afya-deadsea-teal)_18%,var(--afya-night-raised))]"
        >
          <div className="mx-auto flex max-w-content flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:gap-8 md:px-6">
            <span className="flex items-center gap-3 text-small font-semibold text-teal-deep [html[data-theme=wadi-night]_&]:text-teal-soft">
              <svg width="40" height="40" viewBox="0 0 64 64" fill="none" aria-hidden="true" className="shrink-0">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
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
              {t.verified.trustTitle}
            </span>
            <p className="flex-1 text-small text-ink">{t.verified.trustText}</p>
            <Disclaimer micro className="md:max-w-[220px]" />
          </div>
        </div>
      </section>

      {/* Section 2 — Filter row (single-select across type + topics) */}
      <div className="mx-auto max-w-content px-4 md:px-6">
        <div
          ref={chipsRef}
          role="group"
          aria-label={t.verified.filterLabel}
          className="max-md:ltr:[mask-image:linear-gradient(to_left,transparent,black_40px)] max-md:rtl:[mask-image:linear-gradient(to_right,transparent,black_40px)] -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        >
          {FILTER_ORDER.map((f) => (
            <Chip
              key={f}
              data-reveal
              active={active === f}
              onClick={() => setActive(f)}
              className={cn('min-h-[44px] shrink-0')}
            >
              {t.verified.filters[f]}
            </Chip>
          ))}
        </div>
      </div>

      {/* Section 3 — Verified update cards */}
      <section aria-label={t.verified.overline} className="mx-auto max-w-[1100px] px-4 py-10 md:px-6 md:py-14">
        {isLoading ? (
          <CmsSkeleton count={6} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8" />
        ) : isError ? (
          <CmsNotice variant="error" onRetry={refetch} />
        ) : items.length === 0 ? (
          <CmsNotice variant="empty" />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <UpdateCard key={item.id} item={item} index={i} />
                ))}
              </AnimatePresence>
            </div>
            {filtered.length === 0 && <p className="mt-8 text-center text-body text-ink-muted">{t.verified.empty}</p>}
          </>
        )}
      </section>

      {/* Section 4 — "Become a verified source" band */}
      <section ref={becomeRef} aria-labelledby="become-title" className="px-4 pb-16 md:px-6 md:pb-24">
        <div
          data-reveal
          className="mx-auto flex max-w-[900px] flex-col items-center gap-4 rounded-lg border border-line bg-raised p-6 text-center shadow-card md:p-10"
        >
          <h2 id="become-title" className="font-display text-h3 text-ink">
            {t.verified.become.title}
          </h2>
          <p className="max-w-prose text-body text-ink-muted">{t.verified.become.text}</p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-2 inline-flex min-h-[44px] items-center rounded-pill border border-interactive px-6 text-small font-semibold text-interactive transition-all duration-fast ease-soft hover:bg-interactive hover:text-cream-text active:scale-[.97] [html[data-theme=wadi-night]_&]:hover:text-[#1B1611]"
          >
            {t.verified.become.cta}
          </button>
        </div>
      </section>

      {modalOpen && <VerificationModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
