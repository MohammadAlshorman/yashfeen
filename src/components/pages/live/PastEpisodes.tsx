import { useEffect, useRef, useState } from 'react'
import { SectionHead } from '@/components/ui-yashfeen'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { pick, formatDate } from '@/data'
import type { Episode } from '@/data/types'
import { useCmsEpisodes } from '@/hooks/useCmsContent'
import { CmsNotice, CmsSkeleton } from '@/components/CmsState'
import { cn } from '@/lib/utils'

const TOPIC_CHIP =
  'inline-flex items-center rounded-pill bg-[var(--mood-accent-soft)] px-3 py-1 text-micro text-ink'

function TopicChips({ episode }: { episode: Episode }) {
  const { t, lang } = useLanguage()
  const visible = episode.topics.slice(0, 2)
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((topic, i) => (
        <span key={i} className={cn(TOPIC_CHIP, i > 0 && 'hidden md:inline-flex')}>
          {pick(topic, lang)}
        </span>
      ))}
      {/* 360: chips hide beyond 1 → "+N"; 768+: beyond 2 → "+N" */}
      {episode.topics.length > 1 && (
        <span className={cn(TOPIC_CHIP, 'md:hidden')}>
          {t.live.moreTopics(episode.topics.length - 1)}
        </span>
      )}
      {episode.topics.length > 2 && (
        <span className={cn(TOPIC_CHIP, 'hidden md:inline-flex')}>
          {t.live.moreTopics(episode.topics.length - 2)}
        </span>
      )}
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="rtl-flip">
      <path d="M7 4.5v15l13-7.5-13-7.5Z" />
    </svg>
  )
}

/**
 * Episode detail modal (live.md §Section 3): summary, topic list, guest list,
 * and the honest player placeholder — never a fake broken player.
 */
function EpisodeModal({ episode, onClose }: { episode: Episode; onClose: () => void }) {
  const { t, lang } = useLanguage()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => dialogRef.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="presentation" onClick={onClose}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'rgba(27,22,17,.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={pick(episode.title, lang)}
        tabIndex={-1}
        className="relative z-10 max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-lg border border-line bg-raised p-6 shadow-overlay outline-none md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.live.closeDetails}
          className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors duration-instant hover:bg-surface hover:text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <p className="text-micro uppercase text-interactive-accent [html[lang=ar]_&]:normal-case" dir="ltr">
          {t.live.epNumber(episode.number)} · {formatDate(episode.airedAt, lang)} · {t.common.mins(episode.durationMins)}
        </p>
        <h3 className="mt-2 pe-10 font-display text-h2 text-ink">{pick(episode.title, lang)}</h3>

        {/* Honest placeholder state — no fake player */}
        <p className="mt-4 rounded-sm border border-dashed border-line bg-surface px-4 py-3 text-small text-ink-muted">
          {t.live.playerNote}
        </p>

        <p className="mt-4 text-body text-ink">{pick(episode.summary, lang)}</p>

        <div className="mt-5">
          <p className="text-micro uppercase text-ink-muted [html[lang=ar]_&]:normal-case">{t.live.topicsLabel}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {episode.topics.map((topic, i) => (
              <span key={i} className={TOPIC_CHIP}>
                {pick(topic, lang)}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-micro uppercase text-ink-muted [html[lang=ar]_&]:normal-case">{t.live.guestsLabel}</p>
          <ul className="mt-2 space-y-1 text-small text-ink">
            {episode.guests.map((g, i) => (
              <li key={i}>{pick(g, lang)}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <p className="text-micro uppercase text-ink-muted [html[lang=ar]_&]:normal-case">{t.live.notesLabel}</p>
          <p className="mt-2 text-small text-ink-muted">{pick(episode.notes, lang)}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Past episodes (live.md §Section 3): archive-style rows from the typed
 * `episodes` data; Play opens the detail modal. Wadi Night → night-raised rows.
 */
export function PastEpisodes() {
  const { t, lang } = useLanguage()
  const ref = useReveal<HTMLElement>()
  const [openId, setOpenId] = useState<string | null>(null)

  // Live CMS content (tRPC content API) — published episodes.
  const { data: episodesData, isLoading, isError, refetch } = useCmsEpisodes()
  const episodes = episodesData ?? []
  const openEpisode = episodes.find((e) => e.id === openId) ?? null

  return (
    <section ref={ref} className="border-y border-line bg-surface">
      <div className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
        <SectionHead overline={t.live.archiveOverline} title={t.live.archiveTitle} />
        {isLoading ? (
          <CmsSkeleton count={3} className="mx-auto mt-10 max-w-[900px] space-y-4" />
        ) : isError ? (
          <CmsNotice variant="error" onRetry={() => refetch()} className="mx-auto mt-10 max-w-[900px]" />
        ) : episodes.length === 0 ? (
          <CmsNotice variant="empty" className="mx-auto mt-10 max-w-[900px]" />
        ) : (
        <div className="mx-auto mt-10 max-w-[900px] space-y-4">
          {episodes.map((ep) => (
            <article
              key={ep.id}
              data-reveal
              className="group flex flex-col gap-4 rounded-md border border-line bg-raised p-5 shadow-card transition-all duration-fast ease-soft hover:shadow-lift motion-safe:hover:translate-x-1.5 motion-safe:rtl:hover:-translate-x-1.5 md:flex-row md:items-center md:gap-6"
            >
              {/* Episode number block — sand, fills 100% on row hover */}
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-sand-soft font-display text-xl font-semibold text-sand-deep transition-colors duration-fast group-hover:bg-sand group-hover:text-night md:h-16 md:w-16 md:text-2xl"
              >
                {ep.number}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-h3 text-ink">{pick(ep.title, lang)}</h3>
                <p className="mt-1 truncate text-micro tracking-normal text-ink-muted">
                  {ep.guests.map((g) => pick(g, lang)).join(' · ')}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="text-micro tracking-normal text-ink-muted" dir="ltr">
                    {formatDate(ep.airedAt, lang)}
                  </span>
                  <span
                    className="inline-flex items-center rounded-pill border border-line px-3 py-1 text-micro text-ink [font-variant-numeric:tabular-nums]"
                    dir="ltr"
                  >
                    {t.common.mins(ep.durationMins)}
                  </span>
                  <TopicChips episode={ep} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpenId(ep.id)}
                aria-label={`${t.live.play} — ${pick(ep.title, lang)}`}
                className="inline-flex min-h-[44px] shrink-0 items-center gap-2 self-start rounded-pill bg-interactive px-5 py-2.5 text-small font-semibold text-surface transition-transform duration-fast ease-soft hover:scale-[1.03] active:scale-[0.97] md:self-center"
              >
                <PlayIcon />
                {t.live.play}
              </button>
            </article>
          ))}
        </div>
        )}
      </div>

      {openEpisode && <EpisodeModal episode={openEpisode} onClose={() => setOpenId(null)} />}
    </section>
  )
}
