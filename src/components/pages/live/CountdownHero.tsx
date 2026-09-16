import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { nextShowTime, countdownParts } from '@/lib/nextShow'
import { subscribeToPush } from '@/integrations/push.stub'
import { cn } from '@/lib/utils'

/** 120ms translateY flip for changing numerals (live.md §Section 1). Scoped — index.css is shared. */
const FLIP_STYLES = `
@keyframes afya-live-flip {
  from { transform: translateY(6px); opacity: .35; }
  to { transform: translateY(0); opacity: 1; }
}
.afya-live-flip {
  display: inline-block;
  animation: afya-live-flip 120ms var(--ease-out-expo) both;
}
`

function CountdownBlock({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, '0')
  return (
    <div className="flex min-w-[3.25rem] flex-col items-center gap-1.5 md:min-w-[4.5rem]">
      <span
        key={text}
        className="afya-live-flip font-display text-[1.75rem] font-semibold leading-none text-cream-text [font-variant-numeric:tabular-nums] md:text-[2.25rem] xl:text-[3.5rem]"
      >
        {text}
      </span>
      <span className="text-micro uppercase text-cream-muted [html[lang=ar]_&]:normal-case">
        {label}
      </span>
    </div>
  )
}

function BellIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M13.7 20a2 2 0 0 1-3.4 0" />
    </svg>
  )
}

/**
 * Live §Section 1 — full-width Wadi Night band (dark in both themes) with
 * drifting dune contours, pulsing LIVE dot, and the countdown to next Thursday
 * 20:00 Asia/Amman. Countdown is dir="ltr" with Western numerals (§2.9).
 * At zero: "We're live" state with a disabled-style join button (no fake stream).
 */
export function CountdownHero() {
  const { t } = useLanguage()
  const ref = useReveal<HTMLElement>()
  const target = useMemo(() => nextShowTime(), [])
  const [now, setNow] = useState(() => Date.now())
  const [armed, setArmed] = useState(false)
  const [arming, setArming] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const isLive = target - now <= 0
  const { days, hours, mins } = countdownParts(target, now)
  const secs = Math.max(0, Math.floor((target - now) / 1000)) % 60

  // STUB: schedule local notification via push.stub.ts — mock subscribe only.
  const toggleReminder = async () => {
    if (armed) {
      setArmed(false)
      return
    }
    setArming(true)
    await subscribeToPush('live')
    setArming(false)
    setArmed(true)
  }

  return (
    <section
      ref={ref}
      aria-labelledby="live-title"
      className="relative overflow-hidden bg-night"
    >
      <style>{FLIP_STYLES}</style>
      {/* drifting dune-contour lines at 8%, 8s loop (paused off-screen by global CSS) */}
      <div
        aria-hidden="true"
        className="texture-dune-contours animate-dune-drift absolute inset-0 opacity-[0.08]"
        style={{ color: '#EFE7DA' }}
      />
      <div className="relative z-10 mx-auto max-w-content px-4 py-16 text-center md:px-6 md:py-24">
        {/* Overline: pulsing LIVE dot (anemone — reserved identity) + label */}
        <p
          data-reveal
          className="inline-flex items-center gap-2.5 text-micro uppercase text-cream-text [html[lang=ar]_&]:normal-case"
        >
          <span
            aria-hidden="true"
            className={cn('h-2 w-2 rounded-full bg-danger', !isLive && 'animate-live-pulse')}
          />
          {t.live.overline}
        </p>
        <h1
          id="live-title"
          data-reveal
          className="mt-4 font-display text-h1 text-cream-text"
        >
          {t.live.h1}
        </h1>
        <p data-reveal className="mx-auto mt-4 max-w-prose text-lede text-cream-muted">
          {t.live.lede}
        </p>

        {/* Next-episode card */}
        <div
          data-reveal
          className="mx-auto mt-10 w-full max-w-[720px] rounded-lg border border-night-border bg-night-raised p-6 shadow-card md:p-8"
        >
          <p className="text-micro uppercase text-cream-muted [html[lang=ar]_&]:normal-case">
            {t.live.nextEpisode}
          </p>
          <p className="mt-2 font-display text-h3 text-cream-text">{t.live.ep12Title}</p>

          {isLive ? (
            <div className="mt-8 flex flex-col items-center gap-4">
              <p className="inline-flex items-center gap-2.5 font-display text-h2 text-cream-text">
                <span aria-hidden="true" className="h-3 w-3 rounded-full bg-danger" />
                {t.live.liveNow}
              </p>
              <button
                type="button"
                aria-disabled="true"
                title={t.live.joinTooltip}
                className="min-h-[44px] cursor-not-allowed rounded-pill border border-night-border px-8 py-3 text-small font-semibold text-cream-muted opacity-70"
              >
                {t.live.joinStream}
              </button>
              <p className="text-micro tracking-normal text-cream-muted">{t.live.joinTooltip}</p>
            </div>
          ) : (
            <>
              {/* DD : HH : MM : SS — LTR, Western numerals (§2.9) */}
              <div dir="ltr" className="mt-8 flex items-start justify-center gap-2 md:gap-4">
                <CountdownBlock value={days} label={t.live.days} />
                <span aria-hidden="true" className="hidden pt-0.5 font-display text-2xl text-cream-muted md:inline">
                  :
                </span>
                <CountdownBlock value={hours} label={t.live.hours} />
                <span aria-hidden="true" className="hidden pt-0.5 font-display text-2xl text-cream-muted md:inline">
                  :
                </span>
                <CountdownBlock value={mins} label={t.live.mins} />
                <span aria-hidden="true" className="hidden pt-0.5 font-display text-2xl text-cream-muted md:inline">
                  :
                </span>
                <CountdownBlock value={secs} label={t.live.secs} />
              </div>

              {/* Reminder stub — ghost pill toggling an armed state */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={toggleReminder}
                  aria-pressed={armed}
                  disabled={arming}
                  className={cn(
                    'inline-flex min-h-[44px] items-center gap-2 rounded-pill border px-6 py-2.5 text-small font-semibold transition-colors duration-fast',
                    armed
                      ? 'border-mood bg-[var(--mood-accent-soft)] text-night'
                      : 'border-night-border text-cream-text hover:bg-night',
                  )}
                >
                  <BellIcon filled={armed} />
                  {t.live.remind}
                </button>
                {armed && (
                  <p className="text-small text-cream-muted">
                    {t.live.reminded}{' '}
                    <Link
                      to="/connect"
                      className="font-semibold text-sand underline decoration-dotted underline-offset-4 hover:text-cream-text"
                    >
                      {t.live.remindedCta}
                    </Link>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
