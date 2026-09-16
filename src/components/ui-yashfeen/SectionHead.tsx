import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadProps {
  /** Micro overline (uppercase EN / normal AR) */
  overline: string
  title: string
  lede?: string
  className?: string
  /** Heading level — default h2 for sections; pages own the single h1 */
  as?: 'h1' | 'h2'
  align?: 'start' | 'center'
  children?: ReactNode
}

/**
 * Section head (design.md §2.8): overline micro + H2 + optional lede.
 * Carries data-reveal so page-level useReveal staggers it in (§2.6).
 */
export function SectionHead({ overline, title, lede, className, as = 'h2', align = 'start', children }: SectionHeadProps) {
  const Heading = as
  return (
    <header
      data-reveal
      className={cn('max-w-prose', align === 'center' && 'mx-auto text-center', className)}
    >
      <p className="text-micro uppercase text-interactive-accent [html[lang=ar]_&]:normal-case">
        {overline}
      </p>
      <Heading className="mt-3 font-display text-h2 text-ink">{title}</Heading>
      {lede ? <p className="mt-4 text-lede text-ink-muted">{lede}</p> : null}
      {children}
    </header>
  )
}
