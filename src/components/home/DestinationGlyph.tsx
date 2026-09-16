import type { Destination } from '@/data/destinations'

/**
 * Minimal landmark glyphs for the destination ribbon (home.md §4):
 * 64px, 1.5px stroke, pure SVG geometry — wave / steam / dune / facade / reef.
 */
export function DestinationGlyph({ glyph, className }: { glyph: Destination['glyph']; className?: string }) {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {glyph === 'wave' && (
        <>
          <path d="M8 26c6-6 10-6 16 0s10 6 16 0 10-6 16 0" />
          <path d="M8 38c6-6 10-6 16 0s10 6 16 0 10-6 16 0" />
          <path d="M14 50h36" strokeDasharray="1 6" />
        </>
      )}
      {glyph === 'steam' && (
        <>
          <path d="M20 54c-3-8 4-10 2-18s-2-12 2-20" />
          <path d="M32 56c-3-9 5-11 3-20s-2-13 2-22" />
          <path d="M44 54c-3-8 4-10 2-18s-2-12 2-20" />
        </>
      )}
      {glyph === 'dune' && (
        <>
          <path d="M6 44c10-14 22-16 32-8 6 5 12 6 20 2" />
          <path d="M10 52c12-6 28-6 44 0" />
          <path d="M44 14a8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 0 8 4 8 8 0 0 0 8-4Z" />
        </>
      )}
      {glyph === 'facade' && (
        <>
          <path d="M18 22 32 12l14 10" />
          <path d="M20 22h24v4H20z" />
          <path d="M22 26v22M28 26v22M36 26v22M42 26v22" />
          <path d="M18 48h28v4H18z" />
          <path d="M30 34h4v14h-4z" />
        </>
      )}
      {glyph === 'reef' && (
        <>
          <rect x="22" y="22" width="20" height="20" rx="5" transform="rotate(45 32 32)" />
          <rect x="26" y="26" width="12" height="12" rx="3" transform="rotate(45 32 32)" />
          <rect x="14" y="14" width="36" height="36" rx="9" transform="rotate(45 32 32)" strokeDasharray="3 5" />
        </>
      )}
    </svg>
  )
}
