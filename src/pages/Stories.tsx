import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Story } from '@/data/types'
import { pick } from '@/data'
import { useCmsStories } from '@/hooks/useCmsContent'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { MOODS, MOOD_ORDER } from '@/lib/moods'
import type { MoodId } from '@/lib/moods'
import { CmsNotice, CmsSkeleton } from '@/components/CmsState'
import { Card } from '@/components/ui-yashfeen/Card'
import { Chip } from '@/components/ui-yashfeen/Chip'
import { SectionHead } from '@/components/ui-yashfeen/SectionHead'
import { StoryDrawer } from '@/components/pages/stories/StoryDrawer'
import { ShareModal } from '@/components/pages/stories/ShareModal'
import { cn } from '@/lib/utils'

type Filter = 'all' | MoodId

/** See News.tsx — inactive shared-Chip text needs the deep mood tone on Wadi Night. */

/* ------------------------------------------------------------------ */
/* Story card (stories.md §2)                                          */
/* ------------------------------------------------------------------ */
function StoryCard({ story: s, onOpen }: { story: Story; onOpen: (s: Story) => void }) {
  const { t, lang } = useLanguage()
  const mood = MOODS[s.moodTag]
  return (
    <Card
      hover
      className="group texture-grain relative flex h-full flex-col overflow-hidden rounded-lg p-6 ps-7 before:rounded-lg before:opacity-[0.04] md:p-7 md:ps-8"
    >
      {/* 4px start-edge accent bar in the story's mood color; grows to 6px on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 start-0 w-1 transition-[width] duration-fast ease-soft group-hover:w-1.5"
        style={{ background: mood.accent }}
      />
      <div className="relative z-[1] flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-pill px-3 py-1 text-micro" style={{ background: mood.accentSoft, color: mood.accentDeep }}>
            {t.mood.moods[s.moodTag]}
          </span>
          {s.destinationLabel && (
            <span
              className="rounded-pill px-3 py-1 text-micro"
              style={{ background: 'var(--afya-rum-sand-soft)', color: 'var(--afya-rum-sand-deep)' }}
            >
              {pick(s.destinationLabel, lang)}
            </span>
          )}
        </div>

        {/* Display quote hook — Fraunces italic, the story's most human line */}
        <blockquote className="mt-5 font-display italic text-[1.25rem] leading-snug text-ink md:text-[1.4rem]">
          “{pick(s.quote, lang)}”
        </blockquote>

        <h3 className="mt-4 font-display text-h3 text-ink">{pick(s.title, lang)}</h3>
        <p className="mt-1 text-small text-ink-muted">
          {pick(s.author, lang)} · {pick(s.city, lang)}
        </p>
        <p className="mt-3 flex-1 text-body text-ink-muted">{pick(s.excerpt, lang)}</p>

        <button
          type="button"
          onClick={() => onOpen(s)}
          className="mt-5 inline-flex min-h-[44px] items-center gap-2 self-start text-small font-semibold text-interactive transition-colors duration-instant hover:text-interactive-accent"
        >
          {t.stories.readCta}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="rtl-flip transition-transform duration-fast group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Filtered grid — re-keyed per filter so the editorial reveal replays */
/* ------------------------------------------------------------------ */
function StoryGrid({ items, onOpen }: { items: Story[]; onOpen: (s: Story) => void }) {
  const ref = useReveal<HTMLDivElement>({ stagger: 0.12, y: 48 })
  return (
    <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
      {items.map((s, i) => (
        // Alternating vertical offset at 1440 (even cards +32px) — editorial rhythm
        <div key={s.id} data-reveal className={cn('xl:max-w-[580px]', i % 2 === 1 && 'xl:mt-8')}>
          <StoryCard story={s} onOpen={onOpen} />
        </div>
      ))}
    </div>
  )
}

/**
 * Stories (/stories) — first-person experience cards with a reading drawer,
 * mood-tag filters, and the "Share yours" invitation band (stories.md).
 */
export default function Stories() {
  const { t } = useLanguage()
  const headerRef = useReveal<HTMLElement>()
  const chipsRef = useReveal<HTMLDivElement>({ stagger: 0.04, y: 16, duration: 0.5 })
  const inviteRef = useReveal<HTMLElement>()

  const [active, setActive] = useState<Filter>('all')
  const [openStory, setOpenStory] = useState<Story | null>(null)
  const [shareOpen, setShareOpen] = useState(false)

  // Live CMS content (tRPC content API) — published stories.
  const { data: storiesData, isLoading, isError, refetch } = useCmsStories()
  const stories = useMemo(() => storiesData ?? [], [storiesData])

  const filtered = useMemo(
    () => (active === 'all' ? stories : stories.filter((s) => s.moodTag === active)),
    [active, stories],
  )

  // Filtering changes page height — keep reveal trigger positions accurate.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => window.clearTimeout(id)
  }, [active])

  return (
    <>
      {/* Section 1 — Header + mood-tag filter chips */}
      <section ref={headerRef} className="mx-auto max-w-content px-4 pt-16 md:px-6 md:pt-24">
        <SectionHead as="h1" overline={t.stories.overline} title={t.stories.h1} lede={t.stories.lede} />
        <div
          ref={chipsRef}
          role="group"
          aria-label={t.stories.filterLabel}
          className="mt-8 flex flex-wrap gap-2"
        >
          <Chip
            data-reveal
            active={active === 'all'}
            onClick={() => setActive('all')}
            className={cn('min-h-[44px]')}
          >
            {t.stories.all}
          </Chip>
          {MOOD_ORDER.map((id) => (
            <Chip
              key={id}
              data-reveal
              active={active === id}
              onClick={() => setActive(id)}
              className={cn('min-h-[44px]')}
            >
              {t.mood.moods[id]}
            </Chip>
          ))}
        </div>
      </section>

      {/* Section 2 — Story cards */}
      <section aria-label={t.stories.overline} className="mx-auto max-w-content px-4 py-10 md:px-6 md:py-14">
        {isLoading ? (
          <CmsSkeleton count={4} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8" />
        ) : isError ? (
          <CmsNotice variant="error" onRetry={() => refetch()} />
        ) : stories.length === 0 ? (
          <CmsNotice variant="empty" />
        ) : (
          <>
            <StoryGrid key={active} items={filtered} onOpen={setOpenStory} />
            {filtered.length === 0 && <p className="mt-8 text-center text-body text-ink-muted">{t.stories.empty}</p>}
          </>
        )}
      </section>

      {/* Section 4 — Invitation band */}
      <section ref={inviteRef} aria-labelledby="stories-invite-title" className="px-4 pb-16 md:px-6 md:pb-24">
        <div
          data-reveal
          className="mx-auto flex max-w-[720px] flex-col items-center gap-4 rounded-lg border border-line bg-raised p-6 text-center shadow-card md:p-10"
        >
          <h2 id="stories-invite-title" className="font-display text-h3 text-ink">
            {t.stories.invite.title}
          </h2>
          <p className="max-w-prose text-body text-ink-muted">{t.stories.invite.text}</p>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="mt-2 inline-flex min-h-[44px] items-center rounded-pill border border-interactive px-6 text-small font-semibold text-interactive transition-all duration-fast ease-soft hover:bg-interactive hover:text-cream-text active:scale-[.97] [html[data-theme=wadi-night]_&]:hover:text-[#1B1611]"
          >
            {t.stories.invite.cta}
          </button>
        </div>
      </section>

      {/* Section 3 — Reading drawer + share modal */}
      <AnimatePresence>
        {openStory && <StoryDrawer key={openStory.id} story={openStory} onClose={() => setOpenStory(null)} />}
      </AnimatePresence>
      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
    </>
  )
}
