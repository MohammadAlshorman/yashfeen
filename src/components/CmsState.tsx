import { useLanguage } from '@/context/LanguageProvider'
import { cn } from '@/lib/utils'

/**
 * Shared CMS data states for the public pages (tRPC content API):
 * - `CmsSkeleton` — Yashfeen-styled placeholder cards while content loads
 * - `CmsNotice`   — honest empty / unavailable states (never a broken page)
 *
 * Copy lives under the `cms` i18n group (EN/AR).
 */

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-lg border border-line bg-raised p-6 shadow-card', className)}
    >
      <span className="block h-6 w-24 rounded-pill bg-[var(--afya-line)] opacity-70" />
      <span className="mt-4 block h-5 w-3/4 rounded-sm bg-[var(--afya-line)] opacity-70" />
      <span className="mt-3 block h-3.5 w-full rounded-sm bg-[var(--afya-line)] opacity-50" />
      <span className="mt-2 block h-3.5 w-5/6 rounded-sm bg-[var(--afya-line)] opacity-50" />
      <span className="mt-5 block h-3 w-1/3 rounded-sm bg-[var(--afya-line)] opacity-40" />
    </div>
  )
}

/** Skeleton cards + screen-reader loading note. Wrap in your page's grid classes. */
export function CmsSkeleton({
  count = 3,
  className,
  cardClassName,
}: {
  count?: number
  className?: string
  cardClassName?: string
}) {
  const { t } = useLanguage()
  return (
    <div aria-busy="true" className={className}>
      <span className="sr-only">{t.cms.loading}</span>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} className={cardClassName} />
      ))}
    </div>
  )
}

/** Inline loading line (for small decorative usages, e.g. calendar dots). */
export function CmsLoadingLine({ className }: { className?: string }) {
  const { t } = useLanguage()
  return (
    <p aria-busy="true" className={cn('text-small text-ink-muted', className)}>
      {t.cms.loading}
    </p>
  )
}

/**
 * Honest empty / unavailable panel — dashed-border card in the EmptyStub
 * family. `onRetry` shows a retry button for recoverable fetch errors.
 */
export function CmsNotice({
  variant,
  onRetry,
  className,
}: {
  variant: 'empty' | 'error'
  onRetry?: () => void
  className?: string
}) {
  const { t } = useLanguage()
  return (
    <div
      role={variant === 'error' ? 'alert' : undefined}
      className={cn(
        'relative overflow-hidden rounded-md border border-dashed border-line bg-raised/60 p-6 text-center',
        className,
      )}
    >
      <div aria-hidden="true" className="texture-salt-lattice absolute inset-0 text-teal opacity-20" />
      <p className="relative text-small text-ink-muted">
        {variant === 'error' ? t.cms.unavailable : t.cms.empty}
      </p>
      {variant === 'error' && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="relative mt-4 inline-flex min-h-[44px] items-center rounded-pill border border-interactive px-5 text-small font-semibold text-interactive transition-colors duration-instant hover:bg-surface"
        >
          {t.cms.retry}
        </button>
      )}
    </div>
  )
}
