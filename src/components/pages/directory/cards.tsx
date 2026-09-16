import type { Doctor, Pharmacy, Service, ServiceType } from '@/data'
import { pick } from '@/data'
import { Card, Disclaimer, SourceLine, VerifiedBadge } from '@/components/ui-yashfeen'
import { useLanguage } from '@/context/LanguageProvider'
import { initialsFor, localizeSlot } from './utils'

/* ---------- 1.5px stroke glyphs (design.md §2.7 iconography — no images) ---------- */

const glyphProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/** Cross-free mortar & pestle (directory.md §2 pharmacy card). */
export function MortarGlyph() {
  return (
    <svg {...glyphProps}>
      <path d="M4 12h16" />
      <path d="M5.5 12a6.5 6.5 0 0 0 13 0" />
      <path d="M9 21h6" />
      <path d="M19.5 3.5 14 9" />
      <path d="M16.8 2.8l2.4 2.4" />
    </svg>
  )
}

/** Per-service-type glyphs: lab vial / imaging scan / physio hand / home-care house. */
export function ServiceGlyph({ type }: { type: ServiceType }) {
  if (type === 'lab') {
    return (
      <svg {...glyphProps}>
        <path d="M9.5 3h5" />
        <path d="M10.5 3v5.5L6.6 17a2.6 2.6 0 0 0 2.4 3.5h6a2.6 2.6 0 0 0 2.4-3.5L13.5 8.5V3" />
        <path d="M8.2 14.5h7.6" />
      </svg>
    )
  }
  if (type === 'imaging') {
    return (
      <svg {...glyphProps}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M7 12h2.5l1.5-3 2 6 1.5-3H17" />
      </svg>
    )
  }
  if (type === 'physio') {
    return (
      <svg {...glyphProps}>
        <path d="M8 12.5V6a1.4 1.4 0 0 1 2.8 0v5" />
        <path d="M10.8 11V4.6a1.4 1.4 0 0 1 2.8 0V11" />
        <path d="M13.6 11.2V6.4a1.4 1.4 0 0 1 2.8 0v5.6" />
        <path d="M16.4 12.5l1.6-1.9a1.3 1.3 0 0 1 1.9 1.7l-2.8 4.6A6 6 0 0 1 12 20.5h-.3A5.7 5.7 0 0 1 6 14.8v-2.3" />
      </svg>
    )
  }
  return (
    <svg {...glyphProps}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v10h12V10" />
      <path d="M12 17s-2.2-1.4-2.2-3a1.3 1.3 0 0 1 2.2-.9 1.3 1.3 0 0 1 2.2.9c0 1.6-2.2 3-2.2 3Z" />
    </svg>
  )
}

/* ---------- Shared card bits ---------- */

function Medallion({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--afya-rum-sand-soft)] font-display text-small font-semibold text-sand-deep"
    >
      {label}
    </span>
  )
}

function GlyphMedallion({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--afya-deadsea-teal-soft)] text-teal-deep"
    >
      {children}
    </span>
  )
}

function CardFoot({ source }: { source: Doctor['source'] }) {
  return (
    <div className="mt-4 space-y-1.5 border-t border-line pt-3">
      <SourceLine source={source} />
      <Disclaimer micro />
    </div>
  )
}

const ctaClass =
  'inline-flex min-h-[44px] items-center justify-center rounded-pill bg-mood-deep px-5 text-small font-semibold text-cream-text transition-transform duration-instant ease-soft hover:opacity-90 active:scale-[.97]'

/* ---------- Cards (directory.md §2) ---------- */

export function DoctorCard({ doctor, onBook }: { doctor: Doctor; onBook: (d: Doctor) => void }) {
  const { t, lang } = useLanguage()
  const name = pick(doctor.name, lang)
  return (
    <Card hover className="flex h-full flex-col p-5">
      <div className="flex items-start gap-4">
        <Medallion label={initialsFor(name)} />
        <div className="min-w-0">
          <h3 className="font-display text-h3 text-ink">{name}</h3>
          <p className="mt-1.5">
            <span className="inline-flex items-center rounded-pill bg-[var(--afya-deadsea-teal-soft)] px-3 py-0.5 text-micro text-teal-deep">
              {pick(doctor.specialty, lang)}
            </span>
          </p>
        </div>
      </div>
      <p className="mt-3 text-small text-ink-muted">
        {pick(doctor.clinic, lang)} · {pick(doctor.city, lang)}
      </p>
      <p className="mt-1 text-micro text-ink-muted">
        {t.directory.languagesLabel}: {doctor.languages.join(' · ')}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {doctor.verified && <VerifiedBadge />}
        <span className="inline-flex items-center rounded-pill bg-[var(--afya-rum-sand-soft)] px-3 py-1 text-micro text-sand-deep">
          {t.directory.nextAvailable}: {localizeSlot(doctor.slots[0] ?? '', lang, t.directory.daysShort)}
        </span>
      </div>
      <div className="mt-4 flex-1" />
      <button type="button" onClick={() => onBook(doctor)} className={ctaClass}>
        {t.directory.requestBooking}
      </button>
      <CardFoot source={doctor.source} />
    </Card>
  )
}

export function PharmacyCard({ pharmacy }: { pharmacy: Pharmacy }) {
  const { t, lang } = useLanguage()
  return (
    <Card hover className="flex h-full flex-col p-5">
      <div className="flex items-start gap-4">
        <GlyphMedallion>
          <MortarGlyph />
        </GlyphMedallion>
        <div className="min-w-0">
          <h3 className="font-display text-h3 text-ink">{pick(pharmacy.name, lang)}</h3>
          <p className="mt-1 text-small text-ink-muted">
            {pick(pharmacy.area, lang)} · {pick(pharmacy.city, lang)}
          </p>
        </div>
      </div>
      <p className="mt-3 text-small text-ink-muted">{pick(pharmacy.hours, lang)}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {pharmacy.verified && <VerifiedBadge />}
        {pharmacy.onDuty && (
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-[var(--afya-deadsea-teal-soft)] px-3 py-1 text-micro text-teal-deep">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal" />
            {t.directory.onDuty}
          </span>
        )}
      </div>
      <div className="mt-4 flex-1" />
      <a href={`tel:${pharmacy.phone.replace(/\s/g, '')}`} className={ctaClass} dir="ltr">
        {pharmacy.phone}
      </a>
      <p className="mt-2 text-micro text-ink-muted">{t.directory.callToConfirm}</p>
      <CardFoot source={pharmacy.source} />
    </Card>
  )
}

export function ServiceCard({ service, onBook }: { service: Service; onBook: (s: Service) => void }) {
  const { t, lang } = useLanguage()
  return (
    <Card hover className="flex h-full flex-col p-5">
      <div className="flex items-start gap-4">
        <GlyphMedallion>
          <ServiceGlyph type={service.type} />
        </GlyphMedallion>
        <div className="min-w-0">
          <h3 className="font-display text-h3 text-ink">{pick(service.name, lang)}</h3>
          <p className="mt-1.5">
            <span className="inline-flex items-center rounded-pill bg-[var(--afya-deadsea-teal-soft)] px-3 py-0.5 text-micro text-teal-deep">
              {t.directory.serviceTypes[service.type]}
            </span>
          </p>
        </div>
      </div>
      <p className="mt-3 text-small font-semibold text-ink">{t.directory.priceFrom(service.priceFrom)}</p>
      <p className="mt-1 text-small text-ink-muted">
        {pick(service.provider, lang)} · {pick(service.city, lang)}
      </p>
      <div className="mt-4 flex-1" />
      <button type="button" onClick={() => onBook(service)} className={ctaClass}>
        {t.directory.requestBooking}
      </button>
      <CardFoot source={service.source} />
    </Card>
  )
}
