import { useLanguage } from '@/context/LanguageProvider'
import { cn } from '@/lib/utils'

/**
 * Universal disclaimer (design.md §2.11): "Informational content only — not medical
 * advice." with an Anemone-red dot prefix. Rendered on every medical card/detail view.
 */
export function Disclaimer({ className, micro = false }: { className?: string; micro?: boolean }) {
  const { t } = useLanguage()
  return (
    <p
      className={cn(
        'flex items-start gap-2 text-ink-muted',
        micro ? 'text-micro tracking-normal' : 'text-small',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="mt-[0.45em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-anemone"
      />
      {t.disclaimer}
    </p>
  )
}
