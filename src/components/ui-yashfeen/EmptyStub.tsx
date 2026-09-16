import { useLanguage } from '@/context/LanguageProvider'
import { cn } from '@/lib/utils'

interface EmptyStubProps {
  /** What future integration belongs here, e.g. "News API feed" */
  label: string
  /** The // STUB comment reference, e.g. "src/integrations/newsApi.stub.ts" */
  stubRef?: string
  className?: string
}

/**
 * EmptyStub (design.md §2.8): an honestly-labeled integration placeholder card —
 * only used where future APIs belong. Never a fake UI pretending to be live.
 */
export function EmptyStub({ label, stubRef, className }: EmptyStubProps) {
  const { t } = useLanguage()
  return (
    <div
      className={cn(
        'rounded-md border border-dashed border-line bg-raised/60 p-6 text-center',
        className,
      )}
    >
      <p className="text-small font-semibold text-ink">{label}</p>
      <p className="mt-1 text-small text-ink-muted">{t.common.integrationStub}</p>
      {stubRef ? (
        <p className="mt-2 font-mono text-[0.7rem] text-ink-muted">// STUB: {stubRef}</p>
      ) : null}
    </div>
  )
}
