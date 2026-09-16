import { useState } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { useLanguage } from '@/context/LanguageProvider'
import { cn } from '@/lib/utils'
import type { ContentType } from '@contracts/content'
import { TYPE_CONFIGS } from './fields'
import { ContentList } from './ContentList'

interface AdminShellProps {
  userName: string
  onSignOut: () => void
}

const tabBtn =
  'relative inline-flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap px-3 text-small font-medium transition-colors duration-instant ease-soft'

/**
 * Admin shell (design.md §2 tokens): page header with the Yashfeen CMS wordmark,
 * signed-in user, sign-out + back-to-site, and the 7 content-type tabs with
 * live entry counts. The active tab renders its ContentList as a tabpanel.
 */
export function AdminShell({ userName, onSignOut }: AdminShellProps) {
  const { t } = useLanguage()
  const [active, setActive] = useState<ContentType>('article')

  // One query per content type: feeds both the tab counts and the active list.
  const articleQ = trpc.admin.list.useQuery({ type: 'article' })
  const doctorQ = trpc.admin.list.useQuery({ type: 'doctor' })
  const pharmacyQ = trpc.admin.list.useQuery({ type: 'pharmacy' })
  const serviceQ = trpc.admin.list.useQuery({ type: 'service' })
  const eventQ = trpc.admin.list.useQuery({ type: 'event' })
  const episodeQ = trpc.admin.list.useQuery({ type: 'episode' })
  const storyQ = trpc.admin.list.useQuery({ type: 'story' })
  const results = [articleQ, doctorQ, pharmacyQ, serviceQ, eventQ, episodeQ, storyQ]
  const byType = Object.fromEntries(TYPE_CONFIGS.map((c, i) => [c.type, results[i]])) as Record<
    ContentType,
    (typeof results)[number]
  >
  const activeQ = byType[active]

  return (
    <div className="bg-surface text-ink">
      {/* ——— Page header ——— */}
      <header className="border-b border-line bg-raised">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-4 md:px-6">
          <div className="flex items-center gap-2.5">
            <img src="/yashfeen-mark.png" alt="" width="30" height="27" className="h-[27px] w-[30px] object-contain" />
            <span className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold tracking-tight text-ink">
                {t.admin.wordmark}
              </span>
              <span className="font-ar text-micro font-bold text-ink-muted">يشفين</span>
              <span className="hidden text-small text-ink-muted sm:inline">· {t.admin.tagline}</span>
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden text-small text-ink-muted md:inline">{t.admin.signedIn(userName)}</span>
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center rounded-pill border border-line px-4 text-small font-semibold text-ink transition-colors duration-instant hover:bg-surface"
            >
              {t.admin.backToSite}
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex min-h-[44px] items-center rounded-pill bg-mood-deep px-4 text-small font-semibold text-cream-text transition-opacity duration-instant hover:opacity-90"
            >
              {t.admin.signOut}
            </button>
          </div>
        </div>

        {/* ——— Content-type tabs ——— */}
        <div className="mx-auto max-w-content px-2 md:px-4">
          <div role="tablist" aria-label={t.admin.tabsLabel} className="flex gap-1 overflow-x-auto">
            {TYPE_CONFIGS.map((c) => {
              const q = byType[c.type]
              const isActive = active === c.type
              return (
                <button
                  key={c.type}
                  role="tab"
                  id={`admin-tab-${c.type}`}
                  aria-selected={isActive}
                  aria-controls={`admin-panel-${c.type}`}
                  onClick={() => setActive(c.type)}
                  className={cn(tabBtn, isActive ? 'text-ink' : 'text-ink-muted hover:text-ink')}
                >
                  {t.admin.types[c.type]}
                  <span
                    className={cn(
                      'inline-flex min-w-[1.5rem] items-center justify-center rounded-pill px-1.5 py-0.5 text-micro font-semibold',
                      isActive ? 'bg-mood-deep text-cream-text' : 'bg-[var(--mood-accent-soft)] text-ink',
                    )}
                  >
                    {q.data ? q.data.length : '…'}
                  </span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[var(--mood-accent)]"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* ——— Active type panel ——— */}
      <main
        role="tabpanel"
        id={`admin-panel-${active}`}
        aria-labelledby={`admin-tab-${active}`}
        className="mx-auto max-w-content px-4 py-8 md:px-6 md:py-10"
      >
        <h1 className="sr-only">{t.admin.types[active]}</h1>
        <ContentList
          key={active}
          type={active}
          rows={activeQ.data ?? []}
          isLoading={activeQ.isLoading}
          isError={activeQ.isError}
          onRetry={() => activeQ.refetch()}
        />
      </main>
    </div>
  )
}
