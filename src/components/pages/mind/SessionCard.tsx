import { useId, useState } from 'react'
import { Card, Disclaimer } from '@/components/ui-yashfeen'
import { useLanguage } from '@/context/LanguageProvider'
import { pick } from '@/data'
import { cn } from '@/lib/utils'
import type { Session, SessionGlyph } from './sessions'
import { useInView } from './useInView'

/** Session glyphs — inline SVG, 1.5px stroke, 24px grid (design.md §2.7), mood-accent ink. */
const GLYPH_PATHS: Record<SessionGlyph, string[]> = {
  lotus: [
    'M12 19c-4.2 0-7.2-2.4-8.2-6 2.6.2 4.9 1.3 6.4 3.2',
    'M12 19c4.2 0 7.2-2.4 8.2-6-2.6.2-4.9 1.3-6.4 3.2',
    'M12 17.5c-1.6-2.6-1.6-6.2 0-9.5 1.6 3.3 1.6 6.9 0 9.5Z',
    'M3 21c3-1.4 6 1.4 9 0s6 1.4 9 0',
  ],
  chair: ['M8 3v9', 'M8 12h8', 'M8 12v9M16 12v9', 'M8 7h4'],
  moon: ['M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5Z'],
  wave: ['M3 9c2-3 4-3 6 0s4 3 6 0 4-3 6 0', 'M3 15c2-3 4-3 6 0s4 3 6 0 4-3 6 0'],
  steps: [
    'M8 4c1.6 0 2.6 1.6 2.6 3.6S9.6 11 8 11 5.4 9.6 5.4 7.6 6.4 4 8 4Z',
    'M15.5 13c1.6 0 2.6 1.6 2.6 3.6s-1 3.4-2.6 3.4-2.6-1.4-2.6-3.4 1-3.6 2.6-3.6Z',
  ],
  pen: ['M4 20l1.2-4.2L16 5l3 3-10.8 10.8L4 20Z', 'M14 7l3 3'],
}

function Glyph({ glyph, drawn }: { glyph: SessionGlyph; drawn: boolean }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="text-mood"
    >
      {GLYPH_PATHS[glyph].map((d, i) => (
        <path
          key={d}
          d={d}
          style={{
            strokeDasharray: 400,
            strokeDashoffset: drawn ? 0 : 400,
            // stroke-draw on first reveal, 600ms (mind.md §Section 2)
            transition: `stroke-dashoffset 600ms var(--ease-soft) ${i * 90}ms`,
          }}
        />
      ))}
    </svg>
  )
}

interface SessionCardProps {
  session: Session
}

/**
 * Session library card (mind.md §Section 2): glyph · title · duration chip ·
 * 1-line description · "Preview" text button expanding an in-card script
 * accordion (height auto 420ms, chevron 180°/220ms). No audio in MVP.
 */
export function SessionCard({ session }: SessionCardProps) {
  const { t, lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [cardRef, inView] = useInView<HTMLDivElement>()
  const panelId = useId()

  return (
    <div ref={cardRef} data-reveal className="h-full">
    <Card hover className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <Glyph glyph={session.glyph} drawn={inView} />
        <span
          className="inline-flex shrink-0 items-center rounded-pill bg-[var(--mood-accent-soft)] px-3 py-1 text-micro"
          style={{ color: 'var(--afya-ink)' }}
          dir="ltr"
        >
          {t.mind.mins(session.mins)}
        </span>
      </div>

      <h3 className="mt-4 font-display text-h3 text-ink">{pick(session.title, lang)}</h3>
      <p className="mt-2 text-body text-ink-muted">{pick(session.desc, lang)}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="mt-4 inline-flex min-h-[44px] w-fit items-center gap-1.5 self-start rounded-sm text-small font-semibold text-interactive transition-colors duration-instant hover:text-ink"
      >
        {open ? t.mind.closePreview : t.mind.preview}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className="transition-transform duration-fast ease-soft"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* In-card script accordion — height auto 420ms via grid-rows trick */}
      <div
        id={panelId}
        className={cn(
          'grid transition-[grid-template-rows] duration-med ease-soft',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-2 rounded-sm border border-line bg-surface p-4">
            <p className="text-micro uppercase text-ink-muted [html[lang=ar]_&]:normal-case">
              {t.mind.scriptLabel}
            </p>
            <ol className="mt-2 list-decimal space-y-2 ps-5 text-small text-ink">
              {session.steps.map((step, i) => (
                <li key={i} className="marker:text-ink-muted">
                  {pick(step, lang)}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-micro tracking-normal text-interactive-accent">
              {t.mind.audioNote}
            </p>
            {session.medical && <Disclaimer micro className="mt-2" />}
          </div>
        </div>
      </div>
    </Card>
    </div>
  )
}
