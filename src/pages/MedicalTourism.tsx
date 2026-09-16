import { Fragment, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/context/LanguageProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { destinations } from '@/data/destinations'
import type { DestinationId } from '@/data/destinations'
import { Chapter } from '@/components/pages/tourism/Chapter'
import { ChapterRail } from '@/components/pages/tourism/ChapterRail'
import { PlanningBand } from '@/components/pages/tourism/PlanningBand'
import '@/components/pages/tourism/tourism.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * 120px "salt seam" divider between chapters (medical-tourism.md §Chapter layouts):
 * 1px hairline + tiny dot in the NEXT destination's sub-palette color.
 */
function SaltSeam({ color }: { color: string }) {
  return (
    <div aria-hidden="true" className="mx-auto flex h-[120px] max-w-content items-center justify-center gap-4 px-6">
      <span className="h-px flex-1 bg-line" />
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}

/**
 * Medical Tourism — /medical-tourism (medical-tourism.md).
 * Page intro (word-split H1, bobbing arrow cue) → sticky chapter rail with
 * mood-tinted progress hairline → five pinned destination scroll chapters
 * (#dead-sea, #main-hot-springs, #wadi-rum, #petra, #aqaba) → planning band.
 * Reduced motion: pinning disabled, chapters become static stacked sections.
 */
export default function MedicalTourism() {
  const { t, lang } = useLanguage()
  const reduced = useReducedMotion()
  const [active, setActive] = useState<DestinationId>('dead-sea')

  const introRef = useRef<HTMLElement>(null)
  const chaptersRef = useRef<HTMLDivElement>(null)
  const hairRef = useRef<HTMLDivElement>(null)

  // Intro: H1 word-split reveal (60ms stagger), lede/cue fade (§Section 1)
  useEffect(() => {
    const root = introRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const words = root.querySelectorAll('.mt-hero-word')
      const fades = root.querySelectorAll('.mt-hero-fade')
      if (reduced) {
        gsap.set([...Array.from(words), ...Array.from(fades)], { clearProps: 'all' })
        return
      }
      gsap.fromTo(words, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power3.out', delay: 0.15 })
      gsap.fromTo(fades, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.5 })
    }, root)
    return () => ctx.revert()
  }, [lang, reduced])

  // Chapter progress hairline under the rail — scaleX scrub over the chapters region
  useEffect(() => {
    const hair = hairRef.current
    const wrap = chaptersRef.current
    if (!hair || !wrap) return
    const ctx = gsap.context(() => {
      gsap.fromTo(hair, { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top 60%', end: 'bottom 90%', scrub: true },
      })
    })
    return () => ctx.revert()
  }, [lang])

  // Smooth-scroll to a chapter anchor, offset for nav + rail height
  const scrollToChapter = (anchor: string) => {
    const el = document.getElementById(anchor)
    if (!el) return
    const navH = window.matchMedia('(min-width: 768px)').matches ? 72 : 64
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 48
    window.scrollTo({ top: Math.max(top, 0), behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <>
      {/* Section 1 — page intro (60vh, centered) */}
      <section ref={introRef} className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <p className="mt-hero-fade text-micro uppercase text-interactive-accent [html[lang=ar]_&]:normal-case [html[lang=ar]_&]:tracking-normal">
          {t.tourism.overline}
        </p>
        <h1 key={lang} className="mt-4 font-display text-h1 text-balance text-ink">
          {t.tourism.h1.split(' ').map((w, i) => (
            <span key={`${lang}-${i}`} className="inline-block overflow-hidden pb-1 align-bottom">
              <span className="mt-hero-word inline-block">{w}&nbsp;</span>
            </span>
          ))}
        </h1>
        <p className="mt-hero-fade mt-5 max-w-[46ch] text-lede text-ink-muted">{t.tourism.lede}</p>
        <button
          type="button"
          onClick={() => scrollToChapter('dead-sea')}
          className="mt-hero-fade mt-10 flex min-h-[44px] flex-col items-center gap-2 rounded-pill px-4 text-small font-semibold text-interactive transition-colors duration-instant hover:brightness-110"
        >
          {t.tourism.cue}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="mt-cue-bob"
          >
            <path d="M12 4v16M6 14l6 6 6-6" />
          </svg>
        </button>
      </section>

      {/* Chapters region — the sticky rail unsticks after the last chapter */}
      <div ref={chaptersRef}>
        <ChapterRail active={active} onSelect={scrollToChapter} hairRef={hairRef} />
        {destinations.map((d, i) => (
          <Fragment key={d.id}>
            {i > 0 && <SaltSeam color={d.palette[0]} />}
            <Chapter dest={d} index={i} onActive={setActive} />
          </Fragment>
        ))}
      </div>

      {/* Section 2 — planning band */}
      <PlanningBand />
    </>
  )
}
