import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '@/context/LanguageProvider'
import { useTheme } from '@/context/ThemeProvider'
import { useMood } from '@/context/MoodProvider'
import { useBreathe } from '@/context/BreatheProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { MOODS } from '@/lib/moods'
import { buildDunePath, mulberry32 } from '@/components/home/heroNoise'
import { HeroDust } from '@/components/home/HeroDust'

gsap.registerPlugin(ScrollTrigger)

const DUNE_SPEEDS = [0.15, 0.3, 0.5, 0.75] // scroll parallax per layer (home.md §1)
const DUNE_SEEDS = [11, 29, 53, 97]
const DUNE_BASELINES = [300, 360, 425, 480]
const DUNE_AMPLITUDES = [46, 60, 72, 80]
/* Pointer-parallax depth per plane (px at full deflection) — nearer planes move more */
const DEPTH_SKY = 7
const DEPTH_STARS = 11
const DEPTH_SUN = 26
const DEPTH_HAZE = 32
const DUNE_DEPTHS = [14, 22, 34, 50]

/** SVG <pattern> of dune contour lines, tiled inside the two front dune paths (§2.7.3) */
function ContourPattern({ id, color }: { id: string; color: string }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="200" height="120">
      <g fill="none" stroke={color} strokeWidth="1">
        <path d="M0 20 C 40 8, 80 30, 120 18 S 180 26, 200 14" />
        <path d="M0 45 C 45 33, 85 55, 125 42 S 185 50, 200 40" />
        <path d="M0 70 C 40 58, 90 80, 130 66 S 185 74, 200 62" />
        <path d="M0 95 C 50 84, 85 105, 135 92 S 185 100, 200 90" />
        <path d="M0 118 C 45 108, 95 126, 140 114 S 185 120, 200 112" />
      </g>
    </pattern>
  )
}

/** translate3d reading the hero's lerped --hx/--hy pointer vars (unitless -0.5..0.5) */
const parallax = (depth: number, yRatio = 0.6): CSSProperties => ({
  transform: `translate3d(calc(var(--hx, 0) * ${depth}px), calc(var(--hy, 0) * ${(depth * yRatio).toFixed(1)}px), 0)`,
  willChange: 'transform',
})

/**
 * Cinematic generative Wadi Rum golden-hour hero (home.md §1), refined:
 * 100% canvas + SVG + CSS. Multi-plane 3D pointer parallax (lerped, 5 depth
 * planes), 4 seeded-noise dune layers with scroll parallax (0.15–0.75) + 8s
 * drift, mood-tinted sun disc with slow rays + breathing halo, floating
 * sand-dust particle field, grain/haze overlays, 3D flip-in headline,
 * magnetic primary CTA. IntersectionObserver pause, DPR cap 2, reduced-motion
 * falls back to a static composition.
 */
export function Hero() {
  const { t, lang, dir } = useLanguage()
  const { isNight } = useTheme()
  const { mood } = useMood()
  const { openBreathe, isOpen: breatheOpen } = useBreathe()
  const reduced = useReducedMotion()

  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sunInnerRef = useRef<HTMLDivElement>(null)
  const duneRefs = useRef<Array<HTMLDivElement | null>>([])
  const textRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const ctaPrimaryRef = useRef<HTMLAnchorElement>(null)

  // Dune silhouettes: seeded at mount — stable per session, never random per frame
  const dunePaths = useMemo(
    () => DUNE_SEEDS.map((seed, i) => buildDunePath(seed, 1440, 560, DUNE_BASELINES[i], DUNE_AMPLITUDES[i])),
    [],
  )

  // Star field (Wadi Night): 50 seeded CSS radial-gradient dots, fade in over 1.2s (§2.10)
  const starField = useMemo(() => {
    const rand = mulberry32(7)
    const dots = Array.from({ length: 50 }, () => {
      const x = (rand() * 100).toFixed(2)
      const y = (rand() * 55).toFixed(2)
      const a = (0.35 + rand() * 0.55).toFixed(2)
      return `radial-gradient(circle at ${x}% ${y}%, rgba(239,231,218,${a}) 0 1px, transparent 1.6px)`
    })
    return dots.join(', ')
  }, [])

  // Mood ambiance crossfade stack (800ms — home.md §Global interactions)
  const [ambiances, setAmbiances] = useState(() => [{ id: 0, value: MOODS[mood].ambiance, fading: false }])
  const firstMood = useRef(true)
  useEffect(() => {
    if (firstMood.current) {
      firstMood.current = false
      return
    }
    const id = Date.now()
    setAmbiances((prev) => [...prev.map((a) => ({ ...a, fading: true })), { id, value: MOODS[mood].ambiance, fading: false }])
    const timer = window.setTimeout(() => setAmbiances((prev) => prev.slice(-1)), 850)
    return () => window.clearTimeout(timer)
  }, [mood])

  // Canvas sky: drawn once per resize/theme change; DPR capped at 2 (§2.12)
  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { clientWidth: w, clientHeight: h } = root
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const css = getComputedStyle(document.documentElement)
      const stops = [css.getPropertyValue('--hero-sky-1').trim(), css.getPropertyValue('--hero-sky-2').trim(), css.getPropertyValue('--hero-sky-3').trim()]
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
      grad.addColorStop(0, stops[0] || '#F6EBDD')
      grad.addColorStop(0.55, stops[1] || '#F0DDC0')
      grad.addColorStop(1, stops[2] || '#D9A05B')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(root)
    // Redraw after the theme class transition settles (computed vars change instantly, but be safe)
    const timer = window.setTimeout(draw, 60)
    return () => {
      ro.disconnect()
      window.clearTimeout(timer)
    }
  }, [isNight])

  // IntersectionObserver: pause ambient loops when the hero leaves the viewport (§2.12)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(
      ([entry]) => root.classList.toggle('loops-paused', !entry.isIntersecting),
      { threshold: 0.05 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  /*
   * Unified 3D pointer parallax: pointer position → lerped --hx/--hy vars on
   * the hero root (rAF, ease 0.07/frame, returns to 0 on leave). Every plane
   * reads the vars with its own depth coefficient → true multi-plane depth.
   * Desktop pointers only, off with reduced motion, paused off-screen.
   */
  useEffect(() => {
    const root = rootRef.current
    if (!root || reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let raf = 0
    let running = false

    const loop = () => {
      raf = 0
      if (root.classList.contains('loops-paused') || document.hidden) {
        running = false
        return
      }
      cx += (tx - cx) * 0.07
      cy += (ty - cy) * 0.07
      root.style.setProperty('--hx', cx.toFixed(4))
      root.style.setProperty('--hy', cy.toFixed(4))
      if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) {
        raf = requestAnimationFrame(loop)
      } else {
        running = false
      }
    }
    const kick = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      tx = (e.clientX - r.left) / r.width - 0.5
      ty = (e.clientY - r.top) / r.height - 0.5
      kick()
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      kick()
    }
    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    return () => {
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  // Magnetic primary CTA: drifts up to 6px toward the pointer, eases back on leave
  useEffect(() => {
    const cta = ctaPrimaryRef.current
    if (!cta || reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      const r = cta.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      cta.style.transition = 'transform 80ms linear'
      cta.style.transform = `translate3d(${(nx * 12).toFixed(1)}px, ${(ny * 8).toFixed(1)}px, 0)`
    }
    const onLeave = () => {
      cta.style.transition = 'transform 320ms var(--ease-soft)'
      cta.style.transform = 'translate3d(0,0,0)'
    }
    cta.addEventListener('pointermove', onMove)
    cta.addEventListener('pointerleave', onLeave)
    return () => {
      cta.removeEventListener('pointermove', onMove)
      cta.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  // Load choreography + scroll parallax (GSAP; re-splits H1 on language change)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const dunes = duneRefs.current.filter(Boolean) as HTMLDivElement[]
      const words = root.querySelectorAll('.hero-word')
      const ctas = root.querySelectorAll('.hero-cta')

      if (reduced) {
        gsap.set([root.querySelector('.hero-sky'), ...dunes, sunInnerRef.current, words, ctas, cueRef.current], { clearProps: 'all', opacity: 1 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(root.querySelector('.hero-sky'), { opacity: 0 }, { opacity: 1, duration: 0.6 })
        .fromTo(dunes, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, '-=0.25')
        .fromTo(sunInnerRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2 }, '-=0.75')
        /* 3D flip-in: words rise out of their masks while rotating off the horizon */
        .fromTo(
          words,
          { yPercent: 110, rotateX: -75, opacity: 0, transformOrigin: '50% 100% -30px' },
          { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.95, stagger: 0.07, ease: 'power4.out' },
          '-=0.9',
        )
        .fromTo(ctas, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.45')
        .fromTo(cueRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2')

      // Scroll parallax scrub per dune layer; hero text drifts up over 0→30% viewport
      dunes.forEach((el, i) => {
        gsap.to(el, {
          yPercent: DUNE_SPEEDS[i] * 30,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
      gsap.to(textRef.current, {
        y: -60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: '30% top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [lang, reduced])

  const words = t.home.h1.split(' ')

  return (
    <section
      ref={rootRef}
      aria-label={t.home.overline}
      className="relative overflow-hidden"
      style={{
        minHeight: 'max(560px, 100dvh)',
        // Hero dims behind the global Breathe overlay (home.md §Global interactions)
        filter: breatheOpen ? 'brightness(.7)' : 'none',
        transition: 'filter 500ms var(--ease-soft)',
      }}
    >
      {/* 1. Sky — canvas, DPR-capped (sized via inline style per react-dev.md); farthest parallax plane */}
      <div className="hero-sky absolute inset-0">
        <div className="absolute inset-[-3%]" style={parallax(DEPTH_SKY, 0.5)}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true" />
        </div>
      </div>

      {/* Star field — Wadi Night only (§2.10), near-sky parallax plane */}
      <div
        aria-hidden="true"
        className="absolute inset-[-3%] transition-opacity"
        style={{ backgroundImage: starField, opacity: isNight ? 1 : 0, transitionDuration: '1200ms', ...parallax(DEPTH_STARS, 0.5) }}
      />

      {/* Mood ambiance overlay at 60% blend, 800ms crossfade on mood change (§2.2) */}
      {ambiances.map((a) => (
        <div
          key={a.id}
          aria-hidden="true"
          className={`absolute inset-0 ${a.fading ? 'ambiance-fade-out' : ''}`}
          style={{ background: a.value, opacity: 0.6 }}
        />
      ))}

      {/* 2. Sun disc — mood-tinted, halo in --mood-glow; moon-pearl on Wadi Night. Mid-depth plane. */}
      <div
        className="absolute z-[2]"
        style={{ left: dir === 'rtl' ? '38%' : '62%', top: '38%', transform: 'translate(-50%, -50%)' }}
      >
        <div style={parallax(DEPTH_SUN, 0.7)} className="relative">
          {/* Orbiting ray rings — two counter-rotating dashed circles (24s / 36s).
              Centering lives on the wrapper; the SVG owns the rotate animation
              (a CSS animation on transform would override Tailwind's -translate). */}
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[240%] w-[240%] -translate-x-1/2 -translate-y-1/2">
            <svg className="animate-ring-rotate h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="41"
                fill="none"
                stroke={isNight ? 'rgba(239,231,218,0.35)' : 'var(--mood-accent)'}
                strokeOpacity={isNight ? 1 : 0.4}
                strokeWidth="0.5"
                strokeDasharray="0.6 4.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2">
            <svg className="h-full w-full" style={{ animation: 'ring-rotate 36s linear infinite reverse' }} viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke={isNight ? 'rgba(239,231,218,0.22)' : 'var(--mood-accent)'}
                strokeOpacity={isNight ? 1 : 0.28}
                strokeWidth="0.4"
                strokeDasharray="0.4 6.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {/* Breathing halo wrapper (GSAP load tween targets the inner disc) */}
          <div className="animate-orb-pulse">
            <div
              ref={sunInnerRef}
              aria-hidden="true"
              className="h-24 w-24 rounded-full md:h-32 md:w-32 xl:h-40 xl:w-40"
              style={{
                background: isNight
                  ? 'radial-gradient(circle at 40% 35%, #F6F2E8, #B9AC9A)'
                  : 'radial-gradient(circle at 40% 35%, var(--mood-sun-1, #F6EBDD), var(--mood-sun-2, #D9A05B))',
                boxShadow: '0 0 60px 12px var(--mood-glow)',
                transition: 'background 800ms var(--ease-soft), box-shadow 800ms var(--ease-soft)',
              }}
            />
          </div>
        </div>
      </div>

      {/* 6. Heat-haze band at the horizon — 8s shimmer on a mid-front parallax plane */}
      <div className="absolute inset-x-[-10%] top-[38%] z-[3] h-[120px] w-[120%]" style={parallax(DEPTH_HAZE, 0.4)}>
        <div
          aria-hidden="true"
          className="animate-haze-drift h-full w-full"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(251,247,239,.10) 40%, rgba(251,247,239,.16) 55%, transparent 100%)',
          }}
        />
      </div>

      {/* 3+4. Four seeded dune layers — GSAP scroll/load on the outer wrapper, 8s
          drift on the middle wrapper, pointer-depth translate on the inner one.
          Contour texture on the two front layers. */}
      {dunePaths.map((d, i) => (
        <div
          key={i}
          ref={(el) => {
            duneRefs.current[i] = el
          }}
          className="absolute inset-x-[-5%] bottom-0 z-[4] h-[62%] w-[110%]"
        >
          <div className={`h-full w-full ${i === 3 ? 'animate-dune-drift' : ''}`}>
            <div className="h-full w-full" style={parallax(DUNE_DEPTHS[i], 0.35)}>
              <svg viewBox="0 0 1440 560" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
                <defs>
                  {(i === 2 || i === 3) && <ContourPattern id={`contours-${i}`} color={isNight ? '#D9A05B' : '#F4EFE6'} />}
                </defs>
                <path d={d} fill={`var(--dune-${i + 1})`} />
                {(i === 2 || i === 3) && <path d={d} fill={`url(#contours-${i})`} opacity="0.1" />}
              </svg>
            </div>
          </div>
        </div>
      ))}

      {/* 5. Floating sand-dust motes — canvas particle field, mood-tinted */}
      <HeroDust rootRef={rootRef} isNight={isNight} reduced={reduced} />

      {/* 7. Sandstone grain over everything, 6s stepped shimmer (§2.7.1) */}
      <div aria-hidden="true" className="texture-grain texture-grain-animated pointer-events-none absolute inset-0 z-[6]" />

      {/* Content — counter-parallax tilt plane for depth against the dunes */}
      <div
        ref={textRef}
        className="relative z-10 mx-auto flex max-w-content flex-col justify-center px-4 pb-28 pt-24 md:px-12 md:pt-16 xl:px-[120px]"
        style={{ minHeight: 'max(560px, 88dvh)' }}
      >
        <div
          style={{
            transform:
              'perspective(1100px) translate3d(calc(var(--hx, 0) * -10px), calc(var(--hy, 0) * -6px), 0) rotateY(calc(var(--hx, 0) * 2.4deg)) rotateX(calc(var(--hy, 0) * -1.6deg))',
            willChange: 'transform',
          }}
        >
          <div className="max-w-[560px] xl:max-w-[680px]">
            <p className="hero-cta text-micro uppercase text-ink [html[lang=ar]_&]:normal-case">{t.home.overline}</p>
            <h1
              className="mt-4 font-display text-hero text-balance text-ink"
              key={lang}
              style={{ perspective: '700px' }}
            >
              {words.map((w, i) => (
                <span key={`${lang}-${i}`} className="inline-block overflow-hidden pb-1 align-bottom">
                  <span className="hero-word inline-block">{w}&nbsp;</span>
                </span>
              ))}
            </h1>
            <p className="hero-cta mt-5 max-w-[46ch] text-lede text-ink-muted">{t.home.lede}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                ref={ctaPrimaryRef}
                to="/medical-tourism"
                className="hero-cta group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill bg-interactive px-7 py-3 text-small font-semibold text-cream-text shadow-lift transition-colors duration-fast ease-soft hover:brightness-110"
              >
                {t.home.ctaDestinations}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl-flip transition-transform duration-fast group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={openBreathe}
                className="hero-cta group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill border border-ink/25 px-7 py-3 text-small font-semibold text-ink backdrop-blur-sm transition-all duration-fast ease-soft hover:border-mood hover:bg-raised/60 active:scale-[0.97]"
              >
                {t.home.ctaBreathe}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        ref={cueRef}
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 [@media(max-height:400px)]:hidden"
      >
        <span className="text-micro uppercase text-ink-muted [html[lang=ar]_&]:normal-case">{t.home.scroll}</span>
        <span className="scroll-cue-line block h-10 w-px bg-ink-muted" />
      </div>
    </section>
  )
}
