import { Card, SectionHead } from '@/components/ui-yashfeen'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { pick } from '@/data'
import type { Localized } from '@/data/types'
import { cn } from '@/lib/utils'
import { useInView } from '@/components/pages/mind/useInView'

interface Guest {
  id: string
  name: Localized
  role: Localized
  topic: Localized
  /** Segment time, Amman (LTR, Western numerals) */
  time: string
  host?: boolean
}

/** This week's lineup (live.md §Section 2 — sample). Host first in DOM, order preserved. */
const guests: Guest[] = [
  {
    id: 'dina',
    name: { en: 'Dina Khalil', ar: 'دينا خليل' },
    role: { en: 'Journalist & host', ar: 'صحفية ومقدّمة' },
    topic: { en: 'Guiding the hour — your questions first', ar: 'تقود الساعة — أسئلتكم أولًا' },
    time: '20:00',
    host: true,
  },
  {
    id: 'samer',
    name: { en: 'Dr. Samer Nasser', ar: 'د. سامر ناصر' },
    role: { en: 'Cardiologist', ar: 'طبيب قلب' },
    topic: { en: 'Why cholesterol advice changed', ar: 'لماذا تغيّرت نصائح الكولسترول' },
    time: '20:10',
  },
  {
    id: 'rania',
    name: { en: 'Rania K.', ar: 'رانيا ك.' },
    role: { en: 'Storyteller', ar: 'راوية قصص' },
    topic: { en: 'What the Dead Sea shore gave back', ar: 'ما الذي ردّه شاطئ البحر الميت' },
    time: '20:35',
  },
  {
    id: 'alshifa',
    name: { en: 'Al-Shifa Pharmacy', ar: 'صيدلية الشفاء' },
    role: { en: 'Pharmacist Q&A', ar: 'أسئلة للصيدلي' },
    topic: { en: 'Your medicine questions, answered plainly', ar: 'إجابات واضحة عن أسئلة أدويتكم' },
    time: '20:50',
  },
]

/** Initials medallion letters from the EN name ("Dr." skipped). */
function initials(nameEn: string): string {
  const words = nameEn.split(/\s+/).filter((w) => w !== 'Dr.')
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function GuestCard({ guest }: { guest: Guest }) {
  const { t, lang } = useLanguage()
  const [ref, inView] = useInView<HTMLDivElement>()

  const medallion = (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-14 w-14 items-center justify-center rounded-full font-display text-lg font-semibold',
        guest.host ? 'bg-sand text-night' : 'bg-[var(--mood-accent-soft)] text-ink',
      )}
      style={{
        // scale-in with 120ms-overshoot back-ease on first reveal (live.md §Section 2)
        transform: inView ? 'scale(1)' : 'scale(0.55)',
        opacity: inView ? 1 : 0,
        transition: 'transform 420ms cubic-bezier(.34,1.56,.64,1), opacity 300ms var(--ease-soft)',
      }}
    >
      {initials(guest.name.en)}
    </span>
  )

  return (
    <div ref={ref} data-reveal className="h-full">
      {guest.host ? (
        /* Host card variant — sand-soft fill + Host chip */
        <div
          className="flex h-full flex-col gap-3 rounded-md border border-line p-6 shadow-card transition-all duration-fast ease-out-expo hover:-translate-y-1 hover:shadow-lift"
          style={{ background: 'var(--afya-rum-sand-soft)' }}
        >
          <div className="flex items-start justify-between gap-3">
            {medallion}
            <span className="inline-flex items-center rounded-pill bg-sand px-3 py-1 text-micro uppercase text-night [html[lang=ar]_&]:normal-case">
              {t.live.hostChip}
            </span>
          </div>
          <h3 className="font-display text-h3" style={{ color: 'var(--afya-ink)' }}>
            {pick(guest.name, lang)}
          </h3>
          <p className="text-small font-semibold" style={{ color: 'var(--afya-rum-sand-deep)' }}>
            {pick(guest.role, lang)}
          </p>
          <p className="text-body" style={{ color: 'var(--afya-ink-muted)' }}>
            {pick(guest.topic, lang)}
          </p>
          <span
            dir="ltr"
            className="mt-auto inline-flex w-fit items-center rounded-pill px-3 py-1 text-micro [font-variant-numeric:tabular-nums]"
            style={{ background: 'var(--afya-cream)', color: 'var(--afya-rum-sand-deep)' }}
            aria-label={`${t.live.segmentAt} ${guest.time}`}
          >
            {guest.time}
          </span>
        </div>
      ) : (
        <Card className="flex h-full flex-col gap-3 p-6 transition-transform duration-fast ease-out-expo hover:-translate-y-1 hover:shadow-lift">
          <div className="flex items-start justify-between gap-3">{medallion}</div>
          <h3 className="font-display text-h3 text-ink">{pick(guest.name, lang)}</h3>
          <p className="text-small font-semibold text-interactive-accent">{pick(guest.role, lang)}</p>
          <p className="text-body text-ink-muted">{pick(guest.topic, lang)}</p>
          <span
            dir="ltr"
            className="mt-auto inline-flex w-fit items-center rounded-pill bg-[var(--mood-accent-soft)] px-3 py-1 text-micro text-ink [font-variant-numeric:tabular-nums]"
            aria-label={`${t.live.segmentAt} ${guest.time}`}
          >
            {guest.time}
          </span>
        </Card>
      )}
    </div>
  )
}

/**
 * Guest lineup (live.md §Section 2): 4 cards — host first in DOM (host card
 * variant), 3-across at 768, 4-across at 1440.
 */
export function GuestLineup() {
  const { t } = useLanguage()
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
      <SectionHead overline={t.live.guestsOverline} title={t.live.guestsTitle} />
      <div className="mt-10 grid gap-5 md:grid-cols-3 xl:grid-cols-4">
        {guests.map((g) => (
          <GuestCard key={g.id} guest={g} />
        ))}
      </div>
    </section>
  )
}
