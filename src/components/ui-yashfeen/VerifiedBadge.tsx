import { cn } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageProvider'

/**
 * Verified badge (design.md §2.8): teal filled check-circle + "Verified" micro label.
 * Tooltip on hover: "Licensed professional — sample verification".
 */
export function VerifiedBadge({ className }: { className?: string }) {
  const { t } = useLanguage()
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-micro text-interactive-accent', className)}
      title={t.common.verifiedTooltip}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
        <circle cx="12" cy="12" r="10" fill="var(--afya-deadsea-teal)" />
        <path
          d="M8 12.5l2.5 2.5L16 9.5"
          fill="none"
          stroke="var(--afya-salt-white)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {t.common.verified}
    </span>
  )
}
