import { useMemo } from 'react'
import type { Destination } from '@/data/destinations'
import { buildDunePath, mulberry32 } from '@/components/home/heroNoise'
import { cn } from '@/lib/utils'

/**
 * Generative chapter scenes (medical-tourism.md §Chapter template): layered CSS/SVG
 * in each destination's canonical 3-color sub-palette — gradient sky band, silhouette
 * layers, signature pattern (.mt-pattern, drawn in by the chapter scrub timeline via
 * data-pattern-opacity), plus sandstone grain and a Wadi Night darkening veil.
 * Zero images. Ambient loops live in tourism.css (transform/opacity only).
 */

/** Ch.1 Dead Sea — salt sky, horizon at 55%, shimmering water band, drifting crystals */
function DeadSeaScene() {
  const crystals = [
    { left: '14%', top: '18%', size: 26, delay: '0s' },
    { left: '30%', top: '56%', size: 18, delay: '-1.5s' },
    { left: '46%', top: '30%', size: 32, delay: '-3s' },
    { left: '63%', top: '60%', size: 20, delay: '-2s' },
    { left: '78%', top: '24%', size: 28, delay: '-4.5s' },
    { left: '90%', top: '52%', size: 16, delay: '-1s' },
  ]
  return (
    <>
      {/* pale salt-sky gradient, flat horizon at 55% */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #F6F1E7 0%, #EFE9DB 34%, #DEE6E2 55%, transparent 55%)' }} />
      {/* signature salt-crystal lattice over the sky */}
      <div
        className="mt-pattern texture-salt-lattice absolute inset-x-0 top-0 h-[55%]"
        data-pattern-opacity="0.08"
        style={{ color: '#2E6B69', opacity: 0.08 }}
      />
      {/* shimmering water band: two overlapping gradients, 8s horizontal shift ±20px */}
      <div className="absolute inset-x-0 bottom-0 top-[55%] overflow-hidden">
        <div
          className="mt-water-a absolute inset-y-0 start-[-24px] end-[-24px]"
          style={{ background: 'linear-gradient(180deg, #93A8A4 0%, #5D8B88 30%, #2E6B69 78%, #275956 100%)' }}
        />
        <div
          className="mt-water-b absolute inset-y-0 start-[-24px] end-[-24px]"
          style={{ background: 'linear-gradient(100deg, transparent 15%, rgba(244,239,230,.28) 45%, transparent 75%)' }}
        />
        {/* salt-crystal polygons drifting upward, 6s loop */}
        {crystals.map((c, i) => (
          <svg
            key={i}
            className="mt-crystal absolute"
            style={{ left: c.left, top: c.top, width: c.size, height: c.size, animationDelay: c.delay, color: '#F4EFE6', opacity: 0.1 }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          >
            <path d="M12 2.5 20.5 7.5v9L12 21.5 3.5 16.5v-9Z" />
            <path d="M12 8.5 16 15.5H8Z" />
          </svg>
        ))}
      </div>
      <div className="absolute inset-x-0 top-[55%] h-px" style={{ background: '#8A9A97', opacity: 0.6 }} />
    </>
  )
}

/** Ch.2 Ma'in — basalt lower half, waterfall ribbon, rising steam bands, rose pool-line glow */
function MainScene() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #F6EBDD 0%, #F0DEC9 30%, #C89A7E 52%, #5C4A40 68%, #3E3A36 100%)' }}
      />
      {/* warm rose glow at the pool line */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 90% 22% at 50% 58%, rgba(194,106,74,.45), transparent 70%)' }}
      />
      {/* waterfall silhouette — 1 vertical ribbon, 8s flowing dash-offset loop */}
      <svg
        className="absolute left-1/2 top-[16%] h-[48%] w-[110px] -translate-x-1/2"
        viewBox="0 0 110 300"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          className="mt-falls-line"
          d="M55 -10 C 64 60, 44 120, 58 180 C 68 230, 48 260, 55 310"
          stroke="#F6EBDD"
          strokeWidth="30"
          strokeLinecap="round"
          opacity="0.12"
        />
      </svg>
      {/* signature steam contour bands drifting up, 8s loop */}
      <div
        className="mt-pattern mt-steam-drift texture-steam-bands absolute inset-0"
        data-pattern-opacity="0.06"
        style={{ color: '#C26A4A', opacity: 0.06 }}
      />
    </>
  )
}

/** Ch.3 Wadi Rum — dusk dune engine: 3 silhouettes (sand→ember→dusk), low moon, stars, contours */
function WadiRumScene() {
  const dunes = useMemo(
    () => [
      { d: buildDunePath(41, 1440, 400, 210, 55), fill: '#B76E58', opacity: 0.55 },
      { d: buildDunePath(83, 1440, 400, 280, 65), fill: '#6E4530', opacity: 0.85 },
      { d: buildDunePath(127, 1440, 400, 340, 70), fill: '#1B1611', opacity: 1 },
    ],
    [],
  )
  // Sparse star dots — seeded, stable per session; fade in as the chapter pins
  const stars = useMemo(() => {
    const rand = mulberry32(31)
    return Array.from({ length: 42 }, () => {
      const x = (rand() * 100).toFixed(2)
      const y = (rand() * 50).toFixed(2)
      const a = (0.3 + rand() * 0.6).toFixed(2)
      return `radial-gradient(circle at ${x}% ${y}%, rgba(246,242,232,${a}) 0 1px, transparent 1.5px)`
    }).join(', ')
  }, [])
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #14100B 0%, #1B1611 34%, #33261D 62%, #5C4033 88%, #7A5238 100%)' }}
      />
      <div className="mt-stars absolute inset-0" style={{ backgroundImage: stars, opacity: 0.4 }} />
      {/* low moon disc — pearl radial */}
      <div
        className="absolute left-[64%] top-[18%] h-16 w-16 rounded-full md:h-24 md:w-24"
        style={{ background: 'radial-gradient(circle at 38% 34%, #F6F2E8, #C9BBA6)', boxShadow: '0 0 48px 10px rgba(246,242,232,.28)' }}
      />
      {/* signature dune contour lines, 8s horizontal drift */}
      <div
        className="mt-pattern animate-dune-drift texture-dune-contours absolute inset-0"
        data-pattern-opacity="0.08"
        style={{ color: '#D9A05B', opacity: 0.08 }}
      />
      {/* three dune silhouettes: sand → ember → dusk */}
      {dunes.map((dune, i) => (
        <div key={i} className="absolute inset-x-[-4%] bottom-0 h-[52%] w-[108%]">
          <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="h-full w-full">
            <path d={dune.d} fill={dune.fill} opacity={dune.opacity} />
          </svg>
        </div>
      ))}
    </>
  )
}

/** Ch.4 Petra — alabaster sky, stroke-drawn Treasury glyph, sandstone striation, strong grain */
function PetraScene() {
  // Minimal Treasury facade line drawing (~140px, 1.5px stroke): pediment, 6 columns, doorway, steps
  const facadePaths = [
    'M30 48 L70 20 L110 48',
    'M26 48 H114',
    'M66 20 V12 H74 V20',
    'M32 54 H108 V62 H32 Z',
    'M38 62 V124',
    'M50 62 V124',
    'M62 62 V124',
    'M78 62 V124',
    'M90 62 V124',
    'M102 62 V124',
    'M34 62 H42',
    'M46 62 H54',
    'M58 62 H66',
    'M74 62 H82',
    'M86 62 H94',
    'M98 62 H106',
    'M64 82 H76 V124 H64 Z',
    'M34 124 H106',
    'M28 133 H112',
    'M22 142 H118',
  ]
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #F2E9DA 0%, #EFE3D3 45%, #E3CDB4 100%)' }}
      />
      {/* signature sandstone striation sweeping behind at −8° */}
      <div
        className="mt-pattern texture-striation absolute inset-[-10%]"
        data-pattern-opacity="0.05"
        style={{ color: '#5C4033', opacity: 0.05 }}
      />
      {/* Treasury glyph — stroke-draws 0→1 over the first quarter of the pin */}
      <svg
        className="absolute left-1/2 top-[46%] w-[140px] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 140 170"
        fill="none"
        stroke="#5C4033"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      >
        {facadePaths.map((d, i) => (
          <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={0} className="mt-glyph-path" />
        ))}
      </svg>
    </>
  )
}

/** Ch.5 Aqaba — pearl sky into gulf-teal sea, reef crystals, pulsing coral clusters, fish school */
function AqabaScene() {
  const clusters = [
    { x: 90, y: 120, d: '0s' },
    { x: 230, y: 200, d: '-1s' },
    { x: 390, y: 140, d: '-2s' },
    { x: 560, y: 230, d: '-3s' },
    { x: 740, y: 150, d: '-4s' },
    { x: 880, y: 210, d: '-5s' },
  ]
  const fish = [
    { x: 120, y: 80, d: '0s' },
    { x: 300, y: 60, d: '-2s' },
    { x: 480, y: 95, d: '-4s' },
    { x: 660, y: 70, d: '-1s' },
    { x: 820, y: 100, d: '-3s' },
  ]
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #F8F5EC 0%, #F6F2E8 30%, #E3EBE7 45%, transparent 45%)' }}
      />
      {/* gulf-teal sea band, 8s shimmer */}
      <div
        className="mt-sea-shimmer absolute inset-x-0 bottom-0 top-[45%]"
        style={{ background: 'linear-gradient(100deg, #3E7E8F 0%, #5E9CA9 35%, #35707F 70%, #3E7E8F 100%)' }}
      />
      {/* signature reef crystal pattern under the waterline */}
      <div
        className="mt-pattern texture-reef absolute inset-x-0 bottom-0 top-[45%]"
        data-pattern-opacity="0.07"
        style={{ color: '#F6F2E8', opacity: 0.07 }}
      />
      <svg
        className="absolute inset-x-0 bottom-0 top-[45%] h-[55%] w-full"
        viewBox="0 0 1000 320"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* 6 coral diamond clusters pulsing 1↔1.05, staggered 6s ease-breathe */}
        {clusters.map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y})`}>
            <g className="mt-reef-pulse" style={{ animationDelay: c.d }} stroke="#D9704E" strokeWidth="1.5" opacity="0.55">
              <rect x="-16" y="-16" width="32" height="32" rx="8" transform="rotate(45)" />
              <rect x="-9" y="-9" width="18" height="18" rx="5" transform="rotate(45)" />
            </g>
          </g>
        ))}
        {/* tiny fish school — 5 chevrons drifting 8s */}
        {fish.map((f, i) => (
          <g key={`f${i}`} transform={`translate(${f.x} ${f.y})`}>
            <path
              className="mt-fish"
              style={{ animationDelay: f.d }}
              d="M0 6 L8 0 L16 6"
              stroke="#F6F2E8"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
        ))}
      </svg>
      <div className="absolute inset-x-0 top-[45%] h-px" style={{ background: '#3E7E8F', opacity: 0.5 }} />
    </>
  )
}

/** Full-bleed chapter scene wrapper: destination layers + Wadi Night veil + sandstone grain */
export function ChapterScene({ dest }: { dest: Destination }) {
  return (
    <div className="mt-scene absolute inset-0 overflow-hidden" aria-hidden="true">
      {dest.id === 'dead-sea' && <DeadSeaScene />}
      {dest.id === 'main-hot-springs' && <MainScene />}
      {dest.id === 'wadi-rum' && <WadiRumScene />}
      {dest.id === 'petra' && <PetraScene />}
      {dest.id === 'aqaba' && <AqabaScene />}
      {/* Wadi Night: scene shifts ~30% darker (medical-tourism.md §Global) */}
      <div className="mt-night-veil" />
      {/* Sandstone grain §2.7.1 — 6% (8% for Petra's stone feel) */}
      <div className={cn('texture-grain absolute inset-0', dest.id === 'petra' && 'mt-grain-strong')} />
    </div>
  )
}
