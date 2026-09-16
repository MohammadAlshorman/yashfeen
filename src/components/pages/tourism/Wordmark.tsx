import type { CSSProperties, ReactNode } from 'react'
import type { Destination } from '@/data/destinations'
import { useLanguage } from '@/context/LanguageProvider'

/** Fluid wordmark size: 2rem @360 · ~3rem @768 · 4.5rem @1440 (medical-tourism.md §Chapter layouts) */
const SIZE = 'clamp(2rem, 6vw, 4.5rem)'

/** Ma'in: apostrophe rendered as a rising steam dot — 3 stacked circles fading upward (§2.3.2) */
function SteamDots() {
  return (
    <span className="relative inline-block w-[0.28em]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute start-1/2 rounded-full bg-current"
          style={{
            width: '0.07em',
            height: '0.07em',
            bottom: `${0.58 + i * 0.13}em`,
            opacity: 0.9 - i * 0.3,
            transform: 'translateX(-50%)',
          }}
        />
      ))}
    </span>
  )
}

/** Wadi Rum: thin crescent-moon notch clipped into the "R" counter (§2.3.3) — dusk-colored knock-out */
function CrescentNotch() {
  return (
    <span className="absolute" style={{ insetInlineStart: '44%', top: '14%', width: '0.34em', height: '0.34em', color: '#1B1611' }}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
        <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z" />
      </svg>
    </span>
  )
}

/** Aqaba: wave-cut terminal on the final "a" (§2.3.5) — pearl wave knocks out the terminal */
function WaveCut() {
  return (
    <span className="absolute" style={{ insetInlineEnd: '-0.14em', bottom: '0.04em', width: '0.38em', height: '0.2em', color: '#F6F2E8' }}>
      <svg viewBox="0 0 24 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-full w-full">
        <path d="M1 5 Q 6.5 0 12 5 T 23 5" />
      </svg>
    </span>
  )
}

interface LettersProps {
  text: string
  /** Dead Sea: the two "e"s rise +0.06em — buoyancy (§2.3.1) */
  elevateE?: boolean
  /** Ma'in: apostrophe → steam dot */
  apostropheSteam?: boolean
  /** Wadi Rum: index of the R receiving the crescent notch */
  notchRIndex?: number
  /** Aqaba: wave-cut on the final letter */
  waveLastA?: boolean
}

/**
 * EN wordmark letters — each glyph an .mt-letter span for the pinned assemble
 * animation (40ms-feel stagger, driven by the chapter scrub timeline).
 * Arabic is NEVER letter-split here (contextual joining); AR wordmarks render
 * as a single .mt-letter block.
 */
function Letters({ text, elevateE = false, apostropheSteam = false, notchRIndex = -1, waveLastA = false }: LettersProps) {
  const chars = Array.from(text)
  return (
    <>
      {chars.map((ch, i) => {
        if (ch === ' ') {
          return (
            <span key={i} className="mt-letter inline-block w-[0.3em]">
              {' '}
            </span>
          )
        }
        let inner: ReactNode = ch
        if (elevateE && ch === 'e') {
          inner = (
            <span className="inline-block" style={{ transform: 'translateY(-0.06em)' }}>
              {ch}
            </span>
          )
        }
        if (apostropheSteam && (ch === '’' || ch === "'")) {
          inner = <SteamDots />
        }
        if (i === notchRIndex) {
          inner = (
            <span className="relative inline-block">
              {ch}
              <CrescentNotch />
            </span>
          )
        }
        if (waveLastA && i === chars.length - 1) {
          inner = (
            <span className="relative inline-block">
              {ch}
              <WaveCut />
            </span>
          )
        }
        return (
          <span key={i} className="mt-letter inline-block">
            {inner}
          </span>
        )
      })}
    </>
  )
}

/** EN wordmark treatments — Fraunces, per design.md §2.3 (pure CSS/SVG, no images) */
function EnWordmark({ dest }: { dest: Destination }) {
  switch (dest.id) {
    case 'dead-sea':
      // §2.3.1 — lowercase, 72pt optical size, tracking −0.02em, elevated e's
      return (
        <span
          aria-hidden="true"
          className="font-display font-semibold lowercase"
          style={{ fontSize: SIZE, lineHeight: 1.15, letterSpacing: '-0.02em', fontVariationSettings: '"opsz" 72', color: '#2E6B69' }}
        >
          <Letters text="dead sea" elevateE />
        </span>
      )
    case 'main-hot-springs':
      // §2.3.2 — italic, steam-dot apostrophe
      return (
        <span
          aria-hidden="true"
          className="font-display font-semibold italic"
          style={{ fontSize: SIZE, lineHeight: 1.2, color: '#C26A4A' }}
        >
          <Letters text={dest.name.en} apostropheSteam />
        </span>
      )
    case 'wadi-rum':
      // §2.3.3 — ultra-wide display caps, 0.18em tracking, crescent notch in the R of "RUM"
      return (
        <span
          aria-hidden="true"
          className="font-display font-bold uppercase"
          style={{ fontSize: SIZE, lineHeight: 1.15, letterSpacing: '0.18em', color: '#D9A05B' }}
        >
          <Letters text="WADI RUM" notchRIndex={5} />
        </span>
      )
    case 'petra':
      // §2.3.4 — small-caps, carved inset (1px top highlight + 1px bottom shadow)
      return (
        <span
          aria-hidden="true"
          className="font-display font-semibold"
          style={{
            fontSize: SIZE,
            lineHeight: 1.15,
            fontVariant: 'small-caps',
            letterSpacing: '0.02em',
            color: '#5C4033',
            textShadow: '0 1px 0 rgba(255,251,244,.5), 0 -1px 1px rgba(60,42,30,.55)',
          }}
        >
          <Letters text="Petra" />
        </span>
      )
    case 'aqaba':
      // §2.3.5 — tracking 0.04em, wave-cut terminal on the final "a"
      return (
        <span
          aria-hidden="true"
          className="font-display font-semibold"
          style={{ fontSize: SIZE, lineHeight: 1.15, letterSpacing: '0.04em', color: '#3E7E8F' }}
        >
          <Letters text="Aqaba" waveLastA />
        </span>
      )
  }
}

/** AR wordmark treatments — Noto Kufi Arabic, per design.md §2.3 (never letter-split, tracking 0) */
function ArWordmark({ dest }: { dest: Destination }) {
  const base: CSSProperties = { fontSize: SIZE, lineHeight: 1.4, letterSpacing: 0 }
  switch (dest.id) {
    case 'dead-sea':
      // §2.3.1 — Kufi 700 + soft teal underline wave (2px SVG squiggle)
      return (
        <span aria-hidden="true" className="mt-letter relative inline-block font-ar font-bold" style={{ ...base, color: '#2E6B69' }}>
          {dest.arWordmark}
          <svg
            className="absolute -bottom-[0.14em] start-0 end-0 h-[0.16em] w-full"
            viewBox="0 0 120 10"
            preserveAspectRatio="none"
            fill="none"
            stroke="#2E6B69"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M2 6 Q 12 1 22 6 T 42 6 T 62 6 T 82 6 T 102 6 T 122 6" />
          </svg>
        </span>
      )
    case 'main-hot-springs':
      // §2.3.2 — Kufi 600 + warm rose underline
      return (
        <span aria-hidden="true" className="mt-letter relative inline-block font-ar font-semibold" style={{ ...base, color: '#C26A4A' }}>
          {dest.arWordmark}
          <span className="absolute -bottom-[0.08em] start-[4%] end-[4%] h-[0.045em] rounded-full" style={{ background: '#C26A4A', opacity: 0.85 }} />
        </span>
      )
    case 'wadi-rum':
      // §2.3.3 — Kufi 800, spaced (0.02em max for Kufi per §2.4)
      return (
        <span aria-hidden="true" className="mt-letter inline-block font-ar font-extrabold" style={{ ...base, letterSpacing: '0.02em', color: '#D9A05B' }}>
          {dest.arWordmark}
        </span>
      )
    case 'petra':
      // §2.3.4 — Kufi 700 with sandstone gradient fill (background-clip: text)
      return (
        <span
          aria-hidden="true"
          className="mt-letter inline-block font-ar font-bold"
          style={{
            ...base,
            backgroundImage: 'linear-gradient(165deg, #C98A6B 0%, #B76E58 45%, #5C4033 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {dest.arWordmark}
        </span>
      )
    case 'aqaba':
      // §2.3.5 — Kufi 700 + coral dot over the ق
      return (
        <span aria-hidden="true" className="mt-letter relative inline-block font-ar font-bold" style={{ ...base, color: '#3E7E8F' }}>
          {dest.arWordmark}
          <span
            className="absolute rounded-full"
            style={{ width: '0.09em', height: '0.09em', background: '#D9704E', insetInlineEnd: '38%', top: '0.04em' }}
          />
        </span>
      )
  }
}

/**
 * Destination wordmark (design.md §2.3): EN renders the Fraunces letter treatment;
 * AR swaps to the Noto Kufi treatment. Pure CSS/SVG — no image files.
 * Decorative: the parent <h2> carries an sr-only accessible name.
 */
export function Wordmark({ dest }: { dest: Destination }) {
  const { lang } = useLanguage()
  return lang === 'ar' ? <ArWordmark dest={dest} /> : <EnWordmark dest={dest} />
}
