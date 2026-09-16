import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { ArticleCategory } from '@/data/types'
import { pick } from '@/data'
import { useCmsArticles } from '@/hooks/useCmsContent'
import { useLanguage } from '@/context/LanguageProvider'
import { useReveal } from '@/hooks/useReveal'
import { CmsNotice, CmsSkeleton } from '@/components/CmsState'
import { Chip } from '@/components/ui-yashfeen/Chip'
import { EmptyStub } from '@/components/ui-yashfeen/EmptyStub'
import { SectionHead } from '@/components/ui-yashfeen/SectionHead'
import { NewsCard } from '@/components/pages/news/NewsCard'
import { NewsletterBand } from '@/components/pages/news/NewsletterBand'
import { cn } from '@/lib/utils'

type Filter = 'all' | ArticleCategory

const CATEGORY_ORDER: ArticleCategory[] = ['public-health', 'nutrition', 'mental-health', 'research', 'policy']

const SAVED_KEY = 'afya-news-saved'

/**
 * The shared Chip pairs inactive chips with `text-ink`; on Wadi Night the mood
 * soft tint stays light (inline var wins), so inactive chips need deep text for AA.
 */

function readSaved(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}

/**
 * News Pulse (/news) — vertical short-form health news cards from the sample
 * `articles` data. Header + category filter chips (GSAP reveals), feed with
 * Framer Motion layout animation + bookmark persistence, integration EmptyStub
 * for the future News API, and the front-end-only newsletter band (news.md).
 */
export default function News() {
  const { t, lang } = useLanguage()
  const headerRef = useReveal<HTMLElement>()
  const chipsRef = useReveal<HTMLDivElement>({ stagger: 0.04, y: 16, duration: 0.5 })

  const [active, setActive] = useState<Filter>('all')
  const [saved, setSaved] = useState<string[]>(readSaved)

  // Live CMS content (tRPC content API) — published articles, same shape as
  // the old local sample data.
  const { data: articlesData, isLoading, isError, refetch } = useCmsArticles()
  const articles = useMemo(() => articlesData ?? [], [articlesData])

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      } catch {
        /* private mode — state stays local */
      }
      return next
    })
  }

  const filtered = useMemo(
    () => (active === 'all' ? articles : articles.filter((a) => a.category === active)),
    [active, articles],
  )

  // Filtering changes page height — recalculate reveal trigger positions after
  // the 420ms reflow so lower sections still reveal on scroll.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 450)
    return () => window.clearTimeout(id)
  }, [active])

  const categoryLabel = (cat: ArticleCategory) => {
    const found = articles.find((a) => a.category === cat)
    // While CMS data loads (or if it fails), fall back to the localized enum
    // labels from the dictionary — never show the raw slug.
    return found ? pick(found.categoryLabel, lang) : t.admin.enums.articleCategory[cat]
  }

  return (
    <>
      {/* Section 1 — Page header + category filter chips (single-select) */}
      <section ref={headerRef} className="mx-auto max-w-content px-4 pt-16 md:px-6 md:pt-24">
        <SectionHead as="h1" overline={t.news.overline} title={t.news.h1} lede={t.news.lede} />
        <div
          ref={chipsRef}
          role="group"
          aria-label={t.news.filterLabel}
          className="max-md:ltr:[mask-image:linear-gradient(to_left,transparent,black_40px)] max-md:rtl:[mask-image:linear-gradient(to_right,transparent,black_40px)] -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        >
          <Chip
            data-reveal
            active={active === 'all'}
            onClick={() => setActive('all')}
            className={cn('min-h-[44px] shrink-0')}
          >
            {t.news.all}
          </Chip>
          {CATEGORY_ORDER.map((cat) => (
            <Chip
              key={cat}
              data-reveal
              active={active === cat}
              onClick={() => setActive(cat)}
              className={cn('min-h-[44px] shrink-0')}
            >
              {categoryLabel(cat)}
            </Chip>
          ))}
        </div>
      </section>

      {/* Section 2 — Vertical short-form card feed (mobile: snap-scroll container) */}
      <section aria-label={t.news.overline} className="mx-auto max-w-content px-4 py-10 md:px-6 md:py-14">
        {isLoading ? (
          <CmsSkeleton
            count={6}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8"
          />
        ) : isError ? (
          <CmsNotice variant="error" onRetry={() => refetch()} />
        ) : articles.length === 0 ? (
          <CmsNotice variant="empty" />
        ) : (
          <>
            <div className="max-md:snap-y max-md:snap-proximity max-md:overflow-y-auto max-md:overscroll-contain max-md:rounded-lg max-md:[max-height:calc(100dvh-6rem)]">
              <div className="grid grid-cols-1 gap-4 max-md:pb-2 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8">
                <AnimatePresence mode="popLayout">
                  {filtered.map((a, i) => (
                    <NewsCard key={a.id} article={a} index={i} saved={saved.includes(a.id)} onToggleSave={toggleSave} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
            {filtered.length === 0 && <p className="mt-8 text-center text-body text-ink-muted">{t.news.empty}</p>}
          </>
        )}

        {/* Future live feed — honestly labeled integration stub (wired to the newsApi stub) */}
        <div className="mt-12">
          <EmptyStub label={t.news.feedStubLabel} stubRef="src/integrations/newsApi.stub.ts" />
        </div>
      </section>

      {/* Section 3 — Newsletter stub band (front-end only) */}
      <NewsletterBand />
    </>
  )
}
