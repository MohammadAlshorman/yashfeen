import type { RefObject } from 'react'
import { useLanguage } from '@/context/LanguageProvider'
import { destinations } from '@/data/destinations'
import type { DestinationId } from '@/data/destinations'
import { cn } from '@/lib/utils'

interface ChapterRailProps {
  active: DestinationId
  onSelect: (anchor: string) => void
  /** Progress hairline element — scaleX scrub is driven by the page */
  hairRef: RefObject<HTMLDivElement | null>
}

/**
 * Sticky chapter rail (medical-tourism.md §Section 0): 5 destination pills, each a
 * dot in the chapter's canonical sub-palette color + name. Active dot scales 1→1.5
 * with a mood-accent ring and the label goes 500→700 (220ms). The mood engine tints
 * ONLY the progress hairline and the active dot ring — palettes stay canonical.
 * 360: horizontal scroll pill row; 768/1440: centered. Mirrors automatically in RTL.
 */
export function ChapterRail({ active, onSelect, hairRef }: ChapterRailProps) {
  const { t, dir } = useLanguage()
  return (
    <nav
      aria-label={t.tourism.railLabel}
      className="sticky top-16 z-40 border-b border-line backdrop-blur-[12px] md:top-[72px]"
      style={{ background: 'color-mix(in oklab, var(--afya-surface) 86%, transparent)' }}
    >
      <ul className="mx-auto flex h-12 max-w-content list-none items-center gap-1 overflow-x-auto px-4 md:justify-center md:px-6">
        {destinations.map((d) => {
          const isActive = d.id === active
          return (
            <li key={d.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(d.anchor)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex min-h-[44px] items-center gap-2 rounded-pill px-3 text-small transition-colors duration-fast ease-soft',
                  isActive ? 'font-bold text-ink' : 'font-medium text-ink-muted hover:text-ink',
                )}
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-fast ease-soft"
                  style={{
                    background: d.palette[0],
                    transform: isActive ? 'scale(1.5)' : 'scale(1)',
                    boxShadow: isActive ? '0 0 0 2px var(--afya-surface), 0 0 0 4px var(--mood-accent)' : 'none',
                  }}
                />
                {t.tourism.rail[d.id]}
              </button>
            </li>
          )
        })}
      </ul>
      {/* progress hairline under the rail — fills with scroll progress (scaleX, scrub) */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] h-[2px]">
        <div
          ref={hairRef}
          className="h-full w-full"
          style={{ background: 'var(--mood-accent)', transform: 'scaleX(0)', transformOrigin: dir === 'rtl' ? '100% 50%' : '0 50%' }}
        />
      </div>
    </nav>
  )
}
