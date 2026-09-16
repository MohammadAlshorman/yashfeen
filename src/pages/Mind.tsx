import { SectionHead } from '@/components/ui-yashfeen'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { BreathingWidget } from '@/components/pages/mind/BreathingWidget'
import { SessionCard } from '@/components/pages/mind/SessionCard'
import { QuietFacts } from '@/components/pages/mind/QuietFacts'
import { sessions } from '@/components/pages/mind/sessions'

/**
 * Mind & Meditation — `/mind` (mind.md).
 * §1 Studio header + in-page breathing widget (4-7-8 / Box presets, mood orb).
 * §2 Session library (6 sample sessions, script accordions — no audio in MVP).
 * §3 Quiet facts strip (sourced micro-stats + sparklines).
 * The global 60s Breathe overlay stays available via the floating Breathe
 * button and the widget's "open overlay" link.
 */
export default function Mind() {
  const { t } = useLanguage()
  const studioRef = useReveal<HTMLElement>()
  const libraryRef = useReveal<HTMLElement>()

  return (
    <>
      {/* Section 1 — Studio header + breathing widget */}
      <section
        ref={studioRef}
        aria-labelledby="mind-title"
        className="texture-grain mx-auto max-w-content px-4 py-16 md:px-6 md:py-24"
      >
        <div className="grid items-center gap-12 md:grid-cols-[45fr_55fr]">
          <header data-reveal className="max-w-[520px]">
            <p className="text-micro uppercase text-interactive-accent [html[lang=ar]_&]:normal-case">
              {t.mind.overline}
            </p>
            <h1 id="mind-title" className="mt-3 font-display text-h1 text-ink">
              {t.mind.h1}
            </h1>
            <p className="mt-4 text-lede text-ink-muted">{t.mind.lede}</p>
          </header>
          <div data-reveal className="flex justify-center">
            <BreathingWidget />
          </div>
        </div>
      </section>

      {/* Section 2 — Session library */}
      <section
        ref={libraryRef}
        className="mx-auto max-w-content px-4 py-16 md:px-6 md:py-24"
      >
        <SectionHead
          overline={t.mind.sessionsOverline}
          title={t.mind.sessionsTitle}
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      </section>

      {/* Section 3 — Quiet facts strip */}
      <QuietFacts />
    </>
  )
}
