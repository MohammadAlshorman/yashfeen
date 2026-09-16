import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children: ReactNode
}

/**
 * Pill chip (design.md §2.8): soft tint at rest, accent fill when active.
 * Used for filters, category tags, mood-marked selections.
 */
export function Chip({ active = false, className, children, type = 'button', ...rest }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-[36px] items-center gap-1.5 rounded-pill px-4 py-1.5 text-small',
        'transition-colors duration-fast ease-soft',
        active
          ? 'bg-mood-deep text-cream-text'
          : 'bg-[var(--mood-accent-soft)] text-ink hover:opacity-85',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
