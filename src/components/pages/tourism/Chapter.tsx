import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/context/LanguageProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { Disclaimer } from '@/components/ui-yashfeen'
import type { Destination, DestinationId } from '@/data/destinations'
import { ChapterScene } from './ChapterScene'
import { Wordmark } from './Wordmark'

gsap.registerPlugin(ScrollTrigger)

/**
 * Promise/overline text color per chapter — AA-checked body/large-text colors against
 * each scene's light band (§2.1 AA rule: brand brights are for fills/display only).
 */
const TEXT_COLOR: Record<DestinationId, string> = {
  'dead-sea': '#2E6B69', // Brine Teal on Salt — 6.4:1
  'main-hot-springs': '#3E3A36', // Basalt on Steam Cream — 10:1
  'wadi-rum': '#D9A05B', // Rum Sand on Dusk — 7:1
  petra: '#5C4033', // Shadow Umber on Alabaster — 8.6:1
  aqaba: '#3E7E8F', // Gulf Teal on Pearl — 4.7:1
}

interface ChapterProps {
  dest: Destination
  index: number
  onActive: (id: DestinationId) => void
}

/**
 * One destination chapter (medical-tourism.md §Chapter template): a pinned scroll
 * scene — the panel pins for 160vh while scrub drives the internal story:
 *   0–25%  wordmark assembles (letters rise, stagger) + scene wash + (Petra glyph
 *          stroke-draw / Rum stars fade)
 *   25–55% brand promise fades up + signature pattern draws in (0 → per-scene opacity)
 *   55–85% content card slides up (y 60→0)
 *   85–100% hold, then unpin
 * Reduced motion: NO pinning — chapters render as static stacked sections with
 * everything visible (§Global graceful fallback).
 */
export function Chapter({ dest, index, onActive }: ChapterProps) {
  const { t, lang } = useLanguage()
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const onActiveRef = useRef(onActive)
  onActiveRef.current = onActive

  const copy = t.tourism.chapters[dest.id]
  const name = lang === 'ar' ? dest.name.ar : dest.name.en
  const promise = lang === 'ar' ? dest.promise.ar : dest.promise.en
  const num = String(index + 1).padStart(2, '0')

  // Pinned scrub sequence (skipped entirely under reduced motion)
  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      const scene = root.querySelector('.mt-scene')
      const letters = root.querySelectorAll('.mt-letter')
      const meta = root.querySelector('.mt-chap-meta')
      const promiseEl = root.querySelector('.mt-promise')
      const pattern = root.querySelector<HTMLElement>('.mt-pattern')
      const card = root.querySelector('.mt-card')
      const glyphPaths = root.querySelectorAll('.mt-glyph-path')
      const stars = root.querySelector('.mt-stars')
      const patTarget = pattern ? parseFloat(pattern.dataset.patternOpacity || '0.08') : 0

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=160%',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          onToggle: (self) => {
            if (self.isActive) onActiveRef.current(dest.id)
          },
        },
      })

      // 0–25%: sub-palette wash in; wordmark assembles
      tl.fromTo(scene, { opacity: 0.35 }, { opacity: 1, duration: 2.5, ease: 'none' }, 0)
      if (meta) tl.fromTo(meta, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9 }, 0.1)
      tl.fromTo(letters, { opacity: 0, y: '0.55em' }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.16 }, 0.25)
      if (glyphPaths.length > 0) {
        tl.fromTo(glyphPaths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, stagger: 0.07, ease: 'none' }, 0.35)
      }
      if (stars) tl.fromTo(stars, { opacity: 0 }, { opacity: 0.55, duration: 1.8, ease: 'none' }, 0.6)

      // 25–55%: brand promise fades up; signature pattern draws in behind it
      tl.fromTo(promiseEl, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.6 }, 2.5)
      if (pattern) tl.fromTo(pattern, { opacity: 0 }, { opacity: patTarget, duration: 2.4, ease: 'none' }, 2.7)

      // 55–85%: content card slides up
      tl.fromTo(card, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 2 }, 5.5)

      // 85–100%: hold before unpin
      tl.to({}, { duration: 1.5 }, 8.5)
    }, root)
    return () => ctx.revert()
  }, [reduced, lang, dest.id])

  // Mouse parallax ±8px on the scene layers — desktop (fine pointer) only, 1440 spec
  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const scene = root.querySelector<HTMLElement>('.mt-scene')
    if (!scene) return
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5
      scene.style.transform = `translate(${(nx * 16).toFixed(1)}px, ${(ny * 16).toFixed(1)}px)`
    }
    root.addEventListener('pointermove', onMove)
    return () => {
      root.removeEventListener('pointermove', onMove)
      scene.style.transform = ''
    }
  }, [reduced])

  return (
    <section id={dest.anchor} ref={rootRef} aria-labelledby={`${dest.anchor}-title`} className="relative">
      {/* Chapter panel — arch top echoes Jordanian architecture (--radius-arch §2.5) */}
      <div className="relative min-h-[100dvh] overflow-hidden rounded-t-arch">
        <ChapterScene dest={dest} />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-content flex-col items-center px-3 pb-8 pt-20 md:px-6 md:pt-24">
          <p
            className="mt-chap-meta text-micro font-semibold uppercase tracking-[0.18em] [html[lang=ar]_&]:normal-case [html[lang=ar]_&]:tracking-normal"
            style={{ color: TEXT_COLOR[dest.id] }}
          >
            {t.tourism.chapterLabel(num)}
          </p>

          <h2 id={`${dest.anchor}-title`} className="mt-3 text-center">
            <span className="sr-only">{name}</span>
            <Wordmark dest={dest} key={lang} />
          </h2>

          <div className="mt-promise mt-5 max-w-[54ch] text-center">
            <p className="font-ar text-small" style={{ color: TEXT_COLOR[dest.id], opacity: 0.85 }}>
              {lang === 'ar' ? dest.name.en : dest.arWordmark}
            </p>
            <p className="mt-2 font-display text-lede italic" style={{ color: TEXT_COLOR[dest.id] }}>
              {promise}
            </p>
          </div>

          <div className="flex-1" aria-hidden="true" />

          {/* Content card — 360: full-width −24px over scene bottom; 768: 560px offset-start 48px;
              1440: 620px at start 120px, vertically centered (translate on the wrapper, not the
              gsap-animated card) */}
          <div className="relative z-10 w-full md:ms-6 md:w-[560px] md:self-start xl:absolute xl:start-[120px] xl:top-1/2 xl:ms-0 xl:w-[620px] xl:-translate-y-1/2">
            <article className="mt-card afya-card rounded-lg p-5 md:p-6">
              {(['why', 'feel', 'note'] as const).map((k) => (
                <section key={k} className="mt-4 first:mt-0">
                  <h3 className="flex items-center gap-2 text-small font-bold text-ink">
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: dest.palette[0] }} />
                    {t.tourism.card[k]}
                  </h3>
                  <p className="mt-1.5 text-body text-ink-muted">{copy[k]}</p>
                </section>
              ))}
              <footer className="mt-5 border-t border-line pt-4">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-pill border border-line bg-surface px-3 py-1.5 text-small text-ink">
                    {t.tourism.card.season}: <span className="ms-1 font-semibold">{copy.season}</span>
                  </span>
                  <span className="inline-flex items-center rounded-pill border border-line bg-surface px-3 py-1.5 text-small text-ink">
                    {t.tourism.card.drive}: <span className="ms-1 font-semibold">{copy.drive}</span>
                  </span>
                </div>
                <p className="mt-3 text-small text-interactive-accent">{t.tourism.card.facts}</p>
                <Disclaimer micro className="mt-2" />
              </footer>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
