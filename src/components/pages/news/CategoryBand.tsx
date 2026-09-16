import { useEffect, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import type { ArticleCategory } from '@/data/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

/**
 * News card visual header band (news.md §2): 80px mobile / 96px desktop,
 * category-tinted gradient with a code-generated texture at 8% and a 1.5px
 * stroke SVG glyph per category that stroke-draws on first reveal (600ms).
 * Mood accent overlays the band at 12% (news.md §Global). No photos ever.
 */

const CATEGORY_META: Record<ArticleCategory, { color: string; soft: string; texture: 'lattice' | 'dunes' }> = {
  'public-health': { color: '#4E8D8B', soft: '#C4DEDD', texture: 'lattice' },
  nutrition: { color: '#D9A05B', soft: '#F0DDC0', texture: 'dunes' },
  'mental-health': { color: '#B76E58', soft: '#E8C9BC', texture: 'dunes' },
  research: { color: '#3E7E8F', soft: '#CFE0E4', texture: 'lattice' },
  policy: { color: '#7A6A8F', soft: '#D8CFE3', texture: 'dunes' },
}

/** 24px-grid, 1.5px stroke glyphs: shield, wheat, lotus, flask, dome (news.md §2). */
const GLYPHS: Record<ArticleCategory, ReactElement> = {
  'public-health': (
    <>
      <path d="M12 3.5 18.5 6.2v5.1c0 4.2-2.8 7-6.5 8.2-3.7-1.2-6.5-4-6.5-8.2V6.2L12 3.5Z" />
      <path d="m9.2 11.8 2 2 3.6-3.9" />
    </>
  ),
  nutrition: (
    <>
      <path d="M12 21V9.5" />
      <path d="M12 9.5c-2.2 0-4-1.8-4-4 2.2 0 4 1.8 4 4Z" />
      <path d="M12 9.5c2.2 0 4-1.8 4-4-2.2 0-4 1.8-4 4Z" />
      <path d="M12 14.5c-2.2 0-4-1.8-4-4 2.2 0 4 1.8 4 4Z" />
      <path d="M12 14.5c2.2 0 4-1.8 4-4-2.2 0-4 1.8-4 4Z" />
      <path d="M12 19.5c-2.2 0-4-1.8-4-4 2.2 0 4 1.8 4 4Z" />
      <path d="M12 19.5c2.2 0 4-1.8 4-4-2.2 0-4 1.8-4 4Z" />
      <path d="M12 5.5c-1.4-.9-1.4-2.4 0-3.2 1.4.8 1.4 2.3 0 3.2Z" />
    </>
  ),
  'mental-health': (
    <path d="M12 20.5c-4.5 0-8-2.8-9.2-6.7 3.2.2 5.6 1.4 7 3-1-2.6-.4-5.6 2.2-7.8 2.6 2.2 3.2 5.2 2.2 7.8 1.4-1.6 3.8-2.8 7-3-1.2 3.9-4.7 6.7-9.2 6.7Z" />
  ),
  research: (
    <>
      <path d="M9.5 3.5h5" />
      <path d="M10.5 3.5v4.8L5.8 17c-.9 1.6.3 3.5 2.1 3.5h8.2c1.8 0 3-1.9 2.1-3.5l-4.7-8.7V3.5" />
      <path d="M8 14.5h8" />
    </>
  ),
  policy: (
    <>
      <path d="M4 20.5h16" />
      <path d="M6 20.5v-7M10 20.5v-7M14 20.5v-7M18 20.5v-7" />
      <path d="M12 4c-3.6 0-6.5 2.5-6.9 5.8h13.8C18.5 6.5 15.6 4 12 4Z" />
      <path d="M12 4V2.5" />
    </>
  ),
}

export function CategoryBand({ category }: { category: ArticleCategory }) {
  const meta = CATEGORY_META[category]
  const ref = useRef<HTMLDivElement>(null)
  const [drawn, setDrawn] = useState(false)
  const reduced = useReducedMotion()

  // Stroke-draw triggers when the band first enters the viewport (600ms)
  useEffect(() => {
    if (reduced) {
      setDrawn(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setDrawn(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative h-20 shrink-0 overflow-hidden md:h-24"
      style={{ background: `linear-gradient(135deg, ${meta.color}33 0%, ${meta.soft} 100%)` }}
    >
      {/* Mood accent overlay at 12% — category hues stay fixed (news.md §Global) */}
      <div className="absolute inset-0" style={{ background: 'var(--mood-accent)', opacity: 0.12 }} />
      {/* Code-generated texture at 8% */}
      <div
        className={cn('absolute inset-0', meta.texture === 'lattice' ? 'texture-salt-lattice' : 'texture-dune-contours')}
        style={{ color: meta.color, opacity: 0.08 }}
      />
      <svg
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="none"
        stroke={meta.color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute bottom-3 end-4"
        style={{
          strokeDasharray: 90,
          strokeDashoffset: drawn ? 0 : 90,
          transition: 'stroke-dashoffset 600ms var(--ease-soft)',
        }}
      >
        {GLYPHS[category]}
      </svg>
    </div>
  )
}
