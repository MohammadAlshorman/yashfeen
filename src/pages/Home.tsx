import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Hero } from '@/components/home/Hero'
import { DestinationGlyph } from '@/components/home/DestinationGlyph'
import { Card, Disclaimer, SectionHead, SourceLine, VerifiedBadge } from '@/components/ui-yashfeen'
import { useLanguage } from '@/context/LanguageProvider'
import { useMood } from '@/context/MoodProvider'
import { useBreathe } from '@/context/BreatheProvider'
import { useReveal } from '@/hooks/useReveal'
import { MOODS, MOOD_ORDER } from '@/lib/moods'
import { nextShowTime, countdownParts } from '@/lib/nextShow'
import { destinations, pick } from '@/data'
import { useCmsArticles, useCmsDoctors, useCmsEvents, useCmsPharmacies, useCmsStories } from '@/hooks/useCmsContent'
import { CmsNotice, CmsSkeleton } from '@/components/CmsState'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Section 2b — "Today's mood" strip (post-first-visit)                */
/* ------------------------------------------------------------------ */
function MoodStrip() {
  const { t } = useLanguage()
  const { mood, setMood } = useMood()
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} aria-label={t.mood.stripTitle} className="border-b border-line bg-raised">
      <div className="mx-auto flex max-w-content flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 md:px-6">
        <span data-reveal className="text-micro uppercase text-ink-muted [html[lang=ar]_&]:normal-case">
          {t.mood.stripTitle}
        </span>
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          {MOOD_ORDER.map((id) => (
            <button
              key={id}
              data-reveal
              type="button"
              onClick={() => setMood(id)}
              aria-pressed={mood === id}
              className={cn(
                'relative inline-flex min-h-[44px] items-center gap-2 rounded-pill px-3 text-small transition-colors duration-fast',
                mood === id ? 'font-semibold text-ink' : 'text-ink-muted hover:text-ink',
              )}
            >
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 rounded-full"
                style={{
                  background: `radial-gradient(circle at 35% 30%, ${MOODS[id].accentSoft}, ${MOODS[id].accent})`,
                  boxShadow: mood === id ? `0 0 10px ${MOODS[id].glow}` : 'none',
                }}
              />
              {t.mood.moods[id]}
              {mood === id && (
                <span aria-hidden="true" className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-mood" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 3 — News Pulse preview                                      */
/* ------------------------------------------------------------------ */
function NewsPreview() {
  const { t, lang } = useLanguage()
  const ref = useReveal<HTMLElement>()
  // Live CMS content (tRPC content API) — published articles.
  const { data: articles, isLoading, isError, refetch } = useCmsArticles()
  const featured = (articles ?? []).slice(0, 3)
  return (
    <section ref={ref} className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
      <SectionHead overline={t.home.news.overline} title={t.home.news.title} />
      {isLoading ? (
        <CmsSkeleton count={3} className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" />
      ) : isError ? (
        <CmsNotice variant="error" onRetry={() => refetch()} className="mt-10" />
      ) : featured.length === 0 ? (
        <CmsNotice variant="empty" className="mt-10" />
      ) : (
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((a, i) => (
          <Card key={a.id} hover data-reveal className={cn('flex flex-col p-6', i === 0 && 'md:row-span-2')}>
            <span className="inline-flex min-h-[36px] w-fit items-center gap-1.5 rounded-pill bg-[var(--mood-accent-soft)] px-4 py-1.5 text-small text-ink">
              {pick(a.categoryLabel, lang)}
            </span>
            <h3 className="mt-4 font-display text-h3 text-ink">{pick(a.title, lang)}</h3>
            <p className="mt-2 flex-1 text-body text-ink-muted">{pick(a.dek, lang)}</p>
            <div className="mt-5 space-y-2">
              <SourceLine source={a.source} date={a.publishedAt} />
              <div className="flex items-center justify-between gap-3">
                <span className="text-small text-ink-muted">{t.common.readMins(a.readMins)}</span>
                <Disclaimer micro />
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}
      <div data-reveal className="mt-8 flex justify-end">
        <Link
          to="/news"
          className="group inline-flex min-h-[44px] items-center gap-2 text-small font-semibold text-interactive"
        >
          {t.home.news.allLink}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip transition-transform duration-fast group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 4 — Destination ribbon (gateway to Medical Tourism)         */
/* ------------------------------------------------------------------ */
const WORDMARK_CLASS: Record<string, string> = {
  'dead-sea': 'lowercase tracking-[-0.02em]',
  'main-hot-springs': 'italic',
  'wadi-rum': 'uppercase tracking-[0.18em]',
  petra: '[font-variant:small-caps] [text-shadow:0_1px_0_rgba(255,255,255,.35),0_-1px_0_rgba(0,0,0,.25)]',
  aqaba: 'tracking-[0.04em]',
}

function DestinationRibbon() {
  const { t, lang } = useLanguage()
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
      <SectionHead overline={t.home.destinations.overline} title={t.home.destinations.title} />
      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 xl:grid xl:snap-none xl:grid-cols-5 xl:overflow-visible xl:pb-0">
        {destinations.map((d) => (
          <Link
            key={d.id}
            data-reveal
            to={`/medical-tourism#${d.anchor}`}
            className="group relative flex min-h-[320px] w-[78vw] min-w-[78vw] snap-start flex-col justify-between overflow-hidden rounded-lg p-6 shadow-card transition-all duration-fast ease-out-expo hover:-translate-y-1.5 hover:shadow-lift md:w-[38%] md:min-w-[38%] xl:w-auto xl:min-w-0"
            style={{ background: `linear-gradient(160deg, ${d.palette[0]} 0%, ${d.palette[2]} 100%)`, color: d.palette[1] }}
          >
            {/* signature pattern at 8% → 14% on hover */}
            <div
              aria-hidden="true"
              className={cn(d.textureClass, 'absolute inset-0 opacity-[0.08] transition-opacity duration-fast group-hover:opacity-[0.14]')}
              style={{ color: d.palette[1] }}
            />
            <DestinationGlyph glyph={d.glyph} className="glyph-draw relative opacity-90" />
            <div className="relative">
              <h3 className={cn('font-display text-2xl font-semibold', lang === 'en' && WORDMARK_CLASS[d.id])}>
                {pick(d.name, lang)}
              </h3>
              <p className="mt-2 text-small opacity-90">{pick(d.promise, lang)}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-small font-semibold underline decoration-transparent underline-offset-4 transition-colors duration-fast group-hover:decoration-current">
                {t.home.destinations.enter}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip transition-transform duration-fast group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 5 — Mind & Meditation preview (idle breathing orb)          */
/* ------------------------------------------------------------------ */
function MindPreview() {
  const { t } = useLanguage()
  const { openBreathe } = useBreathe()
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="bg-raised">
      <div className="mx-auto grid max-w-content items-center gap-12 px-4 py-16 md:grid-cols-[55%_45%] md:px-6 md:py-24">
        <div>
          <SectionHead overline={t.home.mind.overline} title={t.home.mind.title} lede={t.home.mind.lede} />
          <div data-reveal className="mt-8">
            <Link
              to="/mind"
              className="group inline-flex min-h-[48px] items-center gap-2 rounded-pill bg-interactive px-7 py-3 text-small font-semibold text-cream-text shadow-lift transition-all duration-fast ease-soft hover:brightness-110 active:scale-[0.97]"
            >
              {t.home.mind.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip transition-transform duration-fast group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
        <div data-reveal className="flex flex-col items-center gap-5">
          <button
            type="button"
            onClick={openBreathe}
            aria-label={t.breathe.ariaOpen}
            className="group relative flex items-center justify-center"
          >
            {/* rotating dune-contour ring (24s, 6% opacity) */}
            <div
              aria-hidden="true"
              className="animate-ring-rotate texture-dune-contours absolute -inset-8 rounded-full opacity-[0.06]"
              style={{
                color: 'var(--mood-accent)',
                maskImage: 'radial-gradient(circle, transparent 58%, black 60%, black 74%, transparent 76%)',
                WebkitMaskImage: 'radial-gradient(circle, transparent 58%, black 60%, black 74%, transparent 76%)',
              }}
            />
            <span
              aria-hidden="true"
              className="animate-orb-pulse block h-[180px] w-[180px] rounded-full transition-transform duration-fast group-hover:scale-[1.04] xl:h-[220px] xl:w-[220px]"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--mood-accent) 55%, #F4EFE6), var(--mood-accent) 70%)',
                boxShadow: 'var(--shadow-glow)',
              }}
            />
          </button>
          <p className="text-small text-ink-muted">{t.breathe.tapToBreathe}</p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 6 — Voices: Stories + Verified preview                      */
/* ------------------------------------------------------------------ */
function VoicesPreview() {
  const { t, lang } = useLanguage()
  const ref = useReveal<HTMLElement>()
  // Live CMS content (tRPC content API) — published stories, doctors, pharmacies.
  const storiesQuery = useCmsStories()
  const doctorsQuery = useCmsDoctors()
  const pharmaciesQuery = useCmsPharmacies()

  const storyPair = (storiesQuery.data ?? []).slice(0, 2)

  const verifiedLoading = doctorsQuery.isLoading || pharmaciesQuery.isLoading
  const verifiedError = doctorsQuery.isError || pharmaciesQuery.isError
  const refetchVerified = () => {
    doctorsQuery.refetch()
    pharmaciesQuery.refetch()
  }
  const verifiedPair = [
    doctorsQuery.data?.[0] && {
      name: doctorsQuery.data[0].name,
      role: doctorsQuery.data[0].specialty,
      city: doctorsQuery.data[0].city,
      update: doctorsQuery.data[0].update,
      updateSource: doctorsQuery.data[0].updateSource,
      updateDate: doctorsQuery.data[0].updateDate,
      id: `doctor-${doctorsQuery.data[0].id}`,
    },
    pharmaciesQuery.data?.[0] && {
      name: pharmaciesQuery.data[0].name,
      role: pharmaciesQuery.data[0].area,
      city: pharmaciesQuery.data[0].city,
      update: pharmaciesQuery.data[0].update,
      updateSource: pharmaciesQuery.data[0].updateSource,
      updateDate: pharmaciesQuery.data[0].updateDate,
      id: `pharmacy-${pharmaciesQuery.data[0].id}`,
    },
  ].filter((v): v is NonNullable<typeof v> => Boolean(v))
  return (
    <section ref={ref} className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
      <div className="relative grid gap-12 md:grid-cols-2 md:gap-16">
        {/* salt-crystal lattice divider (horizontal on mobile, vertical on md+) */}
        <div
          aria-hidden="true"
          className="texture-salt-lattice absolute inset-x-0 -top-6 h-6 w-full opacity-60 md:inset-x-auto md:start-1/2 md:top-0 md:h-full md:w-6 md:-translate-x-1/2 rtl:md:translate-x-1/2"
          style={{ color: 'var(--afya-line)' }}
        />
        {/* Stories column */}
        <div>
          <SectionHead overline={t.home.voices.storiesOverline} title={t.home.voices.storiesTitle} />
          {storiesQuery.isLoading ? (
            <CmsSkeleton count={2} className="mt-8 space-y-5" />
          ) : storiesQuery.isError ? (
            <CmsNotice variant="error" onRetry={() => storiesQuery.refetch()} className="mt-8" />
          ) : storyPair.length === 0 ? (
            <CmsNotice variant="empty" className="mt-8" />
          ) : (
          <div className="mt-8 space-y-5">
            {storyPair.map((s) => (
              <Card key={s.id} hover data-reveal className="relative p-6 ps-7">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-4 start-0 w-1 rounded-full"
                  style={{ background: MOODS[s.moodTag].accent }}
                />
                <div className="flex flex-wrap gap-2">
                  <span
                    className="rounded-pill px-3 py-1 text-micro"
                    style={{ background: MOODS[s.moodTag].accentSoft, color: MOODS[s.moodTag].accentDeep }}
                  >
                    {t.mood.moods[s.moodTag]}
                  </span>
                  {s.destinationLabel && (
                    <span className="rounded-pill bg-sand-soft px-3 py-1 text-micro text-sand-deep">
                      {pick(s.destinationLabel, lang)}
                    </span>
                  )}
                </div>
                <p className="mt-4 font-display text-xl italic leading-snug text-ink">“{pick(s.quote, lang)}”</p>
                <p className="mt-3 text-small text-ink-muted">
                  {pick(s.author, lang)} · {pick(s.city, lang)}
                </p>
                <Link
                  to="/stories"
                  className="group mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-small font-semibold text-interactive"
                >
                  {t.home.voices.readStory}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip transition-transform duration-fast group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </Card>
            ))}
          </div>
          )}
        </div>
        {/* Verified column */}
        <div>
          <SectionHead overline={t.home.voices.verifiedOverline} title={t.home.voices.verifiedTitle} />
          {verifiedLoading ? (
            <CmsSkeleton count={2} className="mt-8 space-y-5" />
          ) : verifiedError ? (
            <CmsNotice variant="error" onRetry={refetchVerified} className="mt-8" />
          ) : verifiedPair.length === 0 ? (
            <CmsNotice variant="empty" className="mt-8" />
          ) : (
          <div className="mt-8 space-y-5">
            {verifiedPair.map((v) => (
              <Card key={v.id} hover data-reveal className="border-s-4 border-s-teal p-6">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-small font-semibold text-ink">{pick(v.name, lang)}</span>
                  <VerifiedBadge />
                </div>
                <p className="mt-0.5 text-small text-ink-muted">
                  {pick(v.role, lang)} · {pick(v.city, lang)}
                </p>
                <p className="mt-3 text-body text-ink">{pick(v.update, lang)}</p>
                <div className="mt-4 space-y-2">
                  <SourceLine source={{ name: v.updateSource, url: '#' }} date={v.updateDate} />
                  <Disclaimer micro />
                </div>
              </Card>
            ))}
          </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 7 — Plan your care: Directory + Events + Live               */
/* ------------------------------------------------------------------ */
const EVENT_DOT_COLOR: Record<string, string> = {
  screening: 'var(--afya-deadsea-teal)',
  workshop: 'var(--afya-petra-rose)',
  walk: 'var(--afya-rum-sand)',
  talk: 'var(--afya-ink)',
}

function LiveMiniCountdown() {
  const { t } = useLanguage()
  const target = useMemo(() => nextShowTime(), [])
  const [parts, setParts] = useState(() => countdownParts(target))
  useEffect(() => {
    const id = window.setInterval(() => setParts(countdownParts(target)), 30_000)
    return () => window.clearInterval(id)
  }, [target])
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <p dir="ltr" className="mt-3 font-display text-2xl font-semibold tabular-nums text-ink">
      {pad(parts.days)}
      <span className="mx-1 text-ink-muted">:</span>
      {pad(parts.hours)}
      <span className="mx-1 text-ink-muted">:</span>
      {pad(parts.mins)}
      <span className="ms-2 align-middle font-body text-micro font-medium text-ink-muted">
        {t.home.plan.liveDays} · {t.home.plan.liveHours} · {t.home.plan.liveMins}
      </span>
    </p>
  )
}

function PlanTiles() {
  const { t, lang } = useLanguage()
  const ref = useReveal<HTMLElement>()
  // Live CMS content (tRPC content API) — published events drive the category dots.
  const { data: events, isLoading } = useCmsEvents()
  return (
    <section ref={ref} aria-label={t.home.plan.overline} className="bg-raised">
      <div className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Directory tile */}
          <Card hover data-reveal className="flex flex-col p-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--mood-accent)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <p className="mt-4 text-micro uppercase text-interactive-accent [html[lang=ar]_&]:normal-case">{t.home.plan.overline}</p>
            <h3 className="mt-2 font-display text-h3 text-ink">{t.home.plan.directoryTitle}</h3>
            <p className="mt-2 flex-1 text-body text-ink-muted">{t.home.plan.directoryText}</p>
            <Link to="/directory" className="group mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-small font-semibold text-interactive">
              {t.home.plan.directoryCta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip transition-transform duration-fast group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Card>
          {/* Events tile — slightly raised on xl for rhythm */}
          <Card hover data-reveal className="flex flex-col p-6 xl:-translate-y-3">
            {/* mini calendar glyph with the 4 sample events' category dots */}
            <div aria-hidden="true" className="w-fit rounded-sm border border-line p-2">
              <svg width="40" height="34" viewBox="0 0 40 34" fill="none" stroke="var(--mood-accent)" strokeWidth="1.5" strokeLinecap="round">
                <rect x="2" y="4" width="36" height="28" rx="3" />
                <path d="M2 11h36M11 2v4M29 2v4" />
              </svg>
              <div aria-busy={isLoading || undefined} className="mt-1.5 flex min-h-[6px] items-center justify-center gap-1.5">
                {isLoading
                  ? Array.from({ length: 4 }, (_, i) => (
                      <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--afya-line)]" />
                    ))
                  : (events ?? []).map((e) => (
                      <span key={e.id} title={pick(e.title, lang)} className="h-1.5 w-1.5 rounded-full" style={{ background: EVENT_DOT_COLOR[e.category] }} />
                    ))}
              </div>
            </div>
            <p className="mt-4 text-micro uppercase text-interactive-accent [html[lang=ar]_&]:normal-case">{t.home.plan.overline}</p>
            <h3 className="mt-2 font-display text-h3 text-ink">{t.home.plan.eventsTitle}</h3>
            <p className="mt-2 flex-1 text-body text-ink-muted">{t.home.plan.eventsText}</p>
            <Link to="/events" className="group mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-small font-semibold text-interactive">
              {t.home.plan.eventsCta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip transition-transform duration-fast group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Card>
          {/* Live tile — Anemone-red pulsing dot + mini countdown */}
          <Card hover data-reveal className="flex flex-col p-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-pill border border-line px-3 py-1.5 text-micro text-ink">
              <span aria-hidden="true" className="animate-live-pulse h-2 w-2 rounded-full bg-anemone" />
              LIVE
            </span>
            <h3 className="mt-4 font-display text-h3 text-ink">{t.home.plan.liveTitle}</h3>
            <p className="mt-2 text-body text-ink-muted">{t.home.plan.liveText}</p>
            <LiveMiniCountdown />
            <Link to="/live" className="group mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-small font-semibold text-interactive">
              {t.home.plan.liveCta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip transition-transform duration-fast group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Card>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 8 — Connect band (Wadi Night, dark in both themes)          */
/* ------------------------------------------------------------------ */
function ConnectBand() {
  const { t } = useLanguage()
  const ref = useReveal<HTMLElement>()
  return (
    <section ref={ref} className="relative mt-16 text-cream-text" style={{ background: 'var(--afya-wadi-night)' }}>
      {/* dune-contour divider */}
      <svg aria-hidden="true" className="absolute -top-6 left-0 h-6 w-full" viewBox="0 0 1200 24" preserveAspectRatio="none">
        <path d="M0 24 C 150 6, 300 18, 450 10 S 700 20, 850 8 S 1100 16, 1200 6 L 1200 24 Z" fill="var(--afya-wadi-night)" />
        <path d="M0 24 C 150 6, 300 18, 450 10 S 700 20, 850 8 S 1100 16, 1200 6" fill="none" stroke="var(--afya-rum-sand)" strokeOpacity="0.25" strokeWidth="1" />
      </svg>
      <div className="mx-auto max-w-[900px] px-4 py-16 text-center md:px-6 md:py-24">
        <h2 data-reveal className="font-display text-h2">
          {t.home.connect.title}
        </h2>
        <div data-reveal className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <a
            href="https://t.me/afyajo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill border border-night-border px-6 text-small font-semibold transition-all duration-fast hover:-translate-y-0.5 hover:border-teal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 4 3 11.2l5.5 2L10 19l2.8-3.4L17 18l4-14Z" />
            </svg>
            {t.home.connect.telegram}
          </a>
          <a
            href="https://wa.me/962771777711"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill border border-night-border px-6 text-small font-semibold transition-all duration-fast hover:-translate-y-0.5 hover:border-teal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
              <path d="M9.5 8.5c.3 2.5 3.5 5.5 6 6l1.5-1.5-2-1.5-1 .8c-1-.5-2-1.5-2.5-2.5l.8-1-1.5-2-1.3 1.7Z" />
            </svg>
            {t.home.connect.whatsapp}
          </a>
          <Link
            to="/connect"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill border border-night-border px-6 text-small font-semibold transition-all duration-fast hover:-translate-y-0.5 hover:border-teal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <rect x="7" y="3" width="10" height="18" rx="2" />
              <path d="M11 18h2" />
            </svg>
            {t.home.connect.sms}
          </Link>
        </div>
        <p data-reveal className="mt-6 text-small text-cream-muted">{t.home.connect.pushNote}</p>
        <div data-reveal className="mt-6">
          <Link
            to="/connect"
            className="inline-flex min-h-[48px] items-center rounded-pill px-7 py-3 text-small font-semibold text-night transition-transform duration-fast hover:brightness-105 active:scale-[0.97]"
            style={{ background: 'var(--afya-rum-sand)' }}
          >
            {t.home.connect.cta}
          </Link>
        </div>
        <p data-reveal className="mt-6 text-micro normal-case tracking-normal text-cream-muted">
          {t.home.connect.micro}
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */
export default function Home() {
  const { hasChosen, openPrompt } = useMood()

  // First-visit mood prompt: after hero load completes + 800ms (home.md §2)
  useEffect(() => {
    if (hasChosen) return
    const timer = window.setTimeout(openPrompt, 2200)
    return () => window.clearTimeout(timer)
  }, [hasChosen, openPrompt])

  return (
    <>
      <Hero />
      {hasChosen && <MoodStrip />}
      <NewsPreview />
      <DestinationRibbon />
      <MindPreview />
      <VoicesPreview />
      <PlanTiles />
      <ConnectBand />
    </>
  )
}
