import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { Story } from '@/data/types'
import { pick } from '@/data'
import { useLanguage } from '@/context/LanguageProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { MOODS } from '@/lib/moods'
import { Disclaimer } from '@/components/ui-yashfeen/Disclaimer'

interface StoryDrawerProps {
  story: Story
  onClose: () => void
}

/**
 * Reading drawer (stories.md §3): slides from the inline-end edge (right in LTR,
 * left in RTL), x 100%→0 at 420ms ease-out-expo, scrim rgba(27,22,17,.5).
 * Esc / scrim / × close, focus is trapped, body scroll locked. Paragraphs
 * stagger in after the slide (60ms, y 12→0) unless reduced motion is on.
 */
export function StoryDrawer({ story, onClose }: StoryDrawerProps) {
  const { t, lang, dir } = useLanguage()
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const mood = MOODS[story.moodTag]
  const offscreen = dir === 'rtl' ? '-100%' : '100%'

  // Focus trap + Esc + body scroll lock
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const prevActive = document.activeElement instanceof HTMLElement ? document.activeElement : null
    panel.querySelector<HTMLElement>('button')?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusables = panel.querySelectorAll<HTMLElement>(
        'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      prevActive?.focus()
    }
  }, [onClose])

  const paragraphVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 12 },
    shown: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: reduced
        ? { duration: 0 }
        : { duration: 0.4, delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0"
        style={{ background: 'rgba(27,22,17,.5)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.3 }}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${t.stories.drawerLabel}: ${pick(story.title, lang)}`}
        className="absolute inset-y-0 end-0 flex w-full flex-col overflow-y-auto bg-raised shadow-overlay md:w-[480px] xl:w-[560px]"
        initial={{ x: offscreen }}
        animate={{ x: 0 }}
        exit={{ x: offscreen }}
        transition={reduced ? { duration: 0 } : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start justify-between gap-4 p-6 pb-0 md:p-8 md:pb-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-pill px-3 py-1 text-micro"
              style={{ background: mood.accentSoft, color: mood.accentDeep }}
            >
              {t.mood.moods[story.moodTag]}
            </span>
            {story.destinationLabel && (
              <span
                className="rounded-pill px-3 py-1 text-micro"
                style={{ background: 'var(--afya-rum-sand-soft)', color: 'var(--afya-rum-sand-deep)' }}
              >
                {pick(story.destinationLabel, lang)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.stories.closeDrawer}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-instant hover:bg-surface hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 p-6 md:p-8">
          <h3 className="font-display text-h3 text-ink">{pick(story.title, lang)}</h3>
          <p className="mt-2 text-small text-ink-muted">
            {pick(story.author, lang)} · {pick(story.city, lang)}
          </p>
          <blockquote className="mt-5 border-s-2 ps-4 font-display italic text-[1.15rem] leading-relaxed text-interactive" style={{ borderColor: mood.accent }}>
            {pick(story.quote, lang)}
          </blockquote>

          <div className="mt-6 space-y-4">
            {story.body.map((p, i) => (
              <motion.p
                key={i}
                custom={i}
                variants={paragraphVariants}
                initial="hidden"
                animate="shown"
                className="text-body text-ink"
              >
                {pick(p, lang)}
              </motion.p>
            ))}
          </div>

          <p className="mt-8 border-t border-line pt-4 text-small text-ink-muted">{t.stories.closing}</p>
          <Disclaimer className="mt-3" micro />
        </div>
      </motion.div>
    </div>
  )
}
