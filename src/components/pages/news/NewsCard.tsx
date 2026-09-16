import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Article } from '@/data/types'
import { pick } from '@/data'
import { useLanguage } from '@/context/LanguageProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Disclaimer } from '@/components/ui-yashfeen/Disclaimer'
import { SourceLine } from '@/components/ui-yashfeen/SourceLine'
import { CategoryBand } from './CategoryBand'
import { cn } from '@/lib/utils'

interface NewsCardProps {
  article: Article
  /** Position in the filtered feed — drives the every-4th feature rhythm (news.md §2) */
  index: number
  saved: boolean
  onToggleSave: (id: string) => void
}

/**
 * Vertical short-form news card (news.md §2): visual header band, category chip +
 * read time, display headline, short body, source line, "Read summary" accordion
 * (420ms ease-soft) with remaining paragraphs + full disclaimer, and a bookmark
 * toggle persisted by the page. Framer Motion owns entrance/layout animation, so
 * hover lift lives on the inner visual card (keeps GSAP out of this tree).
 */
export function NewsCard({ article: a, index, saved, onToggleSave }: NewsCardProps) {
  const { t, lang } = useLanguage()
  const reduced = useReducedMotion()
  const [expanded, setExpanded] = useState(false)
  const feature = index % 4 === 3
  const panelId = `news-summary-${a.id}`

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              duration: 0.6,
              delay: (index % 3) * 0.08,
              ease: [0.16, 1, 0.3, 1],
              layout: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
            }
      }
      className={cn('max-md:snap-start', feature && 'xl:col-span-2')}
    >
      <div
        className={cn(
          // Tall portrait card (news.md); grid rows stretch cards to equal height.
          // The 3:4.2 aspect from the spec is intentionally not hard-enforced so
          // expanded summaries and longer Arabic copy can never be clipped.
          'afya-card afya-card-hover flex h-full flex-col overflow-hidden rounded-lg',
        )}
      >
        <CategoryBand category={a.category} />

        <div className="flex min-h-0 flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-pill bg-[var(--mood-accent-soft)] px-3 py-1 text-micro text-ink">
              {pick(a.categoryLabel, lang)}
            </span>
            <span className="text-small text-ink-muted">{t.common.readMins(a.readMins)}</span>
          </div>

          <h3
            className={cn('mt-4 font-display font-semibold leading-snug text-ink', feature ? 'text-[1.5rem] xl:text-[1.75rem]' : 'text-[1.5rem]')}
          >
            {pick(a.title, lang)}
          </h3>

          <p className="mt-3 text-body text-ink-muted">{pick(a.dek, lang)}</p>

          {/* "Read summary" in-card accordion (height auto, 420ms ease-soft) */}
          <div
            id={panelId}
            aria-hidden={!expanded}
            className={cn(
              'grid transition-[grid-template-rows] duration-med ease-soft',
              expanded ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]',
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-3 pt-3">
                {a.body.map((p, i) => (
                  <p key={i} className="text-body text-ink-muted">
                    {pick(p, lang)}
                  </p>
                ))}
                <Disclaimer className="pt-1" />
              </div>
            </div>
          </div>

          <div className="mt-auto space-y-3 pt-4">
            <SourceLine source={a.source} date={a.publishedAt} />
            <div className="flex items-center justify-between gap-3 border-t border-line pt-2">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="inline-flex min-h-[44px] items-center gap-1.5 text-small font-semibold text-interactive transition-colors duration-instant hover:text-interactive-accent"
              >
                {expanded ? t.news.hideSummary : t.news.readSummary}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="transition-transform duration-fast ease-soft"
                  style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onToggleSave(a.id)}
                aria-pressed={saved}
                aria-label={saved ? t.news.removeSave : t.news.save}
                title={saved ? t.news.saved : t.news.save}
                className="flex h-11 w-11 items-center justify-center rounded-full text-interactive transition-colors duration-instant hover:bg-surface"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ fill: saved ? 'currentColor' : 'none', transition: 'fill 220ms var(--ease-soft)' }}
                >
                  <path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4.8L5.5 21V4.5a1 1 0 0 1 1-1Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
