import { useLanguage } from '@/context/LanguageProvider'
import { pick } from '@/data'
import { quietFacts } from './sessions'
import { useInView } from './useInView'

/** Tiny dune-contour sparklines — one variant per fact, drawn in on reveal. */
const SPARKS = [
  'M0 20 C 16 10, 34 26, 52 16 S 86 22, 104 12 S 118 16, 124 14',
  'M0 16 C 18 24, 36 10, 54 18 S 88 12, 106 20 S 120 14, 124 16',
  'M0 22 C 14 14, 38 20, 56 12 S 90 24, 108 14 S 120 18, 124 12',
]

/**
 * Quiet facts strip (mind.md §Section 3): 3 sourced micro-stats in a raised
 * band, each with a tiny dune-contour sparkline that draws (stroke-dashoffset,
 * 800ms) when scrolled into view.
 */
export function QuietFacts() {
  const { t, lang } = useLanguage()
  const [ref, inView] = useInView<HTMLElement>(0.3)

  return (
    <section
      ref={ref}
      aria-label={t.mind.factsAria}
      className="border-y border-line bg-raised"
    >
      <div className="mx-auto grid max-w-content gap-10 px-4 py-16 md:grid-cols-3 md:gap-8 md:px-6 md:py-20">
        {quietFacts.map((fact, i) => (
          <figure key={fact.id} data-reveal className="flex flex-col gap-4">
            <svg
              width="124"
              height="28"
              viewBox="0 0 124 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
              className="text-mood"
            >
              <path
                d={SPARKS[i % SPARKS.length]}
                style={{
                  strokeDasharray: 200,
                  strokeDashoffset: inView ? 0 : 200,
                  transition: `stroke-dashoffset 800ms var(--ease-soft) ${i * 120}ms`,
                }}
              />
            </svg>
            <blockquote className="text-lede text-ink">{pick(fact.text, lang)}</blockquote>
            <figcaption className="mt-auto text-micro tracking-normal text-ink-muted">
              {t.common.source}: {pick(fact.source, lang)}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
