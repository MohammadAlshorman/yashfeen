import type { Source } from '@/data/types'
import { useLanguage } from '@/context/LanguageProvider'
import { formatDate } from '@/data'
import { cn } from '@/lib/utils'

interface SourceLineProps {
  source: Source
  /** ISO date string */
  date?: string
  className?: string
}

/**
 * Source line (design.md §2.8/§2.11): small teal text "Source: name · date".
 * Sample data uses '#' placeholder URLs with rel="nofollow" — no broken links (news.md).
 */
export function SourceLine({ source, date, className }: SourceLineProps) {
  const { t, lang } = useLanguage()
  return (
    <p className={cn('text-small text-interactive-accent', className)}>
      {t.common.source}:{' '}
      <a
        href={source.url}
        rel="nofollow"
        title={t.common.sourceRecorded}
        className="underline decoration-dotted underline-offset-2 hover:decoration-solid"
      >
        {lang === 'ar' ? source.name.ar : source.name.en}
      </a>
      {date ? ` · ${formatDate(date, lang)}` : ''}
    </p>
  )
}
