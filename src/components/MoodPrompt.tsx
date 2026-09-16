import { useEffect, useState } from 'react'
import { useMood } from '@/context/MoodProvider'
import { useLanguage } from '@/context/LanguageProvider'
import { MOODS, MOOD_ORDER } from '@/lib/moods'
import type { MoodId } from '@/lib/moods'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Mood engine entry modal (home.md §2 / design.md §2.2):
 * "How do you feel today?" — 5 mood cards (64px orb + label), backdrop blur,
 * Esc/× dismissible; skipping = default Calm. Selection applies instantly and
 * persists; closing animates upward (y 0→−24, fade, 300ms).
 */
export function MoodPrompt() {
  const { promptOpen, closePrompt, setMood, mood } = useMood()
  const { t } = useLanguage()
  const reduced = useReducedMotion()
  const [closing, setClosing] = useState(false)
  const [burst, setBurst] = useState<MoodId | null>(null)

  // Reset transient state whenever the prompt opens
  useEffect(() => {
    if (promptOpen) {
      setClosing(false)
      setBurst(null)
    }
  }, [promptOpen])

  useEffect(() => {
    if (!promptOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleDismiss()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptOpen])

  if (!promptOpen) return null

  const finishClose = () => {
    closePrompt()
    setClosing(false)
    setBurst(null)
  }

  const handleDismiss = () => {
    // Skipping = default "Calm" (home.md §2)
    setMood('calm')
    if (reduced) finishClose()
    else {
      setClosing(true)
      window.setTimeout(finishClose, 300)
    }
  }

  const handleSelect = (id: MoodId) => {
    setMood(id)
    if (reduced) {
      finishClose()
      return
    }
    setBurst(id)
    window.setTimeout(() => setClosing(true), 300)
    window.setTimeout(finishClose, 620)
  }

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center px-4" role="presentation" onClick={handleDismiss}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'rgba(27,22,17,.35)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="mood-prompt-title"
        className={`afya-card relative w-full max-w-[560px] p-6 shadow-overlay md:p-8 ${closing ? 'mood-modal-out' : 'mood-modal-in'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t.mood.close}
          className="absolute end-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors duration-instant hover:text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h2 id="mood-prompt-title" className="font-display text-h3 text-ink">
          {t.mood.promptTitle}
        </h2>
        <p className="mt-1 text-small text-ink-muted">{t.mood.promptSub}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {MOOD_ORDER.map((id) => {
            const def = MOODS[id]
            const active = mood === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id)}
                aria-pressed={active}
                className="group flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-md border border-line bg-raised px-2 py-3 transition-all duration-fast ease-soft hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span
                  aria-hidden="true"
                  className={`block h-16 w-16 rounded-full transition-transform duration-fast ease-soft group-hover:scale-[1.08] ${burst === id ? 'mood-orb-burst' : ''}`}
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${def.accentSoft}, ${def.accent})`,
                    boxShadow: `0 0 24px ${def.glow}`,
                  }}
                />
                <span className="text-small font-semibold text-ink">{t.mood.moods[id]}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-micro normal-case tracking-normal text-ink-muted">{t.mood.privacy}</p>
          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 rounded-pill px-4 py-2 text-small font-semibold text-interactive transition-colors duration-instant hover:bg-raised"
          >
            {t.mood.skip}
          </button>
        </div>
      </div>
    </div>
  )
}
