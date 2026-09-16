import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Enable hover lift (translateY -6px + shadow-lift, 220ms — §2.6) */
  hover?: boolean
  children: ReactNode
}

/** Raised-surface card primitive (design.md §2.8): radius-md, shadow-card. */
export function Card({ hover = false, className, children, ...rest }: CardProps) {
  return (
    <div className={cn('afya-card', hover && 'afya-card-hover', className)} {...rest}>
      {children}
    </div>
  )
}
