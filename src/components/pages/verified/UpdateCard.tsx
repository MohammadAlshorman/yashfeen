import { motion } from 'framer-motion'
import type { Localized } from '@/data/types'
import { pick } from '@/data'
import { useLanguage } from '@/context/LanguageProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Disclaimer } from '@/components/ui-yashfeen/Disclaimer'
import { SourceLine } from '@/components/ui-yashfeen/SourceLine'
import { VerifiedBadge } from '@/components/ui-yashfeen/VerifiedBadge'

export type TopicKey = 'fluSeason' | 'medicationSafety' | 'chronicCare' | 'wellness'

/** One verified update, normalized from a Doctor or Pharmacy sample entry. */
export interface UpdateItem {
  kind: 'doctor' | 'pharmacy'
  id: string
  name: Localized
  /** Role line tail — "Family Medicine, Amman" / "Wehdat, Amman" (composed per lang) */
  role: Localized
  onDuty: boolean
  update: Localized
  updateSource: Localized
  updateDate: string
  topics: TopicKey[]
}

interface UpdateCardProps {
  item: UpdateItem
  index: number
}

/** Two-letter monogram from a display name — no photos ever (verified.md §3). */
function initials(name: string): string {
  const clean = name.replace(/^(Dr\.|د\.)\s*/u, '').trim()
  const words = clean.split(/\s+/).filter(Boolean)
  const letters = words.slice(0, 2).map((w) => Array.from(w)[0] ?? '')
  return letters.join('') || clean.slice(0, 2)
}

/**
 * Verified update card (verified.md §3): initials medallion, name + role line,
 * Verified badge (pops scale 0→1.15→1 on first reveal, 380ms back-ease), update
 * body, teal source line + topic chips + micro disclaimer. Inline-start 3px teal
 * border; hover lift is a calm −4px. Framer Motion owns entrance/layout here.
 */
export function UpdateCard({ item, index }: UpdateCardProps) {
  const { t, lang } = useLanguage()
  const reduced = useReducedMotion()

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              duration: 0.6,
              delay: (index % 2) * 0.08,
              ease: [0.16, 1, 0.3, 1],
              layout: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
            }
      }
      className="h-full"
    >
      <div className="afya-card flex h-full flex-col border-s-[3px] border-s-teal p-6 transition-all duration-fast ease-out-expo hover:-translate-y-1 hover:shadow-lift">
        {/* Header: medallion · name + role · Verified badge */}
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-soft font-display text-small font-semibold text-teal-deep"
          >
            {initials(pick(item.name, lang))}
          </span>
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-ink">
              <span>{pick(item.name, lang)}</span>
              <motion.span
                className="inline-flex"
                initial={reduced ? false : { scale: 0 }}
                whileInView={{ scale: [0, 1.15, 1] }}
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 0.38, delay: (index % 2) * 0.08 + 0.25, times: [0, 0.6, 1], ease: 'backOut' }
                }
              >
                <VerifiedBadge />
              </motion.span>
            </p>
            <p className="mt-0.5 text-small text-ink-muted">
              {pick(item.role, lang)}
              {item.onDuty && (
                <span className="ms-2 inline-flex items-center gap-1 rounded-pill bg-teal-soft px-2 py-0.5 align-middle text-micro text-teal-deep">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal" />
                  {t.verified.onDuty}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Body: the update text */}
        <p className="mt-4 flex-1 text-body text-ink">{pick(item.update, lang)}</p>

        {/* Footer: source citation + topic chips + micro disclaimer */}
        <div className="mt-5 space-y-3 border-t border-line pt-3">
          <SourceLine source={{ name: item.updateSource, url: '#' }} date={item.updateDate} />
          <div className="flex flex-wrap items-center gap-2">
            {item.topics.map((topic) => (
              <span key={topic} className="rounded-pill bg-[var(--mood-accent-soft)] px-2.5 py-0.5 text-micro text-ink">
                {t.verified.filters[topic]}
              </span>
            ))}
          </div>
          <Disclaimer micro />
        </div>
      </div>
    </motion.article>
  )
}
